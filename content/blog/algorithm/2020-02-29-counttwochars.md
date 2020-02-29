---
title: '문자열에서 주어진 문자 갯수 세기'
date: 2020-02-29 12:10:50
category: algorithm
---

## 문제

> 'Aaa Bbb Ccc'

위와 같은 문장에서 주어진 문자의 갯수를 반환하라.

## 풀이

정규 표현식 훈련.

정규 표현식의 g, i 옵션만 알면 쉽게 풀 수 있다.

```ts
const countChars = (
  string: string,
  chars: string[]
): { [key: string]: number } => {
  return chars.reduce<{ [key: string]: number }>((acc, c) => {
    const re = new RegExp(`${c}`, 'gi');
    acc[c] = (string.match(re) || []).length;
    return acc;
  }, {});
};

console.log(countChar('Aaa Bbb Ccc', ['a', 'b', 'c']));
// { a: 3, b: 3, c: 3 }
```
