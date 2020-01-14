---
layout: post
comments: true
title: "[Node.js] Express, Mysql, Sequelize #1"
date: 2019-10-01 11:59:59
category: TIL
tags:
  - Node.js
  - Express
  - Mysql
  - Sequelize
---


`express`, `mysql`, `sequelize`를 사용해보자.

제로초님의 인프런 강의를 정리한 글이다.

## 1. Express Generator로 프로젝트 생성

```js
express learn-sequelize --view=pug
cd learn-sequelize
npm install
```

## 2. Sequelize 설치

`sequelize`와 `mysql2`도 함께 설치한다.

```js
npm i sequelize mysql2
npm i -g sequelize-cli
```

`sequelize-cli`를 global로 설치하면 터미널에서 `sequelize` command를 실행할 수 있다.

## 3. Sequelize 초기화

```js
sequelize init
```

위와 같이 입력하면 `sequelize` 관련 폴더 구조와 파일들이 생성된다.

```js
/config/config.json
/models
/migrations
/seeders
```

## 4. models 설정

`/models/index.js` 파일의 내용을 모두 지우고 다시 설정해본다.

### 4-1. 기본 설정

```js
const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
```

`path`, `sequelize`를 불어온다.

`env`는 일단 `development`로 설정한다. 실제 운영환경이 되면 `process.env.NODE_ENV`의 값인 `production`으로 적용될 것이다.

### 4-2. config 정보 불러오기

```js
const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
```

`/config/config.json` 파일에는 DB 접속정보가 저장되어 있다.

`config` 변수에 해당 파일의 정보 중 `development`의 정보를 불러온다.

### 4-3. sequelize 인스턴스 생성

```js
const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
```

`const app = express();`와 같이 `express` 인스턴스를 만들듯이 `sequelize` 인스턴스를 생성한다.

### 4-4. db 객체 생성

```js
const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
```

`db`라는 객체를 하나 생성하여 `Sequelize`와 `sequelize`를 넣어준다.

그리고 `db`를 export 한다.

## 5. mysql 설치

`mysql`은 5.7.27을 설치했다.

## 6. sequelize cli로 database 생성

`/config/config.json` 파일을 수정한다.

`development`의 `username`, `password`, `database`등을 설정한다.

터미널에서 다음과 같이 입력한다.

```js
sequelize db:create
```

`Database nodejs created.` 메시지가 출력된다.

## 7. model 추가

### 7-1. 테이블 별 파일 생성, index.js와 연결

`/models` 폴더에 `user.js`, `comment.js` 파일을 추가한다.

먼저 `user.js` 부터 만들어보자.

```js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {

  });
};
```

이렇게 작성하면 `user`라는 테이블이 생성된다.

`comment.js`도 동일하게 작성한다.

```js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("comment", {

  });
};
```

이 두 파일을 `/models/index.js`에서 불러온다.

```js
const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);

module.exports = db;
```

`require`문으로 파일을 불러오면서 동시에 `sequelize`, `Sequelize`를 전달했다.

이 param들은 `user.js`의 `sequelize`와 `DataTypes`와 연결된다.

### 7-2. 테이블 컬럼 구조 만들기

`user.js`를 계속 진행해보자.

`user`테이블에 추가될 컬럼은 이름, 나이, 결혼여부, 자기소개, 가입일 이다.

`user.js` 파일에 내용을 추가한다.

```js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    name: {

    },
    age: {

    },
    married: {

    },
    comment: {

    },
    created_at: {

    }
  }, {
    timestamps: false,
  });
};
```

일단 각 컬럼들을 정의할 준비를 해두었고 `sequelize.define()`의 세 번째 param을 추가했다.

세 번째 param의 `timestamps: false`는 `user` 테이블에 데이터가 insert 될 때마다 자동으로 time stamp를 입력하는 것을 false 처리 한 것이다.

세 번째 param에 `underscored: true`같은 항목을 추가할 수 있다.

이 구문의 컬럼명에 `_` 사용 여부를 의미한다.

`comment` 테이블은 작성자, 댓글내용, 작성일 컬럼을 정의한다.

```js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("comment", {
    commenter: {

    },
    comment: {

    },
    created_at: {

    }
  }, {
    timestamps: false,
    underscored: true
  });
};
```

### 7-3. 테이블 컬럼 상세 정의

`user` 테이블 부터 작성해보자.

```js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    age: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    married: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("now()")
    }
  }, {
    timestamps: false,
    underscored: true
  })
}
```

`comment` 테이블도 작성한다.

```js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("comment", {
    commenter: {

    },
    comment: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      aloowNull: false,
      defaultValue: sequelize.literal("now()")
    }
  }, {
    timestamps: false,
    underscored: true
  });
};
```

`commenter`는 추후에 다시 설정할 것이기에 일단 미완성으로 둔다.

### 7-4. 테이블 간 관계 설정

`comment` 테이블의 `commenter` 컬럼의 정의를 비워두었다.

`commenter`는 `user`테이블의 `name`과 연결된다.

`user`와 `comment`의 관계는 `1:N`이다.

`index.js` 파일에서 이 관계를 정의한다.

```js
const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);

db.User.hasMany(db.Comment);
db.Comment.belongsTo(db.User);

module.exports = db;
```

코드 그대로 살펴보면 `user`는 다수의 `comment`를 가지고 있고, `comment`는 하나의 `user`를 가진다는 것을 의미한다.

추가로 더 작성 해야만 하는 것들이 있다.

다음의 코드를 보자.

```js
const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);

db.User.hasMany(db.Comment, { foreignKey: "commenter", soruceKey: "id" });
db.Comment.belongsTo(db.User, { foreignKey: "commenter", targetKey: "id" });

module.exports = db;

```

`User`와 `Comment` 사이의 관계를 상세하게 정의한다.

`Comment`에 속하는 `commenter`라는 컬럼은 `foreginKey`로 설정하고, 연결되는 `User`의 컬럼은 `id`다.

`User`에서 `id`는 명시하지 않았지만 자동으로 생성되는 key다.

`db.Comment.belongsTo`에서는 `soruceKey`가 아니라 `targetKey`를 명시한다.

컬럼명은 동일하고 `foreginKey`에는 `belongsTo` 항목의 컬럼을 적는다.

`sourceKey`, `targetKey`도 동일한 컬럼명을 명시하고 `hasMany` 항목의 컬럼을 적는다.

이렇게 설정했다면 `Comment.js` 파일에서 `commenter` 컬럼을 삭제한다. 삭제해도 관계에 설정이 되어 있어 자동으로 생성된다.

```js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("comment", {
    comment: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      aloowNull: false,
      defaultValue: sequelize.literal("now()")
    }
  }, {
    timestamps: false,
    underscored: true
  });
};
```

## 8. app.js에 sequelize 연결

`app.js` 파일에 `sequelize`를 연결한다.

```js
const { sequelize } = require("./models");

const app = express();
sequelize.sync();
```

이제 `npm start`로 서버를 실행하면 자동으로 테이블이 생성된다.

## 9. 배운 것

`express`에서 `sequelize`를 설정하는 법을 확인했다.

이제 빈 폴더에서 `npm init` 부터 시작한다고 해도 `mysql`과 `sequelize`를 사용할 수 있게 됐다.

`sequelize`에서 `1:N` 구조를 설정하고 방법도 확인했다.

`sequelize`로 데이터를 사용하는 것은 다음 글에서 확인해보자.

(다음 편에 계속)
