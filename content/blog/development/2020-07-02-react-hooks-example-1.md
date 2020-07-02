---
title: "React Hooks Example #1"
date: 2020-07-03 01:07:35
category: development
---

hook들을 한번씩 사용해보자.

## project 설정

```cmd
mkdir hooks-sample
cd hooks-sample
yarn init -y
yarn add react react-dom
yarn add -D @babel/core @babel/plugin-proposal-class-properties @babel/preset-env @babel/preset-react @emotion/babel-preset-css-prop babel-eslint babel-plugin-jsx-pragmatic babel-plugin-transform-class-properties babel-plugin-transform-inline-environment-variables eslint eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks parcel-bundler prettier
```

.eslintrc.json 파일을 추가한다.

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
    "prettier/react"
  ],
  "rules": {
    "react/prop-types": 0,
    "no-console": 1,
    "react-hooks/rules-of-hooks": 2,
    "react-hooks/exhaustive-deps": 1
  },
  "plugins": ["react", "import", "jsx-a11y", "react-hooks"],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

.prettierrc 파일을 추가한다.

```json
{}
```

빈 객체는 default 설정을 따른다는 의미가 된다.

.babelrc 파일을 추가한다.

```json
{
  "presets": ["@babel/preset-react", "@babel/preset-env"],
  "plugins": [["transform-class-properties", { "spec": true }]]
}
```

package.json에 scripts를 추가한다.

```json
"scripts": {
  "dev": "parcel src/index.html"
},
```

src/index.html 파일을 추가한다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hooks in depth</title>
  </head>
  <body>
    <div id="root">not rendered</div>
    <script src="App.js"></script>
  </body>
</html>
```

src/App.js

```js
import React from "react";
import { render } from "react-dom";
import State from "./State";

const App = () => {
  return (
    <>
      <h1>Hooks Example</h1>
      <State />
      <hr />
    </>
  );
};

render(<App />, document.getElementById("root"));
```

hook sample이 추가될 때마다 App.js에 추가하자.

## useState

생략

## useEffect

src/Effect.js

```jsx
import React, { useState, useEffect } from "react";

const Effect = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setTimeout(() => setTime(new Date()), 1000);
    return () => clearTimeout(timer);
  });

  return (
    <>
      <h1>useEffect Example {time.toLocaleTimeString()}</h1>
    </>
  );
};

export default Effect;
```

useEffect의 return이 있을 때와 없을 때가 어떻게 다른지 확인해보고 싶다.

## useContext

```jsx
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

const LevelFive = () => {
  const [user, setUser] = useContext(UserContext);

  return (
    <div>
      <h5>{`${user.firstName} ${user.lastName} ${user.suffix}`}</h5>
      <button
        type="button"
        onClick={() => {
          const suffix = user.suffix + 1;
          setUser({ ...user, suffix });
        }}
      >
        Increment
      </button>
    </div>
  );
};

const LevelFour = () => {
  return (
    <div>
      <h3>Fourth level</h3>
      <LevelFive />
    </div>
  );
};

const LevelThree = () => {
  return (
    <div>
      <h3>Third level</h3>
      <LevelFour />
    </div>
  );
};

const LevelTwo = () => {
  return (
    <div>
      <h2>Second level</h2>
      <LevelThree />
    </div>
  );
};

const Context = () => {
  const userState = useState({
    firstName: "SUHO",
    lastName: "LEE",
    suffix: 1,
    email: "ABC@gmail.com",
  });
  return (
    <UserContext.Provider value={userState}>
      <h1>useContextExample - First level</h1>
      <LevelTwo />
    </UserContext.Provider>
  );
};

export default Context;
```

createContext를 이용하여 UserContextt를 생성하고 Provider를 이용하여 userState를 전달한다.

Provider에 전달된 state는 하위 어느 component에서도 useContext를 이용하여 사용할 수 있다.

## useRef

```jsx
import React, { useRef, useState } from "react";

const Ref = () => {
  const [stateNumber, setStateNumber] = useState(0);
  const numRef = useRef(0);

  function incrementAndDelayLogging() {
    setStateNumber(stateNumber + 1);
    numRef.current += 1;
    setTimeout(
      () => alert(`state: ${stateNumber} | ref: ${numRef.current}`),
      1000
    );
  }
  return (
    <>
      <h1>useRef Example</h1>
      <button type="button" onClick={() => incrementAndDelayLogging()}>
        delay logging
      </button>
      <h4>state: {stateNumber}</h4>
      <h4>ref: {numRef.current}</h4>
    </>
  );
};

export default Ref;
```

useState, useRef를 사용하여 각각 숫자를 표현하기 위한 변수를 만들었다.

버튼을 클릭하면 브라우저에 표시되는 각 숫자는 즉각 증가하는 것 처럼 보이지만 alert에 표시되는 숫자는 useRef만 즉각 변경되고, useState는 변경되지 않는다.

변경되지 않는다기 보다 event loop를 경유하여 실행되기 때문에 딜레이가 발생하는 것으로 추측된다.

따라서 비동기가 필요하지 않는 단순 counting에는 useState보다 useRef를 사용하는 것이 더 낫다.

버튼을 2번 연속으로 클릭하면 alert이 두 번 실행되고 useState는 단계적으로 1씩 증가한다.

useRef는 alert 창이 처음 실행될 때 이미 최종값으로 설정되어 있다.

## useReducer

```jsx
import React, { useReducer } from "react";

const limitRGB = (num) => (num < 0 ? 0 : num > 255 ? 255 : num);
const step = 50;

const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT_R":
      return Object.assign({}, state, { r: limitRGB(state.r + step) });
    case "DECREMENT_R":
      return Object.assign({}, state, { r: limitRGB(state.r - step) });
    case "INCREMENT_G":
      return Object.assign({}, state, { g: limitRGB(state.g + step) });
    case "DECREMENT_G":
      return Object.assign({}, state, { g: limitRGB(state.g - step) });
    case "INCREMENT_B":
      return Object.assign({}, state, { b: limitRGB(state.b + step) });
    case "DECREMENT_B":
      return { ...state, b: limitRGB(state.b - step) };
    default:
      return state;
  }
};

const Reducer = () => {
  const [{ r, g, b }, dispatch] = useReducer(reducer, { r: 0, g: 0, b: 0 });

  return (
    <>
      <h1 style={{ color: `rgb(${r}, ${g}, ${b})` }}>useReducer Example</h1>
      <div>
        <span>r</span>
        <button type="button" onClick={() => dispatch({ type: "INCREMENT_R" })}>
          +
        </button>
        <button type="button" onClick={() => dispatch({ type: "DECREMENT_R" })}>
          -
        </button>
      </div>
      <div>
        <span>g</span>
        <button type="button" onClick={() => dispatch({ type: "INCREMENT_G" })}>
          +
        </button>
        <button type="button" onClick={() => dispatch({ type: "DECREMENT_G" })}>
          -
        </button>
      </div>
      <div>
        <span>b</span>
        <button type="button" onClick={() => dispatch({ type: "INCREMENT_B" })}>
          +
        </button>
        <button type="button" onClick={() => dispatch({ type: "DECREMENT_B" })}>
          -
        </button>
      </div>
    </>
  );
};

export default Reducer;
```

useReducer는 reducer와 초기값을 인자로 받고 결과값과 dispatch를 반환한다.

reducer는 action에 따라 동작이 미리 정의되어 있다.

dispatch를 통해 reducer에 action을 전달하고 reducer는 action에 따라 동작한다.

## useMemo

```jsx
import React, { useState, useMemo } from "react";

const fibonacci = (n) => {
  if (n < 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const Memo = () => {
  const [num, setNum] = useState(1);
  const fib = useMemo(() => fibonacci(num), [num]);
  return (
    <div>
      <h1>useMemo Example</h1>
      <h2>
        fibonacci of {num} is {fib}
      </h2>
      <button type="button" onClick={() => setNum(num + 1)}>
        +
      </button>
    </div>
  );
};

export default Memo;
```

useMemo의 첫 번째 인자는 연산을 실행할 함수, 두 번째 인자는 dependency다.

useMemo는 dependency에 정의된 num에 따른 fibonacci의 결과를 저장해둔다. 동일한 num의 결과를 요청받을 경우 fibonacci를 재계산하지 않고 저장된 값을 돌려준다.

## useCallback, React.memo

```jsx
import React, { memo, useState, useEffect, useCallback } from "react";

const ExpensiveComputationComponent = memo(function ecc({ compute, count }) {
  return (
    <div>
      <h1>computed: {compute(count)}</h1>
      <h4>Last re-render {new Date().toLocaleTimeString()}</h4>
    </div>
  );
});

// const ExpensiveComputationComponent = ({ compute, count }) => {
//   return (
//     <div>
//       <h1>computed: {compute(count)}</h1>
//       <h4>Last re-render {new Date().toLocaleTimeString()}</h4>
//     </div>
//   );
// };

const Callback = () => {
  const [time, setTime] = useState(new Date());
  const [count, setCount] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setTime(new Date()), 1000);
    return () => clearTimeout(timer);
  });

  const fibonacci = (n) => {
    if (n < 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };

  return (
    <div>
      <h1>useCallback Example {time.toLocaleTimeString()}</h1>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        current count: {count}
      </button>
      <ExpensiveComputationComponent
        compute={useCallback(fibonacci, [])}
        // compute={fibonacci}
        count={count}
      />
    </div>
  );
};

export default Callback;
```

이 component는 h1에서 1초마다 시간을 출력하면서 계속 렌더링이 되고 있다.

버튼을 클릭하면 ExpensiveComputationComponent가 호출되면서 fibonacci의 결과와 버튼을 클릭한 시간을 출력한다. 버튼을 클릭한 시간을 값으로 전달할 수도 있겠지만 new Date를 호출하여 렌더링한다.

ExpensiveComputationComponent component에 React.memo를 사용했다.

React.memo는 첫 번째 인자로 component를 받는다. component의 렌더링되는 결과가 자체를 저장한다. ExpensiveComputationComponent의 첫 번째 인자는 함수인데 결국 해당 함수가 실행된 결과가 저장된다.

현재는 ecc라고 이름을 붙여놨는데, arrow function을 사용하여 익명함수를 만들면 eslint에서 함수명을 적으라고 warning을 표시한다. 물론 동작에는 문제가 없다.

React.memo 덕에 h1이 1초마다 렌더링되어도 ExpensiveComputationComponent에서 출력하는 시간은 버튼을 클릭한 시간으로 고정되어 있다.

ExpensiveComputationComponent에 fibonacci 함수를 전달할 때 useCallback을 사용했다.

useCallback은 함수 자체를 저장한다. useCallback을 사용하지 않으면 fibonacci의 참조값이 계속 변경되어 memo가 소용없게 된다.

## useLayoutEffect

```jsx
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";

const LayoutEffect = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const el = useRef();

  useLayoutEffect(() => {
    setWidth(el.current.clientWidth);
    setHeight(el.current.clientHeight);
  });

  // useEffect(() => {
  //   setWidth(el.current.clientWidth);
  //   setHeight(el.current.clientHeight);
  // });

  return (
    <div>
      <h1>useLayoutEffect Example</h1>
      <h2>textarea width: {width}px</h2>
      <h2>textarea height: {height}px</h2>
      <textarea
        onClick={() => {
          setWidth(0);
        }}
        ref={el}
      />
    </div>
  );
};

export default LayoutEffect;
```

textarea의 크기를 변경하면 화면에 width, height가 출력된다.

useEffect와 useLayoutEffect는 매우 유사하다. useLayoutEffect 대신 useEffect를 사용해도 동작한다. 단, 화면의 깜빡임이 더 생긴다.

useEffect: This runs asynchronously after rendered elements are printed on the screen.

useLayoutEffect: This runs synchronously after the render but before elements are printed on the screen.

이런 차이점이 있다고 한다.

출처: <https://medium.com/@pubudu2013101/what-is-the-real-difference-between-react-useeffect-and-uselayouteffect-51723096dc19>

대부분의 경우 useEffect를 쓰지만 UI가 깜빡거리는 것을 방지하기 위해 useLayoutEffect를 쓰는 경우도 있다고 한다. 단, useLayoutEffect는 비동기가 아니니까 주의.
