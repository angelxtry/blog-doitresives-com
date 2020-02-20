---
title: '이상한 문자열'
date: 2020-02-21 00:02:54
category: algorithm
---

## 문제

주어진 문자열을 단어별로 짝수 인덱스는 대문자, 홀수 인덱스는 소문자로 변환하자.

0은 짝수다. 단어별로 변환하는 것이기에 공백은 무시한다.

## 풀이

```ts
const strangeString = (string: string) => {
  const re = new RegExp('(\\w)(\\w?)', 'g');
  return string.toLowerCase().replace(re, a => {
    return a.length === 2
      ? a[0].toUpperCase() + a[1].toLowerCase()
      : a[0].toUpperCase();
  });
};

console.log(strangeString('abc de'));
```

## 분석

`RegExp`를 이용하여 주어진 패턴을 문자열 전체에 적용하려면 두 번째 인자에 `g`를 넣는다.

global이라는 의미다.

```ts
const re = /(\w)(\w?)/g;
```

이것과 동일한 의미다.

`\w?`에서 `?`는 0번 또는 1번 나타난다는 의미다.

다음의 예를 보자.

```ts
console.log('abcde'.match(/(\w)(\w)/g));

// ['ab', 'cd'];
```

위와 같이 실행하면 e가 선택되지 않는다.

```ts
console.log('abcde'.match(/(\w)(\w?)/g));

// ['ab', 'cd', 'e'];
```

여기에 `?`를 추가하면 e까지 포함된다.

문제에서 단어 별로 처리하기 때문에 공백은 생략된다고 했다.

```ts
console.log('abcde fg'.match(/(\w)(\w?)/g));

// ['ab', 'cd', 'e', 'fg'];
```

정규식 패턴에 공백이 없기 때문에 자연스럽게 공백은 무시한다.

String의 메서드인 replace의 정의는 다음과 같다.

```ts
var newStr = str.replace(regexp|substr, newSubstr|function)
```

두 번째 인자를 보면 함수가 들어갈 수 있다.

```ts
string.replace(re, a => {
  return a.length === 2
    ? a[0].toUpperCase() + a[1].toLowerCase()
    : a[0].toUpperCase();
});
```

a에 정규식의 결과가 하나씩 전달되고 전달된 인자의 길이에 따라 대소문자로 변환한다.

(정규 표현식 재미있네 ㅋㅋㅋ)
