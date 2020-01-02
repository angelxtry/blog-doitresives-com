---
layout: post
comments: true
title: "UTC로 저장된 데이터를 Local Date로 조회하기"
date: 2019-11-27 11:59:59
category: development
tags:
  - moment
  - MySQL
  - Sequelize
---


별 고민 없이 timestamp를 DB에 저장하고 특정 날짜로 데이터를 조회하다가 문제가 발생했다.

문제의 원인은 timestamp를 utc 또는 local 기준으로 사용한다는 명확한 방침이 없었기 때문이다.

## 원인분석

문제의 원인을 좀 더 상세히 살펴보자.

이번 프로젝트는 DB는 MySQL, ORM은 sequelize 그리고 moment를 사용했다.

1.moment

client에서 moment()를 호출하는 것과 서버에서 moment()를 호출하는 것이 다른 값이 나왔다.

client와 server에 설정된 timezone이 달라서 발생하는 문제다.

2.MySQL

timestamp 컬럼에 timezone을 표현할 수 있는 값이 포함되지 않는다.

moment().fomat()을 출력해보면 `2019-11-27T20:05:05+09:00`와 같이 출력된다.

`+09:00`으로 timezone을 유추할 수 있다.

하지만 MySQL에는 `2019-11-27 20:05:05`와 같은 형식으로 timestamp가 저장된다.

그러므로 MySQL에 저장된 값만으로는 timezone을 판단하기 어렵다.

## 해결방안

이 문제를 해결하기 위해 기준을 설정했다.

1.client에서 서버로 보내는 모든 timestamp는 UTC로 한다.

그러므로 DB에 저장되어 있는 모든 timestamp는 UTC라고 간주한다.

2.client에서 DB 데이터를 날짜로 검색하기 위해 `YYYY-MM-DD` 형식으로 서버에 데이터를 보낼 경우 해당 날짜를 UTC로 변환하여 검색한다.

## 적용

1.client에서 서버로 보내는 모든 timestamp를 다음과 같이 수정했다.

```js
const timestamp = moment().utc().format();
```

그리고 서버에서 timestamp를 받으면 local로 변환하여 사용했다.

2.날짜로 검색하기 위해 local date(YYYY-MM-DD 형식)를 받으면 다음과 같이 변환한 값을 이용하여 데이터를 검색했다.

검색을 위해 날짜를 인자로 전달할 때는 다음과 같이 작성했다.

```js
await getDataByDate(
    moment()
      .startOf('day')
      .local()
      .format(),
  );
```

monent()를 호출하면 `2019-11-27T20:05:05+09:00` 이런 형식의 데이터가 나온다.

이 timestamp를 utc로 변환하는 과정에서 시간 때문에 오류가 발생할 수도 있으므로 `startOf('day')`를 넣어서 `2019-11-27T00:00:00+09:00`으로 변경한다.

```js
const utcFrom = moment(localDate).utc();
const utcTo = utcFrom.clone().add(1, 'd');
```

localDate가 `2019-11-27T00:00:00+09:00` 일때

utcFrom `2019-11-26T15:00:00Z`

utcTo `2019-11-27T15:00:00Z` 가 된다.

sequelize로 데이터를 조회하기 위해 다음과 같이 코드를 작성했다.

```js
const Op = db.Sequelize.Op;
const data = await db.Utc.findAll({
  where: {
    utcTime: {
      [Op.gte]: utcFrom,
      [Op.lt]: utcTo,
    },
  },
  attributes: ['utcTime', 'localTime'],
  raw: true,
});
```

localDate가 2019-11-26일 때 sequelize는 다음과 같은 query로 변환한다.

```sql
SELECT `utcTime`, `localTime`
FROM `utcs` AS `utc`
WHERE (
  `utc`.`utcTime` >= '2019-11-25 15:00:00'
  AND `utc`.`utcTime` < '2019-11-26 15:00:00'
);
```

`raw: true`는 query의 결과를 sequelize object가 아닌 일반 데이터 객체로 만든다.

## 배운 것

날짜나 timestamp를 사용할 때는 한 번 더 생각하자.

MySQL, moment의 사용법에 대해 좀 더 알게됐다.

테스트한 코드는 다음과 같다.

[https://github.com/angelxtry/Utc-data-lookup-by-local-date](https://github.com/angelxtry/Utc-data-lookup-by-local-date)
