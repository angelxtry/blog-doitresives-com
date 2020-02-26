---
title: 'console tip & VS Code snippet 추가하기'
date: 2020-02-26 23:02:41
category: development
---

console로 할 수 있는 여러가지.

참고 영상: [Beyond Console Log in 100 Seconds](https://www.youtube.com/watch?v=L8CDt1J3DAw)

영상은 브라우저에서 예시를 보여준다. 나는 Node로 test.

## console.assert

false인 경우 log를 출력할 수 있다.

```ts
console.assert(false, 'user not logged in');
```

## object로 출력하기

```ts
const a = 10;
const b = 20;

console.log(a, b);
console.log('a: ', a 'b: ', b);
console.log({a , b});  // 추천
// 10 20
// a:  10 b:  20
// { a: 10, b: 20 }
```

값을 출력할 때 해당 값이 무엇인지 확인하려면 두 번째 console.log 처럼 추가 문자열이 필요하다.

이때 object를 넣으면 property까지 같이 출력되므로 편리하다.

## console.table

```ts
const c = { a, b };
console.table([a, b]);
console.table(c);
```

```cmd
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │   10   │
│    1    │   20   │
└─────────┴────────┘
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    a    │   10   │
│    b    │   20   │
└─────────┴────────┘
```

배열은 index와 함께, object는 property와 함께 표로 출력된다.

## console.count

```ts
let count = 0;
[1, 2, 3, 4, 5].forEach(n => {
  if (n > 3) {
    count += 1;
    console.log('count: ', count);
  }
});
// count:  1
// count:  2

// 추천
[1, 2, 3, 4, 5].forEach(n => {
  if (n > 3) {
    console.count('count');
  }
});
// count: 1
// count: 2
```

(예시가 어색하지만 넘어가자.)

console.count는 label에 따라 자동으로 숫자를 증가하여 출력해준다. 변수 선언도 따로 필요없다.

## console.time

label에 따라 경과된 시간을 출력한다.

```ts
console.time('count');
[1, 2, 3, 4, 5].forEach(n => {
  if (n > 3) {
    console.count('count');
  }
});

console.time('table');
console.table(Object.keys(Array(10).fill(0)).filter(a => parseInt(a) > 3));
console.timeEnd('table');

console.timeEnd('count');
```

```cmd
count: 1
count: 2
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │  '4'   │
│    1    │  '5'   │
│    2    │  '6'   │
│    3    │  '7'   │
│    4    │  '8'   │
│    5    │  '9'   │
└─────────┴────────┘
table: 4.282ms
count: 5.034ms
```

console.timeEnd가 호출될 때 lable과 경과 시간을 출력한다.

## console.trace

```ts
const outer = () => {
  const inner = () => {
    console.trace('누가 호출했어?');
  };
  inner();
};
outer();

// Trace: 누가 호출했어?
//     at inner (test.js:30:17)
//     at outer (test.js:32:5)
// ...
```

call stack이 출력된다.

## VS Code snippet에 추가하기

VS Code를 실행하고

`Code -> Preferences -> User Snippets` 를 선택한다.

파일 확장자가 주욱 나타나는데 javascript.json을 고른다.

친절하게도 주석으로 어떻게 snippet을 만드는지 잘 적어 놓았다.

참고로 `$1`은 snippet이 출력된 후 처음 커서가 위치하는 곳이고 $2, $3으로 tab을 사용하여 이동할 수 있다.

나는 snippet이 겹치는게 없어서 log, count, table, trace를 추가했다.

snippet까지 만들어 놨으니 열심히 써먹어 봐야지.
