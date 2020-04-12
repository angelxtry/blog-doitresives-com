---
title: "[CSS] flex로 반응형 카드 레이아웃 만들기"
date: 2020-04-11 00:04:66
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

동일한 크기의 카드가 반복되는 반응형 레이아웃을 만들어보자.

다음과 같이 row가 출력되도록 해보자.

```ts
width 0 ~ 599: 1 row
width 600 ~ 899: 2 row
width 900 ~ : 3 row
```

## 기본 html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .flex-item {
        border: 1px solid salmon;
      }
    </style>
  </head>
  <body>
    <div class="flex-container">
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        eius.
      </div>
      <div class="flex-item">Lorem ipsum dolor sit amet.</div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
        temporibus?
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        eius.
      </div>
      <div class="flex-item">Lorem ipsum dolor sit amet.</div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
        temporibus?
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        eius.
      </div>
      <div class="flex-item">Lorem ipsum dolor sit amet.</div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
        temporibus?
      </div>
      <div class="flex-item">Lorem, ipsum.</div>
    </div>
  </body>
</html>
```

여기서 시작한다.

일단 flex를 적용하자.

```css
.flex-container {
  display: flex;
  flex-direction: column;
}
.flex-item {
  border: 1px solid salmon;
}
```

`display: flex;`만 적용하면 모든 컬럼이 inline element 처럼 붙어서 출력되고,  `flex-direction: column;`을 적용하면 다시 최초 모습과 동일해진다.

element들이 화면 전체를 가득 채우도록 하기 위해 다음과 같이 설정한다.

```css
.flex-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.flex-item {
  border: 1px solid salmon;
  flex-grow: 1;
}
```

화면 높이를 고정하는 것이 싫다면 min-heigth를 빼고 flex-item에 height를 지정하자.

브라우저 크기에 반응하도록 media를 추가한다.

```css
.flex-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.flex-item {
  border: 1px solid salmon;
  flex-grow: 1;
}
@media (min-width: 600px) {
  .flex-container {
    flex-direction: row;
  }
}
```

폭이 600px을 넘는 순간 flex-direction이 row로 변경되어 모든 element가 inline처럼 출력된다.

row를 2개만 출력되도록 하기 위해 width를 설정한다.

```css
div {
  box-sizing: border-box;
}
.flex-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.flex-item {
  border: 1px solid salmon;
  flex-grow: 1;
}
@media (min-width: 600px) {
  .flex-container {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .flex-item {
    flex-basis: 50%;
  }
}
```

여기서 주의할 점은 flex-direction을 row로 변경하면서 `flex-wrap: wrap;` 속성을 추가한 것과 `box-sizing: border-box;`를 추가한 것이다.

wrap은 element들이 표시될 공간이 부족하면 다음 줄에 출력되도록 설정한다.

`box-sizing`은 용도를 잘 모르겠다. box의 크기를 설정하는 것일텐데 왜 row의 갯수에 영향을 주는지 잘 모르겠다. 원인을 찾아보자.

width가 900 이상일 때도 처리한다.

```css
div {
  box-sizing: border-box;
}
.flex-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.flex-item {
  border: 1px solid salmon;
  flex-grow: 1;
}
@media (min-width: 600px) {
  .flex-container {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .flex-item {
    flex-basis: 50%;
  }
}
@media (min-width: 900px) {
  .flex-item {
    flex-basis: 30%;
  }
}
```

전체 코드는 다음과 같다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      div {
        box-sizing: border-box;
      }
      .flex-container {
        display: flex;
        flex-direction: column;
      }
      .flex-item {
        border: 1px solid salmon;
        flex-grow: 1;
        height: 200px;
      }
      @media (min-width: 600px) {
        .flex-container {
          flex-direction: row;
          flex-wrap: wrap;
        }
        .flex-item {
          flex-basis: 50%;
        }
      }
      @media (min-width: 900px) {
        .flex-item {
          flex-basis: 30%;
        }
      }
    </style>
  </head>
  <body>
    <div class="flex-container">
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        eius.
      </div>
      <div class="flex-item">Lorem ipsum dolor sit amet.</div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
        temporibus?
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        eius.
      </div>
      <div class="flex-item">Lorem ipsum dolor sit amet.</div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
        temporibus?
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        eius.
      </div>
      <div class="flex-item">Lorem ipsum dolor sit amet.</div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
        temporibus?
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        eius.
      </div>
      <div class="flex-item">Lorem ipsum dolor sit amet.</div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div class="flex-item">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
        temporibus?
      </div>
      <div class="flex-item">Lorem, ipsum.</div>
    </div>
  </body>
</html>
```
