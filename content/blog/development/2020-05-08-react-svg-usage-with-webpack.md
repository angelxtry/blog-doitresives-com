---
title: "React에서 SVG 사용하기(with Webpack)"
date: 2020-05-08 23:05:96
category: development
---

SVG(Scalable Vector Graphics)

React에서 svg를 사용하는 방법을 찾아봤다.

지난 번 React + TypeScript + Webpack 프로젝트에서 시작한다.

git: <https://github.com/angelxtry/react-typescript-without-cra>

blog: [CRA 없이 React + TypeScript + Webpack 프로젝트 만들기](https://blog.doitreviews.com/development/2020-05-07-react-typescript-webpack/)

## SVG 특징

어떤 해상도에서도 대응 가능하다.

SVG의 파일 크기를 결정하는 요소는 복잡도다.

image와 동일하게 img 태그, background-image로 사용할 수 있다.

React component로 바로 적용할 수도 있다.

Webpack loader인 svgr을 이용하여 인라인으로 처리할 수도 있다.

## 1. img tag

src/images 폴더를 생성하고 ic-btn-emo-love.svg 파일을 images 폴더에 넣는다.

Webpack file-loader를 설치한다.

```js
yarn add -D file-loader
```

webpack.config.js 파일에 file-loader 설정을 추가한다.

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
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]?[hash]',
            }
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

src/App.tsx 파일을 수정한다.

```tsx
import React from 'react';
import IconLove from './images/ic-btn-emo-love.svg';

export default function App() {
  return (
    <div>
      React + TypeScript + Webpack!
      <div>
        <img src={IconLove} alt="Love Icon" />
      </div>
    </div>
  );
}
```

여기서 svg를 import하면 에러가 발생한다.

src/types/custom.d.ts 파일을 생성하여 다음의 내용을 추가한다.

<https://webpack.js.org/guides/typescript/#importing-other-assets>

```ts
declare module '*.svg' {
  const content: any;
  export default content;
}
```

package.json의 script를 확인하자.

```json
"scripts": {
  "start": "webpack --pregress",
  "build": "NODE_ENV=production webpack --progress"
}
```

`yarn start`를 실행한다.

dist 폴더를 확인해보면 다음과 같다.

```js
dist
├── app.js
├── images
│   └── ic-btn-emo-love.svg
└── index.html
```

index.html을 브라우저로 열어 확인해보면 dist/images/ic-btn-emo-love.svg 파일이 img tag로 포함되어 있다.

## 2. CSS background

src/images/ic-btn-emo-waterdrop.svg 파일을 추가한다.

src/App.css 파일을 생성한다.

```css
.icon-water-drop {
  width: 33px;
  height: 33px;
  background: no-repeat url('./images/ic-btn-emo-waterdrop.svg');
  background-size: 33px 33px;
}
```

src/App.tsx

```tsx
import React from 'react';
import './App.css';
import IconLove from './images/ic-btn-emo-love.svg';

export default function App() {
  return (
    <div>
      React + TypeScript + Webpack!
      <div>
        <img src={IconLove} alt="Love Icon" />
      </div>
      <div>
        <div className="icon-water-drop" />
      </div>
    </div>
  );
}
```

css-loader, style-loader를 설치한다.

```js
yarn add -D css-loader style-loader
```

webpack.config.js 파일을 수정한다.

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
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]?[hash]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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

`yarn start`를 실행한 후 dist/index.html 파일을 확인한다.

dist/images 폴더에 ic-btn-emo-waterdrop.svg 파일이 복사되어 있다.

## 3. SVG tag

src/IconMoonComponent.tsx 파일을 생성한다.

src/images/ic-btn-emo-moon.svg 파일의 내용을 복사하여 그대로 저장한다.

```tsx
import React from 'react';

export default function IconLoveComponent() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="33"
      viewBox="0 0 33 33"
    >
      <g fill="none">
        <path
          fill="#000"
          d="M16.312 27.948h-.12c-3.325-.025-6.5-1.388-8.808-3.78-4.39-4.694-4.524-11.946-.312-16.8 1.31-1.468 2.957-2.597 4.8-3.288.439-.169.936-.066 1.272.264.31.316.42.778.288 1.2-1.343 3.677-.435 7.8 2.328 10.572 2.788 2.754 6.91 3.66 10.596 2.328.439-.154.927-.041 1.254.29.326.332.431.822.27 1.258-.613 1.637-1.57 3.122-2.808 4.356-2.325 2.318-5.477 3.613-8.76 3.6z"
          transform="translate(.6 .6)"
        />
      </g>
    </svg>
  );
}
```

src/App.js에 추가한다.

```tsx
import React from 'react';
import './App.css';
import IconLove from './images/ic-btn-emo-love.svg';
import IconMoon from './IconMoonComponent';

export default function App() {
  return (
    <div>
      React + TypeScript + Webpack!
      <div>
        <img src={IconLove} alt="Love Icon" />
      </div>
      <div>
        <div className="icon-water-drop" />
      </div>
      <div>
        <IconMoon />
      </div>
    </div>
  );
}
```

dist/index.html 파일을 다시 생성하기 위해 `yarn start`를 실행한다.

dist/index.html 파일을 브라우저로 열어보면 svg 태그의 내용이 그대로 포함되어 있다.

## 4. svgr loader

package를 설치한다.

```js
yarn add -D @svgr/webpack
```

webpack.config.js 파일을 수정한다.

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
        test: /\.(png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]?[hash]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
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

테스트를 위해 file-loader에서는 svg를 제외하고 svgr에 svg를 등록했다.

src/App.tsx 파일을 수정한다.

```tsx
import React from 'react';
import './App.css';
import IconLove from './images/ic-btn-emo-love.svg';
import IconMoon from './IconMoonComponent';
import IconBulb from './images/ic-btn-emo-bulb.svg';

export default function App() {
  return (
    <div>
      React + TypeScript + Webpack!
      <div>
        <img src={IconLove} alt="Love Icon" />
      </div>
      <div>
        <div className="icon-water-drop" />
      </div>
      <div>
        <IconMoon />
      </div>
      <div>
        <IconBulb />
      </div>
    </div>
  );
}
```

IconMoon과 IconBulb만 제대로 출력된다.

svgr은 여러가지 방식으로 사용할 수 있는 것으로 보인다. 현재 Webpack 설정으로 진행하면 html파일에 inline으로 추가된다.

## 느낀 점, 배운 점

svg를 이런 저런 방법으로 좀 더 익숙하게 사용할 수 있게 되었다.

svg를 js 모듈로 만들어서 사용하는 방법도 있는 것 같던데 나중에 필요할 때 다시 확인해보자.

webpack을 여기저기서 활용해 볼 수 있어서 좋았다.

## 참고

[How to use SVGs in React](https://blog.logrocket.com/how-to-use-svgs-in-react/)

[SVG 아이콘 사용하기](https://junojunho.com/front-end/svg-icon)
