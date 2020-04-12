---
title: "[CSS] flex로 footer 고정 vs 움직임 처리"
date: 2020-04-11 01:04:37
category: development
---

[인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보고 작성한 글입니다.

2가지 유형을 만들텐데, 차이점은 footer가 고정인가, 움직이는가 차이다.

```html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      header {
        border-bottom: 1px solid salmon;
      }

      footer {
        border-top: 1px solid salmon;
      }
    </style>
  </head>
  <body>
    <div class="flex-container">
      <header class="flex-item">
        <h1>Header</h1>
      </header>
      <section class="flex-item">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero quis,
          atque nostrum nam corrupti ipsum asperiores. Assumenda, eos magnam
          laboriosam officia sed nulla consequatur eveniet nihil. Tempora nisi
          eaque impedit!
        </p>
      </section>
      <footer class="flex-item">
        <h3>Footer</h3>
      </footer>
    </div>
  </body>
</html>
```

여기서 부터 시작한다.

## section이 길어지면 footer가 움직임

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .flex-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      header {
        border-bottom: 1px solid salmon;
      }

      section {
        flex-grow: 1;
      }

      footer {
        border-top: 1px solid salmon;
      }
    </style>
  </head>
  <body>
    <div class="flex-container">
      <header class="flex-item">
        <h1>Header</h1>
      </header>
      <section class="flex-item">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero quis,
          atque nostrum nam corrupti ipsum asperiores. Assumenda, eos magnam
          laboriosam officia sed nulla consequatur eveniet nihil. Tempora nisi
          eaque impedit!
        </p>
      </section>
      <footer class="flex-item">
        <h3>Footer</h3>
      </footer>
    </div>
  </body>
</html>
```

딱 여기까지만 구현하면 section 영역이 아무리 길어져도 footer는 항상 최하단에 위치한다.

## section이 길어져도 footer의 위치는 고정

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .flex-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      header {
        border-bottom: 1px solid salmon;
      }

      section {
        overflow: auto;
        flex-grow: 1;
      }

      footer {
        border-top: 1px solid salmon;
      }
    </style>
  </head>
  <body>
    <div class="flex-container">
      <header class="flex-item">
        <h1>Header</h1>
      </header>
      <section class="flex-item">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero quis,
          atque nostrum nam corrupti ipsum asperiores. Assumenda, eos magnam
          laboriosam officia sed nulla consequatur eveniet nihil. Tempora nisi
          eaque impedit!
        </p>
      </section>
      <footer class="flex-item">
        <h3>Footer</h3>
      </footer>
    </div>
  </body>
</html>
```

이렇게 작성하면 header, footer가 고정되고 section을 스크롤 할 때 header와 footer 안쪽으로 글자가 들어가는 것 처럼 보이게 된다.

차이는 min-height를 height로 변경한 것과 section에 `overflow: auto;`를 적용한 것인다.
