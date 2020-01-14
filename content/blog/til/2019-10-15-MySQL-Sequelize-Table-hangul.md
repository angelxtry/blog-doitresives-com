---
layout: post
comments: true
title: 'MySQL, Sqeuelize 사용 시 한글 character set 문제'
date: 2019-10-15 11:59:59
category: TIL

tags:
  - Node.js
  - MySQL
  - Sequelize
  - 한글
---

MySQL, Sequelize를 이용하여 insert를 사용할 때 다음과 같은 에러가 발생할 때가 있다.

```js
Error: Incorrect string value: '\xEC\x9D...' for column 'COLUMN NAME' at row 1
```

## 원인

MySQL 테이블 생성 시 character set이 `latin1`으로 되어 있어 한글 데이터를 저장하려고 하면 발생하는 에러다.

## 해결 방법

해당 Database의 기본 character set을 변경하거나, 문제가 되는 Table의 charater set을 변경한다.

일단 Table의 character set을 확인해보자.

```sql
SHOW FULL COLUMNS FROM table;
```

이렇게 query를 실행하면 table 테이블의 상세 정보가 출력된다.

```txt
+-----------+--------------+--------------------+------+-----+---------+----------------+---------------------------------+---------+
| Field     | Type         | Collation          | Null | Key | Default | Extra          | Privileges                      | Comment |
+-----------+--------------+--------------------+------+-----+---------+----------------+---------------------------------+---------+
| id        | int(11)      | NULL               | NO   | PRI | NULL    | auto_increment | select,insert,update,references |         |
| email     | varchar(50)  | latin1 | YES  | UNI | NULL    |                | select,insert,update,references |         |
| nick      | varchar(50)  | latin1 | NO   |     | NULL    |                | select,insert,update,references |         |
| password  | varchar(100) | latin1 | YES  |     | NULL    |                | select,insert,update,references |         |
| provider  | varchar(10)  | latin1 | NO   |     | local   |                | select,insert,update,references |         |
| snsId     | varchar(50)  | latin1 | YES  |     | NULL    |                | select,insert,update,references |         |
| createdAt | datetime     | NULL               | NO   |     | NULL    |                | select,insert,update,references |         |
| updatedAt | datetime     | NULL               | NO   |     | NULL    |                | select,insert,update,references |         |
| deletedAt | datetime     | NULL               | YES  |     | NULL    |                | select,insert,update,references |         |
+-----------+--------------+--------------------+------+-----+---------+----------------+---------------------------------+---------+
```

해당 테이블을 정의한 `models/table_name.js` 파일에 character set 관련 내용을 추가한다.(sequelize 사용)

```js
{
  timestamps: true,
  paranoid: true,
  charset: "utf8mb4",
  collate: "utf8mb4_general_ci"
}
```

해당 테이블을 drop하고 다시 생성하면 `latin1` 이었던 컬럼이 `utf8mb4_general_ci`으로 변경된 것을 확인할 수 있다.

한글을 저장해보면 잘 처리된다.
