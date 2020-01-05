---
layout: post
comments: true
title: "mocha로 express, DB 테스트 #02"
date: 2019-11-13 11:59:59
category: development
tags:
  - mocha
  - express
  - test
  - mysql
  - sequelize
---

이전 글에서 test 환경과 develop 환경을 분리하여 test 환경에서 test를 성공했다.

## signup 테스트

지난 번의 요구사항은 다음과 같다.

email, nickname, password를 입력받아 회원 가입을 처리한다.

회원가입이 성공하면 status code 201로 응답한다.

email이 중복이면 status code 400 에러코드를 발생한다.

email, nickname, password가 빈 값이면 400 에러.

테스트 코드를 추가한다.

```js
const request = require('supertest');

const app = require('../../index');
const db = require('../../models');

describe('POST /api/user/signup 요청 시 email, nickname, password를 전달하여 회원가입을 요청', () => {
  describe('성공 시', () => {
    before(() => db.sequelize.sync({ force: true }));
    it('성공하면 201 응답.', (done) => {
      request(app)
        .post('/api/user/signup')
        .send({
          email: 'zzz@gmail.com',
          nickname: 'zzz',
          password: 'zzz',
        })
        .expect(201, done);
    });
  });

  describe('실패 시', () => {
    before(() =>
      db.User.bulkCreate({
        email: 'zzz@gmail.com',
        nickname: 'zzz',
        password: 'zzz',
      }),
    );
    after(() => db.sequelize.sync({ force: true }));

    it('email이 중복이면 400 에러, 에러 메시지: Already exist.', (done) => {
      request(app)
        .post('/api/user/signup')
        .send({
          email: 'zzz@gmail.com',
          nickname: 'zzz',
          password: 'zzz',
        })
        .expect(400, done);
    });
  });

  describe('실패 시', () => {
    before(() => db.sequelize.sync({ force: true }));
    it('nickname이 존재하지 않으면 500 Error.', (done) => {
      request(app)
        .post('/api/user/signup')
        .send({
          email: 'zzz@gmail.com',
          nick: 'zzz',
          password: 'zzz',
        })
        .expect(400, done);
    });
    it('nickname이 빈 값이면 400 Error.', (done) => {
      request(app)
        .post('/api/user/signup')
        .send({
          email: 'zzz@gmail.com',
          nickname: '',
          password: 'zzz',
        })
        .expect(400, done);
    });
  });
});

```

회원 가입 시 email 중복, 데이터 부족 등의 에러를 확인하기 위해 테스트 코드를 만들었다.

해당 테스트가 통과할 수 있도록 실제 코드를 구현한다.

```js
const verifyString = (str) => {
  if (!str) {
    return null;
  }
  const verified = str.trim();
  if (!verified.length) {
    return null;
  }
  return verified;
};

const signup = async (req, res) => {
  try {
    const { email, nickname, password } = req.body;
    const exUser = await db.User.findOne({ where: { email } });
    if (exUser) {
      return res.status(400).send('Already exist user.');
    }
    const verifiedNickname = verifyString(nickname);
    if (!verifiedNickname) {
      return res.status(400).send('Check nickname.');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({
      email,
      nickname: verifiedNickname,
      password: passwordHash,
    });
    return res.status(201).send('User created.');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error.');
  }
};

```

로그인 과정도 테스트를 추가해보자.

```js
describe('로그인', () => {
  before((done) => {
    request(app)
      .post('/api/user/signup')
      .send({
        email: 'zzz@gmail.com',
        nickname: 'zzz',
        password: 'zzz',
      })
      .expect(201, done);
  });
  after(() => db.sequelize.sync({ force: true }));
  it('성공 시', (done) => {
    const userCredentials = {
      email: 'zzz@gmail.com',
      password: 'zzz',
    };
    const authenticatedUser = request.agent(app);
    authenticatedUser
      .post('/api/user/login')
      .send(userCredentials)
      .expect(200, done);
  });
});
```

테스트를 통과하기 위한 코드를 작성한다.

```js
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exUser = await db.User.findOne({ where: { email } });
    if (!exUser) {
      return res.status(400).send('Not exist user.');
    }
    const result = await bcrypt.compare(password, exUser.password);
    if (result) {
      return res.status(200).send('Login Success.');
    }
    return res.status(401).send('Unauthorized');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error.');
  }
};

```

login은 실제로 사용될만한 코드가 아니라 테스트를 더 추가하지는 않았다.

내일은 passport-local 로그인 후 api 호출까지 테스트 해보자.
