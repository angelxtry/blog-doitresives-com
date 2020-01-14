---
layout: post
comments: true
title: "[Express] Express Mysql Setting #1"
date: 2019-09-16 11:59:59
category: TIL
tags:
  - Express
  - MySQL
  - setting
---

Express와 MySQL을 사용한 project setting 과정을 적어본다.

처음에는 Sequelize를 사용하려고 했는데 적다보니 내용이 너무 길어지고, 아는 것도 얼마 없어서 그냥 `mysel2`를 사용하는 방식으로 변경했다.

이렇게 기록하고 정리하는 과정을 거치지 않으면 한번 해본 것도 잘 기억나지 않아서 시간을 들여 적어본다.

몇몇 교재와 검색한 자료를 짜집기한 내용이라 오류가 많을 수 있다.

MySQL 설치, 테이블 생성 등의 내용은 포함하지 않았다.

## intro

먼저 폴더를 하나 만든다.

```cmd
mkdir project-name
```

해당 폴더롤 이동하여 `npm init`으로 `package.json` 파일을 생성한다.

```cmd
npm init

package name: (express-dividend-dot-com)
version: (1.0.0) 0.0.1
description:
entry point: (index.js) app.js
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to /Users/angelx/projects/CodeStates/my-project/express-dividend-dot-com/package.json:

{
  "name": "express-dividend-dot-com",
  "version": "0.0.1",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

entry point를 app.js로 변경했다.

npm init이 끝나면 package.json 파일이 하나 생성된다.

해당 파일에서 scripts 부분에 다음의 내용을 추가한다.

```cmd
"start": "nodemon app"
```

## sequelize 설치

(sequelize를 사용하지 않는다면 `mysql2`만 설치하고 이 부분은 건너뛰자.)

다음 command도 sequelize cli를 설치한다.

```cmd
npm i -g sqeuelize-cli
```

그리고 sequelize와 mysql을 사용하기 위한 package도 설치한다.

```cmd
npm i sequelize mysql2
```

package.json 파일을 확인해보면 sequelize와 mysql2가 설치된 것을 확인할 수 있다.

sequelize-cli`를 설치했기 때문에 터미널에서 sequelize 명령어를 사용할 수 있다.

```cmd
sequelize init
```

위와 같이 입력하면 다음의 폴더와 파일들이 생성된다.

```cmd
config/config.json
modules
migrations
seeders
```

## sequelize를 통해 mysql database 생성

(sequelize를 사용하지 않는다면 이 부분도 건너뛰자.)

`config/config.json` 파일에서 DB 설정을 한다.

개발 단계 이므로 development ​부분만 수정한다.

```json
"development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
```

자신의 mysql에 맞게 username, password, database 등을 수정한다.

설정이 완료되었다면 터미널에서 다음과 같이 입력한다.

```cmd
sequelize db:create
```

mysql 설정이 제대로 되었다면 `config.json`에서 설정한 database가 생성되었다고 메시지가 출력된다.

## nodemon 설치

조금 더 편리한 개발을 위해 nodemon을 설치한다.

```cmd
npm i -D nodemon
```

`-D` 옵션으로 설치하면 package.json의 `devDependencies` 항목에 기록된다.

nodemon은 터미널에서 직접 입력하여 수행하기도 하기에 global로도 설치한다.

```cmd
npm i -g nodemon
```

## express, 기타 package 설치

express와 필요한 기타 package를 설치한다.

```cmd
npm i express morgan
```

`cookie-parser`, `express-session`, `connect-flash` 등은 필요할 때 설치하도록 하자.

## express 기본 설정

`npm init`에서 `entry point`를 `app.js`로 설정했었다.

그래서 root 폴더에 app.js 파일을 만든다.

```js
const express = require("express");

const app = express();

app.listen(8001, () => {
  console.log(`8001번 포트로 실행 중입니다.`);
});
```

express의 가장 기본 구조다.

이 상태로 `npm start`를 실행하면 8001번 포트의 요청을 대기한다.

설치했던 package들을 load하고 미들웨어 설정을 한다.

```js
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(8001, () => {
  console.log(`8001번 포트로 실행 중입니다.`);
});
```

솔직히 여기서 사용되는 미들웨어들의 기능을 아직 다 파악하지 못하고 있다.

날을 잡아서 하나하나 찾아봐야겠다.

`app.set()`, `app.get()`을 이용하여 port를 동적으로 설정할 수 있다.

```js
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.set("port", process.env.PORT || "8001");

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트로 실행 중입니다.`);
});
```

process.env를 사용하여 PORT 값이 있으면 해당 값을 사용하고 없다면 8001번을 사용하도록 설정했다.

`app.set()`으로 설정한 값은 `app.get()`으로 불러올 수 있다.

`app.listen()`에서 `app.get()`을 이용하여 설정한 port 값을 불러온다.

## dotenv 사용

port를 설정할 때 `process.env.PORT`의 값을 확인했었다.

이것은 `dotenv` package를 사용한 것이다.

다음과 같이 `dotenv` package를 설치한다.

```cmd
npm i dotenv
```

그리고 root 폴더에 `.env`파일을 하나 생성한다.

`.env` 파일에는 `key=value` 형식으로 값을 입력하면 된다.

`.env` 파일에 port 값을 정의한다.

```cmd
PORT=8002
```

이렇게 `.env` 파일을 이용하면 코드에 비밀번호 같은 것이 포함되는 것을 막을 수 있다.

마지막으로 `app.js` 파일의 최상단에 다음과 같이 입력한다.

```js
require("dotenv").config()
```

이렇게 입력하자마자 `nodemon`에 의해 8002번 포트로 서버가 시작된다.

(다음 편에 게속)
