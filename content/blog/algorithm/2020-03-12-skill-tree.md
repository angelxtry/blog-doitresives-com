---
title: '2020-03-12 Skill Tree'
date: 2020-03-13 00:03:41
category: algorithm
---

정규 표현식 문제는 꼭 글을 쓰게 된다.

## 문제

[프로그래머스 스킬 트리](https://programmers.co.kr/learn/courses/30/lessons/49993)

skill, skill_trees가 주어진다.

```txt
skill: "CBD"
skill_trees: ["BACDE", "CBADF", "AECB", "BDA"]
```

skill에 포함된 문자는 첫 번째 문자는 반드시 포함되어야 하고 나머지는 순서만 지키면 된다. 모두 다 포함될 필요도 없다. 단, 중간의 문자가 없으면 다음 문자가 올 수 없다.

그외의 문자는 어디에 포함되든 상관없다.

문자를 다루는 문제라서 정규표현식으로 어떻게 풀 수 있을까 고민했는데 답을 찾지 못했다.

일단 내가 푼 방식은 다음과 같다.

```ts
const skillTree = (skill: string, skill_trees: string[]): number => {
  const result = skill_trees.filter(st => {
    const subSet = st
      .split('')
      .filter(s => skill.indexOf(s) !== -1)
      .join('');
    return subSet === skill.slice(0, subSet.length);
  });
  return result.length;
};
```

풀이를 보니 정규 표현식으로 해결한 사람들이 있었다. 힌트를 얻어 다시 풀어봤다.

```ts
const skillTree = (skill: string, skill_tree: string[]): number => {
  const re = new RegExp(`[^${skill}]`, 'g');
  const result = skill_tree.filter(st => {
    const subSet = st.replace(re, '');
    return skill.indexOf(subSet) === 0;
  });
  return result.length;
};
```

`[^abc]` 패턴은 negated character set이라고 하는데 해당 문자를 제외한 나머지를 선택하게 된다.

```ts
const re = new RegExp(`[^a]`, 'g');
const match = 'abcdcba'.match(re);
console.log(match);

// [ 'b', 'c', 'd', 'c', 'b' ]
```

여기서는 replace를 사용해서 skill을 제외한 문자를 모두 지웠다.

그리고는 indexOf를 사용하여 skill의 첫 번째 문자와 동일한지 검사했다.

특정 문자를 제외하고 나머지 문자를 모두 삭제할 때 사용하면 좋을 것 같다.
