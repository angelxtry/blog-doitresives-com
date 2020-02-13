---
title: Shuffle Cards
date: 2020-02-14 00:02:01
category: algorithm
---

```ts
const orderedDeck = (): string[] => {
  const suits = ['H', 'C', 'D', 'S'];
  const values = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
  ];
  const deck: string[] = [];
  suits.forEach(s => {
    values.forEach(v => {
      deck.push(`${s}${v}`);
    });
  });
  return deck;
};

const shuffleDect = (deck: string[]): string[] => {
  const result: string[] = [];
  const deckLength = deck.length;
  for (let i = 0; i < deckLength; i += 1) {
    const chosen = Math.floor(Math.random() * deck.length);
    result.push(deck.splice(chosen, 1)[0]);
  }
  return result;
};

console.log(shuffleDect(orderedDeck()));
```

카드 덱을 랜덤하게 섞는 문제. splice로 수월하게 해결했다.

너무 수월하게 풀려서 좀 찜찜했다. 내가 모르는 뭔가가 있을 것 같아 검색을 해봤다.

찾아보니 Fisher–Yates Shuffle이라는 알고리즘 이었다.

1 새로운 배열을 만들고

2 기존 배열에서 랜덤하게 카드를 뽑아서(기존 배열에서 제거)

3 새로운 배열에 저장한다.

계속 기존 배열의 길이를 확인하는 것이 O(n), 카드를 뽑아서 새로운 배열에 넣는 것이 O(n)

결국 시간 복잡도는 `O(n^2)`

```ts
const shuffleDeck = (deck: string[]) => {
  let deckLength = deck.length;
  while (deckLength) {
    const chosen = Math.floor(Math.random() * deckLength);
    deckLength -= 1;
    const temp = deck[chosen];
    deck[chosen] = deck[deckLength];
    deck[deckLength] = temp;
  }
  return deck;
};
```

이 코드가 더 효과적인 shuffle 알고리즘이라고 한다.

랜덤으로 카드를 골라서 마지막 인덱스의 카드와 교체하고

인덱스를 한 칸씩 앞으로 조정하면서 반복한다.

시간 복잡도는 `O(n)`. 별도의 공간도 필요없다.
