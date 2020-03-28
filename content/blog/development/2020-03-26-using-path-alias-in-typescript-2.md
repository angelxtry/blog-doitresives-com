---
title: Path alias를 사용하여 TypeScript import 경로 깔끔하게 만들기 2
date: 2020-03-26 23:03:69
category: development
---

음... 이게 시리즈가 될 줄은 몰랐는데 어쩌다보니 2편을 쓰게 됐다.

1편은 여기를 참조하자.

[Path alias를 사용하여 TypeScript import 경로 깔끔하게 만들기](https://blog.doitreviews.com/development/2020-03-04-using-path-alias-in-typescript/)

## 발단

지난 번에 Path alias를 적용해서 import 경로를 깔끔하게 만드는 것은 성공했다.

거기서 더 발전시키지는 않고 딱 그 수준으로 개발을 진행하다보니 불편한 점이 많았다.

일단 package.json을 보자.

```json
"scripts": {
  "prebuild": "rm -rf dist",
  "build": "tsc",
  "postbuild": "cd src && copy ./api/**/*.graphql ../dist/api",
  "dev": "NODE_ENV=development node dist/index.js",
  "watch": "nodemon --exec \"yarn build && yarn dev\" --watch src -e ts,graphql",
  "codegen": "graphql-codegen --config ./codegen.yml"
},
```

watch에 ts, graphql 확장자를 걸어놔서 해당 확장자 파일이 수정되면 자동으로 재시작되는 것은 좋은데, 나머지 잡다한 일들이 줄줄이 실행되고 있었다.

## 방법 찾기

이전처럼 개발 시에는 ts-node를 이용하여 실행하고 싶었지만 path alias와 [Express의 Request 확장](https://blog.doitreviews.com/development/2020-03-26-extend-express-request-type-in-typescript/)으로 인해 에러가 발생했다.

그래서 검색.

멋진 선배님의 좋은 글을 발견!

[타입스크립트에서 절대경로 쓰기](https://libsora.so/posts/use-absolute-path-in-typescript/)

딱 내가 찾던 그 부분이 있었다.

tsconfig-paths란 package를 설치하면 매번 tsconfig.json을 참조하여 ts-node를 실행하기 때문에 path alias 같은 문제를 다 해결할 수 있다고 한다.

[ts-node Loading tsconfig.json](https://github.com/TypeStrong/ts-node#loading-tsconfigjson)

[tsconfig-paths how to use](https://www.npmjs.com/package/tsconfig-paths#how-to-use)

## 적용

package.json의 script를 다음과 같이 변경했다.

```json
"scripts": {
  "prebuild": "rm -rf dist",
  "build": "tsc",
  "postbuild": "cd src && copy ./api/**/*.graphql ../dist/api",
  "start": "yarn build && NODE_ENV=production node dist/index.js",
  "watch": "NODE_ENV=development nodemon --exec ts-node -r tsconfig-paths/register --files src/index.ts -e ts,graphql",
  "codegen": "graphql-codegen --config ./codegen.yml"
},
```

dev와 start를 실행하면 build 실행 후 index.js가 실행되도록 수정했다.

watch는 nodemon과 함께 ts-node로 실행되도록 만들었다.

## 이상한 점

음? tsconfig-paths를 설치했던가? 안했던 것 같은데?

node_modules 폴더를 뒤져보니 이미 설치되어 있었다. 어떻게 엮여서 설치가 되었을까?

yarn why로 확인해봤다.

```ts
$ yarn why tsconfig-paths
yarn why v1.22.0
[1/4] 🤔  Why do we have the module "tsconfig-paths"...?
[2/4] 🚚  Initialising dependency graph...
[3/4] 🔍  Finding dependency...
[4/4] 🚡  Calculating file sizes...
=> Found "tsconfig-paths@3.9.0"
info Reasons this module exists
   - "eslint-import-resolver-typescript" depends on it
   - Hoisted from "eslint-import-resolver-typescript#tsconfig-paths"
info Disk size without dependencies: "336KB"
info Disk size with unique dependencies: "752KB"
info Disk size with transitive dependencies: "752KB"
info Number of shared dependencies: 4
```

아. eslint-import-resolver-typescript를 설치할 때 같이 설치됐구나.

## 결론

개발 시점에 재컴파일 되는 과정이 단순해져서 마음에 든다.

[타입스크립트에서 절대경로 쓰기](https://libsora.so/posts/use-absolute-path-in-typescript/)를 읽다보니 jest도 언급되던데 조만간 적용하게 될 것 같다.

## 오류수정

```json
"scripts": {
  "prebuild": "rm -rf dist",
  "build": "tsc",
  "postbuild": "cd src && copy ./api/**/*.graphql ../dist/api",
  "start": "NODE_ENV=production yarn build && node dist/index.js",
  "watch": "NODE_ENV=development nodemon --exec ts-node -r tsconfig-paths/register --files src/index.ts -e ts,graphql",
  "codegen": "graphql-codegen --config ./codegen.yml"
},
```

start와 watch가 모두 잘 동작한다고 생각하고 있었는데 아니었다.

module-alias 설정 중에 package.json 파일에 다음과 같은 내용을 추가하는 과정이 있었다.

```json
"_moduleAliases": {
  "@src": "dist"
},
```

이 구문 때문에 watch를 실행해도 @src를 src가 아니라 dist로 변환하여 검색한다. NODE_ENV로 분기하는 로직을 추가하고 싶은데 방법을 잘 모르겠다. ㅠㅠ

```json
"_moduleAliases": {
  "@src": "src"
},
```

결국 이렇게 고쳐놓고 yarn watch를 실행하여 개발중이다.
