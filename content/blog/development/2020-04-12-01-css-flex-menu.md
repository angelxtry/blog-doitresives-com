---
title: "[CSS] flex로 menu 만들기"
date: 2020-04-13 01:04:37
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./default.css" />
    <link rel="stylesheet" href="./ui.css" />
  </head>
  <body>
    <ul class="menu">
      <li class="menu-item"><a href="#" class="menu-link">Home</a></li>
      <li class="menu-item"><a href="#" class="menu-link">About</a></li>
      <li class="menu-item"><a href="#" class="menu-link">Product</a></li>
      <li class="menu-item"><a href="#" class="menu-link">Contact</a></li>

    </ul>
  </body>
</html>
```

기본적인 html은 여기서 시작한다.

```css
.menu-item {
  background-color: gold;
}

.menu-item:hover {
  background-color: crimson;
}

.menu-link {
  display: block;
}
```

menu-item을 gold로 하고 마우스를 올렸을 때 crimson으로 색을 변경한다.

a는 inline 속성이기 때문에 해당 글자에 마우스를 올려야만 반응한다. display를 block으로 변경하여 해당 라인에 마우스를 가져가면 반응하도록 변경한다.

```css
.menu-item {
  background-color: gold;
}

.menu-item:hover {
  background-color: crimson;
}

.menu-link {
  display: block;
  padding: 1em;
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  text-decoration: none;
  text-align: center;
}

.menu-link:hover {
  color: white;
}
```

`font-size: 1.2rem;`

rem 단위는 문서의 최상위 element, 즉 html element의 크기의 몇 배인지로 크기를 정한다.

html element 크기의 기본값은 웹브라우저 설정에서 정한 글자 크기다. 보통 16px.

`padding: 1em;`

em 단위는 상위 element 크기의 몇 배인지로 크기를 정한다.

font-size와 동일한 크기의 padding이 설정된다.

```css
.menu {
  display: flex;
}

.menu-item {
  background-color: gold;
  width: 25%;
}

.menu-item:hover {
  width: 35%;
  background-color: crimson;
}

.menu-link {
  display: block;
  padding: 1em;
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  text-decoration: none;
  text-align: center;
}

.menu-link:hover {
  color: white;
}
```

menu에 flex를 적용하고 menu-item에 width를 25%, menu-item:hover에 35%를 적용했다.

```css
.menu {
  display: flex;
}

.menu-item {
  background-color: gold;
  /* width: 25%; */
  flex-grow: 1;
  transition: 0.5s;
}

.menu-item:hover {
  background-color: crimson;
  /* width: 35%; */
  flex-grow: 1.5;
}

.menu-link {
  display: block;
  padding: 1em;
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  text-decoration: none;
  text-align: center;
}

.menu-link:hover {
  color: white;
}
```

flex-grow를 이용해서 동일하게 처리할 수 있다.

하지만 flex-grow와 transition을 함께 사용하면 ie에서 동작하지 않을 수 있다고 한다.

그래서 width를 권장한다.
