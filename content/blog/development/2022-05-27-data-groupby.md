---
title: 2022-05-27 데이터 GroupBy 하기 feat. TypeScript
date: 2022-05-27 15:05:69
category: development
---

회사에서 차트를 그려야 하는 일감이 있었습니다. API를 통해 차트에 딱 맞는 데이터를 받으면 가장 좋지만 그렇지 못할 경우가 종종 생깁니다. 이번에도 이런 저런 이유로 raw한 데이터를 받아서 이리 저리 가공을 해서 차트에 표현을 해야 했습니다.

다음과 같은 차트를 만들고 싶었습니다.

![ts-grpup-by-01.png](https://drive.google.com/uc?export=view&id=1ykZnV5AkYaNal1hQeA7NKwAALzKJwuX9)

막대 그래프는 주문 건수 입니다. 주문 건수는 주문 확인, 주문 취소의 합 입니다. 라인 그래프는 판매금액 합계 입니다.

API를 통해 받은 데이터는 간단히 표현하면 다음과 같습니다.

```ts
type Order = {  
  productName: string;  
  orderedAt: string;  
  orderStatus: 'OK' | 'CANCEL';  
  price: number;  
};

const orderData: Order[] = [  
  { productName: 'abc1', orderedAt: '2022-05-01', orderStatus: 'OK', price: 10000 },  
  { productName: 'abc2', orderedAt: '2022-05-01', orderStatus: 'CANCEL', price: 20000 },  
  { productName: 'abc3', orderedAt: '2022-05-01', orderStatus: 'OK', price: 30000 },  
  { productName: 'abc3', orderedAt: '2022-05-01', orderStatus: 'OK', price: 30000 },  
  { productName: 'abc3', orderedAt: '2022-05-02', orderStatus: 'OK', price: 30000 },  
  { productName: 'abc4', orderedAt: '2022-05-02', orderStatus: 'CANCEL', price: 40000 },  
  { productName: 'abc3', orderedAt: '2022-05-03', orderStatus: 'OK', price: 30000 },  
  { productName: 'abc3', orderedAt: '2022-05-04', orderStatus: 'OK', price: 30000 },  
  { productName: 'abc3', orderedAt: '2022-05-04', orderStatus: 'OK', price: 30000 },  
  { productName: 'abc4', orderedAt: '2022-05-04', orderStatus: 'CANCEL', price: 40000 },  
  { productName: 'abc2', orderedAt: '2022-05-05', orderStatus: 'OK', price: 20000 },  
  { productName: 'abc1', orderedAt: '2022-05-05', orderStatus: 'CANCEL', price: 10000 },  
  { productName: 'abc2', orderedAt: '2022-05-05', orderStatus: 'CANCEL', price: 20000 },  
  { productName: 'abc2', orderedAt: '2022-05-06', orderStatus: 'OK', price: 20000 },  
  { productName: 'abc2', orderedAt: '2022-05-06', orderStatus: 'OK', price: 20000 },  
  { productName: 'abc6', orderedAt: '2022-05-07', orderStatus: 'OK', price: 60000 },  
  { productName: 'abc1', orderedAt: '2022-05-07', orderStatus: 'CANCEL', price: 10000 },  
  { productName: 'abc2', orderedAt: '2022-05-07', orderStatus: 'OK', price: 20000 },  
  { productName: 'abc1', orderedAt: '2022-05-07', orderStatus: 'CANCEL', price: 10000 },  
  { productName: 'abc1', orderedAt: '2022-05-07', orderStatus: 'OK', price: 10000 },  
];
```

더 많은 필드와 데이터가 있지만 설명을 위해 단순하게 만들었습니다.

이 데이터로 원하는 데이터의 모양을 만들려면 orderedAt 으로 group by를 한 후에 count 나 sum 을 수행하면 됩니다.

Lodash, Ramda, RxJS, FxTS 등 많은 라이브러리가 group by 를 지원합니다. 하지만 단순히 group by 만을 사용하기 위해 이 라이브러리를 사용하는 건 음식 배달비가 음식값보다 비싼 느낌이 들었습니다. 그래서 간단하게 만들어봤습니다.

## JS 내장 함수에서 groupBy 지원?

만들기 전에 js array 내장 함수로 group by를 지원한다는 걸 얼핏 본 기억이 있어 찾아봤습니다.

[Array.prototype.groupBy()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupBy#browser_compatibility)

```js
const inventory = [
  { name: 'asparagus', type: 'vegetables', quantity: 5 },
  { name: 'bananas',  type: 'fruit', quantity: 0 },
  { name: 'goat', type: 'meat', quantity: 23 },
  { name: 'cherries', type: 'fruit', quantity: 5 },
  { name: 'fish', type: 'meat', quantity: 22 }
];


const result = inventory.groupBy( ({ type }) => type );
```

result는 다음과 같습니다.

```
{
  vegetables: [
    { name: 'asparagus', type: 'vegetables', quantity: 5 },
  ],
  fruit: [
    { name: "bananas", type: "fruit", quantity: 0 },
    { name: "cherries", type: "fruit", quantity: 5 }
  ],
  meat: [
    { name: "goat", type: "meat", quantity: 23 },
    { name: "fish", type: "meat", quantity: 22 }
  ]
}
```

딱 원하는 결과네요. 그런데 아쉽게도 아직 사용할 수 있는 단계가 아닙니다. 거의 모든 브라우저에서 아직 지원하지 않습니다.

## 만들어보자!

그럼 단순하게 구현해봅시다.

group by의 key는 string만 지원합니다. 입력 데이터는 data cleansing이 다 되었다고 가정합니다.

```ts
type GroupByOrderedAt = { [key: string]: Order[] };

const groupByOrderedAt = orderData.reduce<GroupByOrderedAt>((acc, item) => {  
  const key = item.orderedAt;  
  acc[key] = acc[key] || [];  
  acc[key].push(item);  
  return acc;  
}, {} as GroupByOrderedAt);

console.log('groupByOrderedAt', groupByOrderedAt);
```

orderedAt 기준으로 group by 가 잘 처리됐습니다.

![ts-grpup-by-02.png](https://drive.google.com/uc?export=view&id=1xeocO2zEs0DU9tVdTNU9CTwEsSeqVylg)

조금 더 일반화 된,  입력 오브젝트에 속한 key로 자유롭게 group by를 할 수 있도록 개선해봅시다.

```ts
type GroupBy<T> = { [key: string]: T[] };  
  
const groupBy = <T>(array: T[], groupByKey: keyof T) => {  
  return array.reduce<GroupBy<T>>((acc, item) => {  
    const key = `${item[groupByKey]}`;  
    acc[key] = acc[key] || [];  
    acc[key].push(item);  
    return acc;  
  }, {} as GroupBy<T>);  
};

console.log('groupBy', groupBy<Order>(orderData, 'orderedAt'));
```

key로 orderedAt을 전달하면 동일한 결과를 확인할 수 있습니다.

productName을 key로 전달해봅시다.

```ts
console.log('groupBy', groupBy<Order>(orderData, 'productName'));
```

![ts-grpup-by-03.png](https://drive.google.com/uc?export=view&id=14fWTKjNlgvS5cvK9so3D2QxOwbQqt3R8)

잘 동작하네요.

## 오브젝트가 아닌 Map을 써보자

마지막으로 위 작업을 오브젝트가 아닌 Map 으로도 처리할 수 있습니다.

```ts
type MapGroupByOrderedAt = Map<string, Order[]>;

const mapGroupByOrderedAt = orderData.reduce<MapGroupByOrderedAt>((acc, order) => {  
  const key = order.orderedAt;  
  const value = acc.get(key) || [];  
  value.push(order);  
  acc.set(key, value);  
  return acc;  
}, new Map() as MapGroupByOrderedAt);

type MapGroupBy<T> = Map<string, T[]>;  
  
const mapGroupBy = <T>(array: T[], groupByKey: keyof T) => {  
  return array.reduce<MapGroupBy<T>>((acc, item) => {  
    const key = `${item[groupByKey]}`;  
    const value = acc.get(key) || [];  
    value.push(item);  
    acc.set(key, value);  
    return acc;  
  }, new Map() as MapGroupBy<T>);  
};
```

Map과 Object는 우열이 있다기 보다 장단점이 있다고 합니다. ([링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Keyed_collections#object%EC%99%80_map_%EB%B9%84%EA%B5%90)) 상황에 맞게 사용하면 될 것 같습니다.

Map과 Object는 프로퍼티의 key가 string인 경우에는 상호 변환이 가능합니다.

```js
// Object -> Map
const map = new Map(Object.entries(obj));

// Map -> Object
const obj = Object.fromEntries(map);
```

## 마치며
프론트앤드는 어떻게 보여주느냐에 더 초점을 맞춰야 한다고 생각합니다. 그래서 가능하다면  프론트에서 사용하는 형식에 맞게 백앤드에서 데이터를 보내주는 것을 선호합니다. 하지만 그렇지 못한 경우도 종종 생깁니다. 이럴 때는 프론트에서 데이터를 잘 가공해서 사용해야 합니다.

group by 같은 함수는 프론트에서 간단하게 만들어 사용할만하다고 생각했습니다. 위에서도 작성했지만, 여기에 구현한 groupBy는 매우 제한적인 상황에서만 사용할 수 있는 함수입니다.

좀 더 강력한 추상화가 필요하거나, group by 외에 다양한 util 함수가 필요하다면 라이브러리를 도입하는 것도 좋은 방법이라고 생각합니다.
