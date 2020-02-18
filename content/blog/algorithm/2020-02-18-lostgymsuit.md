---
title: '프로그래머스: 체육복'
date: 2020-02-19 00:02:73
category: algorithm
---

프로그래머스 문제는 저작권 같은게 있을까봐 블로그에는 안올릴려고 했는데... 너무 억울해서 올려본다.

```ts {4-10}
const lostGymSuit = (n: number, lost: number[], reserve: number[]): number => {
  const array: number[] = Array(n).fill(1);

  lost.forEach(l => {
    if (reserve.includes(l)) {
      reserve.splice(reserve.indexOf(l), 1);
    } else {
      array[l - 1] = 0;
    }
  });

  reserve.forEach(r => {
    if (array[r - 2] === 0) {
      array[r - 2] = 1;
    } else if (array[r - 1] === 0) {
      array[r - 1] = 1;
    } else if (array[r] === 0) {
      array[r] = 1;
    }
  });

  const result = array.reduce((acc, a) => acc + a);
  return result;
};
```

문제 마지막 조건은 다음과 같다.

> 여벌 체육복을 가져온 학생이 체육복을 도난당했을 수 있습니다. 이때 이 학생은 체육복을 하나만 도난당했다고 가정하며, 남은 체육복이 하나이기에 다른 학생에게는 체육복을 빌려줄 수 없습니다.

lost와 reserve에 같은 값이 있으면 미리 제외하라는 의미였는데, 이 조건을 제대로 안읽었다.

거의 3시간을 이 문제를 잡고 있었다. 눈물이 난다 ㅋㅋㅋㅋㅋ

문제를 잘 읽자.
