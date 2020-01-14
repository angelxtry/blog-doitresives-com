---
layout: post
comments: true
title: "[Express] Express Mysql Setting #2"
date: 2019-09-16 11:59:59
category: TIL
tags:
  - Express
  - MySQL
  - setting
---

[1편](https://angelxtry.github.io/Express-Mysql-Setting-01/)에서 진행한 `app.js` 파일은 다음과 같다.

```js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.set("port", process.env.PORT || "8001");

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트로 실행 중입니다.`);
});

```

## express 폴더 구조 설정

일단 폴더 구조를 설정한다.

root 폴더에 다음과 같은 폴더를 생성한다.

각 폴더의 역할도 간단하게 적어본다.

1.db - db connection 관련
2.models - DB의 데이터를 조회, 저장. sql문은 모두 여기 넣는다.
3.controllers - client에서 보낸 요청을 받아서 해당하는 모델의 함수를 호출한다. 모델에서 작업하기 쉽게 데이터를 가공해서 전달한다.
4.routes - client 요청을 받아서 url에 맞는 controller에 전달한다.

폴더를 모두 만들었다면 각 폴더에 `index.js` 파일을 생성해둔다.

프로젝트의 덩치가 커지고 복잡해지면 `index.js` 외에 파일이 더 생기겠지만 아직은 이정도로도 충분해 보인다.

이 부분을 맞게 하는 건지, 정답이 있는 건지 잘 모르겠다.

코드를 수정해야 하는 이슈가 발생했을 때 최대한 적은 부분을 수정하도록 만드는게 목표인데 잘 될지 모르겠다.

일단 계속 가보자.

## app.js 추가 설정(cors)

`cors`를 처리하기 위해 `cors` package를 설치한다.

```cmd
npm i cors
```

`app.js`에 두 줄만 추가하면 된다.

```js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const app = express();

app.set("port", process.env.PORT || "8001");

app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트로 실행 중입니다.`);
});

```

## route 처리

`app.js`에 routing 관련 코드를 추가한다.

```js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const router = require("./routes");

const app = express();

app.set("port", process.env.PORT || "8001");

app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트로 실행 중입니다.`);
});

```

이렇게 작성하면 `http://localhost:8002/[blahblah]`로 요청이 오면 `routes` 폴더의 `router`로 전달된다.

`routes/index.js` 파일을 다음과 같이 작성한다.

```js
const express = require("express");
const router = express.Router();

module.exports = router;

```

이렇게 세 줄이 routing을 하기 위한 기본 설정이다.

이제 `router`를 이용해 특정 url의 `GET`, `POST` 같은 요청에 맞게 처리할 수 있다.

여기에 `controller`를 붙이고 나머지 작업을 진행한다.

```js
const express = require("express");
const router = express.Router();

const controller = require("../controllers");

router.get("/stock", controller.stock.get);
router.post("/stock", controller.stock.save);

module.exports = router;

```

`http://localhost:8002/stock` url로 `GET`, `POST` 요청이 오면 각 요청에 맞춰 해당 controller가 실행된다.

## controllers

(내용이 너무 길어지는 것 같다. ㅠㅠ)

`controllers/index.js` 파일의 코드는 다음과 같이 생겼다.

```js
const models = require("../models");

module.exports = {
  stock: {
    get: async (req, res) => {
      try {
        const result = await models.stock.get(req.body);
        res.status(200).send(result);
      } catch (err) {
        return new Error();
      }
    },
    post: async (req, res) => {
      try {
        const result = await models.stock.save(req.body);
        res.status(201).send(result);
      } catch (err) {
        return new Error();
      }
    }
  }
};

```

router에서 호출하는 함수들이 정의되어 있다.

다른 로직은 신경쓰지 말고 get, post를 관리하는 구조만 보자.

controller는 받은 request에 맞게 model의 함수를 호출하고 그 결과를 response로 client에게 보내준다.

## models

`models/index.js` 파일은 다음과 같다.

```js
const pool = require("../db");

module.exports = {
  stock: {
    get: async info => {
      const connection = await pool.getConnection();
      try {
        const queryString = `select ...`;
        const queryArg = [info.param1, info.param2];
        const [rows] = await connection.query(queryString, queryArg);
        return rows;
      } catch (error) {
        return new Error();
      } finally {
        connection.release();
      }
    },
    save: async info => {
      const connection = await pool.getConnection();
      try {
        const queryString = `insert into...`;
        const queryArg = [info.param1, info.param2, ...];
        const [rows] = connection.query(queryString, queryArg);
        return rows;
      } catch (error) {
        return new Error();
      } finally {
        connection.release();
      }
    }
  }
};

```

이 코드도 그냥 구조만 보자.

`model`은 `controller`에서 전달받은 param을 이용하여 query를 만들고 실행한다.

그리고 그 실행 결과를 다시 `controller`에 전달한다.

## db

`db/index.js` 파일은 다음과 같다.

```js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: "dividend_dot_com",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectionTest = async () => {
  const connection = await pool.getConnection();
  try {
    const sql = "select sysdate() from dual;";
    const [rows] = await connection.query(sql);
    console.log(rows);
  } catch (error) {
    return new Error();
  } finally {
    connection.release();
  }
};

connectionTest();

module.exports = pool;

```

`db`는 mysql과 연결하는 역할을 한다.

`mysql2`는 `promise`를 지원하는 client다. `async/await`도 자연스럽게 사용할 수 있다.

솔직히 말하자면 `createPool`의 옵션들이 어떤 역할을 하는지 아직 잘 모르겠다;; 이것도 얼른 찾아봐야한다;; 뭐든 알고 써야한다.

## fin

나중에 내가 다시 찾아보려고 코드까지 적어가며 길게 적었다.

분명히 얼마 뒤면 또 많은 것이 바뀌어 있겠지만 그건 계속 따라가면서 바뀌는 부분을 보충해주면 된다.

내가 적어 놓은 코드도 아직 다 이해 못하는 부분이 많다.

시간 날때마다 꾸준히 보충하자.
