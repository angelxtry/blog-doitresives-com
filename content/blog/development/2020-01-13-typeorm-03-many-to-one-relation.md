---
title: 2020-01-13 TypeORM - 03. Many-to-one / one-to-many relations
date: 2020-01-13 23:01:99
category: development
---

N:1 / 1:N 관계에 대해 알아보자.

## 사전 준비

`https://github.com/angelxtry/typeorm-tutorial`에서 현재 코드를 볼 수 있다.

`https://github.com/angelxtry/typeorm-boilerplate.git`에서 boilerplate를 받아 코드를 작성해 볼 수 있다.

## Entity

Motivation이라는 entity를 추가한다. User는 여러 가지 Motivation을 가질 수 있다.

```ts
// src/entity/Motivation.ts

import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './User';

export enum MotivationEnum {
  WEIGHT_INCREASE = 'WEIGHT_INCREASE',
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  FIND_FRIEND = 'FIND_FRIEND',
  LONELINESS = 'LONELINESS',
}

@Entity()
export class Motivation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User,
    user => user.motivations
  )
  user: User;

  @Column({ type: 'enum', enum: MotivationEnum })
  motivation: string;
}
```

다음의 코드가 핵심이다.

```ts
@ManyToOne(() => User, (user) => user.motivations)
user: User;
```

다양한 Motivation을 한 User가 가질 수 있다는 것을 `@ManyToOne`으로 표현했다.

이 user는 `User` type이고 `user.motivations`는 실제로 User entity의 motivations라는 Column과 연결된다.

User entity를 살펴보자.

```ts{28-32}
// src/entity/User.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Motivation } from './Motivation';

export enum LevelEnum {
  L1 = 'Level 1',
  L2 = 'Level 2',
  L3 = 'Level 3',
  L4 = 'Level 4',
  L5 = 'Level 5',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  nickname: string;

  @Column({ type: 'enum', enum: LevelEnum, default: LevelEnum.L1 })
  level: LevelEnum;

  @OneToMany(
    () => Motivation,
    motivation => motivation.user
  )
  motivations: Motivation[];
}
```

User entity는 motivations가 새로 추가되었다.

한 User가 다양한 Motivation을 가질 수 있다는 것을 표현한다. 그래서 motivations는 `Motivation[]` type이다. 괄호 안의 motivation.user는 실제 Motivation entity의 user를 의미한다.

여기까지 작성한 후 `yarn start`로 프로그램을 실행하여 생성된 테이블을 확인해보자.

## DB Table 확인

DB를 확인해보면 user, motivation 2개의 테이블이 생성되었다.

`OneToMany` 컬럼이 설정된 user 테이블에는 motivations라는 컬럼이 없다.

motivation 테이블에는 `ManyToOne`으로 설정된 user와 관련이 있는 듯한 `userId`라는 컬럼이 존재한다.

테이블 정보를 보면 userId 컬럼은 user 테이블의 id와 연결되어 foreign key로 설정된 것을 확인할 수 있다.

1:N 구조일 때 entity의 코드만 보면 양쪽 테이블에 모두 컬럼이 생성될 것 처럼 보이지만, **N쪽의 테이블에만 컬럼이 생성**된다.

## Test 환경 설정

```cmd
yarn add -D jest ts-jest @types/jest

yarn ts-jest config:init
```

jest.config.js 파일이 생성된다.

기존에 index.ts에 있던 user 샘플 데이터는 fakeUser.ts 파일을 만들어서 옮겨 놓자.

## Repository

user 때와는 다르게 다음과 같이 폴더와 파일을 생성한다.

`src/repository/MotivationRepository/index.ts`

`src/repository/MotivationRepository/MotivationRepository.test.ts`

테스트를 작성하면서 필수 코드도 만들어보자.

먼저 특정 User는 motivation을 등록할 수 있다.

user를 하나 생성하고, motivation을 2개 추가하고, 해당 user로 User 데이터를 조회하여 확인한다.

motivation 추가는 Motivation Repository에, user 데이터를 조회할 때 motivation 데이터까지 함께 조회하는 메서드는 User Repository에 추가한다.

```ts
// src/repository/MotivationRepository/MotivationRepository.test.ts

import { Connection } from 'typeorm';
import connectDB, {
  getUserRepository,
  getMotivationRepository,
} from '../../database';
import users from '../../fakeUser';
import { MotivationEnum } from '../../entity/Motivation';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

describe('Motivation Repostory', () => {
  it('특정 User는 motivation을 등록할 수 있다.', async () => {
    // user를 하나 생성하고
    // motivation을 2개 추가하고 <- 추가하는 메서드 작성
    // 해당 user로 User 데이터를 조회하여 확인한다. <- 조회 메서드 작성
    const user = await getUserRepository().createUser(users[0]);
    const motivations = [MotivationEnum.FIND_FRIEND, MotivationEnum.LONELINESS];
    const result = await getMotivationRepository().saveByUserId(
      user.id,
      motivations,
    );
    console.log(result);
  });
};
```

일단 여기서 에러가 발생한다. 에러를 처리하기 위해 `saveByUserId()` 메서드를 추가한다.

```ts
// src/repository/MotivationRepository/index.ts

import { EntityRepository, Repository } from 'typeorm';

import { Motivation } from '../../entity/Motivation';
import { getUserRepository } from '../../database';

@EntityRepository(Motivation)
export class MotivationRepository extends Repository<Motivation> {
  // 특정 user의 motivation을 저장.
  async saveByUserId(userId: string, motivations: Array<string>) {
    try {
      const user = getUserRepository().create({ id: userId });
      // console.log('saveByUserId: ', motivations);
      const motivationInstances = motivations.map(m =>
        this.create({ user, motivation: m })
      );
      return await this.save(motivationInstances);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
```

Motivation entity에 데이터를 저장하기 위해 Motivation instance를 생성한다. user는 User type이므로 User instance를 생성하여 인자로 전달한다.

save()를 실행하면 해당 결과가 리턴된다.

test에서 log를 확인한 후 test를 계속 작성한다.

```ts{26-31}
// src/repository/MotivationRepository/MotivationRepository.test.ts

import { Connection } from 'typeorm';
import connectDB, {
  getUserRepository,
  getMotivationRepository,
} from '../../database';
import users from '../../fakeUser';
import { MotivationEnum } from '../../entity/Motivation';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

describe('Motivation Repostory', () => {
  it('특정 User는 motivation을 등록할 수 있다.', async () => {
    // user를 하나 생성하고
    // motivation을 2개 추가하고 <- 추가하는 메서드 작성
    // 해당 user로 User 데이터를 조회하여 확인한다. <- 조회 메서드 작성
    const user = await getUserRepository().createUser(users[0]);
    const motivations = [MotivationEnum.FIND_FRIEND, MotivationEnum.LONELINESS];
    await getMotivationRepository().saveByUserId(user.id, motivations);
    const currentUser = (await getUserRepository().findOne({
      where: { id: user.id },
      relations: ['motivations'],
    })) as User;
    console.log(currentUser.motivations);
  });
});
```

User entity를 조회하여 저장한 motivation을 확인한다. User entity에 선언한 motivations는 실제로 user 테이블에 컬럼이 존재하지는 않지만, relations라는 키워드를 이용하여 조회할 수 있다.

```query
SELECT
`User`.`id` AS `User_id`,
`User`.`email` AS `User_email`,
`User`.`nickname` AS `User_nickname`,
`User`.`level` AS `User_level`,
`User__motivations`.`id` AS `User__motivations_id`,
`User__motivations`.`motivation` AS `User__motivations_motivation`,
`User__motivations`.`userId` AS `User__motivations_userId`
FROM `user` `User`
LEFT JOIN `motivation` `User__motivations`
  ON `User__motivations`.`userId`=`User`.`id`
WHERE (`User`.`id` = ?) AND `User`.`id` IN (?)
```

확인해보면 motivation 테이블과 LEFT JOIN으로 엮어서 query를 실행한다.

이 로직은 계속 사용될 것이기에 User Repository로 옮긴다.

```ts{24-30}
// src/repository/UserRepository.ts

import { EntityRepository, Repository } from 'typeorm';

import { User } from '../entity/User';
import { UserInfo } from '../types';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userInfo: UserInfo) {
    const user = this.create(userInfo);
    return this.save(user);
  }

  async createUsers(usersInfo: Array<UserInfo>) {
    const users = this.create(usersInfo);
    return this.save(users);
  }

  async findByEmail(email: string) {
    return this.findOne({ email });
  }

  async findByUserId(userId: string) {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['motivations'],
    });
    return user || null;
  }
}
```

다시 test로 돌아와서 마무리를 짓는다.

```ts{28-32}
// src/repository/MotivationRepository/MotivationRepository.test.ts

import { Connection } from 'typeorm';
import { User } from '../../entity/User';
import connectDB, {
  getUserRepository,
  getMotivationRepository,
} from '../../database';
import users from '../../fakeUser';
import { MotivationEnum } from '../../entity/Motivation';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

describe('Motivation Repostory', () => {
  it('특정 User는 motivation을 등록할 수 있다.', async () => {
    // user를 하나 생성하고
    // motivation을 2개 추가하고 <- 추가하는 메서드 작성
    // 해당 user로 User 데이터를 조회하여 확인한다. <- 조회 메서드 작성
    const user = await getUserRepository().createUser(users[0]);
    const motivations = [MotivationEnum.FIND_FRIEND, MotivationEnum.LONELINESS];
    await getMotivationRepository().saveByUserId(user.id, motivations);
    const currentUser = (await getUserRepository().findByUserId(
      user.id
    )) as User;
    const result = currentUser.motivations.map(m => m.motivation);
    expect(result.sort()).toEqual(motivations.sort());
  });
});
```

테스트를 하나 더 추가한다.

```ts{8-22}
// src/repository/MotivationRepository/MotivationRepository.test.ts

...

describe('Motivation Repostory', () => {
  ...

  it('motivation을 다시 등록하면 기존 데이터는 삭제되고 신규 데이터가 저장된다.', async () => {
    // user를 하나 생성하고
    // motivation을 2개 추가하고
    // 다른 motivation을 저장한다.
    // 해당 user로 조회하여 확인한다. <- 조회 메서드 작성
    const user = await getUserRepository().createUser(users[0]);
    const motivations1 = [MotivationEnum.FIND_FRIEND, MotivationEnum.LONELINESS];
    await getMotivationRepository().saveByUserId(user.id, motivations1);
    const motivations2 = [MotivationEnum.WEIGHT_INCREASE];
    await getMotivationRepository().saveByUserId(user.id, motivations2);

    const currentUser = (await getUserRepository().findByUserId(user.id)) as User;
    const result = currentUser.motivations.map(m => m.motivation);
    expect(result.sort()).toEqual(motivations2.sort());
  });
});
```

motivation을 저장하고, 다른 motivation을 다시 저장하면 뒤에 저장한 motivation만 남도록 로직을 변경한다. 테스트는 물론 실패한다.

로직을 추가하자.

```ts{18-19}
// src/repository/MotivationRepository/index.ts

import { EntityRepository, Repository } from 'typeorm';

import { Motivation } from '../../entity/Motivation';
import { getUserRepository } from '../../database';

@EntityRepository(Motivation)
export class MotivationRepository extends Repository<Motivation> {
  // 특정 user의 motivation을 저장.
  // user의 기존 motivation을 삭제하고 저장.
  async saveByUserId(userId: string, motivations: Array<string>) {
    try {
      const user = getUserRepository().create({ id: userId });
      const motivationInstances = motivations.map(m =>
        this.create({ user, motivation: m })
      );
      await this.delete({ user });
      return await this.save(motivationInstances);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
```

## Transaction

delete와 save는 transaction을 적용하여 모두 성공하거나 하나가 실패하면 모두 실행하지 않아야 한다.

먼저 테스트 코드 부터 작성한다.

```ts{8-23}
// src/repository/MotivationRepository/MotivationRepository.test.ts

...

describe('Motivation Repostory', () => {
  ...

  it('motivation 재등록이 실패하면 기존 데이터가 유지된다.', async () => {
    // user를 하나 생성하고
    // motivation을 1개 추가하고
    // 다시 motivation을 저장할 때는 실패.
    // 해당 user로 조회하여 처음 motivation이 유지되는지 확인한다.
    const user = await getUserRepository().createUser(users[0]);
    const motivations1 = [MotivationEnum.FIND_FRIEND, MotivationEnum.LONELINESS];
    await getMotivationRepository().saveByUserId(user.id, motivations1);
    const motivations2 = [MotivationEnum.WEIGHT_INCREASE];

    await getMotivationRepository().saveByUserId(user.id, ['ABC']);

    const currentUser = (await getUserRepository().findByUserId(user.id)) as User;
    const result = currentUser.motivations.map(m => m.motivation);
    expect(result.sort()).toEqual(motivations1.sort());
  });
});
```

2번째 motivation을 저장할 때 `['ABC']`라는 값을 전달했다. motivation 컬럼에 저장될 수 없는 값이므로 에러가 발생할 것이다. 이때 transaction이 없다면 데이터가 삭제만 된 채로 남아있게 된다.

그래서 transaction을 적용한다.

```ts{19-24}
// src/repository/MotivationRepository/index.ts

import { EntityRepository, Repository, getManager } from 'typeorm';

import { Motivation } from '../../entity/Motivation';
import { getUserRepository } from '../../database';

@EntityRepository(Motivation)
export class MotivationRepository extends Repository<Motivation> {
  // 특정 user의 motivation을 저장.
  // user의 기존 motivation을 삭제하고 저장.
  async saveByUserId(userId: string, motivations: Array<string>) {
    try {
      const user = getUserRepository().create({ id: userId });
      const motivationInstances = motivations.map(m =>
        this.create({ user, motivation: m })
      );

      return await getManager().transaction(
        async transactionalEntityManager => {
          await transactionalEntityManager.delete(Motivation, { user });
          await transactionalEntityManager.save(motivationInstances);
        }
      );
    } catch (error) {
      // console.log(error);
      return new Error('Motivation save error.');
    }
  }
}
```

이 코드가 실행된 query를 확인해보자.

삭제, 저장이 순서대로 잘 진행 될 경우 다음과 같은 query를 확인할 수 있다.

```query
query: START TRANSACTION

query: DELETE FROM `motivation` WHERE `userId` = ? -- PARAMETERS: ["bce40372-1389-480f-af2d-e0b4f7f58c46"]

query: INSERT INTO `motivation`(`id`, `motivation`, `userId`) VALUES (?, ?, ?)
-- PARAMETERS: ["f7c34202-d071-4258-afbb-8f8110a0f1b6","FIND_FRIEND","bce40372-1389-480f-af2d-e0b4f7f58c46"]

query: INSERT INTO `motivation`(`id`, `motivation`, `userId`) VALUES (?, ?, ?)
-- PARAMETERS: ["8ebff72b-3728-4f83-99cc-8108573aa226","LONELINESS","bce40372-1389-480f-af2d-e0b4f7f58c46"]

query: COMMIT
```

실패하면?

```query
query: START TRANSACTION

query: DELETE FROM `motivation` WHERE `userId` = ? -- PARAMETERS: ["bce40372-1389-480f-af2d-e0b4f7f58c46"]

query: INSERT INTO `motivation`(`id`, `motivation`, `userId`) VALUES (?, ?, ?)
-- PARAMETERS: ["d5ba3a34-6953-47c5-9dce-241b95c6f616","ABC","bce40372-1389-480f-af2d-e0b4f7f58c46"]

query failed: INSERT INTO `motivation`(`id`, `motivation`, `userId`) VALUES (?, ?, ?)
-- PARAMETERS: ["d5ba3a34-6953-47c5-9dce-241b95c6f616","ABC","bce40372-1389-480f-af2d-e0b4f7f58c46"]

query: ROLLBACK
```

## type 하나 더 추가

transaction을 적용한 후에 생각난 건데 motivaion인자의 type을 확인하면 삭제, 저장 로직이 도달하기 전에 문제를 확인할 수 있을 것 같았다.

```ts{12}
// src/repository/MotivationRepository/index.ts

import { EntityRepository, Repository, getManager } from 'typeorm';

import { Motivation, MotivationEnum } from '../../entity/Motivation';
import { getUserRepository } from '../../database';

@EntityRepository(Motivation)
export class MotivationRepository extends Repository<Motivation> {
  // 특정 user의 motivation을 저장.
  // user의 기존 motivation을 삭제하고 저장.
  async saveByUserId(userId: string, motivations: Array<MotivationEnum>) {
    try {
      const user = getUserRepository().create({ id: userId });
      const motivationInstances = motivations.map(m =>
        this.create({ user, motivation: m })
      );

      return await getManager().transaction(
        async transactionalEntityManager => {
          await transactionalEntityManager.delete(Motivation, { user });
          await transactionalEntityManager.save(motivationInstances);
        }
      );
    } catch (error) {
      // console.log(error);
      return new Error('Motivation save error.');
    }
  }
}
```

이렇게 변경하는 순간 test code의 `['ABC']`에서 `Type 'string' is not assignable to type 'MotivationEnum'.ts(2322)` 같은 오류 메시지가 표시되고 테스트를 시도하기 전에 오류를 확인할 수 있다. 굿!

오늘은 여기까지!
