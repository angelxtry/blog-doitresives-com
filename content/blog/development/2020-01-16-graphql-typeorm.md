---
title: 2020-01-16 GraphQL-TypeORM 친구 신청, 수락 구현
date: 2020-01-17 02:01:54
category: development
---

(2020-01-20 Follow, User entity 수정)

TypeORM Boilerplate와 GraphQL Boilerplate를 하나로 합쳤다.

TypeORM Boilerplate를 base로 하고 GraphQL에 필요한 package를 설치한다.

```cmd
yarn add graphql apollo-server-express express
```

## 프로젝트 구조

```cmd
├── README.md
├── jest.config.js
├── ormconfig.json
├── ormconfigSample.json
├── package.json
├── src
│   ├── entity
│   │   ├── Follow.ts
│   │   └── User.ts
│   ├── fakeData.ts
│   ├── index.ts
│   ├── modules
│   ├── repository
│   │   ├── Follower
│   │   │   ├── FollowerRepository.test.ts
│   │   │   └── FollowerRepository.ts
│   │   ├── User
│   │   │   ├── UserRepository.test.ts
│   │   │   ├── UserRepository.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── resolvers.ts
│   ├── schemas.ts
│   └── startServer.ts
├── tsconfig.json
└── yarn.lock
```

modules에 GraphQL 관련 파일들이 추가될 것이다. 이번에는 TypeORM에만 집중할 예정이라 생략한다.

## Entity 생성

친구 신청은 follow 관계와 유사하다. A가 B에게 친구 신청을 하는 것은 A가 B를 following 하는 것과 동일하다. B 입장에서는 A가 follower가 된다. B는 자신의 follower 중에서 친구 신청을 승인할 수 있다.

follow를 구현하기 위해 User entity와 Follow entity를 생성한다.

검색해보면 TypeORM으로 follow를 구현할 때 User entity만으로 처리하는 것을 많이 볼 수 있다.(이 내용도 나중에 글로 쓸 계획이다.) 이번에 이렇게 처리하지 않은 것은 다음의 요건들 때문이다.

- user는 follower들을 친구 신청한 시간으로 정렬할 수 있다.
- user가 친구 신청을 확인한 follower와 확인하지 않은 follwer는 다르게 표시된다.

TypeORM에서 얘기하는 "adjacency list" pattern으로 구현하면 간단하게 처리할 수 있지만 위의 2가지 요건을 처리할 수 있는 방식을 찾지 못했다. 그래서 Follow entity를 추가로 만든다.

### User entity

```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Follow } from './Follow';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  nickname: string;

  @OneToMany(
    () => Follow,
    follow => follow.following
  )
  following: Follow[];

  @OneToMany(
    () => Follow,
    follow => follow.follower
  )
  followers: Follow[];
}
```

User entity에 following, follwers를 추가하여 follow entity와 연결한다.

following은 내가 follow 한 유저들을 의미한다. follow 테이블에서 follower가 나(me)인 데이터를 선택하면 된다.

followers는 나를 follow 한 유저들을 의미한다. follow 테이블에서 following이 나(me)인 데이터를 선택하면 된다.

### Follow entity

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.following
  )
  following: User;

  @ManyToOne(
    () => User,
    user => user.followers
  )
  follower: User;

  @Column({ type: Boolean, default: false })
  checked: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

following, follower는 User entity와 ManyToOne으로 연결된다.

A, B, C 라는 유저가 있고 A가 C를 following하고, B도 C를 following 한다고 해보자. Follow entity에는 다음과 같이 저장된다.

| following | follower |
| --------- | -------- |
| C         | A        |
| C         | B        |

친구 신청으로 createdAt으로, 신청 확인은 checked로 처리한다.

## Repository

```ts
// src/repository/index.ts

import { getConnectionOptions, createConnection, Connection } from 'typeorm';

import { UserRepository } from './User';
import { FollowerRepository } from './Follower/FollowerRepository';

let connection: Connection;

const connectDB = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  connection = await createConnection({
    ...connectionOptions,
    name: 'default',
  });
  return connection;
};

export const getUserRepository = (): UserRepository =>
  connection.getCustomRepository(UserRepository);

export const getFollowerRepository = (): FollowerRepository =>
  connection.getCustomRepository(FollowerRepository);

export default connectDB;
```

### User Repository

테스트 코드 부터 작성한다.

```ts
// src/repository/User/UserRepository.test.ts

import { Connection } from 'typeorm';
import connectDB, { getUserRepository } from '..';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

describe('User 생성', () => {
  it('email, nickname을 인자로 전달하여 user를 생성한다.', async () => {
    const email = 'abc@gmail.com';
    const nickname = 'abc';
    await getUserRepository().addUser(email, nickname);
    const user = await getUserRepository().find({ email });
    expect(user).toHaveLength(1);
    expect(user[0].email).toEqual(email);
    expect(user[0].nickname).toEqual(nickname);
  });
});
```

User는 상세한 테스트를 작성하지 않고 여기까지만.

```ts
// src/repository/User/UserRepository.ts

import { EntityRepository, Repository } from 'typeorm';

import { User } from '../../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async addUser(email: string, nickname: string) {
    const user = this.create({ email, nickname });
    return this.save(user);
  }
}
```

UserRepository도 일단 addUser만 작성한다.

### Follow Repository

test를 하나씩 추가하면서 Repository의 메서드를 작성한다.

```ts
// src/repository/Follow/FollowRepository.test.ts

import { Connection } from 'typeorm';
import { Follow } from '../../entity/Follow';
import connectDB, { getUserRepository, getFollowerRepository } from '..';

let conn: Connection;
beforeEach(async () => {
  conn = await connectDB();
});
afterEach(async () => {
  await conn.close();
});

const aaaEmail = 'aaa@gmail.com';
const aaaNickname = 'aaa';
const bbbEmail = 'bbb@gmail.com';
const bbbNickname = 'bbb';

describe('following test', () => {
  it('aaa가 bbb를 following 하면, 리턴값을 aaa의 Follow instance다.', async () => {
    const aaa = await getUserRepository().addUser(aaaEmail, aaaNickname);
    const bbb = await getUserRepository().addUser(bbbEmail, bbbNickname);
    const follow = (await getFollowerRepository().followingUser(
      aaa,
      bbb
    )) as Follow;
    expect(follow.follower.email).toEqual(aaa.email);
    expect(follow.following.email).toEqual(bbb.email);
    expect(Object.keys(follow)).toEqual(
      expect.arrayContaining([
        'following',
        'follower',
        'id',
        'checked',
        'createdAt',
        'updatedAt',
      ])
    );
  });
});
```

a, b user를 추가하고 a가 b를 following 한다. followingUser 메서드는 a의 follow instance를 리턴한다. 여기서 먼저 실행 코드를 확인해보자.

```ts
// src/repository/Follow/FollowRepository.ts

import { EntityRepository, Repository } from 'typeorm';

import { Follow } from '../../entity/Follow';
import { User } from '../../entity/User';
import { getUserRepository } from '..';

@EntityRepository(Follow)
export class FollowerRepository extends Repository<Follow> {
  async followingUser(me: User, following: User) {
    const follow = this.create({ following, follower: me });

    return this.save(follow);
  }
}
```

followingUser 메서드는 me, following을 인자로 받아 Follow instance를 생성하여 Follow 테이블에 저장한다.

리턴값을 출력해보면 다음과 같다.

```cmd
Follow {
  following: User { id: 2, email: 'bbb@gmail.com', nickname: 'bbb' },
  follower: User { id: 1, email: 'aaa@gmail.com', nickname: 'aaa' },
  id: 1,
  checked: false,
  createdAt: 2020-01-16T15:28:09.478Z,
  updatedAt: 2020-01-16T15:28:09.478Z
}
```

a가 b를 following 하는 것을 표현한다.

테스트를 추가하면서 로직을 보완하면 다음과 같은 코드가 나온다.

```ts
// src/repository/Follow/FollowRepository.ts

@EntityRepository(Follow)
export class FollowerRepository extends Repository<Follow> {
  async followingUser(me: User, following: User) {
    if (me.id === following.id) return null;

    const checkMe = getUserRepository().hasId(me);
    const checkFollowing = getUserRepository().hasId(following);
    if (!checkMe || !checkFollowing) return null;

    const follow = this.create({ following, follower: me });
    const existFollow = await this.findOne(follow);
    if (existFollow) return null;

    return this.save(follow);
  }
}
```

```ts
// src/repository/Follow/FollowRepository.test.ts

it('aaa가 bbb를 following 한 후 다시 following 하면 null을 리턴한다.', async () => {
  const aaa = await getUserRepository().addUser(aaaEmail, aaaNickname);
  const bbb = await getUserRepository().addUser(bbbEmail, bbbNickname);
  const follow = (await getFollowerRepository().followingUser(
    aaa,
    bbb
  )) as Follow;
  expect(follow.follower.email).toEqual(aaa.email);
  expect(follow.following.email).toEqual(bbb.email);

  // 이미 following 한 유저를 following하면 null
  const refollow = await getFollowerRepository().followingUser(aaa, bbb);
  expect(refollow).toBeNull();

  const followersOfbbb = await getFollowerRepository().getFollowers(bbb);
  expect(followersOfbbb).toHaveLength(1);
  expect(followersOfbbb.map(f => f.follower.email)).toEqual([aaa.email]);
});
```

위와 같은 테스트를 통과하기 위해 getFollowers라는 메서드를 작성한다.

```ts
// src/repository/Follow/FollowRepository.ts

@EntityRepository(Follow)
export class FollowerRepository extends Repository<Follow> {
  ...

  async getFollowers(following: User) {
    const followers = await this.find({
      where: { following },
      relations: ['follower', 'following'],
    });
    return followers;
  }
};
```

getFollowers 메서드는 following user를 기준으로 follow instance를 조회한다. 이 때 realtions 옵션으로 User entity와 연결되어 있는 follow entity의 두 컬럼을 지정하면 user 테이블이 follow 테이블에 left join으로 연결된다. query를 확인해보면 다음과 같다.

```sql
SELECT `Follow`.`id` AS `Follow_id`,
`Follow`.`checked` AS `Follow_checked`,
`Follow`.`createdAt` AS `Follow_createdAt`,
`Follow`.`updatedAt` AS `Follow_updatedAt`,
`Follow`.`followingId` AS `Follow_followingId`,
`Follow`.`followerId` AS `Follow_followerId`,
`Follow__follower`.`id` AS `Follow__follower_id`,
`Follow__follower`.`email` AS `Follow__follower_email`,
`Follow__follower`.`nickname` AS `Follow__follower_nickname`,
`Follow__following`.`id` AS `Follow__following_id`,
`Follow__following`.`email` AS `Follow__following_email`,
`Follow__following`.`nickname` AS `Follow__following_nickname`
FROM `follow` `Follow`
LEFT JOIN `user` `Follow__follower`
ON `Follow__follower`.`id`=`Follow`.`followerId`
LEFT JOIN `user` `Follow__following`
ON `Follow__following`.`id`=`Follow`.`followingId`
```

반대로 유저가 following 하는 대상을 조회하기 위해 다음과 같이 테스트를 작성한다.

```ts
// src/repository/Follow/FollowRepository.test.ts

it('aaa가 bbb, ccc를 following 하면 aaa의 following는 User[2]를 리턴한다.', async () => {
  const aaa = await getUserRepository().addUser(aaaEmail, aaaNickname);
  const bbb = await getUserRepository().addUser(bbbEmail, bbbNickname);
  const ccc = await getUserRepository().addUser(cccEmail, cccNickname);
  await getFollowerRepository().followingUser(aaa, bbb);
  await getFollowerRepository().followingUser(aaa, ccc);
  const followingOfAaa = await getFollowerRepository().getFollowing(aaa);
  // console.log(followingOfAaa);
  expect(followingOfAaa).toHaveLength(2);
  expect(followingOfAaa.map(f => f.following.email).sort()).toEqual(
    [bbb.email, ccc.email].sort()
  );
});
```

```ts
// src/repository/Follow/FollowRepository.ts

@EntityRepository(Follow)
export class FollowerRepository extends Repository<Follow> {
  ...

  async getFollowing(follower: User) {
    const followers = await this.find({
      where: { follower },
      relations: ['follower', 'following'],
    });
    return followers;
  }
};
```

getFollowing, getFollowers 메서드의 결과를 합치면 특정 유저의 followers, following을 모두 확인할 수 있다.

```ts
// src/repository/Follow/FollowRepository.ts

@EntityRepository(Follow)
export class FollowerRepository extends Repository<Follow> {
  ...
  async getAllFollow(user: User) {
    const followers = await this.getFollowers(user);
    const following = await this.getFollowing(user);
    return [...followers, ...following];
  }
};
```

삭제는 로직이 간단하므로 생략한다.

마지막으로 client에서 followers(친구 신청) 확인 여부를 표현할 수 있도록 기능을 추가해보자.

client의 로직에 따라 한 유저 혹은 여러 유저의 신구 신청을 확인할 수 있다. 그러므로 배열을 받아 처리할 수 있도록 작성하자. 일단 테스트 코드 부터.

```ts
// src/repository/Follow/FollowRepository.test.ts

describe('client에서의 follower 확인', () => {
  it('follower의 일부만 확인(check: false -> true)할 수 있다.', async () => {
    const aaa = await getUserRepository().addUser(aaaEmail, aaaNickname);
    const bbb = await getUserRepository().addUser(bbbEmail, bbbNickname);
    const ccc = await getUserRepository().addUser(cccEmail, cccNickname);
    const ddd = await getUserRepository().addUser(dddEmail, dddNickname);
    await getFollowerRepository().followingUser(aaa, ddd);
    await getFollowerRepository().followingUser(bbb, ddd);
    await getFollowerRepository().followingUser(ccc, ddd);
    const followOfDdd = await getFollowerRepository().setCheckFollowers(ddd, [
      bbb,
      ccc,
    ]);
    // console.log(followOfDdd);
    expect(followOfDdd).toHaveLength(3);
    const followOfAaa = followOfDdd.find(
      (f: Follow) => f.follower.email === aaaEmail
    ) as Follow;
    const followOfBbb = followOfDdd.find(
      (f: Follow) => f.follower.email === bbbEmail
    ) as Follow;
    const followOfCcc = followOfDdd.find(
      (f: Follow) => f.follower.email === cccEmail
    ) as Follow;
    expect(followOfAaa.checked).toEqual(false);
    expect(followOfBbb.checked).toEqual(true);
    expect(followOfCcc.checked).toEqual(true);
  });
});
```

`setCheckFollowers(d, [b, c])`는 d유저가 b, c 유저의 정보를 확인한 것을 표현했다.

```ts
// src/repository/Follow/FollowRepository.ts

@EntityRepository(Follow)
export class FollowerRepository extends Repository<Follow> {
  ...
  async setCheckFollowers(me: User, followers: User[]) {
    const uncheckedFollowers = await this.getUncheckedFollowers(me, followers);
    await this.changeFollowerCheckedToTrue(uncheckedFollowers);
    const follow = await this.getFollowers(me);
    return follow;
  }

  async getUncheckedFollowers(following: User, followers: User[]) {
    const followerIds = followers.map((f) => f.id);
    const results = await this.createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'user')
      .where('follow.following = :following', { following: following.id })
      .andWhere('follow.checked = false')
      .andWhere('user.id IN (:...followers)', { followers: followerIds })
      .getMany();
    // console.log(results);
    return results;
  }

  async changeFollowerCheckedToTrue(uncheckedFollowers: Follow[]) {
    const results = uncheckedFollowers.map((f) => ({ ...f, checked: true }));
    // console.log(results);
    await this.save(results);
  }
}
```

setCheckFollowers 메서드는 2개의 메서드를 호출한다. getUncheckedFollowers 메서드는 인자로 받은 값을 조회하여 ckecked: false 인 followers 만을 반환한다.

changeFollowerCheckedToTrue는 선택된 followers를 checked: true인 상태로 변경한다.

checked: false 항목을 찾기 위해 Query Builder를 사용했다. TypeORM은 Query Builder가 상당히 직관적이다. Query Builder는 인자를 객체를 받는 것이 아니라 값을 받고 entitiy 명을 사용하는 것이 아니라 테이블명을 사용한다. 이 점만 주의하면 간단한 query는 쉽게 작성할 수 있다.

내일은 이 코드에 GraphQL을 적용할 예정이다. 오늘은 여기까지.
