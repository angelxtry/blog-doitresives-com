---
title: "[CSS] flex로 반응형 페이지 만들기"
date: 2020-04-13 14:04:58
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

앞서 만든 UI를 이용하여 반응형 페이지를 만들어보자.

## header

```css
.header {
  display: flex;
}
```

haeder와 검색이 두 줄로 되어있는 것을 한 줄로 변경하기 위해 flex 적용한다.

```css
.header {
  display: flex;
  justify-content: space-between;
}

/* justify-content: space-between; 대신 사용 가능 */
/* .search-form {
  margin-left: auto;
} */
```

h1과 검색을 화면의 양 끝에 위치하도록 `justify-content: space-between;` 추가한다.

이것 대신 search-form에 margin-left: auto;를 추가해도 된다.

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}
```

header의 높이는 80px로 설정하고 상하 가운데 정렬을 위해 `align-items: center;`를 적용한다.

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 1rem;
}
```

좌우여백을 위해 `padding: 0 1rem;`을 추가한다.

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 1rem;
}

.search-form {
  width: 240px;
  max-width: 60%;
}
```

### 검색 UI

검색UI의 html은 다음과 같다.

```html
<form action="" class="search-form">
  <input type="search">
  <input type="submit" value="찾기">
</form>
```

input search는 flex이고 크기는 가변적으로 부모 element의 크기에 따라 결정된다.

그래서 input search의 크기를 직접 조정하는 것보다 .search-form의 크기를 조정하도록 한다.

max-width로 제한을 걸어두면 화면이 작아져도 h1 element를 침범하지 않는다.

### modal button

검색 UI 우측에 modal을 popup 시키는 버튼이 있다.

이 버튼으로 modal을 popup 시키는 기능은 보통 js로 구현한다.

html/css로도 기능을 구현할 수 있다.

먼저 간단한 테스트를 진행해보자.

```html
<label for="modal-switch">
  modal open/close
</label>
<input type="checkbox" name="modal-switch" id="modal-switch" />
<p class="test">test</p>
<p class="test">test</p>
<p class="test">test</p>
<style>
  .test {
    color: dodgerblue;
  }
  #modal-switch:checked ~ .test {
    color: crimson;
  }
</style>
```

input의 id와 label의 for를 동일하게 설정하면 label을 클릭해도 checkbox가 동작한다.

`#modal-switch:checked`는 modal-switch가 선택된 상태를 선택한다.

`~`은 앞 선택자의 다음 tag 중에 .test를 선택한다.

화면에서 checkbox를 클릭하면 test의 색이 변경된다.

```html
<label for="modal-switch">
  modal open/close
</label>
<input type="checkbox" name="modal-switch" id="modal-switch" />
<p class="test">test</p>
<p class="test">test</p>
<p class="test">test</p>
<style>
  .test {
    color: dodgerblue;
  }
  #modal-switch:checked + .test {
    color: crimson;
  }
</style>
```

~ 대신 +로 변경하면 첫 번째 test만 색깔이 변경된다.

이 테스트를 응용하여 modal을 추가한다.

테스트했던 코드를 지우고 다시 html 부터 확인해보자.

```html
<input type="checkbox" name="modal-switch" id="modal-switch" />
<label for="modal-switch">
  <span>modal open/close</span>
</label>

<div class="modal">
  <div class="dialog">
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, quibusdam
    nam rem necessitatibus ipsum saepe repudiandae exercitationem quaerat.
    Vitae voluptates repudiandae possimus, odio doloribus temporibus
    distinctio sit similique alias cum aliquam neque quo magnam dicta itaque
    quam accusamus aspernatur quae consequuntur tempora nam quasi officia.
  Reiciendis possimus aliquid repellat iusto?˝
</div>
```

```css
.modal {
  display: none;
}

#modal-switch:checked ~ .modal {
  display: flex;
}
```

.modal은 평상시에는 `display: none;`으로 설정했다가 클릭하면 `display:flex;`로 변경한다.

```css
label[for="modal-switch"]:before {
  content: "💌";
  font-size: 2rem;
}

#modal-switch,
label[for="modal-switch"] span {
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
}
```

label 앞에 icon을 추가하고 checkbox와 label의 span을 안보이게 처리한다.

```css
label[for="modal-switch"] {
  position: absolute;
  top: 1.3rem;
  right: 1rem;
  /* background-color: red; */
  height: 50;
  width: 50;
}
```

icon의 위치를 검색UI 우측으로 설정한다.

```css
label[for="modal-switch"] {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 1.3rem;
  right: 1rem;
  /* background-color: red; */
}

label[for="modal-switch"]:hover {
  cursor: pointer;
}

#modal-switch:checked ~ label[for="modal-switch"]:before {
  content: "🍭";
}
```

icon의 정렬을 위해 flex를 적용한다.

hover를 적용하고, modal popup 시 icon을 변경한다.

마지막으로 modal popup시 버튼을 가리지 않도록 modal의 위치를 조정한다.

```css
.modal {
  display: none;
  top: 80px;
}
```

width가 900px 이상이 되면 primary, secondary의 위치를 변경하기 위해 page에 flex를 적용하고 flex-warp을 wrap으로 설정한다.

header, menu, footer에는 width: 100%;를 적용하고 primary: 60% secondary는 각각 20%씩 설정한다.

```css
@media (min-width: 900px) {
  .page {
    display: flex;
    flex-wrap: wrap;
  }
  .header {
    width: 100%;
  }
  .menu {
    width: 100%;
  }
  .secondary {
    width: 20%;
  }
  .primary {
    width: 60%;
    order: 2;
  }
  .secondary-a {
    order: 1;
  }
  .secondary-b {
    order: 3;
  }
  .footer {
    order: 4;
    width: 100%;
    /* flex-grow: 1; */
    border-top: 1px solid lightgray;
  }
}
```

secondary 영역이 화면 전체 넓이에 따라 계속 커지는 것을 막기 위해 media query를 하나 더 추가하고 secondary의 최대 폭을 지정한다.

```css
@media (min-width: 1024px) {
  .secondary {
    width: 200px;
  }
}
```

이렇게 설정하면 넓이가 더 커지면 우측 끝에 여백이 생길 가능성이 있다.

그래서 primary 영역도 같이 조정한다.

```css
@media (min-width: 1024px) {
  .primary {
    width: calc(100% - 400px);
  }
  .secondary {
    width: 200px;
  }
}
```

## final html, css

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./default.css" />
    <link rel="stylesheet" href="./ui.css" />
    <link rel="stylesheet" href="./page.css" />
  </head>
  <body>
    <div class="page">
      <!-- header -->
      <header class="header">
        <h1 class="website-title">Make Habit</h1>
        <form action="" class="search-form">
          <input type="search" />
          <input type="submit" value="찾기" />
        </form>
      </header>
      <!-- menu -->
      <ul class="menu">
        <li class="menu-item"><a href="#" class="menu-link">Home</a></li>
        <li class="menu-item"><a href="#" class="menu-link">About</a></li>
        <li class="menu-item"><a href="#" class="menu-link">Product</a></li>
        <li class="menu-item"><a href="#" class="menu-link">Contact</a></li>
      </ul>
      <!-- primary -->
      <section class="primary">
        <ul class="card-list">
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam ut
              quis architecto dolorum laborum enim necessitatibus temporibus
              quidem accusantium tempore expedita, ea natus molestiae eveniet
              modi ad itaque voluptatibus exercitationem dolor
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
              blanditiis.
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
              blanditiis.
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
              blanditiis.
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
              blanditiis.
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
              blanditiis.
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
              blanditiis.
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
              blanditiis.
            </div>
          </li>
          <li class="card-item">
            <figure
              class="card-image"
              style="background-image: url(./catcat.jpg);"
            >
              <img src="./catcat.jpg" alt="cat" srcset="" />
            </figure>
            <div class="card-desc">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error,
              blanditiis.
            </div>
          </li>
        </ul>
      </section>
      <!-- secondary-a -->
      <aside class="secondary secondary-a">
        <ul class="info-list">
          <li class="info-list-item">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam quod
            eum dolore sunt deserunt iusto consequuntur architecto quaerat
            quisquam fugit!
          </li>
          <li class="info-list-item">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            tempore, eveniet vero perspiciatis beatae exercitationem?
          </li>
          <li class="info-list-item">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            laborum nobis similique pariatur? Nihil delectus reiciendis fugit
            nostrum blanditiis soluta optio. Temporibus ad ullam nam?
          </li>
        </ul>

        <ul class="user-list friend-list">
          <li class="user-list-item friend-list-item">
            <figure
              class="user-photo"
              style="background-image: url(./catcat.jpg);"
            ></figure>
            <p class="user-name">
              name name name name name name name name name
            </p>
          </li>
          <li class="user-list-item friend-list-item">
            <figure
              class="user-photo"
              style="background-image: url();"
            ></figure>
            <p class="user-name">
              name name name name name
            </p>
          </li>
          <li class="user-list-item friend-list-item">
            <figure
              class="user-photo"
              style="background-image: url();"
            ></figure>
            <p class="user-name">
              name
            </p>
          </li>
        </ul>
      </aside>
      <!-- secondary-b -->
      <aside class="secondary secondary-b">
        <ul class="user-list message-list">
          <li class="user-list-item message-list-item">
            <figure
              class="user-photo"
              style="background-image: url(./catcat.jpg);"
            ></figure>
            <p class="message-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
              architecto nihil commodi aliquam. Quas omnis optio dolorem alias,
              officia nisi!
            </p>
          </li>
          <li class="user-list-item message-list-item">
            <figure
              class="user-photo"
              style="background-image: url();"
            ></figure>
            <p class="message-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
              architecto nihil commodi aliquam. Quas omnis optio dolorem alias,
            </p>
          </li>
          <li class="user-list-item message-list-item">
            <figure
              class="user-photo"
              style="background-image: url();"
            ></figure>
            <p class="message-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
            </p>
          </li>
        </ul>
      </aside>
      <!-- footer -->
      <footer class="footer">Footer!</footer>
    </div>

    <input type="checkbox" name="modal-switch" id="modal-switch" />
    <label for="modal-switch">
      <span>modal open/close</span>
    </label>

    <div class="modal">
      <div class="dialog">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, quibusdam
        nam rem necessitatibus ipsum saepe repudiandae exercitationem quaerat.
        Vitae voluptates repudiandae possimus, odio doloribus temporibus
        distinctio sit similique alias cum aliquam neque quo magnam dicta itaque
        quam accusamus aspernatur quae consequuntur tempora nam quasi officia.
        Reiciendis possimus aliquid repellat iusto?˝
      </div>
    </div>
  </body>
</html>
```

```css
.header {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  height: 80px;
  padding: 0 1rem;
}

/* justify-content: space-between; 대신 사용 가능 */
.search-form {
  width: 240px;
  max-width: 60%;
  margin-left: auto;
  margin-right: 3rem;
}

.primary {
  padding: 1rem;
}

.secondary {
  padding: 1rem;
}

.secondary-a {
  background-color: white;
}

.secondary-a .info-list,
.friend-list {
  margin-bottom: 2rem;
}

.secondary-b {
  background-color: #666;
  color: white;
}

.footer {
  padding: 1rem;
  text-align: center;
}

.modal {
  display: none;
  top: 80px;
}

#modal-switch:checked ~ .modal {
  display: flex;
}

label[for='modal-switch']:before {
  content: '💌';
  font-size: 2rem;
}

#modal-switch,
label[for='modal-switch'] span {
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
}

label[for='modal-switch'] {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 1.3rem;
  right: 1rem;
  /* background-color: red; */
}

label[for='modal-switch']:hover {
  cursor: pointer;
}

#modal-switch:checked ~ label[for='modal-switch']:before {
  content: '🍭';
}

@media (min-width: 900px) {
  .page {
    display: flex;
    flex-wrap: wrap;
  }
  .header {
    width: 100%;
  }
  .menu {
    width: 100%;
  }
  .secondary {
    width: 20%;
  }
  .primary {
    width: 60%;
    order: 2;
  }
  .secondary-a {
    order: 1;
  }
  .secondary-b {
    order: 3;
  }
  .footer {
    order: 4;
    width: 100%;
    /* flex-grow: 1; */
    border-top: 1px solid lightgray;
  }
}

@media (min-width: 1024px) {
  .primary {
    width: calc(100% - 400px);
  }
  .secondary {
    width: 200px;
  }
}
```
