---
title: 2023-04-09 웹 개발자를 위한 자바스크립트의 모든 것
date: 2023-04-09 23:04:54
category: development
---


최근에 `웹 개발자를 위한 자바스크립트의 모든 것`이라는 책을 읽었습니다. 이 책으로 진행되는 스터디에 참여해서 겨우 진도를 따라가며, 뛰어난 분들의 해석에 업혀다니면서 많은 것을 배운 것 같습니다. 어께넘어로 배운 것들이 아직 충분히 내 것이 되지 않은듯 해서 다시 책을 읽으면서 그 동안 모호하게 알고 있었던 내용들을 정리해보려고 합니다.

책을 읽으면서 `이 책은 친절하지는 않구나` 라는 생각을 많이 했습니다. 자바스크립트 입문서 같은 느낌은 전혀 아닙니다. 이 책의 부제처럼 ES2015 ~ ES2020의 내용에만 초점을 맞추고 있습니다. 한편으로는 그래서 더 좋았다고 생각합니다. 하지만 어려운 부분이 꽤 많았네요.

2장부터 차근차근 글을 작성해볼 생각입니다. 제가 소화하기에 너무 어려운 부분은 건너뛰고, 평소에 알고 있던 내용도 생략하고, 제가 새롭게 알게되었거나, 모호하게 알고 있으면서 사용하기만 했던 부분들을 정리해보려고 합니다.

---

## 2장 블록 스코프 선언: let과 const

책에서 제시한 2장의 목표는 다음과 같습니다.

> 1. let과 const 선언이 어떻게 작동하는지, 어떤 문제를 해결하는지를 배운다.
> 2. 문제가 있는 것으로 판명된 var의 일부 동작을 확인하고, let과 const가 이러한 문제를 해결하는 방법을 배운다.
> 3. let과 const가 어떻게 진정한 블록 스코프를 제공하고, 초기화하기 전에 변수를 사용하거나 반복된 선언으로 인한 혼동을 방지하는 방법을 배운다.
> 4. 블록 스코프가 변경할 수 없는 변수, 상수를 만드는 방법을 배운다.
> 5. let과 const가 이미 과부하된 전역 객체에 더 많은 속성을 생성하지 않게 하는 방법을 배운다.


이 목표를 상기하며 2장을 읽으려고 노력했습니다. 책의 내용을 정리하면 다음과 같습니다.


> - var와 마찬가지로 let은 초기화할 필요가 없습니다. let은 선언하면 기본적으로 undefined로 설정됩니다.
> - const는 상수를 만들고 초기화가 필요합니다. const는 기본값이 없습니다.

> - var는 선언이 함수의 맨 위로 이동한 것처럼 동작합니다. 선언만 이동하고 연결된 초기화는 같이 이동하지 않습니다. 이 과정을 호이스트 한다고 합니다. 이 때 기본값을 undefined로 설정합니다.
> - let과 const를 사용하면 선언한 라인 이전에서 변수를 사용할 수 없습니다. 사실 let과 const도 호이스팅되지만 var와 동작이 다릅니다.


```js
let answer;

const hoisting = () => {
  answer = 42;
  console.log(answer);
  let answer;
};

hoisting();
```

> - 이 코드를 크롬에서 실행하면 다음과 같은 에러가 발생합니다.
```
VM23:4 Uncaught ReferenceError: Cannot access 'answer' before initialization
    at hoisting (<anonymous>:4:10)
    at <anonymous>:9:1
```

> - let과 const는 임시 데드존 (Temporal Dead Zone: TDZ) 이라는 개념을 사용합니다.

```js
let answer;

const hoisting = () => {
  // 여기에 내부 answer를 예약해 둡니다.
  answer = 42;  // ReferenceError 에러 발생!
  console.log(answer);
  let answer; // 내부 answer
};

hoisting();
```

> - 이 코드에서 내부 answer는 hoisting의 시작 부분에 예약되고 선언이 있는 라인에서 초기화됩니다. hoisting의 시작 부분에서 TDZ가 시작되고 선언이 있는 라인에서 TDZ가 끝납니다.
> - TDZ는 공간 개념이 아니라 시간 개념으로 이해해야 합니다. 해당 변수를 사용할 수 없는 공간 범위가 아니라 사용할 수 없는 기간입니다.

```js
const temporalExample = () => {  
  const f = () => {  
    console.log(value);  
  };  
  const value = 42;  
  f();  
};  
  
temporalExample();
```

> - TDZ가 공간 개념이라면 위 코드를 실행했을 때 ReferenceError가 발생해야 합니다. 하지만 코드는 잘 동작합니다.
> - TDZ는 시간 개념이기에 f 함수가 동작하기 전에 value가 선언되었으므로 정상 동작합니다.

> - TDZ는 블록에서도 함수와 동일하게 동작합니다.
```js
const blockExample = (str) => {
  let p = "prefix";
  if (str) {
    p = p.toUpperCase();  // ReferenceError!
    str = str.toUpperCase();
    let p = str.indexOf("X");
    if (p != -1) {
      str = str.substring(0, p);
    }
  }
  return p + str;
};

blockExample('abc');
```

> - 이 코드도 에러가 발생합니다. if 문의 블록 밖에서 p가 선언되었더라도 블록 내에서 p를 다시 선언하면 TDZ가 동작합니다. TDZ는 if 문 블록이 시작할 때 동작해서  블록 내에서 p가 선언되었을 때 종료됩니다.

> - 전역 스코프에서 var를 사용하면 전역 변수가 생성됩니다.
> - 전역 스코프에서 let, const를 사용하면 새로운 종류의 전역 변수가 생성됩니다.

```js
var answer = 42;
console.log('answer = ' + answer);
console.log('this.answer = ' + this.answer);
console.log('has property? ' + ('answer' in this));


answer = 42
this.answer = 42
has property? true
```

> - 브라우저에서 위의 코드를 실행하면 결과를 확인할 수 있습니다. 브라우저의 전역에서 this를 사용하면 전역 객체에 접근할 수 있습니다.

> - let을 사용하면 다음과 같은 결과를 확인할 수 있습니다.

```js
let answer = 42;
console.log('answer == ' + answer);
console.log('this.answer == ' + this.answer);
console.log('has property? ' + ('answer' in this));

answer == 42
this.answer == undefined
has property? false
```

> - 위에서 보는 것 처럼 answer는 더 이상 전역 객체의 속성이 아닙니다.
> - const도 동일합니다. 전역 변수를 생성하지만 전역 변수는 전역 객체의 속성이 아입니다.
> - 전역 객체의 속성이 아니지만 어디에서나 접근할 수 있으므로 전역 변수를 만드는 것을 주의하지 않아도 된다는 의미는 아닙니다.

---

2장에서 배운 내용은 다음과 같습니다.
- let과 const도 호이스팅이 되긴하지만 var와는 완전히 다른 방식으로 동작한다.
- let과 const에 적용되는 TDZ라는 개념
    - TDZ는 호이스팅이 시작되는 부분에서 시작되고, 선언되는 부분에서 끝난다.
    - TDZ는 공간 개념이라기 보다는 시간 개념이다.
- let과 const는 전역 변수이기는 하지만 전역 객체의 속성은 아니다.



일단 시작을 했으니 책 한 권을 모두 마무리 할 때까지 꾸준히 진행해보려고 합니다!
