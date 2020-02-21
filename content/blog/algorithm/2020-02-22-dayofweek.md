---
title: 요일 맞추기
date: 2020-02-22 00:02:94
category: algorithm
---

## 문제

년, 월, 일이 주어지면 요일을 반환하라.

## 풀이

간단한 문제다. 정규식을 활용해보려고 다른 방식으로 시도해본다.

일단 기존 방식을 보자.

```ts
const dayOfWeek = (year: number, month: number, day: number): string => {
  const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return WEEKDAY[new Date(`${year}-${month}-${day}`).getDay()];
};

console.log(dayOfWeek(2020, 2, 21));
console.log(dayOfWeek(2020, 2, 20));
console.log(dayOfWeek(2020, 2, 22));
// FRI
// THU
// SAT
```

```ts
const dayOfWeek = (year: number, month: number, day: number): string => {
  return new Date(`${year}-${month}-${day}`)
    .toString()
    .slice(0, 3)
    .toUpperCase();
};

console.log(dayOfWeek(2020, 2, 21));
console.log(dayOfWeek(2020, 2, 20));
console.log(dayOfWeek(2020, 2, 22));
```

정규식을 사용해보자.

```ts
const dayOfWeek = (year: number, month: number, day: number): string => {
  const result = new Date(`${year}-${month}-${day}`)
    .toString()
    .toUpperCase()
    .match(/^\S{3}/);
  if (result) {
    return result[0];
  }
  return 'result is null';
};

console.log(dayOfWeek(2020, 2, 21));
console.log(dayOfWeek(2020, 2, 20));
console.log(dayOfWeek(2020, 2, 22));
```

`S` 대신 `D`나 `w`를 사용할 수 있다.

`\D`는 숫자가 아닌 문자에 대응된다. `[^0-9]`와 동일하다.

`\S`는 공백 문자가 아닌 문자에 대응된다.

`\w`는 밑줄 문자를 포함한 영숫자 문자에 대응된다.

따라서 공백을 포함한 문자열을 길이로 자를 때는 `\D`, 공백없이 문자만 찾으려면 `\S`, 숫자가 포함된(공백x) 문자를 길이로 자르려면 `\w`를 쓰면 된다.

`^`는 시작을 의미한다.

`[^0-9]` 이때 `^`는 부정의 의미다.

`{3}`은 앞의 패턴이 n만큼 반복된다는 것을 의미한다.

그래서 `/^\S{3}/`은 공백없이 문자열의 시작부터 3개의 문자를 선택한다.

문자 사이에 공백이 있다면 null이 된다.
