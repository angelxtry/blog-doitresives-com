---
title: 같은 품사 교체하기
date: 2020-02-20 22:02:28
category: algorithm
---

## 문제

두 문장이 있다.

```js
const originalText = 'change this [good](adj) sentence [quickly](adv)';
const referText = '[carefully](adv) referring this [short](adj) sentence';
```

originalText의 adj를 referText의 adj로 교체해보자. adv도 동일하게 처리한다.

## 풀이

일단 referText만 보자.

`(adv)` 앞에 있는 `[carefully]`에서 `carefully`만 뽑아내야 한다.

### 문장에서 `[blah blah]` 찾기

`[]`안에 임의의 문자열이 포함된 것을 선택하려면 다음과 같이 정규식을 작성한다.

```js
const re = /\[\w+\]/;
const referMatch = referText.match(re);
console.log(referMatch);

// [ '[carefully]',
//   index: 0,
//   input: '[carefully](adv) referring this [short](adj) sentence',
//   groups: undefined ]
```

변수에 정규식을 담기 위해서는 정규식 앞, 뒤로 `/`가 필요하다.

`[]` 같은 대괄호를 표현하려면 `\` 즉, 역슬래시를 사용한다.

그리고 `\w`는 `_`를 포함한 숫자, 문자를 의미한다. `[A-Za-z0-9_]`과 동일하다.

`\w`에 `+`를 붙여 앞의 표현식이 1회 이상 반복되는 것을 표현했다.

String의 메서드인 `match`는 정규식을 인자로 받고, 일치하는 문자열이 있다면 배열을, 없다면 null을 반환한다.

### `[blah blah]`에서 대괄호를 제외하고 문자만 추출

`[carefully]`에서 carefully만 뽑아내 보자.

```js
const re = /\[(\w+)\]/;
const referMatch = referText.match(re);
console.log(referMatch);

// [ '[carefully]',
//   'carefully',
//   index: 0,
//   input: '[carefully](adv) referring this [short](adj) sentence',
//   groups: undefined ]
```

match 메서드의 결과 배열의 1번째 항목에 carefully가 포함되었다.

`()`안에 포함된 항목을 결과에 포함시키는 이 소괄호를 capturing parentheses라고 부른다.

이제 다시 문제를 풀어보자.

## 다시 문제로

```ts
const replaceSameTerm = (
  targetList: string[],
  originalText: string,
  referText: string
): string => {
  let result = originalText;
  targetList.forEach(target => {
    const pattern = new RegExp(`\\[(\\w+)\\]\\(${target}\\)`);
    const referMatch = referText.match(pattern);
    if (referMatch) {
      result = result.replace(pattern, referMatch[1]);
    }
  });
  return result;
};

const originalText = 'change this [good](adj) sentence [quickly](adv)';
const referText = '[carefully](adv) referring this [short](adj) sentence';

console.log(replaceSameTerm(['adj', 'adv'], originalText, referText));

// change this short sentence carefully
```

replaceSameTerm이라는 함수는 3개의 인자를 받는다.

첫 번째 인자가 정규식으로 찾을 대상이다. 하나 이상이 될 수 있으므로 배열로 받는다.

`RegExp`는 생성자 함수다. 인자로 정규식을 전달할 때 `\`(역슬래시)를 사용하려면 두 개를 연속으로 써야한다. 주의하자.

## 회고

평소에 정규식이 나오면 외면했었는데, 결국 코딩 테스트에서 이 문제를 만났다. 당연히 못풀었다. ㅠㅠ

오늘 내일 이틀에 걸쳐서 정규식을 한번 정리해봐야겠다. 앞으로 정규식을 만나면 즐겁게 도전할 수 있도록!

## 참고. `/g`

```ts
const referText = '[carefully](adv) referring this [short](adj) sentence';

const re = /\[(\w+)\]/g;
const referMatch = referText.match(re);
console.log(referMatch);

// [ '[carefully]', '[short]' ]
```

정규식에 `/g`가 포함되면 일치하는 구문 하나를 찾고 중단하는 것이 아니라 모든 일치하는 구문을 찾는다.

그래서 결과가 다르게 나온다.

## 참고. 캡처링 괄호가 2개 이상일 때

```ts
const referText = '[carefully](adv) referring this [short](adj) sentence';

const re = /(\[)(\w+)(\])/;
const referMatch = referText.match(re);
console.log(referMatch);

// [ '[carefully]',
//   '[',
//   'carefully',
//   ']',
//   index: 0,
//   input: '[carefully](adv) referring this [short](adj) sentence',
//   groups: undefined ]
```

Capturing 괄호가 1개 이상일 때 결과 배열에 1부터 n번째까지 해당 결과가 저장된다.
