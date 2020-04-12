---
title: "[CSS] flex로 friend list 만들기"
date: 2020-04-13 01:04:55
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

message list와 동일한 구조이지만 friend list라고 가정하자.

화면이 줄어들어 이름의 일부만 출력될 때 말줄임표를 출력하고 줄 바꿈을 막는다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./default.css">
    <link rel="stylesheet" href="./ui.css">
  </head>
  <body>
    <ul class="user-list friend-list">
      <li class="user-list-item friend-list-item">
        <figure class="user-photo" style="background-image: url(./catcat.jpg);"></figure>
        <p class="user-name">
          name name name name name name name name name
        </p>
      </li>
      <li class="user-list-item friend-list-item">
        <figure class="user-photo" style="background-image: url();"></figure>
        <p class="user-name">
          name name name name name
        </p>
      </li>
      <li class="user-list-item friend-list-item">
        <figure class="user-photo" style="background-image: url();"></figure>
        <p class="user-name">
          name
        </p>
      </li>
    </ul>
  </body>
</html>
```

```css
/* friend list */
.friend-list-item {
  align-items: center;
}
.user-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```
