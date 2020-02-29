---
title: 'N번째 문자로 정렬하기'
date: 2020-02-29 11:02:51
category: algorithm
---

## 문제

```ts
['abcd', 'accd', 'acbd', 'acca'];
```

위와 같은 배열이 주어졌을 때 2번째 문자로 정렬하라. 2번째 문자가 같다면 사전 순으로 정렬하라.

## 풀이

sort만 알고 있다면 쉽게 처리 될 줄 알았다.

```ts
const sortByNthChar = (array: string[], n: number): string[] => {
  return array.sort((a, b) => a[n].charCodeAt(0) - b[n].charCodeAt(0));
};

console.log(sortByNthChar(['abcd', 'accd', 'acbd', 'acca'], 1));
// [ 'abcd', 'accd', 'acbd', 'acca' ]
```

두 번째 문자인 c가 동일하다면 'acca'가 'accd' 보다 앞에 와야 한다.

그래서 localeCompare를 이용했다. localeCompare는 문자열을 비교한다.

```ts
const sortByNthChar = (array: string[], n: number): string[] => {
  return array.sort((a, b) =>
    a[n] === b[n] ? a.localeCompare(b) : a[n].charCodeAt(0) - b[n].charCodeAt(0)
  );
};

console.log(sortByNthChar(['abcd', 'accd', 'acbd', 'acca'], 1));
// [ 'abcd', 'acbd', 'acca', 'accd' ]
```
