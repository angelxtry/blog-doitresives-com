---
title: "[CSS] flex로 card list 만들기"
date: 2020-04-13 01:04:51
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

동일한 형태의 card가 반복되는 형태다.

card는 image와 desc로 구성되고 image는 모두 동일한 크기지만, desc는 text 길이에 따라 다르다. 하지만 같은 라인에 있는 desc 영역의 크기는 모두 동일하게 설정한다.

반응형으로 600px 이하일 때는 1줄, 600px 이상일 때는 2줄, 900px 이상일 때는 3줄이다.

카드 사이에는 간격이 존재하며 화면 좌우 끝에는 간격이 없다.

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
    <ul class="card-list">
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam ut quis
          architecto dolorum laborum enim necessitatibus temporibus quidem
          accusantium tempore expedita, ea natus molestiae eveniet modi ad
          itaque voluptatibus exercitationem dolor
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
          blanditiis.
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
          blanditiis.
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
          blanditiis.
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
          blanditiis.
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
          blanditiis.
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
          blanditiis.
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
          blanditiis.
        </div>
      </li>
      <li class="card-item">
        <figure class="card-image" style="background-image: url(./catcat.jpg);">
          <img src="./catcat.jpg" alt="cat" srcset="" />
        </figure>
        <div class="card-desc">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
          blanditiis.
        </div>
      </li>
    </ul>
  </body>
</html>
```

카드의 image는 figure에 background로 표시한다. 그래서 img tag는 hidden 처리한다.

```css
.card-image img {
  display: none;
}
```

```css
.card-image {
  height: 0;
  padding-bottom: 60%;
  background-color: lightgray;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.card-image img {
  display: none;
}
```

background image의 크기를 브라우저 크기 변경에 따라 조정하려면 `height: 0; padding-bottom: 60%`를 사용한다. 적용 후 브라우저 크기를 조정해보면 브라우저 크기에 맞게 image 크기가 조정된다.

```css
.card-item {
  margin-bottom: 2em;
}
.card-image {
  height: 0;
  padding-bottom: 60%;
  background-color: lightgray;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.card-image img {
  display: none;
}
.card-desc {
  padding: 1em;
  background: white;
}
```

.card-desc style을 추가하고 card-item에 margin-bottom을 추가하면 1줄 출력은 완성.

media를 추가하여 2줄 출력을 처리해보자.

```css
/* card list */
.card-item {
  margin-bottom: 2em;
}
.card-image {
  height: 0;
  padding-bottom: 60%;
  background-color: lightgray;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.card-image img {
  display: none;
}
.card-desc {
  padding: 1em;
  background: white;
}
@media (min-width: 600px) {
  .card-list {
    display: flex;
    flex-wrap: wrap;
  }
  .card-item {
    width: 50%;
  }
}
```

600px 이상일때 flex, wrap를 추가하고 .card-item의 크기를 50%로 설정하면 2줄이 된다.

카드 사이에 여백을 만들기 위해 다음과 같이 처리한다.

```css
/* card list */
.card-item {
  margin-bottom: 2em;
}
.card-image {
  height: 0;
  padding-bottom: 60%;
  background-color: lightgray;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.card-image img {
  display: none;
}
.card-desc {
  padding: 1em;
  background: white;
}
@media (min-width: 600px) {
  .card-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -1rem;
  }
  .card-item {
    width: 50%;
    padding: 0 1rem;
  }
}
```

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

.card-item에 padding을 추가하면 카드 사이에 공간이 생기지만 브라우저와 카드 사이에도 여백이 생긴다. 이 여백을 없애기 위해 .card-list에 마이너스 margin을 추가한다.

```css
/* card list */
.card-item {
  margin-bottom: 2em;
}
.card-image {
  height: 0;
  padding-bottom: 60%;
  background-color: lightgray;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.card-image img {
  display: none;
}
.card-desc {
  padding: 1em;
  background: white;
}
@media (min-width: 600px) {
  .card-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -1rem;
  }
  .card-item {
    width: 50%;
    padding: 0 1rem;
  }
}
@media (min-width: 900px) {
  .card-item {
    width: 33.33333%;
  }
}
```

900px 이상일 때 3줄까지 처리했다.

마지막으로 현재 글자 길이에 따라 .card-desc의 크기가 다르다.

이것을 처리하기 위해 .card-item에 flex를 적용한다.

```css
/* card list */
.card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
}
.card-image {
  height: 0;
  padding-bottom: 60%;
  background-color: lightgray;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.card-image img {
  display: none;
}
.card-desc {
  flex: 1 1 auto;
  padding: 1em;
  background: white;
}
@media (min-width: 600px) {
  .card-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -1rem;
  }
  .card-item {
    width: 50%;
    padding: 0 1rem;
  }
}
@media (min-width: 900px) {
  .card-item {
    width: 33.33333%;
  }
}
```

.card-item에 flex를 적용하고 direction을 column으로 변경했다.

그리고 .card-desc에 flex-grow 속성을 1로 설정하여 크기를 동일하게 맞춘다.

여기서는 `flex: 1 1 auto;`로 표현했다.
