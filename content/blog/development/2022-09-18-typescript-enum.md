---
title: 2022-09-18 TypeScript에서 enum을 사용해야할까요?
date: 2022-09-18 22:09:39
category: development
---

TypeScript로 개발을 할 때 종종 enum을 사용하게 됩니다. 백앤드 코드를 통해 타입 자동생성을 할 때 자연스럽게 생성되어 사용하기도 하고 필요에 따라 프론트에서 직접 정의하여 사용하기도 합니다.

회사에서 프론트 개발자들끼리 논의를 하다가 과연 enum이 편리한걸까? 더 나은 방법은 없을까? enum의 장단점은 뭘까? 같은 논의를 하게되어 한번 정리할 필요가 있다고 생각했습니다.

enum을 왜 사용하는지, enum의 장단점은 뭔지 한번 살펴보겠습니다.

## enum 이란

enum은 같은 맥락에서 사용되는 상수들의 묶음입니다. 각각 개별로 정의하는 것 보다 enum을 통해 정의하면 같은 맥락에서 사용됨을 강하게 표현할 수 있습니다. IDE 등의 지원이 있으면 코드 작성에도 편리하고, 코드 가독성도 좋아집니다.

```ts
// enum을 사용하지 않고 AlertType 상수 정의
const ERROR = 'error';  
const WARNING = 'warning';  
const INFO = 'info';  
const SUCCESS = 'success';

// enum을 사용하여 AlertType 상수 정의
enum AlertType {  
  ERROR = 'error',  
  WARNING = 'warning',  
  INFO = 'info',  
  SUCCESS = 'success',  
}
```

위 코드에서 보는 것 처럼 단순하게 개별로 AlertType을 정의하는 것 보다 enum을 사용하여 AlertType을 정의하면 AlertType에 어떤 항목들이 존재하는지 좀 더 명확하게 파악할 수 있습니다.

IDE 등의 지원을 이용하면 `AlertType.` 까지만 입력하면 포함된 상수들을 선택할 수 있어 코드 작성에도 도움이 됩니다.

## JavaScript에서의 enum

JavaScript에는 enum이 존재하지 않습니다. 그래서 JavaScript에서는 `Object.freeze`를 이용하여 enum과 비슷한 효과를 만들 수 있습니다.

```js
const AlertType = Object.freeze({  
  ERROR: Symbol('error'),  
  WARNING: Symbol('warning'),  
  INFO: Symbol('info'),  
  SUCCESS: Symbol('success'),  
});
```

인위적으로 만든 enum은 값이 Symbol이기에 `AlertType.ERROR` 를 switch - case 등에는 사용할 수 있지만 'error'라는 문자열 자체를 사용할 수는 없습니다.

```js
console.log(AlertTypes.ERROR);

// Symbol(error)
```

## TypeScript에서의 enum

TypeScript는 enum을 지원합니다.

```ts
enum AlertType {  
  ERROR = 'error',  
  WARNING = 'warning',  
  INFO = 'info',  
  SUCCESS = 'success',  
}
```

각 항목의 값을 활용할 수도 있습니다.

```ts
console.log(AlertTypes.ERROR);

// error
```

TypeScript로 작성된 enum을 JavaScript로 변환하면 다음과 같은 코드가 됩니다.

[TypeScript Playground 링크](https://www.typescriptlang.org/play?#code/KYOwrgtgBAggNsATgFwCoE8AOwoG8BQUUAogEqkDypUAvFAORKID2i9ANIVAOoykByASX4BxWgwDuAQ0QgAliADmHLsIBiFcfQUAzZiqIBlAKoBhU8UOGtAZzABje8Bs2VAX3xA)
```js
"use strict";  
var AlertType;  
(function (AlertType) {  
  AlertType["ERROR"] = "error";  
  AlertType["WARNING"] = "warning";  
  AlertType["INFO"] = "info";  
  AlertType["SUCCESS"] = "success";  
})(AlertType || (AlertType = {}));
```

JavaScript에 존재하지 않는 enum을 구현하기 위해 [IIFE(Immediately Invoked Function Expression - 즉시 실행 함수 표현)](https://developer.mozilla.org/ko/docs/Glossary/IIFE) 을 사용합니다.

TypeScript에서 enum은 object 처럼 다룰 수 있습니다.

```ts
console.log(Object.keys(AlertType));

// ['ERROR', 'WARNING', 'INFO', 'SUCCESS']

console.log(Object.values(AlertType));

// ['error', 'warning', 'info', 'success']
```

AlertType을 select box 같은 UI로 만들 때 사용하면 유용합니다.

또한 enum은 TypeScript에서 타입처럼 사용할 수도 있습니다.

```ts
const printAlertType = (type: AlertType) => {  
  console.log('printAlertType', type);  
};

printAlertType(AlertType.ERROR);  // error
```

enum의 value는 [리터럴 타입](https://typescript-kr.github.io/pages/literal-types.html)으로 처리되기 때문에 동일한 문자열을 사용하더라도 타입 에러로 간주합니다.

```ts
printAlertType('ERROR');  // 타입 에러
printAlertType('error');  // 타입 에러
```


## enum의 단점
enum의 장점을 다시 한번 정리해보자면 다음과 같습니다.

1. 같은 맥락에서 사용되는 상수들을 묶어서 표현하기 때문에 가독성이 좋아진다.
2. IDE의 지원으로 자동 완성을 통해 코드 작성이 쉬워진다.

그럼 enum의 단점은 뭘까요?

1. 번들링 결과물의 파일 크기가 커진다.

위에서 설명했듯이 enum을 JavaScript로 변환하면 코드 길이가 증가합니다. enum이 한 두개면 큰 영향이 없을 수도 있지만 개발하다보면 상당히 많은 enum을 정의하여 사용하게 됩니다.

2. enum을 타입으로 사용할 때 다른 enum과 합치거나 분리할 수 없습니다.

회사에서 동료들과 논의할 때도 이 부분이 가장 이슈였습니다.

```ts
enum AlertType {  
  ERROR = 'error',  
  WARNING = 'warning',  
  INFO = 'info',  
  SUCCESS = 'success',  
}
```

AlertType에서 ERROR와 WARNING 만 사용하고 싶은 상황이 생겼을 때  enum인 AlertType을 가공할 방법이 없습니다. ERROR와 WARNING만을 가지고 있는 별도의 enum이나 타입을 만들어야 합니다.

```ts
enum ImportCountry {  
  KOREA = 'KR',  
  THAILAND = 'TH',  
  VIETNAM = 'VN',  
}  
  
enum ExportCountry {  
  KOREA = 'KR',  
  THAILAND = 'TH',  
  VIETNAM = 'VN',  
  INDONESIA = 'ID',  
  SINGAPORE = 'SG',  
}
```

위와 같은 enum이 있을 때 두 enum을 합친 AllCountry라는 타입이 필요하다면 다시 정의하는 수 밖에 없는 것 같습니다.

## 대안은?

이러한 문제를 해결하기 위해 다음과 같은 코드를 사용합니다.

```ts
type ValueOf<T> = T[keyof T];  
  
export const AlertType = {  
  ERROR: 'error',  
  WARNING: 'warning',  
  INFO: 'info',  
  SUCCESS: 'success',  
} as const;  
  
export type AlertType = ValueOf<typeof AlertType>;
```

위와 같이 작성하면 enum과 동일하게 동작합니다.

```ts
console.log(AlertType.ERROR);

// error

console.log(Object.keys(AlertType));

// ['ERROR', 'WARNING', 'INFO', 'SUCCESS']

console.log(Object.values(AlertType));

// ['error', 'warning', 'info', 'success']
```

object인 AlertType과 타입인 AlertType의 이름이 동일하지만 TypeScript에서 적절하게 추론이 되어 사용시에 문제가 발생하지 않습니다.

AlertType 에서 일부 항목만을 사용하는 것도 Pick이나 Omit 등의 Utility 타입을 활용하여 조금 더 편리하게 처리할 수 있습니다.

두 개의 타입을 합치는 것도 비교적 간단하게 처리할 수 있습니다.

```ts
export const ImportCountry = {  
  KOREA: 'KR',  
  THAILAND: 'TH',  
  VIETNAM: 'VN',  
} as const;  
export type ImportCountry = ValueOf<typeof ImportCountry>;  
  
export const ExportCountry = {  
  KOREA: 'KR',  
  THAILAND: 'TH',  
  VIETNAM: 'VN',  
  INDONESIA: 'ID',  
  SINGAPORE: 'SG',  
} as const;  
export type ExportCountry = ValueOf<typeof ExportCountry>;  
  
const AllCountry = { ...ImportCountry, ...ExportCountry } as const;  
  
export type AllCountry = ValueOf<typeof AllCountry>;
```

## 마치며

enum의 장단점과 대안을 정리해봤습니다.

enum의 대안이 enum 보다 좋은 것 처럼 내용을 작성했지만 이 부분에서는 저의 취향이 듬뿍 담겨있음을 고백합니다. 동료들과 대화에서도 어느 쪽이 더 낫다고 결론을 짓지 못했어요. TypeScript를 사용하면서 enum을 피해갈 수 있는 방법은 없을 것 같고, 모든 상황에서 대안만을 사용해야 한다는 의미없는 고집이라 생각합니다.

단지 enum과 대안이 어떤 것인지 알고 동료들과 합의하에 적절하게 사용하면 좋을 듯 합니다.
