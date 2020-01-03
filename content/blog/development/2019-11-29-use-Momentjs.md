---
title: "Moment.js 사용했던 것 정리"
date: 2019-11-29 11:59:59
category: development
tags:
  - moment
  - MySQL
  - Sequelize
---

이번 프로젝트를 하면서 Moment.js를 사용했던 항목들을 정리해본다.

## 1. timezone을 분명히 할 것

local이나 utc, 둘 중에 하나를 반드시 붙이자.

특히 front, back 간에 날짜를 주고 받을 때는 `format()`까지 붙여서 timezone을 표시하자.

```js
// X
const now = moment().local();
console.log("now: ", now);
```

```js
now:  moment("2019-11-29T02:12:52.743")
```

이렇게 사용하지 말자. 이런 경우에 `.format()`을 꼭 붙이자.

```js
// O
const formattedNow = moment().local().format();
console.log("formattedNow: ", formattedNow);
```

```js
formattedNow:  2019-11-29T02:12:52+09:00
```

```js
const utc = moment().utc();
console.log("utc: ", utc);
```

```js
utc:  moment.utc("2019-11-28T17:12:52.752+00:00")
```

`+00:00`이 utc라는 것을 명확하게 표시해준다.

## 2. 두 시간의 차이를 seconds로 표현하기(타이머를 만들기 위해 사용)

```js
const diffSeconds = now => {
  const asSeconds = moment.duration(moment().local() - now).asSeconds();
  const seconds = moment.duration(moment().local() - now).seconds();
  return { asSeconds, seconds };
};

setTimeout(() => {
  const result = diffSeconds(now);
  console.log(result);
}, 61 * 1000);
```

```js
{ asSeconds: 61.014, seconds: 1 }
```

`setTimeout`은 출력을 위해 그냥 적어봤다.

타이머를 만들기위해 지정된 시간을 모두 초(seconds) 단위로 변환하여 사용했다.

이때 `asSeconds`를 사용하니 편리했다.

`seconds`는 `59`까지만 표현되고 다시 `00`으로 돌아간다.

두 개다 필요할 때가 있을거다.

## 시작부터 종료까지 걸린 시간

```js
const start = moment("2019-11-29T02:02:31");
const end = moment("2019-11-29T03:03:31");
const diffMinutes = moment(end).diff(moment(start), "minutes");
console.log(diffMinutes);
```

```js
61
```

뺄셈으로도 가능하지만 이런 방식도 있더라.

## utc timestamp를 local date로 검색할 때 날짜 전달

DB에 utc로 저장되어 있는 timestamp를 local date (ex: 2019-11-29)로 검색할 때 다음과 같이 전달하자.

```js
const dayOfStart = moment().startOf("day").local().format();
console.log("dayOfStart: ", dayOfStart);
```

```js
dayOfStart:  2019-11-29T00:00:00+09:00
```

`+09:00`이 붙어 있어 서버에서 timezone을 바로 식별할 수 있고, 검색을 위해 utc로 변환할 때 시간을 조정하기 위한 추가 작업을 생략할 수 있다.

서버에서 위의 날짜를 받아 다음과 같이 DB 데이터를 검색했다.

```js
const getTodosContent = async (date, userId) => {
  try {
    const utcFrom = moment(date).utc();
    const utcTo = utcFrom.clone().add(1, 'd');
    const Op = db.Sequelize.Op;
    const todos = await db.Todo.findAll({
      where: {
        createdAt: {
          [Op.gte]: utcFrom,
          [Op.lt]: utcTo,
        },
        userId,
      },
      attributes: [
        'id',
        'duration',
        'isComplete',
      ],
      include: [
        { model: db.Timeline, attributes: ['id', 'startedAt', 'endedAt'] },
      ],
    });
    return todos;
  } catch (error) {
    throw error;
  }
};
```

다른 기능도 많겠지만 오늘은 여기까지만.
