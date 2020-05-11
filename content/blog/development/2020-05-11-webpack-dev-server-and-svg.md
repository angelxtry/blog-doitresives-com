---
title: "CRA 없이 React + TypeScript + Webpack 프로젝트 만들기 #2"
date: 2020-05-11 12:05:24
category: development
---

지난 글에 이어서 추가 설정한 내용을 정리해보자.

git: <https://github.com/angelxtry/react-typescript-without-cra>

blog: [CRA 없이 React + TypeScript + Webpack 프로젝트 만들기](https://blog.doitreviews.com/development/2020-05-07-react-typescript-webpack/)

## 1. webpack-dev-server

로컬에서 webpack의 실행결과를 확인하기 위해 사용한다.

특이한 점은 결과물이 실제 파일로 보이지는 않는다.

설치한다.

```js
yarn add -D webpack-dev-server
```

package.json의 script를 수정한다.

```js
"scripts": {
  "start": "NODE_ENV=development webpack-dev-server --progress",
  "build": "NODE_ENV=production webpack --progress"
}
```

`--progress` 옵션은 터미널에서 webpack 빌드 진행상황을 확인할 수 있게 해준다.

테스트 해보고 정상동작하는 것을 확인했다.

## 2. svg 사용을 위한 webpack 설정

### 2-1. package 설치

```js
yarn add -D file-loader @svgr/webpack
```

file-loader

- 파일을 관리한다.
- output 경로로 파일을 복사하면서 파일명을 원하는 대로 수정할 수 있다.

@svgr/webpack

- svg 파일을 관리한다.

### 2-2. webpack 설정

webpack.config.js 파일에 설정을 추가한다.

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
      {
        test: /\.svg$/,
        use: [
          '@svgr/webpack',
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]?[hash]',
            },
          },
        ],
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

### 2-3. tsx 파일에서 svg 사용

```tsx
import React from 'react';
import bulbIconUrl, { ReactComponent as BulbIcon } from './images/ic-btn-emo-bulb.svg';
import loveIconUrl, { ReactComponent as LoveIcon } from './images/ic-btn-emo-love.svg';
import moonIconUrl, { ReactComponent as MoonIcon } from './images/ic-btn-emo-moon.svg';
import waterdropIconUrl, { ReactComponent as WaterdropIcon } from './images/ic-btn-emo-waterdrop.svg';

export default function App() {
  return (
    <div>
      React + TypeScript + Webpack!
      <div>
        <img src={bulbIconUrl} alt="Bulb Icon" />
      </div>
      <BulbIcon />
      <div>
        <img src={loveIconUrl} alt="Love Icon" />
      </div>
      <LoveIcon />
      <div>
        <img src={moonIconUrl} alt="Moon Icon" />
      </div>
      <MoonIcon />
      <div>
        <img src={waterdropIconUrl} alt="Waterdrop Icon" />
      </div>
      <WaterdropIcon />
    </div>
  );
}
```

svg를 4개 import 했다.

`bulbIconUrl`은 img 태그로 사용할 수 있다.

BulbIcon은 React component 처럼 사용할 수 있다.

이렇게 import하기 위해서는 다음의 파일을 하나 더 추가해야 한다.

src/types/custom.d.ts

```ts
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
```

## 느낀 점, 배운 점

당분간은 svg를 사용할 때 크게 방황하지 않고 바로 적용할 수 있을 것 같다.

webpack은 신기한 기능이 많이 붙어 있는 참 재미있는 도구네 ㅋㅋ.
