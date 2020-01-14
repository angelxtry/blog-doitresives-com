---
layout: post
comments: true
title: 'AWS 상에서 서버 2대(domain - sub domain)의 쿠키 교환'
date: 2019-11-15 11:59:59
category: TIL

tags:
  - aws
  - cookie
  - domain
---

Next.js를 고려하다가 아무 근거 없이 쉽고 편해보여서 서버를 2대 사용하는 프로젝트를 구상했다.

하나는 api 서버, 또 하나는 Next 서버.

각각 최소 기능을 구현한 후 빠르게 aws 서버에 올려서 테스트를 했는데 로컬에서는 잘 동작하던 것들이 대부분 동작하지 않았다.

나중에 알고보니 대부분의 원인이 aws 서버 간의 쿠키 교환이 제대로 이루어지지 않은 것이었다.

서버간의 쿠키 교환 설정을 했던 내용을 간단히 기록한다.

## 1. aws Route 53에서 domain 설정

하나는 api 서버, 다른 하나는 Next 서버용이다.

기본적으로 `Elastic IPs`를 이용하여 IP를 하나씩 부여 한 후 `Route 53` 설정으로 간다.

`Hosted zone`에서 domain을 설정한다. 사용할 domain을 doit.com이라고 하자.

`Create Record Set` 버튼을 클릭하여 `A` 타입으로 Next용 서버를 doit.com, api 서버를 api.doit.com이라고 설정한다.

## 2. api 서버(Express)에서 cors 설정

필수적인 코드만 추려보면 다음과 같다.

```js
const express = require('express');
const cors = require('cors');
const expressSession = require('express-session');

const app = express();
const env = process.env.NODE_ENV === 'production';

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      domain: '.doit.com',
      maxAge: 60 * 60 * 1000,
    },
    name: 'forcebewithyou',
  })
);

app.listen(port, () => {
  console.log(`Port ${port}`);
});

module.exports = app;
```

가장 중요한 코드는 `expressSession`에서 `domain: '.doit.com'`이다.

doit.com 앞의 `.`이 꼭 필요하다.

cors의 `origin: true`와 `credential: true`도 필요하고 https 구성이 되면 origin: true보다 더 구체적인 domain이 적어주는 것이 좋다고 한다.

이번에 배운 교휸은 이 문제가 해결되지 않았을 때 다른 문제를 해결하려고 시도하면 안된다는 것이다 ㅠㅠ.

거의 모든 것이 쿠키가 원인이었고, 그 외 부분들도 쿠키가 제대로 설정되어 있지 않으면 정확한 원인을 찾기 힘든 것들이었다.

이렇게 적어보니 정말 간단하네 ㅋㅋㅋ 재미있었다.

![Server domain setting](https://drive.google.com/uc?export=view&id=1xclbKp3dRxvmKDjy0dZ6R8oRTGsOpy6H)

- 참고 사이트

[Share cookie between subdomain and domain](https://stackoverflow.com/questions/18492576/share-cookie-between-subdomain-and-domain?answertab=votes#tab-top)
