---
title: "Babel, ESLint, Prettier + Webpack"
date: 2020-05-07 16:05:34
category: development
---

[인프런의 프론트앤드 개발환경의 이해와 실습](https://www.inflearn.com/course/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD/dashboard)을 듣고 일부 내용을 정리해본다

## 1. babel

babel을 설치하자.

```js
yarn add @babel/core @babel/cli
```

babel은 파싱, 변환, 출력 3단계를 거치는데 plugin이 변환 단계를 담당한다.

app.js 파일을 하나 생성한다.

```js
const alert = (msg) => window.alert(msg);
```

webpack 처럼 config 파일을 생성한다.

babel.config.js

```js
module.exports = {
  plugins: [
    '@babel/plugin-transform-block-scoped-functions',
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-strict-mode',
  ],
};
```

config 파일에 적용되는 plugins들은 모두 설치한다.

plugin 설치 후 다음의 command를 실행하면 결과가 출력된다.

```js
npx babel app.js
```

출력된 결과는 다음과 같다.

```js
"use strict";

const alert = function (msg) {
  return window.alert(msg);
};
```

### 1-1. preset

매번 plugin을 추가하고 설치하기 번거로우므로 프리셋을 사용한다.

[babel 공식 페이지](https://babeljs.io/docs/en/presets)에서 확인해 보면 공식 프리셋은 다음과 같다.

```js
@babel/preset-env
@babel/preset-flow
@babel/preset-react
@babel/preset-typescript
```

preset-env를 설치한다.

```js
yarn add -D @babel/preset-env
```

babel.config.js 파일을 수정한다.

```js
module.exports = {
  presets: [
    '@babel/preset-env',
  ],
};
```

### 1-2. targt browser

특정 브라우저를 지원하도록 설정할 수 있다.

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: 80,
        },
      },
    ],
  ],
};
```

chrome 80 버전을 지원하는 코드로 변환한다.

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: 80,
          ie: 11,
        },
      },
    ],
  ],
};
```

ie 11 버전도 지원하도록 변환한다.

### 1-3. 폴리필

babel은 변환할 수 없는 코드를 만나면 폴리필이라는 코드를 추가하여 처리한다.

먼저 app.js 파일을 다음과 같이 수정해보자.

```js
new Promise();
```

babel을 실행한다.

```js
npx babel app.js
```

결과는 다음과 같다.

```js
"use strict";

new Promise();
```

ie11은 Promise를 지원하지 않는다. 하지만 코드는 변환되지 않았다. 이 상태로 ie11에서 동작하면 오류가 발생한다.

babel은 ECMAScript2015+를 ECMAScript5 버전으로 변환할 수 있는 것만 변환한다. 변환할 수 없는 것들은 폴리필이라는 코드조각을 추가해서 해결한다.

babel.config.js를 수정하여 폴리필을 위해 corejs를 사용한다고 선언해보자.

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: 80,
          ie: 11,
        },
        useBuiltIns: 'usage',
        corejs: {
          version: 3,
        },
      },
    ],
  ],
};
```

다시 실행해보자.

```js
npx babel app.js
```

```js
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

new Promise();
```

두개의 모듈이 포함되었다.

### 1-4. 웹팩으로 통합

webpack의 loader 형태로 사용된다.

babel-loader를 설치한다.

```js
yarn add babel-loader
```

webpack.config.js 파일에 babel-loader 설정을 추가한다.

```js
module: {
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
  ],
},
```

실행하면 다음과 같은 오류 메시지가 발생한다.

```js
ERROR in ./app.js
Module not found: Error: Can't resolve 'core-js/modules/es6.object.to-string'
```

babel-loader를 webpack에 추가하면 bable.config.js 설정을 이용하여 babel을 실행한다.

이전에 Promise 폴리필을 위해 corejs를 사용하도록 설정했었다. corejs를 사용하기 위해 require가 2개 추가되었는데 그 부분에서 에러가 발생한다.

corejs 부터 설치하자.

```js
yarn add core-js
```

다시 webpack을 실행하면 정상 동작한다.

### 1-5. scss, sass

sass-loader와 node-sass를 설치한다.

```js
yarn add sass-loader node-sass
```

sass-loader는 webpack에서 사용할 loader다. node-sass는 sass 파일을 css 파일로 컴파일하기 위해 사용한다.

webpack.config.js 파일을 수정한다.

변경 전

```js
rules: [
  {
    test: /\.css$/,
    use: [
      process.env.NODE_ENV === "production"
        ? MiniCssExtractPlugin.loader // 프로덕션 환경
        : "style-loader", // 개발 환경
      "css-loader"
    ]
  },
],
```

변경 후

```js
rules: [
  {
    test: /\.(scss|css)$/,
    use: [
      process.env.NODE_ENV === 'production'
        ? MiniCssExtractPlugin.loader // 프로덕션 환경
        : 'style-loader', // 개발 환경
      'css-loader',
      'sass-loader',
    ],
  },
]
```

loader의 대상에 scss를 추가했고, loader에 sass-loader를 추가했다.

loader는 sass -> css -> style-loader 순으로 실행된다.

## 2. ESLint

eslint를 설치한다.

```js
yarn add eslint
```

app.js 다음과 같이 파일을 생성하자.

```js
console.log()
(function () {}) ()
```

오류가 있지만 발견하기 힘들수도 있는 코드다.

eslint 설정파일을 만들어서 rules을 추가해보자.

.eslintrc.js

```js
module.exports = {
  rules: {
    'no-unexpected-multiline': 'error',
  },
};
```

.eslintrc.js 파일을 저장하는 순간 vscode에서 app.js 파일에 오류가 있다는 것을 알려준다.

다음의 command를 실행해도 된다.

```js
npx eslint app.js
```

이런 rule들을 일일이 추가하는 것이 아니라 미리 정의된 rule set을 사용한다.

```js
module.exports = {
  extends: ['eslint:recommended'],
  // rules: {
  //   'no-unexpected-multiline': 'error',
  // },
};
```

eslint:recommended를 설정하면 <https://eslint.org/docs/rules/> 페이지에 check 된 항목들이 한 번에 추가된다.

다음의 command를 실행하면 몇 가지 질문들이 출력되고 응답에 맞게 .eslintrc.js 파일을 생성해준다.

```js
npx eslint --init
```

## 3. Prettier

설치한다.

```js
yarn add prettier eslint-config-prettier eslint-plugin-prettier
```

eslint-config-prettier는 prettier와 겹치는 eslint의 규칙을 비활성화한다.

```js
module.exports = {
  extends: ['eslint:recommended', 'eslint-config-prettier'],
};
```

eslint-plugin-prettier는 prettier의 규칙을 eslint의 규칙으로 적용한다.

즉, eslint만 실행하면 prettier도 같이 실행된다.

```js
module.exports = {
  extends: ['eslint:recommended', 'eslint-config-prettier'],
  plugins: ['prettier'],
  rules: { 'pretter/prettier': 'error' },
};
```

다음과 같이 설정할 수도 있다.

```js
module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
};
```

### 3-1. git hook

husky를 사용하여 git command 실행 시점에 lint와 prettier를 실행할 수 있다.

설치한다.

```js
yarn add -D husky
```

package.json 파일에 다음의 내용을 추가한다.

```json
"husky": {
  "hooks": {
    "pre-command": "eslint app.js --fix"
  }
}
```

이제 commit을 할 때마다 eslint가 실행될 것이다.

대상 파일이 많아지면 eslint를 실행하는데도 시간이 오래걸린다.

이럴 때를 위해 lint-staged를 이용하여 commit 시 변경된 파일만 lint로 검사를 할 수 있게 설정하자.

```js
yarn add -D lint-staged
```

package.json 파일을 수정한다.

```json
"husky": {
  "hooks": {
    "pre-command": "lint-staged"
  }
},
"lint-staged": {
  "*.js": "eslint --fix"
}
```

### 3-2. vscode 설정에 추가

vscode에서 eslint를 설치하고 workspace 설정에 다음을 추가한다.

```json
{
  "editor.codeActionOnSave": {
    "source.fixAll.eslint": true
  }
}
```

위와 같이 설정하면 저장할 때 바로 수정된다.

## 느낀 점, 배운 것

webpack, babel은 어렵다라는 얘기를 많이 들었었고, 그래서 설정할 시도도 안해봤었는데 강의를 듣고 차근히 따라해보니 약간의 자신감이 생겼다. 강의를 통해 배운 것이 전부는 아니겠지만 훌륭한 발판이 되었다고 생각한다.

CRA를 사용하지 않고 React project를 만들어보고 싶다. 얼른 시도해보고 기록을 남기자.
