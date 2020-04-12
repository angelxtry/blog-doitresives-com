---
title: "[CSS] flex로 message list 만들기"
date: 2020-04-13 01:04:91
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

bullet list와 유사하지만, message를 남긴 사람의 photo가 같이 출력되는 list.

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
    <ul class="user-list message-list">
      <li class="user-list-item message-list-item">
        <figure class="user-photo" style="background-image: url(./catcat.jpg);"></figure>
        <p class="message-content">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
          architecto nihil commodi aliquam. Quas omnis optio dolorem alias,
          officia nisi!
        </p>
      </li>
      <li class="user-list-item message-list-item">
        <figure class="user-photo" style="background-image: url();"></figure>
        <p class="message-content">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
          architecto nihil commodi aliquam. Quas omnis optio dolorem alias,
        </p>
      </li>
      <li class="user-list-item message-list-item">
        <figure class="user-photo" style="background-image: url();"></figure>
        <p class="message-content">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
        </p>
      </li>
    </ul>
  </body>
</html>
```

동그라미 안에 user photo가 표시되고, 우측에 message가 표시되는 형태의 ui.

ul>lu 구조에 user photo로 figure를 추가한다.

user photo는 `style="background-image: url();"`로 추가한다.

```css
/* message-list */
.user-photo {
  width: 50px;
  height: 50px;
  border: 2px solid #333;
  border-radius: 50%;
  background-color: gold;
  background-repeat: no-repeat;
  background-position: center;
  /* background-size: cover; */
  background-size: 150%;
}
```

먼저 user-photo 부터 처리한다. user-photo는 background-image로 처리했기 때문에 크기를 설정하지 않으면 화면에 출력되지 않는다.

width, height를 설정하고 border를 설정한다. 그리고 나머지 background 설정을 추가한다.

이 background가 message-content와 나란히 위치해야 한다. 그래서 .message-list-item에 flex를 적용한다.

```css
/* message-list */
.user-list-item {
  display: flex;
  margin-bottom: 1.5em;
  /* font-size: 50px;
  margin-bottom: 1.5rem; */
}
.user-photo {
  flex-shrink: 0;
  margin-right: 0.5em;
  width: 50px;
  height: 50px;
  border: 2px solid #333;
  border-radius: 50%;
  background-color: gold;
  background-repeat: no-repeat;
  background-position: center;
  /* background-size: cover; */
  background-size: 150%;
}
```

flex를 적용하면 photo와 message-content가 나란히 위치하지만 message-content의 크기에 따라 photo가 작아질 수 있다.

그래서 photo에 `flex-shrink: 0;`을 추가한다.

.user-list-item에는 `margin-botton: 1.5em;`이 추가되었다. 단위를 em으로 적용했기 때문에 .user-list-item의 font-size가 변경되면 margin도 같이 변경된다.

rem으로 적용하면 단위 뜻 그대로 root의 em이기 때문에 .user-list-item의 font-size가 변경되어도 margin은 변하지 않는다.
