---
title: 문자열의 문자를 내림차순으로 정렬하기
date: 2020-02-22 17:02:78
category: algorithm
---

## 문제

문자열의 문자를 내림차순으로 정렬하라.

소문자가 대문자 보다 앞에 위치한다. (소문자 > 대문자)

## 풀이

정규식으로 어떻게 풀까하고 접근했는데 생각해보니 정규식 문제가 아니라 단순 sort였다.

```ts
console.log('AZaz'.split('').map(c => c.charCodeAt(0)));
// [ 65, 90, 97, 122 ]
```

char의 ascii code를 `charCodeAt`을 이용하여 확인해보니 대문자가 소문자보다 작은 숫자였다.

고민할 필요없이 sort만 하면 된다.

```ts
const descendingOrder = (string: string): string => {
  return string
    .split('')
    .sort((a, b) => b.charCodeAt(0) - a.charCodeAt(0))
    .join('');
};
console.log(descendingOrder('abczA'));
// zcbaA
```

## 참고

charCodeAt으로 ascii code를 확인해보면 Z와 a 사이에 문자 6개가 더 있다.

```ts
console.log(
  [...Array(8).keys()].map(a => String.fromCharCode('Z'.charCodeAt(0) + a))
);
// [ 'Z', '[', '\\', ']', '^', '_', '`' ]
```

영문자 사이에 이런 문자들이 있었구나.

`Array(8).keys()`는 Array(8)의 index를 반환하는 Iterator다.

charCodeAt의 반대 역할을 하는 메서드가 `fromCharCode`다.
