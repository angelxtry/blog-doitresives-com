---
title: Longest Palindrome - Expand Around Center
date: 2020-02-10 23:02:83
category: algorithm
---

Palindrome. 회문이라고 번역한다.

토마토같이 가운데를 중심으로 좌우가 동일할 글자를 의미한다.

토마마토 처럼 짝수인 경우도 해당한다.

주어진 문자열에서 가장 긴 Palindrome을 찾는 것이 문제다.

일단 for loop으로 풀었다.

```js
const expandAroundCenter = (str, left, right) => {
  let l = left;
  let r = right;
  while (l >= 0 && r < str.length && str[l] === str[r]) {
    l -= 1;
    r += 1;
  }
  return r - l - 1;
};

const longestPalindrome = str => {
  if (!str) return '';
  let start = 0;
  let maxLength = 0;
  for (let i = 0; i < str.length; i += 1) {
    const oddLength = expandAroundCenter(str, i, i);
    const evenLength = expandAroundCenter(str, i, i + 1);
    const length = Math.max(oddLength, evenLength);
    if (length > maxLength) {
      maxLength = length;
      start = i - Math.floor((length - 1) / 2);
    }
  }
  // return str.substr(start, maxLength);
  return str.substring(start, start + maxLength);
};
```

시간 복잡도는 `O(n^2)`

`expandAroundCenter`는 말 그대로 중앙에서 좌우로 확장하면서 동일한 값인지 확인한다. 처음 호출한 expandAroundCenter는 palindrome이 홀수인 경우, 두 번째 호출한 것은 palindrome이 짝수인 경우를 확인한다.

`substr`은 `(startIndex, length)`, `substring`은 `(startIndex, endIndex)`다.

mdn에 보면 substr보다 substring을 사용하라고 권장한다. 그래서 substring으로 처리했다.
