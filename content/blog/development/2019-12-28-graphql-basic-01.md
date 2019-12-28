---
title: 2019-12-28 GraphQL basic 01
date: 2019-12-28 02:12:30
category: development
---

GraphQL의 기초가 부족하다고 생각되어 처음부터 내용을 적어보기로 했다.

## 기본 설정

폴더를 하나 만들자.

```js
mkdir graphql-tutorial
```

babel을 설치한다.

```js
yarn add -D babel-cli babel-preset-env
```

`.babelrc` 파일을 생성한다.

```json
{
  "presets": ["env"]
}
```

graphql-yoga를 설치한다.

```js
yarn add graphql-yoga
```

테스트를 수월하게 진행하기 위해 nodemon을 설치한다.

```js
yarn add -D nodemon
```

`src/index.js` 파일을 생성한다.

일단 한 줄만 적어보자.

```js
console.log('Hello GraphQL!');
```

package.json 파일에 script를 추가한다.

```json
{
  "name": "graphql-tutorial",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "nodemon": "^2.0.2"
  },
  "dependencies": {
    "graphql-yoga": "^1.18.3"
  },
  "scripts": {
    "dev": "nodemon --exec babel-node src/index.js"
  }
}
```

기본 설정 완료!

`yarn dev`를 실행해보자.

## simple graphql server

```js
import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello GraphQL',
  },
};

const options = {
  port: 9999,
  playground: '/playground',
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(options, ({ port }) => {
  console.log(`Server start ${port} port.`);
});
```

간단하게 설명하면 type과 resolver를 만들어 GraphQLServer에 인자로 전달하면 된다.

Apolle v2와는 조금 다른 코드지만 비교하면서 이해할 수 있다.

typeDefs는 GraphQL에서 사용할 데이터를 정의한다. 보통 schema라고 부르는 것 같다. type 정의는 대부분 type으로 시작한다.

resolvers는 type과 쌍으로 생성한다. schema가 GraphQL의 레이아웃이라면 resolvers는 실제로 동작하는 몸체 같은 느낌이다.

## 간단한 fake data 조회하기 - users

`fakeData.js`

```js
export const users = [
  {
    id: 1,
    name: 'aaa',
    email: 'aaa@gmail.com',
  },
  {
    id: 2,
    name: 'bbb',
    email: 'bbb@gmail.com',
  },
  {
    id: 3,
    name: 'ccc',
    email: 'ccc@gmail.com',
  },
];

export const posts = [
  {
    id: 11,
    title: 'AAA',
    author: 1,
  },
  {
    id: 22,
    title: 'BBB',
    author: 1,
  },
  {
    id: 33,
    title: 'CCC',
    author: 2,
  },
];
```

일단 users 부터 조회할 수 있도록 만들어보자.

```js{4-15, 17-25}
import { GraphQLServer } from 'graphql-yoga';
import { users } from './fakeData';

const typeDefs = `
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Query {
    user(id: Int!): User!
    users: [User]!
  }
`;

const resolvers = {
  Query: {
    user: (_, args) => users.find(user => user.id === args.id),
    users: () => {
      console.log(users);
      return users;
    },
  },
};

const options = {
  port: 9999,
  playground: '/playground',
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(options, ({ port }) => {
  console.log(`Server start ${port}port.`);
});
```

Query type 부터 확인해보자.

user, users 2가지 방식으로 데이터를 조회할 수 있다.

user는 argument로 Int를 받는다. Int 같은 것은 Scalar type이라고 부른다. `!`가 붙어 있으므로 없으면 에러가 날 것이다.

user와 같은 함수는 총 4개의 인자를 받는다. 순서대로 parent, args, context, info라고 부른다. 이름은 고정된 것은 아니다. parent를 root로 부르기도 한다. 그냥 위치를 보고 판단하자. 각 인자에 대해서는 이후에, 또는 다른 글에서 설명을 보충하겠다.

playground에서 argument 없이 조회를 시도해보면 다음과 같은 에러 메시지가 출력된다.

```graphql
{
  user {
    id
  }
}
```

```json
"message": "Field \"user\" argument \"id\" of type \"Int!\" is required, but it was not provided."
```

user의 리턴값은 User다. User 또한 type이다. Object type이라고 부른다. Object type을 구성하는 field를 정의한다.

field를 가지고 있는 Object type을 리턴하는 경우 조회할 때도 Scalar type과는 다르게 조회해야 한다.

```grqphql
{
  user
}
```

이렇게 조회하면 다음과 같은 에러 메시지가 출력된다.

```js
"message": "Field \"user\" of type \"User!\" must have a selection of subfields. Did you mean \"user { ... }\"?",
```

정상적으로 조회하려면 다음과 같이 실행한다.

```graphql
{
  user(id: 2) {
    id
    name
    email
  }
}
```

존재하지 않는 id를 조회할 경우 에러가 발생한다.

```js
"message": "Cannot return null for non-nullable field Query.user.",
```

그러므로 인자를 전달하면 값을 조회하는 경우는 `!`를 붙일지 말지 고민해보는게 좋다.

Query type의 users는 모든 user를 출력한다.

그래서 리턴 type이 `[User]!`다. `[]`는 배열을 의미한다.

## 간단한 fake data 조회하기 - posts

posts 데이터를 조회할 수 있도록 코드를 추가해보자.

```js{11-15, 32}
import { GraphQLServer } from 'graphql-yoga';
import { users, posts } from './fakeData';

const typeDefs = `
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Post {
    id: String!
    title: String!
    author: User!
  }

  type Query {
    user(id: Int!): User!
    users: [User]!
    post(id: Int!): Post!
    posts: [Post]!
  }
`;

const resolvers = {
  Query: {
    user: (_, args) => users.find(user => user.id === args.id),
    users: () => {
      console.log(users);
      return users.map(user => user);
    },
    post: (_, args) => posts.find(post => post.id === args.id),
  },
};

const options = {
  port: 9999,
  playground: '/playground',
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(options, ({ port }) => {
  console.log(`Server start ${port} port.`);
});
```

Query type에 post, posts를 추가했다. user와 동일하게 Post, Post 배열을 반환한다.

Post type은 특이하게 author field가 User type을 반환한다. 일단 Post를 구현하고 조회해보자. id, title까지는 조회가 잘 된다. 하지만 author를 조회하려고 하는 순간부터 에러가 발생하기 시작한다.

User type을 반환하는 author를 조회하려면 resolver가 하나 더 필요하다.

```js{34-40}
import { GraphQLServer } from 'graphql-yoga';
import { users, posts } from './fakeData';

const typeDefs = `
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Post {
    id: String!
    title: String!
    author: User!
  }

  type Query {
    user(id: Int!): User!
    users: [User]!
    post(id: Int!): Post!
    posts: [Post]!
  }
`;

const resolvers = {
  Query: {
    user: (_, args) => users.find(user => user.id === args.id),
    users: () => {
      console.log(users);
      return users;
    },
    post: (_, args) => posts.find(post => post.id === args.id),
  },
  Post: {
    author: parent => {
      console.log('Parent: ', parent);
      console.log('Author id: ', parent.author);
      return users.find(user => user.id === parent.author);
    },
  },
};

const options = {
  port: 9999,
  playground: '/playground',
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(options, ({ port }) => {
  console.log(`Server start ${port}port.`);
});
```

resolvers를 보면 Query 안에 함수를 추가하는 것이 아니라 Query와 동일한 레벨에 Post를 추가했다. 그리고 Post에 author 함수를 추가한다. 좀 더 풀어서 설명해보면 Post type의 id와 title은 기본적인 Scalar type이기 때문에 Query의 post로 표현할 수 있다. 하지만 author는 User라는 object type이기 때문에 author를 표현할 수 있는 별도의 로직이 필요하다. 그래서 별도로 Post를 명시하고, Post안에 author를 구현한다.

author 함수에서는 첫 번째 인자인 parent를 사용한다. author는 post를 거쳐서 호출된다. 그래서 author를 호출하는 순간의 post가 parent가 되다.

playground에서 post의 id를 변경하면서 console을 확인하면 parent의 의미를 더 명확하게 알 수 있다.

author는 User를 리턴한다. 그러므로 parent.author와 일치하는 user를 찾아 리턴하도록 코드를 작성한다.

## 간단한 fake data 조회하기 - posts, N+1 problem

마지막으로 posts를 조회할 수 있도록 코드를 추가해보자.

```js{33}
import { GraphQLServer } from 'graphql-yoga';
import { users, posts } from './fakeData';

const typeDefs = `
  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Post {
    id: String!
    title: String!
    author: User!
  }

  type Query {
    user(id: Int!): User!
    users: [User]!
    post(id: Int!): Post!
    posts: [Post]!
  }
`;

const resolvers = {
  Query: {
    user: (_, args) => users.find(user => user.id === args.id),
    users: () => {
      console.log(users);
      return users;
    },
    post: (_, args) => posts.find(post => post.id === args.id),
    posts: () => posts,
  },
  Post: {
    author: parent => {
      console.log('Parent: ', parent);
      console.log('Author id: ', parent.author);
      return users.find(user => user.id === parent.author);
    },
  },
};

const options = {
  port: 9999,
  playground: '/playground',
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(options, ({ port }) => {
  console.log(`Server start ${port}port.`);
});
```

posts도 Post type을 리턴한다. 이미 Post - author를 정의했기 별 문제없이 잘 조회된다. 하지만 console을 확인해보면 posts를 한번 조회할 때마다 author가 3번씩 실행된 것을 알 수 있다.

이것이 GraphQL의 N + 1 Problem이다. posts 같이 다른 type을 포함하는 배열 데이터를 조회할 경우 배열 그 자체를 조회하는 것(1)외에 배열 데이터의 개수(N) 만큼 다른 type을 조회한다. 1번 조회에 N + 1회의 함수 호출이 필요하다. 이 비효율을 해결하기 위한 방법으로 [DataLoader](https://github.com/graphql/dataloader)나 [Join Monster](https://github.com/acarl005/join-monster) 등을 사용한다.

오늘은 여기까지.

