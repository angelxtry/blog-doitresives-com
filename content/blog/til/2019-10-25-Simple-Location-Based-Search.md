---
layout: post
comments: true
title: "간단한 위치 기반 검색 만들어보기"
date: 2019-10-25 11:59:59
category: TIL

tags:
  - 위치기반검색
  - sequelize
  - mysql
  - node.js
  - express
---

특정 위치에서 가장 가까운 카페를 검색하는 기능을 만들어 보았다.

잊어버리기 전에 기록해보자.

stack은 `node.js`, `express`, `mysql`, `sequelize`다.

## 기본 설정

먼저 기본 설정을 한다.

```js
> mkdir Simple-Location-Based-Search-Example
> cd Simple-Location-Based-Search-Example
> npm init -y
> npm i express mysql2 sequelize dotenv
> npm i -D nodemon
> npm i -g sequelize-cli nodemon
```

`index.js` 파일을 생성하여 다음과 같이 작성하자.

```js

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello Cafe!');
});

app.use((req, res, next) => {
  res.status(404).json({
    code: 404,
    message: 'Not Found.',
  });
});

app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({
    code: 500,
    message: 'Server Error',
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

```

여기까지 작성하고 `nodemon index.js`를 입력하면 멋지게 express가 동작한다! (...)

## database 생성

자, 이제 database를 생성한다.

테스트에 사용한 mysql은 5.7.27이다.

mysql 5.8 버전은 이 테스트 대로 진행하면 위도 경도 저장/조회 부분에서 에러가 발생할 수 있다.

`sequelize-cli`를 설치했기 때문에 console에서 다음과 같은 명령을 사용할 수 있다.

```js
> sequelize init
```

위와 같이 입력하면 `config`, `models`, `migrations`, `seeders` 폴더가 생성된다.

migrations만 제외하고 이번 테스트에서 모두 사용한다.

`config/config.json` 파일을 `config/config.js`로 파일명을 변경하고 다음과 같이 수정한다.

```js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};

```

`dotenv`를 사용하기 위해 파일명을 변경했다.

여기까지 완료되었다면 다음 명령으로 mysql에 database를 생성한다.

```js
sequelize db:create
```

`config.js`에 정의된 내용을 참조하여 mysql에 database가 생성된다.

## table 생성

`sequelize init` 명령으로 만들어진 `models/index.js` 파일을 수정한다.

```js
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.Cafe = require('./cafe')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

```

`models/Cafe.js` 파일을 생성하여 다음과 같이 작성한다.

```js
module.exports = (sequelize, DataTypes) => {
  const Cafe = sequelize.define(
    'cafe',
    {
      cafeName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      point: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );

  return Cafe;
};

```

`point` 컬럼의 type은 `GEOMETRY('POINT')`다.

위도, 경도를 하나의 컬럼에 저장할 수 있다.

이번 테스트의 목적인 위치기반 검색을 위한 중요 요소다.

테이블의 정의가 완료되었으니 이제 `index.js`에 연결하자.

```js
const express = require('express');
const dotenv = require('dotenv');

const db = require('./models');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
db.sequelize.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('Hello Cafe!');
});

app.use((req, res, next) => {
  res.status(404).json({
    code: 404,
    message: 'Not Found.',
  });
});

app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({
    code: 500,
    message: 'Server Error',
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

```

`nodemon`으로 express가 실행 중이었다면 table이 생성되는 것을 확인할 수 있었을 것이다.

실행 중이 아니었다면 `nodemon index.js`로 실행해보자.

`cafe` 테이블이 생성된 것을 확인할 수 있다.

Table Create query를 확인해보면 다음과 같다.

```sql
CREATE TABLE `cafe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cafeName` varchar(100) NOT NULL,
  `address` varchar(250) DEFAULT NULL,
  `point` point NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8
```

## 테스트 데이터 입력

테이블이 만들어졌으니 데이터를 밀어 넣어보자.

카페 데이터는 어디서 얻을 수 있을까. 지도 서비스를 이용할 수 있지 않을까?

공부하는 용도니까 괜찮겠지? 괜찮을꺼야(...)

네이버맵은 api를 둘러보다가 마음에 안들어서 바로 접었다.

카카오맵 api를 확인해보니 [카테고리로 장소 검색](https://developers.kakao.com/docs/restapi/local#%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC-%EA%B2%80%EC%83%89)이라는 항목이 있다.

api key를 발급받고 postman을 이용해서 데이터를 받았다. 오오 잘받아지는구나!

특정 키워드로 데이터를 검색하여 `samples` 폴더에 10개의 샘플 데이터 파일을 만들었다.

이제 정말 DB에 넣는 일만 남았다.

샘플 데이터 파일을 만들 때 데이터 처리는 node에서 처리할 생각으로 response 데이터를 그대로 파일로 옮겼다.

그리고 생각해보면 데이터를 밀어 넣는 작업이 한번 만에 잘 될리가 없지. 반복 노가다가 될 가능성이 높다.

그래서 sequelize의 seeder를 이용한다.

일단 seed 파일을 하나 만들다.

```js
sequelize seed:generate --name insertCafeSimpleData
```

요렇게 하면 [timestamp]-insertCafeSimpleData.js 파일이 생성된다.

파일 내용을 확인해보면 이렇게 쓰면 된다라고 설명하는 간단한 샘플 코드가 들어있다.

다음과 같이 작성해보자.

```js
'use strict';
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const files = [
      'sampleData00.json',
      'sampleData01.json',
      'sampleData02.json',
      'sampleData03.json',
      'sampleData04.json',
      'sampleData05.json',
      'sampleData06.json',
      'sampleData07.json',
      'sampleData08.json',
      'sampleData09.json',
    ];
    for (const file of files) {
      const filePath = path.join(__dirname, '..', 'samples', file);
      const cafes = require(filePath)['documents'].map(s => {
        const n = {};
        n.cafeName = s.place_name;
        n.address = s.road_address_name;
        n.point = Sequelize.fn('ST_GeomFromText', `POINT(${s.x} ${s.y})`);
        n.createdAt = new Date();
        n.updatedAt = new Date();
        return n;
      });
      await queryInterface.bulkInsert('cafe', cafes, {});
    }
    return;
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cafe', null, {});
  },
};

```

console에서 `sequelize db:seed:all`이라고 입력하면 만들어 둔 샘플 데이터 파일을 읽어서 cafe 테이블에 차곡차곡 데이터를 저장한다.

## 위치 기반 검색

데이터까지 저장되었으니 이제 최종 목표인 검색이다!

`routes` 폴더를 생성하여 api를 작성한다.

```js
const express = require('express');
const router = express.Router();

const { Cafe, sequelize } = require('../models');

// POST /api/cafe 카페 정보 입력
router.post('/', async (req, res, next) => {
  try {
    const { cafeName, address, latitude, longitude } = req.body;

    const point = { type: 'Point', coordinates: [latitude, longitude] };
    await Cafe.create({ cafeName, address, point });
    res.status(200).json({ code: 200, message: '정보 입력 성공!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '정보 입력에 실패했습니다.' });
  }
});

// POST /api/cafe/search 위치기반 카페 검색
router.post('/search', async (req, res, next) => {
  try {
    const { latitude, longitude, maxDistance } = req.body;
    const query = `
      SELECT a.*
      FROM (
        SELECT
          id, cafeName, address, point,
          ST_DISTANCE_SPHERE(POINT(:longitude, :latitude), point) AS distance
        FROM cafe_location.cafe
      ) a
      WHERE distance <= :maxDistance
      ORDER BY distance
      LIMIT 10`;
    const result = await sequelize.query(query, {
      replacements: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        maxDistance,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({
      code: 200,
      message: '현재 위치 기반 카페 검색 완료',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: '현재 위치 기반 카페 검색에 실패했습니다.',
    });
  }
});

module.exports = router;

```

`POST /api/cafe`는 `point` 데이터를 만드는 것을 확인해보려고 만들었다.

```js
const point = { type: 'Point', coordinates: [latitude, longitude] };
```

이런 형식으로 데이터를 만들어야 `mysql`의 point type의 컬럼에 저장된다.

`POST /api/cafe/search`는 sequelize로 query를 만들기가 어려워서 날 query를 그대로 사용했다.

`ST_DISTANCE_SPHERE`라는 mysql 함수를 사용하면 두 지점간의 거리를 구할 수 있다.

(사실 이 부분은 자세히 확인을 못하고 사용법만 긁어와서 테스트한 수준이다. 나중에 좀 더...)

```js
const query = `
  SELECT a.*
  FROM (
    SELECT
      id, cafeName, address, point,
      ST_DISTANCE_SPHERE(POINT(:longitude, :latitude), point) AS distance
    FROM cafe_location.cafe
  ) a
  WHERE distance <= :maxDistance
  ORDER BY distance
  LIMIT 10`;
const result = await sequelize.query(query, {
  replacements: {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    maxDistance,
  },
  type: sequelize.QueryTypes.SELECT,
});
```

binding param, sequelize.query는 이번에 처음 사용해봤다. 잘 기억해두자.

postman으로 테스트해보면 결과가 잘 출력된다.

## 배운 것

위치 기반 검색이라는 목표를 설정하고 시작하니까 수준이 어떻든 결과물은 나온다.

역시 목표 설정이 가장 중요하다.

sequelize 사용법을 잘 몰라서 검색하고 적용하는데 시행착오를 많이 거쳤다.

sequelize 주요 사용법을 정리해두자.

mysql에서 위치를 저장하고 활용하는 것을 했지만 맞게 했는지, 효율적으로 했는지 잘 모르겠다.

위치 데이터를 저장하고 활용하는 방법을 좀 더 찾아보고 정리해두자.

테이블에 spatial index를 설정하면 검색이 좀 더 빠르다고 하던데 이것도 알아보자.
