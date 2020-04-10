---
title: "[CSS] flex로 holy grail layout 만들기"
date: 2020-04-11 00:04:61
category: development
---

어제 인프런에서 html, css 무료 강의를 하나 듣고 난 후에 좀 더 파봐야겠다는 생각이 들었다.

어찌되었든 뭔가를 만들자면 기본적인 것은 혼자 할 수 있어야 하니까.

그래서 [인프런의 CSS Flex와 Grid 제대로 익히기](https://www.inflearn.com/course/css-flex-grid-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%9D%B5%ED%9E%88%EA%B8%B0/)를 보기 시작했는데 아직 초반이지만 내용이 아주 마음에 든다.

강의에서 들었던 내용 일부를 정리해본다.

## 실습

holy grail layout이라는 유명한 형태인가보다.

대략 다음과 같은 모습이다.

![holy grail layout](https://drive.google.com/uc?export=view&id=11CGN3aHJ4bZ2m8Ta7nSt2vusKhI0Kohu)
(출처: <https://css-tricks.com/books/fundamental-css-tactics/holy-grail-layout-5-lines-css/>)

대부분 고정 사이즈 영역이고 Article 영역만 가변 영역이다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outline {
        border: 3px solid rgb(50,50,40);
      }
    </style>
  </head>
  <body>
    <div class="flex-container">
      <header class="flex-item">
        <h1>header</h1>
      </header>
      <section class="flex-item">
        <nav class="outline">
          <ul>
            <li>css</li>
            <li>flex</li>
            <li>grid</li>
          </ul>
        </nav>
        <main class="outline">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Praesentium, voluptatum ut totam cum quos quam! Impedit doloribus ea
            consequuntur assumenda adipisci, neque magni ipsum sequi
            perspiciatis ab sint architecto mollitia!
          </p>
        </main>
        <aside class="outline">ad</aside>
      </section>
      <footer class="flex-item">footer</footer>
    </div>
  </body>
</html>
```

이 정도만 html을 작성하고 시작한다.

가장 먼저 flex-container 영역에 flex를 적용하고 direction을 column으로 설정한다.

```css
.flex-container {
  display: flex;
  flex-direction: column;
}
```

그리고 section 영역의 nav, main, aside를 가로로 배치하기 위해 section에 다시 한번 flex를 적용한다.

```css
flex-container {
  display: flex;
  flex-direction: column;
}

section {
  display: flex;
}
```

section 영역의 nav, main, aside는 각 content의 크기 만큼 영역이 설정되어 있다.

nav와 aside를 적당한 크기로 고정시키자.

```css
.flex-container {
  display: flex;
  flex-direction: column;
}

section {
  display: flex;
}

section nav {
  width: 200px;
  flex-shrink: 0;
}

section aside {
  width: 200px;
  flex-shrink: 0;
}
```

고정시키기 위해 `width: 200px;`과 `flex-shrink: 0;`을 설정했다.

`flex-shrink: 0;`은 width가 200px 이하로 줄어들지 못하게 설정한다.

각 element에 border, padding 등을 추가한 후 flex-container에 `min-heigth: 100vh;`를 추가하여 화면 전체를 사용할 수 있도록 설정한다.

마지막으로 header, footer를 제외한 section 영역이 여백을 모두 활용할 수 있도록 `flex-grow: 1;`을 추가한다.

최종 코드는 다음과 같다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outline {
        padding: 10px;
      }

      .flex-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      header {
        border-bottom: 1px solid rgb(50, 50, 40);
      }

      section {
        display: flex;
        flex-grow: 1;
      }

      section nav {
        width: 200px;
        flex-shrink: 0;
        border-right: 1px solid rgb(50, 50, 40);
      }

      section aside {
        width: 200px;
        flex-shrink: 0;
        border-left: 1px solid rgb(50, 50, 40);
      }

      footer {
        border-top: 1px solid rgb(50, 50, 40);
        padding: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="flex-container">
      <header class="flex-item">
        <h1>header</h1>
      </header>
      <section class="flex-item">
        <nav class="outline">
          <ul>
            <li>css</li>
            <li>flex</li>
            <li>grid</li>
          </ul>
        </nav>
        <main class="outline">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Praesentium, voluptatum ut totam cum quos quam! Impedit doloribus ea
            consequuntur assumenda adipisci, neque magni ipsum sequi
            perspiciatis ab sint architecto mollitia!
          </p>
        </main>
        <aside class="outline">
          ad
        </aside>
      </section>
      <footer class="flex-item">footer</footer>
    </div>
  </body>
</html>
```

## 결론

flex로 간단한 layout을 잡는 것이 생각보다 어렵지 않다는 것을 느꼈다.

쫄지말고 차근차근 만들어보자.
