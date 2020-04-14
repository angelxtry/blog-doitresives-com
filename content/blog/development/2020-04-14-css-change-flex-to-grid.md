---
title: "[CSS] flex를 grid로 대체해보자"
date: 2020-04-14 11:04:90
category: development
---

## layout

지난 번에 만든 반응형 페이지의 layout을 flex에서 grid로 변경해보자.

먼저 media query를 모두 삭제하고 다시 작성한다.

```css
@media (min-width: 900px) {
  .page {
    display: grid;
    grid-template-columns: 20% 1fr 20%;
  }
}
```

display를 grid로 설정하고 컬럼의 폭을 설정한다.

1fr 3fr 1fr 같이 설정하면 grid는 content의 길이에 유연하게 반응하기 때문이 비율이 어그러질 가능성이 높다.

그래서 20% 1fr 20% 같이 설정하면 좀 더 엄격하게 비율이 유지된다.

컬럼 폭을 정의했으면 해당 item들이 놓일 위치를 정의한다.

```css
@media (min-width: 900px) {
  .page {
    display: grid;
    grid-template-columns: 20% 1fr 20%;
  }
  .header {
    grid-column: 1 / 4;
    grid-row: 1 / 2;
  }
  .menu {
    grid-column: 1 / 4;
    grid-row: 2 / 3;
  }
  .primary {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
  }
  .secondary-a {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }
  .secondary-b {
    grid-column: 3 / 4;
    grid-row: 3 / 4;
  }
  .footer {
    grid-column: 1 / 4;
    grid-row: 4 / 5;
  }
}
```

grid-column과 grid-row를 이용하여 배치한다.

여기까지만 진행해도 flex로 구성했던 layout과 유사하게 설정된다.

화면 폭이 1024 이상이 되었을 때 sidebar의 크기를 고정하기 위해 media query를 하나 더 추가한다.

```css
@media (min-width: 900px) {
  .page {
    display: grid;
    grid-template-columns: 20% 1fr 20%;
  }
  .header {
    grid-column: 1 / 4;
    grid-row: 1 / 2;
  }
  .menu {
    grid-column: 1 / 4;
    grid-row: 2 / 3;
  }
  .primary {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
  }
  .secondary-a {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }
  .secondary-b {
    grid-column: 3 / 4;
    grid-row: 3 / 4;
  }
  .footer {
    grid-column: 1 / 4;
    grid-row: 4 / 5;
  }
}

@media (min-width: 1024px) {
  .primary {
    grid-template-columns: 300px 1fr 300px;
  }
}
```

## main 영역의 card list

flex로 card list를 다음과 같이 구현했다.

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

폭이 600px 이하일 때는 card list를 한 줄로 출력한다. 이 부분은 flex나 grid 모두 신경쓸 부분이 없다.

폭이 600px 이상일 때 `flex-wrap: wrap;`을 이용하여 전체 폭을 넘는 card를 다음 줄로 이동시켰다.

grid를 활용하여 card-list를 작성해보자. UI가 동일하지는 않지만 grid를 사용하면 간단하게 card list UI를 만들 수 있다.

```css
/* card list */
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, auto));
  gap: 2%;
}
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
```

grid의 auto-fill 속성을 이용하면 media query를 사용하지 않아도 된다. minmax를 설정하여 최소 300px의 카드가 출력되고, 공간이 남으면 카드의 크기가 공간을 가득 채울 정도로 커진다.

1줄당 카드의 수량은 자동으로 계산된다.
