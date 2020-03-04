---
title: Path alias를 사용하여 TypeScript import 경로 깔끔하게 만들기
date: 2020-03-04 21:03:84
category: development
---

TypeScript, GraphQL, TypeORM으로 작은 프로젝트를 진행하고 있다.

TypeScript에서 import를 할 때 기본적으로 상대경로를 이용한다.

이 상대경로가 너무 지저분해 보여서 좋은 방법이 없을까 하고 검색을 해봤다.

검색 결과 주로 front 관련 내용들이 많이 나왔다. Webpack이나 Babel을 이용하여 이 문제를 해결하고 있었다.

backend에 굳이 Webpack이나 Babel을 이용할 필요는 없을 것 같아서 몇 번 더 검색하다가 다음 글을 발견했다.

[Path aliases with TypeScript in Node.js](https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353)

상대경로를 다르게 변경하는 것을 `Path alias`라고 부르는가보다.

Path alias를 적용하면 다음과 같이 처리할 수 있다.

```ts
// 적용 전
import Chat from '../../../entities/Chat';

// 적용 후
import Chat from '@src/entities/Chat';
```

## 적용 방법

프로젝트 폴더 구조는 다음과 같다.

```ts
├── dist
└── src
    ├── api
    │   ├── Chat
    │   ├── User
    ├── entities
    ├── types
    └── utils
```

dist는 컴파일 된 js 파일이 저장되는 폴더다.

### 1. tsconfig.join 설정 추가

먼저 `tsconfig.json`에 baseUrl과 Paths가 필요하다.

```ts
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@src/*": [ "src/*" ]
    }
  }
}
```

나는 소스 코드의 최상위 경로인 src를 선택했지만 하위 경로를 선택하는 것도 가능하고 개별적으로 하위의 여러 폴더를 선택할 수도 있다.

### 2. module-alias package 설치

[module-alias](https://www.npmjs.com/package/module-alias)를 설치한다.

설치 후 package.json 파일에 다음의 코드를 추가한다.

```ts
"_moduleAliases": {
  "@src": "dist"
},
```

### 3. index.ts 파일에 import 추가

```ts
import 'module-alias/register';
```

## 테스트

tsc 명령으로 ts 파일을 js 파일로 변환해보자.

변환 후 동일한 js 파일을 확인해보면 다음과 같이 코드가 변경되어 있다.

```ts
const Chat_1 = require('@src/entities/Chat');
```

```ts
node dist/index.js
```

위와 같이 해당 파일을 직접 실행해도 오류가 발생하지 않는다.

## scripts

scripts를 다음과 같이 수정해서 사용 중이다. nodemon을 사용하기 위해 `watch` 항목을 추가했다.

```json
"scripts": {
  "dev": "NODE_ENV=development node dist/index.js",
  "watch": "nodemon --exec \"yarn build && yarn dev\" --watch src -e ts,graphql",
  "prebuild": "rm -rf dist",
  "build": "tsc",
  "start": "NODE_ENV=production node dist/index.js"
}
```

## eslint 적용

`tsconfig.json`에 paths를 설정하면 ts 오류는 해결되는데 eslint 오류는 그대로 남아있다.

```ts
Unable to resolve path to module '@src/entities/Chat'.eslint(import/no-unresolved)
```

이 오류를 없애려면 `eslint-import-resolver-typescript` package를 설치하고 `.eslintrc.js` 파일에 다음의 항목을 추가하면 된다.

```js
settings: {
  'import/resolver': {
    typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
  }
},
```
