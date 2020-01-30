---
title: '[GraphQL-TypeORM] 친구 관계 구현 - signup'
date: 2020-01-31 01:01:89
category: development
---

지난 번에 작성한 코드에 이어서 user resolver - signup을 작성한다.

## User schema

일단 user schema를 확인해보자.

```graphql
import { gql } from 'apollo-server-express';

const userSchema = gql`
  extend type Query {
    signin(email: String!, password: String!): AuthPayload!
    me: User!
    user(id: ID!): User!
    users: [User]!
  }

  extend type Mutation {
    signup(input: signupInput): AuthPayload!
  }

  type User {
    id: ID!
    email: String!
    nickname: String!
    following: [Follow]!
    followers: [Follow]!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  input signupInput {
    email: String!
    password: String!
    nickname: String!
  }
`;

export { userSchema };
```

이 중 signup 부터 구현해보자.

## signup

말그대로 회원가입이다.

email, password, nickname을 인자로 받고, user 정보와 token을 리턴한다.

지난 번까지는 User를 리턴하도록 되어있던 것을 AuthPayload로 변경했다.

signup을 위한 테스트를 작성하자. 그러기 위해서는 사전작업이 필요하다.

---

### jest

jest 실행시 server를 한 번만 실행하도록 설정하는 것이 필요하다. 매번 서버를 실행한다면 이미 서버가 실행 중이라는 에러 메시지를 만나게 된다.

먼저 test 라는 폴더를 하나 생성하고 다음과 같이 파일들을 작성한다.

```ts
// src/test/callSetup.js

require('ts-node/register');

const { setup } = require('./setup');

module.exports = async () => {
  await setup();
  return null;
};
```

```ts
// src/test/setup.ts

import { startServer } from '../startServer';

export const setup = async () => {
  await startServer();
  process.env.TEST_HOST = 'http://localhost:9999/graphql';
};
```

마지막으로 root 경로의 jest.config.js 파일을 수정한다.

```js
module.exports = {
  globalSetup: './src/test/callSetup.js',
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

이렇게 설정하면 jest 실행 시 server가 한 번만 실행된다.

---

### interface 추가

Typescript가 아직 많이 미숙하다. 알고 있는 지식 내에서 오류가 안생기도록 다음과 같이 처리했다.

```ts
// src/types/type.ts

export interface Signup {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupArgs {
  input: Signup;
}

export interface UserInfo {
  id: number;
  email: string;
}
```

Typescript 공부도 병행하면서 조금씩 개선하려고 한다.

---

### userRepository 보완

지난 번 까지 userRepository의 addUser 메서드는 password를 생략했다. password를 추가하자.

password hash를 위해 bcrypt를 설치한다.

```cmd
yarn add bcrypt
yarn add -D @types/bcrypt
```

signup에 성공하면 user 정보와 token을 제공할 계획이므로 jsonwebtoken도 설치한다.

```cmd
yarn add jsonwebtoken
yarn add -D @types/jsonwebtoken
```

addUser 부터 수정한다.

```ts
// src/repository/User/UserRepository.ts

import { EntityRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ApolloError } from 'apollo-server-express';
import { User } from '../../entity/User';
import { createToken } from '../../utils/token';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async addUser(email: string, password: string, nickname: string) {
    const existedUser = await this.findOne({ email });
    if (existedUser) {
      throw new ApolloError('Signup error', 'SIGNUP_ERROR');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userInstance = this.create({
      email,
      nickname,
      password: hashedPassword,
    });
    const user = await this.save(userInstance);
    const token = createToken(user);

    return { user, token };
  }
}
```

createToken 함수는 user 정보를 담은 token을 생성하는 함수다.

기존에 user만 반환하던 것을 user와 token을 함께 반환하도록 변경했다. 지난 번에 작성했던 Follow 관련 테스트들이 모두 실패할 것이다. (ㅠㅠ) aaa를 aaa.user 정도로 잘 보완하고 넘어가자.

```ts
// src/utils/token.ts

import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import { UserInfo } from '../types/type';

export const createToken = (userInfo: UserInfo) => {
  const { id, email } = userInfo;
  if (!id || !email) {
    throw new ApolloError('Token create error', 'TOKEN_CREATE_ERROR');
  }
  const token = jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRATION_PERIOD,
      issuer: 'friend.com',
    }
  );
  return token;
};
```

`process.env.JWT_SECRET`과 `process.env.JWT_EXPIRATION_PERIOD`는 root 경로에 `.env` 파일을 생성하여 입력한다.

현재 `.env` 파일은 다음과 같이 작성되어 있다.

```cmd
JWT_SECRET=Forcebewithyou
JWT_EXPIRATION_PERIOD=1d
```

변경한 내용에 맞춰 test도 수정하자.

```ts
import { Connection } from 'typeorm';
import connectDB, { getUserRepository } from '..';

...

describe('User Repository test', () => {
  it('email을 인자로 전달하여 user를 생성한다.', async () => {
    const email = 'abc@gmail.com';
    const password = 'abc';
    const nickname = 'abc';
    await getUserRepository().addUser(email, password, nickname);
    const user = await getUserRepository().find({ email });
    expect(user).toHaveLength(1);
    expect(user[0].email).toEqual(email);
    expect(user[0].nickname).toEqual(nickname);
  });
});
```

(테스트를 더 뾰족하게 다듬어야한다.)

---

### user resolver test 및 로직 추가

GraphQL 테스트를 위해 axios를 설치한다.

```cmd
yarn add axios
```

src/graphql/user 경로에 테스트를 위해 user.api.ts, user.test.ts 파일을 추가한다.

```ts
// src/graphql/user/user.api.ts

import 'dotenv/config';
import axios from 'axios';
import { Signup } from '../../types/type';

const URL = process.env.TEST_HOST as string;

export const signup = async (variables: Signup) =>
  axios.post(URL, {
    query: `
      mutation($email: String!, $password: String!, $nickname: String!) {
        signup(input: {
          email: $email
          password: $password
          nickname: $nickname
        }) {
          user {
            id
            email
            nickname
          }
          token
        }
      }
    `,
    variables,
  });
```

signup은 인자로 signupInput이라는 input type을 받는다.

이제 user.test.ts 파일을 작성하자.

```ts
// src/graphql/user/user.test.ts

import { Connection } from 'typeorm';
import connectDB from '../../repository';
import * as userApi from './user.api';
import { getUserInfoFromToken } from '../../utils/token';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

describe('signup test', () => {
  it(`signup은 email, password, nickname을 인자로 받아
    회원가입을 실행하고 계정정보와 token을 리턴한다.`, async () => {
    const email = 'abc@gmail.com';
    const password = 'abc';
    const nickname = 'abc';

    const {
      data: {
        data: {
          signup: { user, token },
        },
      },
    } = await userApi.signup({ email, password, nickname });

    // console.log(user);
    // console.log(token);
    expect(user.email).toEqual(email);
    expect(user.nickname).toEqual(nickname);

    const userInfo = getUserInfoFromToken(token);
    expect(userInfo.email).toEqual(email);
  });
});
```

axios로 GraphQL을 실행하면 위와 같은 구조로 데이터가 입수된다.

token을 검증하기 위해 getUserInfoFromToken이라는 함수를 생성했다.

```ts
// src/utils/token.ts

import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import { UserInfo } from '../types/type';

...

export const getUserInfoFromToken = (token: string) => {
  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as UserInfo;
    return user;
  } catch (error) {
    console.log(error);
    throw new ApolloError('Token decrypt error.', 'TOKEN_DECRYPT_ERROR');
  }
};
```

test를 통과할 수 있도록 resolver를 작성한다.

```ts
import { getUserRepository } from '../../repository';
import { SignupArgs } from '../../types/type';

const userResolver = {
  Query: {
    signin: () => {},
    me: () => {},
    user: () => {},
    users: () => {},
  },
  User: {
    following: () => {},
    followers: () => {},
  },
  Mutation: {
    signup: async (_: any, args: SignupArgs) => {
      const {
        input: { email, password, nickname },
      } = args;
      const user = await getUserRepository().addUser(email, password, nickname);
      return user;
    },
  },
};

export { userResolver };
```

test를 하나 더 추가한다. 이미 존재하는 email이면 error가 발생하는지 확인한다.

```ts
import { Connection } from 'typeorm';
import connectDB from '../../repository';
import * as userApi from './user.api';
import { getUserInfoFromToken } from '../../utils/token';

...

describe('signup test', () => {
  ...

  it('이미 존재하는 email일 경우 Apollo error(signup error)를 리턴한다.', async () => {
    const email = 'abc@gmail.com';
    const password = 'abc';
    const nickname = 'abc';

    await userApi.signup({ email, password, nickname });
    const {
      data: { errors },
    } = await userApi.signup({ email, password, nickname });

    // console.log(errors[0].message);
    // console.log(errors[0].locations);
    // console.log(errors[0].path);
    // console.log(errors[0].extensions);
    //   Signup error
    //   [ { line: 3, column: 9 } ]
    //   [ 'signup' ]
    //   { code: 'SIGNUP_ERROR' }
    expect(errors[0].message).toEqual('Signup error');
    expect(errors[0].extensions.code).toEqual('SIGNUP_ERROR');
  });
});
```

GraphQL이 실패하면 errors가 리턴된다. errors에는 messages, locations, path, extensions가 포함되어 있다. 이 중 messages와 extensions.code는 ApolloError에서 입력한 내용이다.

오늘은 여기까지.

다음에는 signin과 나머지 user resolver를 구현할 예정이다.
