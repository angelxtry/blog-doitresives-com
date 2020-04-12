---
title: "[CSS] flex로 bullet list 만들기"
date: 2020-04-13 01:04:61
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

bullet icon을 원하는 형태로 변경하고, bullet icon을 기준으로 들여쓰기가 되도록 설정해보자.

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
    <ul class="info-list">
      <li class="info-list-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam quod eum
        dolore sunt deserunt iusto consequuntur architecto quaerat quisquam
        fugit!
      </li>
      <li class="info-list-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
        tempore, eveniet vero perspiciatis beatae exercitationem?
      </li>
      <li class="info-list-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum laborum
        nobis similique pariatur? Nihil delectus reiciendis fugit nostrum
        blanditiis soluta optio. Temporibus ad ullam nam?
      </li>
    </ul>
  </body>
</html>
```

```css
/* bullet list */
.info-list-item:before {
  content: '😎';
  margin-right: 0.5em;
}
```

먼저 :before 가상 selector를 이용하여 icon을 추가한다.

그리고 icon과 text의 간격을 설정한다.

```css
/* bullet list */
.info-list-item {
  display: flex;
  margin: 0.5em 0;
}
.info-list-item:before {
  content: '😎';
  margin-right: 0.5em;
}
```

.info-list-item에 flex를 설정한다. 이것만으로 바로 bullet icon기준으로 들여쓰기가 설정된다.

`margin: 05.em 0;` 위 아래 간격을 위해 설정했다.
