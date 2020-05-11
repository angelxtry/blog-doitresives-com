---
title: "CRA 없이 React + TypeScript + Webpack 프로젝트 만들기 #1"
date: 2020-05-08 01:05:62
category: development
---

그동안 계속 CRA으로 프로젝트를 만들어서 진행했었는데 CRA없이 프로젝트를 진행해보고 싶었다.

그래서 webpack에 대해 공부를 진행했고 React + TypeScript + Webpack 구성으로 기본 코드를 작성해봤다.

<https://github.com/angelxtry/react-typescript-without-cra>

## 1. 폴더 생성 + 기본 설정

```js
mkdir react-typescript-webpack
cd react-typescript-webpack

yarn init -y

yarn add react react-dom

yarn add -D typescript ts-loader webpack webpack-cli @types/react @types/react-dom @types/webpack
```

기본적인 package를 설치했다.

package.json 파일에 script를 추가한다.

```json
{
  "name": "react-typescript-webpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  },
  "devDependencies": {
    "@types/react": "^16.9.34",
    "@types/react-dom": "^16.9.7",
    "@types/webpack": "^4.41.12",
    "ts-loader": "^7.0.3",
    "typescript": "^3.8.3",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11"
  },
  "scripts": {
    "build": "webpack"
  }
}
```

tsconfig.json 파일을 생성한다.

```js
{
  "compilerOptions": {
    "outDir": "./dist",
    "target": "es5",
    "module": "esnext",
    "jsx": "react",
    "noImplicitAny": true,
    "allowSyntheticDefaultImports": true,
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
  },
  "include": [
    "src"
  ]
}
```

webpack.config.js 파일을 생성한다.

```js
const path = require('path');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    app: path.join(__dirname, 'src', 'index.tsx'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

src 폴더와 테스트를 위한 App.tsx, index.tsx, index.html 파일을 생성한다.

src/App.tsx

```tsx
import React from 'react';

export default function App() {
  return <div>React + TypeScript + Webpack!</div>;
}
```

src/index.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

src/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document <%= env %></title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

`yarn build` command를 실행하면 wabpack이 App.tsx와 index.tsx를 빌드하여 dist/app.js 파일을 생성한다.

## 2. html-webpack-plugin

아직 index.html 파일이 처리되지 않았다. index.html 파일을 처리하기 위해 `html-webpack-plugin`을 설치한다.

```js
yarn add -D html-webpack-plugin
```

webpack.config.js 파일에 html-webpack-plugin을 추가한다.

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    app: path.join(__dirname, 'src', 'index.tsx'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      templateParameters: {
        env: process.env.NODE_ENV === 'production' ? '' : '[DEV]',
      },
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
  ],
};
```

html-webpack-plugin의 역할은 다음과 같다.

- 빌드시 html에 값을 전달하여 html을 변경
- html 코드 압축(공백 제거, 주석 제거)
- webpack으로 빌드한 번들 파일을 자동으로 html에 추가

src/index.html 파일을 template으로 설정했다.

templateParameters로 html 파일에 env라는 변수를 전달한다. 이 변수에는 production 모드가 아닐 경우 DEV가 저장된다. env는 html의 title에 사용되었다.

minify 설정으로 공백이 제거되고 주석이 삭제된다.

이 상태로 webpack을 실행하면 dist/index.html 파일까지 함께 생성된다. 이 파일을 브라우저로 열어보면 React로 작성한 코드가 실행된 것을 확인할 수 있다.

해당 설정을 테스트해보기 위해 package.json의 script를 수정한다.

```json
"scripts": {
  "build": "webpack",
  "start": "NODE_ENV=production webpack --progress"
}
```

`yarn start`를 실행하면 webpack이 production 모드로 실행된다. `--progress`는 빌드 진척률을 보여준다.

## 3. clean-webpack-plugin

clean-webpack-plugin을 설치하고 실행하면 webpack을 실행할 때 마다 dist 폴더의 모든 항목을 삭제한다.

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    app: path.join(__dirname, 'src', 'index.tsx'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      templateParameters: {
        env: process.env.NODE_ENV === 'production' ? '' : '[DEV]',
      },
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
    new CleanWebpackPlugin(),
  ],
};
```

## 느낀 점, 배운 점

아직 많이 부족한 상태지만 앞으로 하나하나 익혀가면서 기능을 추가해가려고 한다.

CRA 없이 프로젝트를 만들 수 있을 것 같은 자신감이 생겼다.

다음에는 이 프로젝트를 사용해 svg 파일 추가를 해보자.

## 참고

[프론트엔드 개발환경의 이해: 웹팩(기본)](https://jeonghwan-kim.github.io/series/2019/12/10/frontend-dev-env-webpack-basic.html)

[리액트, 타입스크립트 시작하기](https://jeonghwan-kim.github.io/dev/2019/06/25/react-ts.html)

[React + Typescript + Webpack](https://dev.to/jacopobonta/react-typescript-webpack-3c6l)
