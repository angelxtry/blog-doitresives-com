---
layout: post
comments: true
title: "mocha로 express, DB 테스트 #01"
date: 2019-11-12 11:59:59
category: TIL

tags:
  - mocha
  - express
  - test
  - mysql
  - sequelize
---

이것저것 만들다보니 테스트가 아쉬워져서 mocha, supertest를 사용해봤다.

간단한 api 서버에 test를 적용해보자.

먼저 프로젝트를 구축한다.

```js
> mkdir tdd-express
> cd tdd-express
> npm i express morgan
> npm i -D mocha should supertest nodemon
> npm i mysql2 sequelize sequelize-cli
> npm i -g sequelize-cli nodemon
```

## 1. DB Setting

DB부터 만들어보자.

DB는 mysql, sequelize 조합으로 사용한다.

다음 명령을 실행한다.

```js
> sequelize init
```

`config/config.json` 파일을 수정한다.

```json
{
  "development": {
    "username": "root",
    "password": "PASSSWORD",
    "database": "tdd_dev",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

`models/index.js`

```js
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.User = require('./user')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

```

`models/user.js`

```js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      nick: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
      },
    },
    {
      timestamps: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  return User;
};

```

일단 여기까지 진행하고 mysql에 DB를 만들어보자.

```js
> sequelize db:create
```

요렇게 입력하면 `tdd_dev` database가 만들어졌다고 나온다.

테이블이 만들어진건 아니다.

테이블도 만들 겸 express의 index.js를 작성하자.

## 2. express 설정

```js
const express = require('express');
const morgan = require('morgan');

const db = require('./models');
const app = express();
db.sequelize.sync();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8888, () => {
  console.log('http://localhost:8888');
});

```

nodemon index.js로 실행하면 `db.sequelize.sync()` 덕에 mysql의 tdd_dev database에 ​user table이 생성된다.

## 3. 테스트 준비

처음에 설치했던 테스트 관련 package를 간단히 훑어보자.

### 3-1 mocha

mocha는 테스트 코드를 돌려주는 테스트 러너다.

test suit 안에 test case를 작성한다.

test suit는 describe, test case는 it으로 구현한다.

### 3-2 should

BDD 스타일의 assertion 모듈이다.

다음과 같은 방식으로 사용한다.

```js
result.should.be.equal('value');
```

### 3-3 supertest

테스트는 단위 테스트와 통합 테스트로 구분할 수 있다.

단위 테스트: 함수의 기능 테스트

통합 테스트: api의 기능 테스트

supertest는 express 통합 테스트 라이브러리다.

내부적으로 express를 구동하여 실제 요청을 보낸 뒤 결과를 검증한다.

## 4. 폴더 구조 설정

root 폴더에 `api/user` 폴더를 생성한다.

해당 폴더에 `index.js`, `user.controller.js`, `user.spec.js` 파일을 생성한다.

`index.js` 파일은 routing

`user.controller.js` 파일은 각 라우팅의 로직

`user.spec.js` 파일은 테스트 코드가 포함된다.

## 5. 테스트 작성

회원 가입 부터 시작하자.

요구사항은 다음과 같다.

email, nickname, password를 입력받아 회원 가입을 처리한다.

회원가입이 성공하면 status code 201로 응답한다.

email이 중복이면 status code 400 에러코드를 발생한다.

email, nickname, password가 빈 값이면 400 에러.

`api/user/index.js`

```js
const request = require('supertest');

const app = require('../../index');

describe('POST /api/user/signup 요청 시 email, nickname, password를 전달하여 회원가입을 요청', () => {
  it('성공하면 201 응답.', (done) => {
    request(app)
      .post('/api/user/signup')
      .send({
        email: 'zzz@gmail.com',
        nickname: 'zzz',
        password: 'zzz',
      })
      .expect(201)
      .end(done);
  });
});

```

첫 describe에는 http 메서드와 url을 표현한다.

it이 비동기일때 done을 인자로 보내고 비동기 내에서 실행하면 테스트가 완료된다.

`request`로 express 호출하고 `post`로 POST api를 호출한다.

`send`를 이용하여 POST의 body를 전달한다.

응답의 status code를 `expect`와 비교한다.

테스트를 실행하면 무조건 실패할 것이다. 왜냐하면 실행 코드가 없으니까.

테스트가 통과하도록 코드를 작성해보자.

`api/user/index.js`

```js
const express = require('express');
const router = express.Router();

const controller = require('./user.controller');

router.post('/signup', controller.signup);

module.exports = router;
```

`api/user/user.controller.js`

```js
const db = require('../../models');

const signup = async (req, res) => {
  try {
    const { email, nickname, password } = req.body;
    const newUser = await db.User.create({
      email,
      nickname,
      password,
    });
    return res.status(201).send('User created.');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error.');
  }
};

module.exports = {
  signup,
};
```

## 6. 테스트 실행

이제 테스트를 실행할 차례다.

테스트 실행 명령을 `package.json` 파일에 작성한다.

```json
"scripts": {
  "test": "mocha --exit **/*.spec.js",
  "dev": "nodemon index.js"
},
```

1번 시도하면 성공하고 다시 한번 시도하면 실패한다.

zzz라는 값이 User table에 이미 저장되는 것이 문제.

그래서 다음과 같이 처리한다.

```js
const request = require('supertest');

const app = require('../../index');
const db = require('../../models');

describe('POST /api/user/signup 요청 시 email, nickname, password를 전달하여 회원가입을 요청', () => {
  before(() => db.sequelize.sync({ force: true }));
  it('성공하면 201 응답.', (done) => {
    request(app)
      .post('/api/user/signup')
      .send({
        email: 'zzz@gmail.com',
        nickname: 'zzz',
        password: 'zzz',
      })
      .expect(201)
      .end(done);
  });
});

```

`it` 테스트를 실행하기 전에 `before`를 추가했다.

`db.sequelize.sync({ force: true })`를 실행하면 정의된 테이블의 데이터를 모두 삭제한다.

헌데 이렇게 실행하면 테스트는 성공하는데 중간중간 테이블이 없다는 오류 메시지가 출력된다.

`index.js`와 `user.spec.js` 파일에 모두 `sequelize.sync()`가 포함되어 있어 발생하는 문제인 것 같다.

`NODE_ENV`를 활용하여 테스트 환경을 분리했다.

## 7. 테스트 환경 분리

`index.js`

```js
const express = require('express');
const morgan = require('morgan');

const db = require('./models');
const userAPI = require('./api/user');

const app = express();
const env = process.env.NODE_ENV;
env === 'test' ? '' : db.sequelize.sync();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userAPI);

app.listen(8888, () => {
  console.log('http://localhost:8888');
});

module.exports = app;
```

`NODE_ENV`가 test일 때는 `sequelize.sync()`를 실행하지 않는다.

`models/index.js` 이 파일은 처음부터 `NODE_ENV`에 따라 `config.json`에서 다른 값을 가져온다.

`config/config.json`

```json
{
  "development": {
    "username": "root",
    "password": "PASSWORD",
    "database": "tdd_dev",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "PASSWORD",
    "database": "tdd_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

`test`일 경우 다른 database를 이용하도록 변경했다.

```js
> NODE_ENV=test sequelize db:create
```

위 명령으로 `tdd_test` database를 생성했다.

`package.json`

```js
"scripts": {
  "test": "NODE_ENV=test mocha --exit **/*.spec.js",
  "dev": "nodemon index.js"
},
```

이제 `> npm test`를 실행하면 에러 없이 잘 동작한다.
