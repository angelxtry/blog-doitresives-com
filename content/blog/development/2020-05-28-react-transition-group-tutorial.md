---
title: React Transition Group 적용해보기
date: 2020-05-29 01:05:51
category: development
---

매끄러운 화면 전환을 위해 react transition group을 도입하려고 한다.

도입하기 전에 어떻게 사용하는지 확인해보자.

## 기본 코드 작성

먼저 간단한 navigation이 포함된 페이지를 만든다.

index.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
```

App.tsx

```tsx
import React from 'react';

const App = () => {
  return (
    <div className="App" />
  );
};

export default App;
```

Home, About 파일을 추가한다.

```tsx
import React from 'react';
import moonUrl from "./images/ic-btn-emo-moon.svg"

export default function Home() {
  return (
    <div className="page">
      <section>
        <img src={moonUrl} alt="home logo" className="logo" />
        <span>여기는 Home 이에요.</span>
      </section>
    </div>
  );
}
```

```tsx
import React from 'react';
import loveUrl from "./images/ic-btn-emo-love.svg"

export default function About() {
  return (
    <div className="page">
      <section>
        <img src={loveUrl} alt="about logo" className="logo" />
        <span>여기는 ABOUT 이구요.</span>
      </section>
    </div>
  );
}
```

app.tsx에 Home, About을 출력할 수 있도록하자.

```tsx
import React from 'react';
import { NavLink, BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="nav">
          <NavLink exact to="/" activeClassName="active">
            Home
          </NavLink>
          <NavLink exact to="/about" activeClassName="active">
            About
          </NavLink>
        </nav>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
```

NavLink는 해당 link를 선택했을 때 style을 변경할 수 있도록 className을 변경한다.

코드를 실행하면 다음과 같은 페이지가 실행된다.

![start code](https://drive.google.com/uc?export=view&id=1q1Dmr5f1s_TAmCoWEmmBu6ZfY3z7auhC)

## 스타일 추가

일단 보기 좋게 스타일을 추가한다.

```css
.body {
  padding: 0;
  border: 0;
}

.nav {
  width: 100%;
  height: 5em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
}

.nav a {
  text-decoration: none;
  display: block;
  padding: 20px;
  border: 1px solid #EDEDFA;
  margin: 0 10px;
  color: #9291AA;
}

.nav a.active {
  background-color: #2F2D51;
  color: white;
}

.page section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 5em);
}
```

css 파일을 import 한다.

```tsx
import React from 'react';
import { NavLink, BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="nav">
          <NavLink exact to="/" activeClassName="active">
            Home
          </NavLink>
          <NavLink exact to="/about" activeClassName="active">
            About
          </NavLink>
        </nav>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
```

스타일을 추가된 화면이다.

![add style](https://drive.google.com/uc?export=view&id=1PkxlbAZCeH3R09tOQrqSa8R2x-VDVE3C)

## React transition group 추가

nav의 link를 클릭하면 화면이 전환된다. 하지만 전환이 매끄럽지 않다.

화면 전환을 매끄럽게 하기 위해 react-transition-group을 사용한다.

화면 전환에 fade-in, fade-out 효과를 추가해보자.

```tsx
import React from 'react';
import { NavLink, BrowserRouter, Switch, Route } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Home from './Home';
import About from './About';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="nav">
          <NavLink exact to="/" activeClassName="active">
            Home
          </NavLink>
          <NavLink exact to="/about" activeClassName="active">
            About
          </NavLink>
        </nav>
        <Route
          render={({location}) => (
            <TransitionGroup>
              <CSSTransition key={location.key} timeout={300} classNames="fade">
                <Switch location={location}>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/about" component={About} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </BrowserRouter>
    </div>
  );
};

export default App;
```

CSSTransition에 key, timeout, classNmaes를 설정한다.

key는 고유한 값으로, key가 변경될 때마다 transition이 실행된다.

timeout은 transition이 실행되는 시간이다.

classNames는 css에서 사용할 class의 이름이 된다.

이 상태에서 테스트를 진항하면서 html의 변화를 확인해보자.

실행하기 전에 html은 다음과 같다. 일부는 생략했다.

```html
<div class="page"><section>여기는 Home 이에요.</section></div>
```

About link를 클릭하면 about page의 class에 fade-enter, fade-enter-active가 추가되고 home page의 class에 fade-exit, fade-exit-active가 추가된다.

```html
<div class="page fade-enter fade-enter-active"><section> 여기는 ABOUT 이구요.</section></div>
<div class="page fade-exit fade-exit-active"><section>여기는 Home 이에요.</section></div>
```

timeout 시간이 지나면 home page는 사라지고 about page만 남는다. 그리고 class는 fade-enter-done으로 변경된다.

```html
<div class="page fade-enter-done"><section>여기는 ABOUT 이구요.</section></div>
```

```css
.body {
  padding: 0;
  border: 0;
}

.nav {
  width: 100%;
  height: 5em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
}

.nav a {
  text-decoration: none;
  display: block;
  padding: 20px;
  border: 1px solid #EDEDFA;
  margin: 10px;
  color: #9291AA;
}

.nav a.active {
  background-color: #2F2D51;
  color: white;
}

.page section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 5em);
}

.fade-appear,
.fade-enter {
  opacity: 0;
  z-index: 1;
}
.fade-appear-active,
.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms linear 150ms;
}

.fade-exit {
  opacity: 1;
}

.fade-exit.fade-exit-active {
  opacity: 0;
  transition: opacity 150ms linear;
}
```

css에 fade-로 시작하는 class를 이용하여 transition 관련 코드를 추가한다.

다시 link를 클릭하여 테스트 해보자. 실행 결과는 다음과 같다.

![transition-not-fade-out](https://drive.google.com/uc?export=view&id=1gheAdEonG_H7mDnK8yzkm_i23Ukwqpp7)

About link를 클릭하면 Home page의 fade-out 효과는 없고 About page의 fade-in 효과만 발생한다.

사실 fade-out 효과가 없는 것이 아니라 div가 추가되었기 때문에 기존에 있던 화면은 아래로 밀려서 출력된다.

timeout, App.css의 opacity, linear 값을 모두 늘려서 테스트해보자. 0을 2개씩 더 붙였다.

시간을 길게 늘린 후 link를 클릭하고 화면을 내려보면 사라지는 page가 하단에서 fade-out 되고 있는 것을 확인할 수 있다.

이 상황을 해결하기 위해 page의 위치를 고정한다.

```css
.body {
  padding: 0;
  border: 0;
}

.nav {
  width: 100%;
  height: 5em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
}

.nav a {
  text-decoration: none;
  display: block;
  padding: 20px;
  border: 1px solid #EDEDFA;
  margin: 10px;
  color: #9291AA;
}

.nav a.active {
  background-color: #2F2D51;
  color: white;
}

.page section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 5em);
}

.page {
  position: absolute;
  left: 0;
  right: 0;
}

.fade-appear,
.fade-enter {
  opacity: 0;
  z-index: 1;
}
.fade-appear-active,
.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 3000ms linear 1500ms;
}

.fade-exit {
  opacity: 1;
}

.fade-exit.fade-exit-active {
  opacity: 0;
  transition: opacity 1500ms linear;
}
```

이제 fade-out, fade-in이 정상적으로 동작한다.

![transition-good](https://drive.google.com/uc?export=view&id=1gR5AZs15wO8yhoDvUzA0pf-S20_yrO9w)

----

이론을 좀 더 공부해보자.

### CSSTransition

컴포넌트 하나에 transition을 추가할 수 있다.

### TransitionGroup

Router 또는 다수의 컴포넌트에 CSSTransition을 적용할 수 있다.

CSSTransition에 고유한 key를 전달하여 key가 변경될 때 마다 transition을 실행할 수 있다.

코드를 다시 한번 살펴보자.

```tsx
const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="nav">
          <NavLink exact to="/" activeClassName="active">
            Home
          </NavLink>
          <NavLink exact to="/about" activeClassName="active">
            About
          </NavLink>
        </nav>
        <Route
          render={({location}) => (
            <TransitionGroup>
              <CSSTransition key={location.key} timeout={300} classNames="fade">
                <Switch location={location}>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/about" component={About} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </BrowserRouter>
    </div>
  );
};
```

여기에서는 페이지가 전환될 때 transition을 적용하기 위해 location.key를 key로 전달했다.

location.key를 사용하기 위해 TransitionGroup을 Route로 감싸고 location을 인자로 전달한다.

location.key는 페이지가 전환될 때마다 계속 변경되는 값이다. 그렇기 때문에 같은 페이지를 다시 클릭해도 transition이 발생한다.

이럴 때는 location.pathname을 사용하기도 한다.

location을 인자로 전달하는 이유는 하나가 더 있다.

```tsx
<Switch location={location}>
```

Switch에 location을 인자로 전달해야만 fade-out, fade-in 페이지가 각각 분리될 수 있다.

## 느낀 것, 배운 것

이제 CSS 만 잘 하면 페이지 전환을 좀 더 매끄럽게 처리할 수 있을 것 같다. 얼른 적용해봐야지
