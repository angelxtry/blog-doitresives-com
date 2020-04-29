---
title: "[Webpack] Webpack에 대해 간단히 정리해보자."
date: 2020-04-28 21:04:36
category: development
---

## intro

Webpack. 당장은 급하지 않을 것 같아 미뤄두었는데 깔끔하게 한번 정리할 필요가 있다고 생각했다.

생활코딩 자료를 빨리 한번 정리하고 인프런의 강의를 보려고 한다.

아래 내용은 [생활코딩의 Webpack](https://www.opentutorials.org/module/4566) 내용을 정리한 것이다.

## 1. 모듈의 필요성

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="./source/hello.js"></script>
  <script src="./source/world.js"></script>
</head>
<body>
  <h1>Hello, Webpack</h1>
  <div id="root"></div>
  <script>
    document.querySelector('#root').innerHTML = word;
  </script>
</body>
</html>
```

```js
// source/hello.js
const word = 'Hello';
```

```js
// source/world.js
const word = 'World';
```

간단하게 웹 서버를 실행하기 위해 local-web-server package를 설치하고 실행한다.

```js
npm install -g local-web-server
```

local-web-server를 실행하고 <http://127.0.0.1:8000/>에 접속하면 Hello만 출력된다.

console을 확인해보면 에러가 발생한 것을 확인할 수 있다.

word가 두 js 파일에 모두 정의되어 있어서 문제가 발생했다.

이러한 문제점을 해결하기 위한 방안 중 하나가 모듈 시스템이다.

## 2. 모듈 적용

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, Webpack</h1>
  <div id="root"></div>
  <script type="module">
    import hello from './source/hello.js'
    import world from './source/world.js'
    document.querySelector('#root').innerHTML = hello + ' ' + world;
  </script>
</body>
</html>
```

```js
// source/hello.js
const word = 'Hello';

export default word;
```

```js
// source/world.js
const word = 'World';

export default word;
```

html 파일에서 script에 `type="module"`을 추가했다.

각 js 파일을 import 하고, js에서 파일에서는 export default를 추가했다.

import한 변수명으로 각 js 파일의 word를 사용할 수 있다.

chrome의 network 탭을 확인해보면 index.html 파일과 두 js 파일을 모두 다운받은 것을 확인할 수 있다.

이 방식의 단점은 import라는 문법이 최신 브라우저에서만 동작한다.

그리고 개별 파일이 많아질 경우 여러가지 부하가 높아질 수 있다.

## 3. webpack 적용

webpack, webpack-cli를 설치한다.

```js
yarn add -D webpack webpack-cli
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, Webpack</h1>
  <div id="root"></div>
</body>
</html>
```

```js
// source/hello.js
const word = 'Hello';

export default word;
```

```js
// source/world.js
const word = 'World';

export default word;
```

```js
// source/index.js
import hello from './hello.js';
import world from './world.js';
document.querySelector('#root').innerHTML = hello + ' ' + world;
```

index.js 파일이 js 파일들의 시작점, 즉 entry file이 된다.

다음의 command를 입력해보자.

```js
npx webpack --entry ./source/index.js --output ./public/index_bundle.js
```

에러가 없다면 public 폴더에 index_bundle.js 파일이 생성되었을 것이다.

html 파일에 생성된 index_bundle.js 파일을 추가한다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, Webpack</h1>
  <div id="root"></div>
  <script src="./public/index_bundle.js"></script>
</body>
</html>
```

웹 서버를 통해 html 파일을 다시 확인해보면 정상 동작하는 것을 확인할 수 있다.

index_bundle.js 파일을 만들면서 구형 브라우저도 지원가능하고 js 파일도 하나로 합칠 수 있었다.

## 4. webpack config

```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './source/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index_bundle.js',
  },
};
```

`webpack.config.js` 파일을 생성했다. 다음과 같이 입력하면 실행된다.

```js
npx webpack --config webpack.config.js
```

설정 파일명을 webpack.config.js 라고 명명했다면 `npx webpack` 만 실행해도 동작한다.

## 5. webpack mode

webpack은 development, production, none mode가 있다.

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './source/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index_bundle.js',
  },
};
```

development mode로 실행하면 output 파일에 format이 추가된다.

webpack.config.prod.js 파일명으로 production용 설정 파일을 하나 더 만들어두기도 한다.

## 6. webpack loader

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="./source/style.css">
</head>
<body>
  <h1>Hello, Webpack</h1>
  <div id="root"></div>
  <script src="./public/index_bundle.js"></script>
</body>
</html>
```

css 파일을 추가했다.

```css
body {
  background-color: lightblue;
  color: tomato;
}
```

css 파일을 기존 js 파일처럼 하나로 합쳐보자.

먼저 package를 설치한다.

```js
yarn add -D style-loader css-loader
```

webpack.config.js 파일을 수정한다.

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './source/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index_bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader'],
      },
    ],
  },
};
```

index.js 파일에 css를 import 한다.

```js
// source/index.js
import hello from './hello.js';
import world from './world.js';
import css from './style.css'

document.querySelector('#root').innerHTML = hello + ' ' + world;
```

webpack을 실행하면 css 파일이 index_bundler.js 파일에 합쳐진다.

이 상태로 브라우저에서 index.html을 확인하면 아직 css가 적용되지 않았다.

html에 css를 적용하기 위해서는 `style-loader`가 필요하다.

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './source/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index_bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

다시 webpack을 실행하고 브라우저에서 확인해보면 css가 적용된 것을 확인할 수 있다.

network 탭을 보면 css 파일 까지 하나로 통합되었기 때문에 html, index_bundler.js 파일만 다운받는다.

elements 탭을 보면 css의 내용이 style tag로 추가되어 있는 것도 확인 가능하다.

use에 나열된 loader들은 우측에서 좌측 순서로 실행된다.

그래서 style-loader와 css-loader의 순서가 바뀌면 에러가 발생한다.

## 7. webpack output

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, Index</h1>
  <div id="root"></div>
  <a href="./about.html">about</a>
  <script src="./public/index_bundle.js"></script>
</body>
</html>
```

about.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, About</h1>
  <div id="root"></div>
  <a href="./index.html">index</a>
  <script src="./public/about_bundle.js"></script>
</body>
</html>
```

두 html 파일은 로드하는 script 파일명이 다르다.

이런 경우 webpack을 이용하여 처리하는 방법을 확인해보자.

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './source/index.js',
    about: './source/about.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]_bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

entry를 object로 변경하여 각 entry file을 명시한다.

그리고 output에서 filename을 지정한다.

`[name]`은 예약어다. entry의 key가 입력된다.

webpack을 실행하면 public 폴더에 다음의 두 파일이 생성된다.

```js
index_bundle.js
about_bundle.js
```

## 8. webpack plugin

loader가 webpack의 입력을 관리한다면 plugin은 webpack의 출력을 관리한다고 할 수 있다.

먼저 plugin package를 하나 설치하자.

```js
yarn add -D html-webpack-plugin
```

webpack.config.js 파일을 다음과 같이 수정한다.

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './source/index.js',
    about: './source/about.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]_bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
```

webpack을 실행하면 public 폴더에 자동으로 index.html 파일이 생성된다.

index.html을 확인해보면 bundle.js 파일 2개가 포함된 것을 확인할 수 있다.

html 파일들을 source로 이동하고 bundler.js를 로드하는 코드를 삭제한다.

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, Index</h1>
  <div id="root"></div>
  <a href="./about.html">about</a>
</body>
</html>
```

about.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, About</h1>
  <div id="root"></div>
  <a href="./index.html">index</a>
</body>
</html>
```

이 파일들을 기반으로 html 파일을 자동으로 생성해보자.

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './source/index.js',
    about: './source/about.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]_bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './source/index.html',
      filename: 'index.html',
    }),
  ],
};
```

html-webpack-plugin에 생성자를 전달한다.

template은 로드할 파일, 즉 기반이 되는 파일이다. filename은 결과물이다.

이 상태에서 webpack을 실행하면 public/index.html이 다시 생성되고, html 파일을 확인해보면 source/index.html에 bundle.js 파일 2개가 모두 포함된 것을 확인할 수 있다.

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './source/index.js',
    about: './source/about.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]_bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './source/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
  ],
};
```

chunks라는 프로퍼티를 이용하여 entry의 index를 추가한 후 다시 webpack을 실행하면 public/index.html에 index_bundle.js 파일 하나만 포함된다.

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './source/index.js',
    about: './source/about.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]_bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './source/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: './source/about.html',
      filename: 'about.html',
      chunks: ['about']
    }),
  ],
};
```

동일하게 about도 처리할 수 있다.

## 느낀 점, 배운 것

Webpack을 어떻게 사용해야하는지 간단한 사용법을 확인할 수 있었다.

아직 미숙하지만 webpack.config.js 파일을 이해할 수 있게 됐다.

module, plugin의 의미는 알게 되었다.

이제 인프런 강의로 넘어가보자.
