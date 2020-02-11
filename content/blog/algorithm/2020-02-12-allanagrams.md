---
title: All Anagrams
date: 2020-02-12 00:02:13
category: algorithm
---

문자열이 주어지면 주어진 문자와 동일한 길이의 anagram을 구하는 문제다.

```ts
const allAnagrams = (string: string) => {
  const anagrams: string[] = [];
  const recur = (str: string, anagram = '') => {
    if (!str) {
      anagrams.push(anagram);
      return;
    }
    for (let i = 0; i < str.length; i += 1) {
      anagram += str[i];
      recur(`${str.slice(0, i)}${str.slice(i + 1)}`, anagram);
      anagram = anagram.slice(0, anagram.length - 1);
    }
  };
  recur(string);
  return [...new Set(anagrams)];
};

console.log(allAnagrams('ABC'));
```

재귀를 사용했다.

재귀함수의 첫 번째 인자가 null이면 주어진 문자열을 모두 사용했다는 의미가 되므로 anagrams 배열에 anagram을 넣는다.

재귀한수 내의 for loop에서 다시 재귀함수를 호출할 때 문자열의 알파벳이 하나씩 제거되면서 전달된다.

시간복잡도는 `O(n * n!)`

내일 복습하면서 한번 다시 풀어보자.
