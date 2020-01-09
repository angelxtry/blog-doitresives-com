---
title: 2020-01-03 TypeORM - 01 Start
date: 2020-01-04 00:01:87
category: development
---

TypeORM의 기본 사용법과 사용했던 경험을 적어보려고 한다.

## 설치

일단 global에 설치한다.

```cmd
yarn add typeorm -g
```

폴더를 생성하고 해당 폴더에서 초기화를 실행한다.

```cmd
mkdir typeorm-boilerplate
cd typeorm-boilerplate
typeorm init
```

src 폴더와 ​package.json, ormconfig.json, tsconfig.json 파일 등이 생성된다.

package.json 파일의 devDependencies, dependencies 항목은 모두 삭제하고 다시 설치한다.

## package 설치

```cmd
yarn add typeorm reflect-metadata mysql2 dotenv

yarn add -D ts-node @types/node typescript @types/dotenv

yarn add -D eslint eslint-config-airbnb-base eslint-plugin-import

yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

.prettierrc, .eslintrc.js, tsconfig.json 파일을 복사하자.

[git repo](https://github.com/angelxtry/typeorm-boilerplate)를 참고하자.

ormconfig.json 파일에서 username, password, database를 적절히 입력하고 database를 직접 만들어야 한다.

mysql이든 postgres든 DB에 접속해서 database를 만들자.

여기까지 진행했다면 `typeorm init`으로 자동 생성되었던 src 폴더의 코드를 실행 할 수 있다. yarn start를 실행하면 user 테이블이 생성되고 data 1건이 저장된다.

## Entity 수정

`src/entity/User.ts`

작성되어 있던 코드를 지우고 다시 작성한다.

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum OpenImageChoice {
  OPEN = 'OPEN',
  FRIEND = 'FRIEND',
  CLOSE = 'CLOSE',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: OpenImageChoice,
    default: OpenImageChoice.OPEN,
  })
  openImageChoice: OpenImageChoice;
}
```

entity 파일은 테이블과 직결된다

## Repository 생성

`src/repository` 폴더를 생성한다.

`src/repository/index.ts`

```ts
import { getConnectionOptions, createConnection, Connection } from 'typeorm';

let connection: Connection;

const connectDB = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  connection = await createConnection({
    ...connectionOptions,
    name: 'default',
  });
  return connection;
};

export default connectDB;

```

getConnectionOptions 함수는 NODE_ENV에 따라 ormconfig.json 파일에서 환경 변수를 읽어온다.

createConnection 함수를 실행할 때 `name: 'default'`가 꼭 필요하다.

`src/repository/UserRepository.ts`

```ts
import { EntityRepository, Repository } from 'typeorm';

import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createByEmail(email: string) {
    const user = this.create({ email });
    return this.save(user);
  }
}

```

User entity를 사용하는 UserRepository를 생성했다. 그리고 createByEmail이라는 메서드를 만들었다. 앞으로 User entity를 사용하는 메서드들은 모두 UserRepository에 추가한다.

this.create는 object를 인자로 받아 User instance를 생성한다. 이 User instance를 this.save로 User 테이블에 insert 한다.

이 UserRepository를 사용하기 위해 `repository/index.ts`에 다음의 코드를 추가한다.

```ts
import { getConnectionOptions, createConnection, Connection } from 'typeorm';

import { UserRepository } from './UserRepository';

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

export default connectDB;

```

마지막으로 `index.ts` 파일을 다음과 같이 수정한다.

```ts
import 'reflect-metadata';
import connectDB, { getUserRepository } from './repository';

const startServer = async () => {
  await connectDB();

  const newUser = await getUserRepository().createByEmail('aaa@gmail.com');
  console.log(newUser);
};

startServer();

```

실행하기 위해 package.json의 script를 수정한다.

```json
"start": "NODE_ENV=development ts-node src/index.ts"
```

yarn start로 실행하면 다음과 같은 결과가 출력된다.

```js
User {
  email: 'aaa@gmail.com',
  id: '8cf9e6f8-3531-4199-b52f-a77b67f76128',
  openImageChoice: 'OPEN' }
```

## 느낀 점

아직 충분히 사용해보지 못해 Sequelize와 우열을 가르지는 못하겠다. 그래도 Sequelize보다 훨씬 더 깔끔한 느낌이다. Sequelize는 query가 길어지거나 복잡해지면 코드가 급격히 지저분해 졌는데 TypeORM은 일정 수준의 깔끔함(?)을 유지하는 것 같다.

Entity의 instance를 다루는 것이 아직 익숙하지 않지만 차차 익숙해질 것 같다. 계속 사용하면서 글을 써보자.

## `ormconfig.json`

development, test, production을 구분하여 설정하자.

```json
[
  {
    "name": "development",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "test",
    "password": "test",
    "database": "development",
    "synchronize": true,
    "logging": true,
    "entities": ["src/entity/**/*.ts"],
    "migrations": ["src/migration/**/*.ts"],
    "subscribers": ["src/subscriber/**/*.ts"],
    "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
    }
  },
  {
    "name": "test",
    "type": "mysql",
    "host": "test",
    "port": 3306,
    "username": "test",
    "password": "test",
    "database": "test",
    "synchronize": true,
    "logging": false,
    "dropSchema": true,
    "entities": ["src/entity/**/*.ts"],
    "migrations": ["src/migration/**/*.ts"],
    "subscribers": ["src/subscriber/**/*.ts"],
    "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
    }
  },
  {
    "name": "production",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "test",
    "password": "test",
    "database": "production",
    "synchronize": true,
    "logging": false,
    "entities": ["src/entity/**/*.ts"],
    "migrations": ["src/migration/**/*.ts"],
    "subscribers": ["src/subscriber/**/*.ts"],
    "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
    }
  }
]

```

name과 database, logging, dropSchema 등을 상황에 맞게 조정하자.

name을 위와 같이 지정했다면 앞으로 package.json의 script에 NODE_ENV 항목을 꼭 추가하자.

```json
"start": "NODE_ENV=development ts-node src/index.ts"
```
