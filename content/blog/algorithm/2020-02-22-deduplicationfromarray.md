---
title: 'Array에서 중복 제거'
date: 2020-02-22 17:02:83
category: algorithm
---

JavaScript 코딩 테스트 문제를 풀다가 한번은 정리하고 넘어가야 할 것 같아서 적어본다.

참고 글: [[Javascript] array 중복 제거하는 방법(ES6)](https://medium.com/@Dongmin_Jang/javascript-array-%EC%A4%91%EB%B3%B5-%EC%A0%9C%EA%B1%B0%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-es6-b5b9075361f9)

내가 가장 많이 사용하는 방법은 `Set`을 이용한 방법이다.

```ts
const array = [1, 2, 3, 1, 2, 5, 8];
console.log([...new Set(array)]);
```

이것 외에 위의 글에서 설명하는 방법은 `filter`와 `reduce`를 이용한 방법이다.

```ts
const array = [1, 2, 3, 1, 2, 5, 4, 6];

console.log(array.filter((a, i) => array.indexOf(a) === i));

console.log(
  array.reduce<number[]>((acc, a) => (acc.includes(a) ? acc : [...acc, a]), [])
);
```

직접 테스트 해보지는 않았지만 for loop이나 object를 이용하여 중복을 제거하는 것보다 filter가 빠르다고 한다.

Set은 브라우저 별로 다를 수 있다고 하니 앞으로는 `filter`를 쓰도록 하자.
