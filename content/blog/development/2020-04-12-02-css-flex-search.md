---
title: "[CSS] flex로 검색 UI 만들기"
date: 2020-04-13 01:04:11
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

브라우저의 크기에 따라 가변적으로 변하는 검색창을 만든다.

버튼의 크기는 고정

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="./default.css">
  <link rel="stylesheet" href="./ui.css">
</head>
<body>
  <form action="" class="search-from">
    <input type="search">
    <input type="submit" value="찾기">
  </form>
</body>
</html>
```

input의 type을 잘 설정하는 것이 중요하다.

보통 text를 많이 쓰지만 search나 email도 있다는 것을 기억해두자.

```css
/* search */
.search-from input[type='search'] {
  border: 0;
  margin-right: 10px;
  border-radius: 0.3em;
  font-size: 1rem;
}
```

불필요한 border를 없애고, button과의 간격을 위해 margin-right를 10px로 설정한다.

border-radius는 약간 둥글게, input 안의 font-size는 살짝 작아지므로 1rem으로 html 기본 크기와 동일하게 설정한다.

```css
/* search */
.search-from input[type='search'] {
  border: 0;
  margin-right: 10px;
  border-radius: 0.3em;
  font-size: 1rem;
}

.search-from input[type='submit'] {
  margin-right: 10px;
  border-radius: 0.3em;
  font-size: 1rem;
  width: 4em;
  background-color: gold;
}
```

input과 동일하게 button을 설정하고, width와 background-color를 추가한다.

```css
/* search */
.search-from {
  display: flex;
  height: 40px;
}

.search-from input[type='search'] {
  flex: 1;
  border: 0;
  margin-right: 10px;
  border-radius: 0.3em;
  font-size: 1rem;
}

.search-from input[type='submit'] {
  margin-right: 10px;
  border-radius: 0.3em;
  font-size: 1rem;
  width: 4em;
  background-color: gold;
}
```

input을 화면 크기에 따라 변하도록 설정하기 위해 부모를 flex로 지정하고 input에만 `flex: 1;`을 지정한다.

`flex: 1;`은 `flex-grow: 1; flex-shrink: 0; flex-basis: auto;`와 동일하다.

이 상태에서 .search-form에 height만 적용하면 모든 element의 height가 동일하게 설정된다.
