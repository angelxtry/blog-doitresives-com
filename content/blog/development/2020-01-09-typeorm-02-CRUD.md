---
title: 2020-01-09 TypeORM - 02 CRUD
date: 2020-01-10 00:01:24
category: development
---

데이터를 저장하고, 조회하고, 변경하고, 삭제해보자.

## Entity

일단 entity를 수정한다.

`src/entity/User.ts`

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
```

## Repository

데이터 저장을 실행할 메서드를 Repository에 생성한다.

`src/repository/UserRepository.ts`

```ts
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
}
```

`src/types.ts`

```ts
import { LevelEnum } from './entity/User';

export interface UserInfo {
  email: string;
  nickname: string;
  level: LevelEnum;
}
```

## Insert

TypeORM은 데이터를 insert하거나 update 할 때 모두 save를 사용한다. save는 인자로 해당 instance를 받고, 저장된 결과를 Promise로 반환한다.

따라서 save에 인자로 전달할 instance를 만들기 위해 create를 사용한다. create는 해당 class의 instance를 만든다. 여기서는 new User()를 한 것과 같다.

이제 데이터를 저장해보자.

`src/index.ts`

```ts
import 'reflect-metadata';
import connectDB, { getUserRepository } from './repository';
import { LevelEnum } from './entity/User';

const users: Array<UserInfo> = [
  {
    email: 'aaa@gmail.com',
    nickname: 'aaa',
    level: LevelEnum.L1,
  },
  {
    email: 'bbb@gmail.com',
    nickname: 'bbb',
    level: LevelEnum.L2,
  },
  {
    email: 'ccc@gmail.com',
    nickname: 'ccc',
    level: LevelEnum.L3,
  },
];

const startServer = async () => {
  await connectDB();

  const newUser = await getUserRepository().createUser(users[0]);
  console.log(newUser);
};

startServer();
```

user가 하나 저장되고 저장된 값이 리턴되어 터미널에 출력된다. ormconfig.json에 `"logging": true,` 옵션을 넣었다면 실행된 query도 같이 출력되었을 것이다.

```cmd
query: START TRANSACTION
query: INSERT INTO `user`(`id`, `email`, `nickname`, `level`) VALUES (?, ?, ?, ?) -- PARAMETERS: ["b36fbe1d-37c0-4368-aeab-fa60d881e878","aaa@gmail.com","aaa","Level 1"]
query: SELECT `User`.`id` AS `User_id`, `User`.`level` AS `User_level` FROM `user` `User` WHERE `User`.`id` = ? -- PARAMETERS: ["b36fbe1d-37c0-4368-aeab-fa60d881e878"]
query: COMMIT
```

INSERT와 SELECT를 같이 처리하는 것을 볼 수 있다.

```ts
const newUsers = await getUserRepository().createUsers(users);
console.log(newUsers);
```

데이터 3건을 한번에 저장해보자.

```cmd
query: START TRANSACTION
query: INSERT INTO `user`(`id`, `email`, `nickname`, `level`) VALUES (?, ?, ?, ?) -- PARAMETERS: ["be411637-390c-4050-a138-97329b37d04b","aaa@gmail.com","aaa","Level 1"]
query: SELECT `User`.`id` AS `User_id`, `User`.`level` AS `User_level` FROM `user` `User` WHERE `User`.`id` = ? -- PARAMETERS: ["be411637-390c-4050-a138-97329b37d04b"]
query: INSERT INTO `user`(`id`, `email`, `nickname`, `level`) VALUES (?, ?, ?, ?) -- PARAMETERS: ["af36f22f-dcbc-448b-98ee-71f9fcafbb66","bbb@gmail.com","bbb","Level 2"]
query: SELECT `User`.`id` AS `User_id`, `User`.`level` AS `User_level` FROM `user` `User` WHERE `User`.`id` = ? -- PARAMETERS: ["af36f22f-dcbc-448b-98ee-71f9fcafbb66"]
query: INSERT INTO `user`(`id`, `email`, `nickname`, `level`) VALUES (?, ?, ?, ?) -- PARAMETERS: ["1fbb760b-aad2-4e9c-90f0-f5da985d3f72","ccc@gmail.com","ccc","Level 3"]
query: SELECT `User`.`id` AS `User_id`, `User`.`level` AS `User_level` FROM `user` `User` WHERE `User`.`id` = ? -- PARAMETERS: ["1fbb760b-aad2-4e9c-90f0-f5da985d3f72"]
query: COMMIT
```

하나의 transaction으로 처리하지만 query는 총 6번 실행된다.

## Select

데이터를 한 건 조회해보자.

```ts
await getUserRepository().createUsers(users);
const userAAA = await getUserRepository().findOne({ email: users[0].email });
console.log(userAAA);
```

`findOne`은 builtin이다. Entity에 존재하는 컬럼과 데이터를 전달하면 1건을 조회한다. Sequelize 같이 where 키워드를 쓰지 않아도 된다. 물론 써도 된다.

```ts
const userAAA2 = await getUserRepository().findOne({
  where: { email: users[0].email },
});
console.log(userAAA2);
```

`find`는 배열을 리턴한다.

```ts
const selectedUsers = await getUserRepository().find();
console.log(selectedUsers);
```

```ts
const userIds = selectedUsers.map(u => u.id);

const createdUser3 = getUserRepository().create({ id: userIds[1] });
if (getUserRepository().hasId(createdUser3)) {
  console.log('exist');
} else {
  console.log('not exist');
}
```

`hasId`로 exist를 판단할 수 있다.

## Update

```ts
const user1 = await getUserRepository().findByEmail(users[2].email);
if (user1) {
  user1.nickname = 'zzz';
  user1.level = LevelEnum.L5;
  const upatedUser1 = await getUserRepository().save(user1);
  console.log(upatedUser1);
}
```

앞에서도 언급했지만 `save`는 insert, update에 모두 사용할 수 있다.

ccc가 zzz로 변경되었다.

데이터를 한 건 더 변경해보자.

```ts
const user2: User = getUserRepository().create({ id: userIds[1] });
user2.nickname = 'yyy';
user2.level = LevelEnum.L4;
const upatedUser2 = await getUserRepository().save(user2);
console.log(upatedUser2);

const allUsers = await getUserRepository().find();
console.log(allUsers);
```

Primary key를 알 수 있다면 select를 할 필요없이 create로 처리할 수도 있다.

위와 같이 실행하면 bbb가 yyy로 변경될 것 같지만 실제로는 어떤 user가 변경될지 알 수 없다. 즉, select는 순서를 보장하지 않는다. 순서를 보장하려면 `order` option을 사용해야 한다.

## Delete

삭제는 `delete`, `remove` 두 가지가 있다. 둘 다 삭제된 항목을 리턴한다.

`delete`는 where 조건으로 항목을 삭제할 수 있다.

```ts
await getUserRepository().createUsers(users);
const deletedUser = await getUserRepository().delete({
  email: users[0].email,
});
console.log(deletedUser);
const allUsers = await getUserRepository().find();
console.log(allUsers);
```

`remove`는 entity를 인자로 받는다.

```ts
const createdUsers = await getUserRepository().createUsers(users);
const usersExceptAaa = createdUsers.filter(u => u.nickname !== 'aaa');
console.log(usersExceptAaa);
const deletedUser = await getUserRepository().remove(usersExceptAaa);
console.log(deletedUser);
const allUsers = await getUserRepository().find();
console.log(allUsers);
```
