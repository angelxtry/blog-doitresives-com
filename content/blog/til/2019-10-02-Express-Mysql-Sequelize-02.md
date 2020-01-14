---
layout: post
comments: true
title: "[Node.js] Express, Mysql, Sequelize #2"
date: 2019-10-02 11:59:59
category: TIL
tags:
  - Node.js
  - Express
  - Mysql
  - Sequelize
---


[1편](https://angelxtry.github.io/Express-Mysql-Sequelize-01)에 이어서 진행한다.

제로초님의 인프런 강의를 정리한 글이다.

## 9. router 파일 추가

`/routes` 경로에 `comments.js`를 추가한다.

```js
const express = require("express");
const router = express.Router();

module.exports = router;
```

routes에 추가되는 router 파일들은 위의 코드가 기본이다.

여기에 기본적인 `/` 경로를 처리할 수 있는 뼈대만 만들어두자.

```js
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) =>{

});

module.exports = router;
```

`app.js` 파일에도 추가한다.

```js
const indexRouter = require("./routes");
const userRouter = require("./routes/users");
const commentRouter = require("./routes/comments");
const { sequelize } = require("./models");

const app = express();
sequelize.sync();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);
```

`commentRouter`를 `require`로 로드하고 `app.use()`를 이용하여 router를 middleware로 설정했다.

## 10. users, comments router 기본 코드 작성

`users` router에 get, post routing을 처리할 수 있는 뼈대를 만든다.

```js
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {

});

router.post("/", (req, res, next) => {

});

module.exports = router;
```

`comments`도 동일하게 처리한다.

```js
const express = require("express");
const router = express.Router();

// GET /comment/xxx
router.get("/:id", (req, res, next) => {

});

module.exports = router;
```

`comments`에는 `url param`을 처리할 수 있도록 `:id`가 추가되어 있다.

`comments`의 뼈대를 더 추가한다.

```js
const express = require("express");
const router = express.Router();

router.get("/:id", (req, res, next) => {

});

router.patch("/:id", (req, res, next) => {

});

router.delete("/:id", (req, res, next) => {

});

router.post("/", (req, res, next) => {

});

module.exports = router;
```

url이 `/comments/all`과 `/comments/:id`가 있다면  all이 `:id`보다 앞에 위치해야 한다.

## 11. users, comments router 코드 추가 작성

```js
const express = require("express");
const router = express.Router();
const { User } = require("../models");

router.get("/", (req, res, next) => {
  User.findAll()
    .then(users => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.post("/", (req, res, next) => {
  User.create({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married
  })
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    })
})

module.exports = router;
```

```js
const express = require("express");
const router = express.Router();
const { User, Comment } = require("../models");

router.get("/:id", (req, res, next) => {
  Comment.findAll({
    include: {
      model: User,
      where: { id: req.params.id }
    }
  })
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
```

`comments` router를 하나씩 살펴보자.

`commenter`의 모든 comment를 select하는 router다.

`commenter`는 `User`의 `id`와 연결되어 있다.

`findAll`에서 `include`를 사용하여 조회하면 `Comment`와 `User`의 정보가 포함되어 조회된다.

`include`를 지우고 `commenter`로 조회하면 `Comment`의 정보만 조회된다.

```js
const express = require("express");
const router = express.Router();
const { User, Comment } = require("../models");

router.get("/:id", (req, res, next) => {
  Comment.findAll({
    include: {
      model: User,
      where: { id: req.params.id }
    }
  })
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.post("/", (req, res, next) => {
  Comment.create({
    commenter: req.body.id,
    comment: req.body.comment
  })
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});
```

`POST` routing을 추가했다.

`PATCH`도 추가해보자.

```js
const express = require("express");
const router = express.Router();
const { User, Comment } = require("../models");

router.get("/:id", (req, res, next) => {
  Comment.findAll({
    include: {
      model: User,
      where: { id: req.params.id }
    }
  })
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.post("/", (req, res, next) => {
  Comment.create({
    commenter: req.body.id,
    comment: req.body.comment
  })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.patch("/:id", (req, res, next) => {
  Comment.update({
    comment: req.body.comment
  }, {
    where: { id: req.params.id }
  })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});
```

`update`는 인자를 2개 받는다. 하나는 `update`하고자 하는 데이터이고, 두 번째는 `where`조건이다.

마지막으로 `DELETE`를 추가한다.

```js
const express = require("express");
const router = express.Router();
const { User, Comment } = require("../models");

router.get("/:id", (req, res, next) => {
  Comment.findAll({
    include: {
      model: User,
      where: { id: req.params.id }
    }
  })
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.post("/", (req, res, next) => {
  Comment.create({
    commenter: req.body.id,
    comment: req.body.comment
  })
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.patch("/:id", (req, res, next) => {
  Comment.update({
    comment: req.body.comment
  }, {
    id: req.body.id
  })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.delete("/:id", (req, res, next) => {
  Comment.destroy({
    where: { id: req.param.id }
  })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});
```

`select, insert, update, delete`에 해당하는 `sequelize` 메서드를 다 사용해봤다.

`select - findAll`

`insert - create`

`update - update`

`delete - destory`

## 12. 배운 것

sequelize를 사용하여 `CRUD`를 구현해봤다.

foreginKey로 엮인 테이블 구조를 만들 수 있을 것 같다.
