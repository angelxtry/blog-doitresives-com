---
title: "Custom hook의 return value를 array or object 중 무엇으로 해야할까"
date: 2020-07-02 00:07:79
category: development
---

Custom hook을 사용하다보면 고민이되는 항목이 있다.

return value를 무엇으로 하는 것이 좋을까? Array? Object?

당연히 둘 다 가능하다. 하지만 어떤 상황에서 어떤 것을 선택하는 것이 좋을까하고 검색을 하다가 좋은 글을 찾았다.

[Writing Your Own React Hooks, the Return Value](https://dev.to/namick/writing-your-own-react-hooks-the-return-value-3lp6)

## Array

1. return 하고자 하는 항목의 수가 적을 때
2. 같은 Component 내에서 한 번 이상 사용할 때

## Object

1. return 하고자 하는 항목의 수가 많을 때
2. 같은 Component 내에서 한 번만 사용할 때

상당히 명확한 기준이다.

return 하고자하는 항목의 수가 많을 때 Array는 항상 순서를 고려해야 한다. 하지만 Object로 return하면 필요한 항목만 선택할 수 있다.

Array로 return하면 componet에서 사용할 때 쉽게 이름을 변경할 수 있다. 단적인 예로 hooks의 대표 함수인 useState를 들 수 있다. Object는 이름을 변경하는 것이 불가능 한 것은 아니지만 더 번거롭다.

## Destructuring을 사용하지 않는 경우

항목의 수가 많아 Object로 return 했지만, 동일한 Component에서 한 번 이상 사용해야 할 경우 destructuring을 하지 않는 것도 좋은 대안이 될 수 있다.

React Component에 props로 전달할 때 destructuring을 하는 방식도 있지만 eslint에서 권장하는 방식은 아닌 듯 하다.
