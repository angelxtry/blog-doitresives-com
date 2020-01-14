---
layout: post
comments: true
title: "[Node.js] Express Intro - 1"
date: 2019-09-25 11:59:59
category: TIL
tags:
  - Node.js
  - Express
  - middleware
---

Express의 기본 구조와 middleware를 살펴보자.

## Express generator

express generator를 설치한다.

```js
npm i -g express-generator
```

`express-generator` 설치가 끝나면 다음과 같이 실행한다.

```js
express learn-express --view=pug
```

learn-express 라는 폴더가 생성된다.
해당 폴더로 이동하여 기본 package를 설치한다.

```js
cd learn-express
npm i
```

설치가 다 되었다면 `npm start`로 프로젝트를 실행한다.

혹시라도 에러 없이 실행되었지만 `http://localhost:3000`으로 접속되지 않는다면 port를 의심해봐야 한다.

`/bin/www` 파일에 다음과 같은 코드가 있다.

```js
var port = normalizePort(process.env.PORT || '3000');
```

`process.env.PORT`에 값이 저장되어 있어 3000번 포트가 아닌 다른 포트로 실행되었을 가능성이 있다.
`process.env.PORT`를 확인해보거나 다른 터미널에서 실행해보자.

## 폴더 구조

`learn-express` 폴더를 살펴보면 ​다음과 같은 폴더가 있다.

`bin`

`public`

`routes`

`views`

## app.js

`npm start`로 실행을 하면 `/bin/www`가 실행되지만 확인해보면 결국 `app.js` 파일의 내용이 핵심이다.

`app.js`를 처음부터 다시 만들어본다.

```js
const express = require("express");

const app = express();

module.exports = app;
```

일단 express를 가져온다. 그리고 express를 이용하여 app 객체를 생성한다.

app 객체를 이용하여 `createServer()`, `listen`등을 실행해야 하지만 express generator에서는 ​`www` 파일에 해당 코드가 포함되어 있다.

그래서 `module.exports`로 app 객체를 내보낸다.

이 코드가 가장 간단한 express 서버다.

### app.js - routes

라우터를 추가해보자.

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

module.exports = app;

```

위와 같이 작성한 후 `http://localhost:3000`으로 접속하면 `Hello Express!` 메시지를 확인할 수 있다.

라우터를 하나 더 추가해보자.

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.get("user", (req, res) => {
  res.send("Hello user");
});
```

`http://localhost:3000/user`라고 입력하면 해당 메시지를 확인할 수 있다.

node의 http 서버에서는 응답을 보낼 때 `res.end()`를 사용했었다.

epxress는 `res.send()`를 사용한다. express가 `res.end()`의 역할을 포함하는 `res.send()` 메서드를 사용할 수 있다.

`app.get()`을 브라우저에서 보내는 get 요청을 처리한다.

`post`, `delete` 같은 요청도 `app.post` 같은 메서드를 추가하여 처리할 수 있다.

### app.js - app.set

`app.set()`은 express 설정이나 값을 저장하기 위해 사용한다.

```js
const express = require("express");
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

module.exports = app;

```

`app.set()`으로 `views`를 설정하고 `view engine`을 설정했다.

### app.js = app.use

`app.use()`는 미들웨어다.

express에 요청이 들어오면 이 요청을 설정해둔 미들웨어를 통과하여 응답으로 브라우저로 전송된다.

간단한 미들웨어를 추가해보자.

```js
const express = require("express");
const path = reuqire("path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use((req, res) => {
  console.log("first middleware.");
});

app.use((req, res) => {
  console.log("second middleware.");
});

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

module.exports = app;

```

미들웨어를 두 개 추가했다.

브라우저에서 서버를 다시 호출해보면 `first middleware.`가 출력되고 그 이후에는 동작하지 않는다.

첫 번째 미들웨어까지만 동작한 것이다.

미들웨어를 통과하여 그 이후 동작을 하려면 다음과 같이 미들웨어를 수정해야 한다.

```js
app.use((req, res, next) => {
  console.log("first middleware.");
  next();
});

```

`next()`가 추가되어야 미들웨어를 통과하여 그 다음이 진행된다.

두 번째 미들웨어에도 `next()`를 추가하면 `app.get()`까지 통과하여 응답이 브라우저까지 전달된다.

```js
app.use((req, res, next) => {
  console.log("first middleware.");
});

app.use((req, res) => {
  console.log("second middleware.");
  res.send("Hello Middleware.");
});

```

이렇게 작성하면 두 번째 미들웨어에서 응답을 보내고 종료된다.

미들웨어에서 `next`도 없고, `res.send()`도 없으면 client는 timeout이 발생할 때까지 계속 기다린다.

get, post 등도 미들웨어의 일종이다. 단지 특정 요청에만 반응하는 미들웨어라고 볼 수 있다.

### app.js - morgan 미들웨어

```js
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use((req, res, mext) => {
  console.log("first middleware.");
});

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

module.exports = app;

```

`morgan`이라는 미들웨어를 추가했다.

브라우저에서 서버로 요청을 보내면 다음과 같은 메시지가 터미널에 출력된다.

```js
first middleware.
GET / 200 5.554 ms - 14
```

`morgan`은 미들웨어를 모두 통과한 후 route를 만나 응답이 전송되면 터미널에 응답에 대한 정보를 출력해준다.

`morgan`의 옵션을 `dev`로 설정했기 때문에 다음과 같은 포멧으로 출력된다.

`:method :url :status :response-time ms - :res[content-length]`

방금 전의 응답을 분석해보면 method는 GET, url은 `/`, status는 200, response-time은 5.554, content-length는 14이다.

### app.js - express.json() 미들웨어

`express.json`은 request의 body를 쉽게 parsing 할 수 있도록 도와준다.

기존에는 `body-parser`라는 미들웨어를 사용했으나 express 4.16 버전부터 `express.json`으로 내장되었다.

body에 데이터를 담아 POST request를 보냈을 때 처리하는 route를 다음과 같이 작성한다.

```js
app.post("/user", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

```

body의 데이터는 다음과 같다.

```json
{
  "id": 1,
  "email": "abc@gmail.com"
}
```

요청을 보내면 req.body는 undefined가 출력된다.

`req.body`와 같이 request의 body 데이터를 사용하려면 미들웨어가 필요하다.

```js
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.post("/user", (req, res) => {
  console.log("req.body: ", req.body);
  res.json(req.body);
});

module.exports = app;

```

`express.json()` 미들웨어를 추가하면 `req.body`로 body의 데이터를 활용할 수 있다.

### app.js - cookie-parser 미들웨어

`req.cookies`로 request의 cookies에 접근할 수 있다.

### app.js - express-session 미들웨어

`npm i express-session`으로 설치한다.

```js
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(session())
...

```

`session()`은 메모리 세션을 활성화한다.

`session()`은 다양한 옵션을 사용할 수 있다.

```js
app.use(cookeParser("SecretCode"));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "SecretCode",
  cookie: {
    httpOnly: true,
    secure: false
}));
```

서버에서 `res.cookie()` 등으로 client에 cookie 정보를 보낼 수 있다.

서버에서 전송한 cookie인지 확인하기 위해서 `cookieParser`에 secret key가 필요하다.

`saveUninitialized`가 true이면 처음의 빈 session이라도 저장한다.

`resave`가 true이면 달라진게 없어도 무조건 다시 저장한다.

`secure`가 true이면 https를 사용한다는 의미.

### app.js - connect-flash 미들웨어

`npm i connect-flash`로 설치한다.

로그인 실패 같은 경우 1회용 메시지를 popup으로 생성해주는 미들웨어

## Fin

Express의 기본 설정과 미들웨어를 확인했다.

`app.js` 파일의 몰랐던 부분이 많이 이해된 듯 하다.

특히 미들웨어가 어떻게 동작하는지 알게되어 매우 만족스럽다.
