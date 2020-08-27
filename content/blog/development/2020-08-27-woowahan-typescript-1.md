---
title: "우아한 타입스크립트 #1"
date: 2020-08-27 22:08:86
category: development
---

세미나 일자: 2020-08-26

발표 공고가 나왔을 때부터 두근두근하며 기다렸다.

타입스크립트를 사용하고는 있지만, 잘 사용하는지, 어떻게 하면 더 잘 사용할 수 있을지, 다른 회사들은 어떻게 쓰고 있는지가 항상 궁금했었다.

이번 세미나가 그런 갈증을 조금이나마 해소해줄 수 있었던 것 같다.

영상은 며칠 내로 유트브에 공개된다고 한다. 발표자료를 토대로 필요한 내용만 정리해보자.

## 1부 타입시스템을 올바르게 사용하는 법

### 1. 작성자와 사용자

> 타입 시스템
>
> - 컴파일러에게 사용하는 타입을 명시적으로 지정하는 시스템
>
> - 컴파일러가 자동으로 타입을 추론하는 시스템

타입을 사용하면서 타입 시스템의 정의가 뭔지 깊게 생각해본 적이 없었다.

단지 타입을 강제해서 오류를 줄일 수 있다는 것만 막연하게 생각했었다.

그래서 이런 정의가 신선하면서도 명쾌하게 느껴졌다.

> `noImplicitAny` 옵션을 켜면
>
> 타입을 명시적으로 저장하지 않은 경우
>
> 타입스크립트가 추론 중 `any`라고 판단하게 되면
>
> 컴파일 에러를 발생시켜
>
> 명시적으로 지정하도록 유도한다.

이번 세미나에서 얻은 소득 중 첫 번째가 tsconfig의 명쾌한 설명이다.

막연하게 알고 있었던 항목들을 분명하게 이해하게 됐다.

> `strictNullChecks` 옵션을 켜면
>
> 모든 타입에 자동으로 포함되어 있는
>
> `null`과 `undefined`를 제거해준다.

> `noImplicitReturns` 옵션을 켜면
>
> 함수 내엣 모든 코드가 값을 리턴하지 않으면,
>
> 컴파일 에러를 발생시킨다.

모든 코드에서 명시적으로 리턴 타입을 지정하자!

---

### 2. interface와 type alias

`structural type system` - 구조가 같은면 같은 타입이다.

`nominal type system` - 구조가 같아도 이름이 다르면 다른 타입이다.

타입스크립트의 타입 시스템은 `structural type system`이다.

하지만 `nominal type system`을 사용하고자 하면 구현할 수 있다.

```ts
import { find } from 'lodash';

type PersonId = string & { readonly brand: unique symbol };

function PersonId(id: string): PersonId {
  return id as PersonId;
}

interface Person {
  id: PersonId;
  name: string;
}

function getPersonById(id: PersonId) {
  const data: Array<Person> = [
    {
      id: PersonId('aaa'),
      name: 'aaa',
    },
    {
      id: PersonId('bbb'),
      name: 'bbb',
    },
    {
      id: PersonId('ccc'),
      name: 'ccc',
    },
  ];

  return find(data, p => p.id === id);
}

console.log(getPersonById(PersonId('bbb')));

console.log(getPersonById('bbb'));
```

발표자료에 있던 코드를 거의 그대로 들고왔다.

`PersonId`는 단순 `string`이지만 `unique symbol`로 intersection을 걸어서 만들어졌기 때문에 `string`을 그대로 전달할 수 없다.

명확하게 이해는 되지만 어디에 써먹을 수 있을까 알쏭달쏭하다.

이렇게나 강하게 타입을 강제해야하는 상황이 있을까?

### function

```ts
// type alias
type EatType = (food: string) => void;

// interface
interface Eat {
  (food: string): void
}
```

### array

```ts
// type alias
type PersonList = string[];

// interface
interface PersionList {
  [index: number]: string;
}
```

`type`은 단순히 alias라고 생각해도 좋다고 발표자님이 얘기하신 것이 기억난다.

function, array를 `interface`에서 사용하는 법은 종종 잊어먹는다. 잘 기억해두자.

### intersection

```ts
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtistsData {
  artists: { name: string }[];
}

// type alias
type ArtistsResponseType = ArtistsData & ErrorHandling;

let art: ArtistsResponseType;

// interface
interface ArtistRespose extends ArtistsData, ErrorHandling {}

let art: ArtistsResponse;
```

`type`은 에러와 데이터를 intersection으로 엮어서 새로운 타입을 만들었다.

`interface`는 `extends`를 이용하여 두 에러와 데이터를 엮었다.

이건 잘 써먹을 수 있을 것 같다!

### Declaration Merging - interface

`interface`를 동일한 이름으로 선언하면 각 프로퍼티들은 하나의 `interface`에서 선언한 것 처럼 합쳐진다.

라이브러리에서 타일을 부실하게 적어놨을 경우 활용할 수 있다.

`type`은 중복 선언되면 에러가 발생한다.

---

### 5. Type Guard로 안전함을 파악하기

### 5-1 typeof Type Guard - 보통 primitive 타입일 경우 많이 사용된다.

```ts
function getNumber(value: number | string): number {
  if (typeof value === 'number') {
    return value;
  }
  return -1;
}
```


### 5-2 instanceof Type Guard - Error 객체 구분에 많이 쓰인다.

```ts
class NegativeNumberError extends Error {}

function getNumber(value: number): number | NegativeNumberError {
  if (value < 0) return new NegativeNumberError();
  return value;
}

function main() {
  const num = getNumber(-10);
  if (num instanceof NegativeNumberError) {
    return;
  }
}
```
### 5-3 in operator Type Guard - object의 프로퍼티 유무로 처리하는 경우

```ts
interface Admin {
  id: string;
  role: string;
}

interface User {
  id: string;
  email: string;
}

function redirect(user: Admin | User) {
  if ("role" in user) {
    routeToAdminPage(user.role);
  } else {
    routeToHomePage(user.email);
  }
}
```

### 5-4 literal Type Guard - object의 프로퍼티가 같고, 타입이 다른 경우

```ts
type Car = {
  type: 'CAR';
  wheel: number;
}

type Boat = {
  type: 'BOAT';
  motor: number;
}

function getWheelOrMotor(machine: any): number {
  if (machine.type === 'CAR') {
    return machine.wheel;
  } else if (machine.type === 'BOAT') {
    return machine.motor;
  } else {
    return -1;
  }
}

const carData: Car = {
  type: 'CAR',
  wheel: 5,
}

console.log(getWheelOrMotor(carData));
```

### 5-5 custom Type Guard

```ts
type Car = {
  type: 'CAR';
  wheel: number;
}

type Boat = {
  type: 'BOAT';
  motor: number;
}

function isCar(arg: any): arg is Car {
  return arg.type === 'CAR';
}

function isBoat(arg: any): arg is Boat {
  return arg.type === 'BOAT';
}

function getWheelOrMotor(machine: any): number {
  if (isCar(machine)) {
    return machine.wheel;
  } else if (isBoat(machine)) {
    return machine.motor;
  } else {
    return -1;
  }
}

const carData: Car = {
  type: 'CAR',
  wheel: 5,
}

console.log(getWheelOrMotor(carData));
```

Type Guard는 어떻게 엮어서 사용하던지 매우 유용하게 사용할 수 있을 듯 하다.

어렴풋하게 알고 있었던 내용을 정리할 수 있어서 좋았고, 부가 설명에 적힌대로 에러 처리를 할 때 유용하게 쓸 수 있을 것 같다!

---

### 6. Class를 안전하게 만들기

> Class Property의 타입을 명시적으로 지정해야 한다.
> 
> 런타임에 undefined가 된다.
> 
> strictPropertyInitalization
> 
> Class Property가 선언에서 초기화되어야 한다. or Class property가 생성자에서 초기화한다.
> 
> 4.0.2부터 생성자에 의해 Class Property의 타입이 추론된다.
> 
> 생성자를 벗어나면 추론되지 않는다.
> 
> `!`로 의도를 표현해야 한다. - 주의하라는 표시라고 이해해도 좋다.

요건 간단하게만 정리!

## 정리

1부 내용만 일단 간단하게 정리해봤다. 사용된 코드는 발표 자료에 있는 코드를 거의 그대로 사용했다.

2부는 `실전 타입스크립트 코드 작성하기` 인데 1부보다 훨씬 더 어려웠다. 그래도 내 수준에서도 유용한 내용이 많아서 꼭 다시 리뷰해보려고 한다.

오늘은 여기까지만!

정리한 내용에 오류가 있을 수도 있으니 혹시라도 읽는 분이 있다면 유튜브나 [원본 슬라이드](https://slides.com/woongjae/woowahan-ts)를 참고하세요.
