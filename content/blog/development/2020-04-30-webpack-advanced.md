---
title: "[Webpack] devServer, 최적화"
date: 2020-04-30 23:04:50
category: development
---
[인프런의 프론트앤드 개발환경의 이해와 실습](https://www.inflearn.com/course/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD/dashboard)을 듣고 일부 내용을 정리해본다.

어제에 이어 webpack의 기능을 좀 더 정리해보자.

## 1. Webpack dev server

```js
yarn add -D webpack-dev-server
```

webpack-dev-server를 설치한 후 package.json의 script에 추가한다.

```json
"scripts": {
  "build": "webpack",
  "start": "webpack-dev-server"
},
```

yarn start로 실행하면 <http://localhost:8080/>으로 웹 서버가 실행된다.

터미널을 살펴보면 webpack이 실행된 것을 알 수 있다.

​관련 파일을 수정해면 브라우저가 바로 갱신된다. css 파일만 수정해도 브라우저에 바로 반영된다.

### 1-1. devServer options

webpack.config.js 파일에서 webpack-dev-server의 옵션을 설정할 수 있다.

```js
const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  devServer: {
    overlay: true,
    stats: 'errors-only',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          publicPath: './',
          name: '[name].[ext]?[hash]',
          limit: 20000, // 20k
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleDateString()}
      `,
    }),
    new webpack.DefinePlugin({
      VALUE: '1 + 1',
      STRING: JSON.stringify('1 + 1'),
      'api.domain': JSON.stringify('https://api.domain.com'),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      templateParameters: {
        env: process.env.NODE_ENV === 'development' ? '(DEV)' : '',
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
    ...(process.env.NODE_ENV === 'production'
      ? [new MiniCssExtractPlugin({ filename: '[name].css' })]
      : []),
  ],
};
```

```js
devServer: {
  overlay: true,
  stats: 'errors-only',
},
```

에러가 발생하면 브라우저에 overlay 된다.

자주 쓰이는 옵션은 따로 정리해보자.

### 1-2. api mock

api mock 기능을 추가할 수 있다.

```js
const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  devServer: {
    overlay: true,
    stats: 'errors-only',
    before: (app) => {
      app.get('/api/users', (req, res) => {
        res.json([
          {
            id: 1,
            name: 'Alice',
          },
          {
            id: 2,
            name: 'Bob',
          },
          {
            id: 3,
            name: 'Mike',
          },
        ]);
      });
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          publicPath: './',
          name: '[name].[ext]?[hash]',
          limit: 20000, // 20k
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleDateString()}
      `,
    }),
    new webpack.DefinePlugin({
      VALUE: '1 + 1',
      STRING: JSON.stringify('1 + 1'),
      'api.domain': JSON.stringify('https://api.domain.com'),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      templateParameters: {
        env: process.env.NODE_ENV === 'development' ? '(DEV)' : '',
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
    ...(process.env.NODE_ENV === 'production'
      ? [new MiniCssExtractPlugin({ filename: '[name].css' })]
      : []),
  ],
};
```

```js
devServer: {
  overlay: true,
  stats: 'errors-only',
  before: (app) => {
    app.get('/api/users', (req, res) => {
      res.json([
        {
          id: 1,
          name: 'Alice',
        },
        {
          id: 2,
          name: 'Bob',
        },
        {
          id: 3,
          name: 'Mike',
        },
      ]);
    });
  },
},
```

<http://localhost:8080/api/users>로 접근하면 json을 반환한다.

axios를 설치하고 app.js 코드를 다음과 같이 수정해보자.

```js
import './app.css';
import party from './party-8-240.png';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', async () => {
  document.body.innerHTML = `
    <img src="${party}" />
  `;
  const res = await axios.get('/api/users');
  console.log(res);
});
```

화면이 로드되자마자 api가 호출되고 결과가 console에 출력된다.

```js
import './app.css';
import party from './party-8-240.png';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', async () => {
  document.body.innerHTML = `
    <img src="${party}" />
  `;
  const res = await axios.get('/api/users');
  console.log(res);
  document.body.innerHTML += (res.data || []).map(
    (user) => `<div>${user.id}: ${user.name}</div>`
  ).join('');
});
```

결과를 출력했다.

### 1-3. connect-api-mocker

먼저 package를 설치한다.

```js
yarn add -D connect-api-mocker
```

src와 같은 level에 mocks 폴더를 생성하고 하위 폴더와 파일을 추가한다.

mocks/api/users/GET.json

폴더 경로 api/users는 request 요청 url과 동일하게 설정한다.

그리고 GET 요청이기 때문에 GET.json 파일을 생성한다.

```json
[
  {
    "id": 1,
    "name": "Alice"
  },
  {
    "id": 2,
    "name": "Bob"
  },
  {
    "id": 3,
    "name": "Mike"
  }
]
```

데이터는 devServer와 동일하다.

webpack.config.js 파일을 수정하자.

```js
const apiMocker = require('connect-api-mocker');

devServer: {
  overlay: true,
  stats: 'errors-only',
  before: (app) => {
    app.use(apiMocker('/api', './mocks/api'));
  },
},
```

apiMocker는 urlRoot와 pathRoot를 인자로 받는다. 각 항목을 입력하면 devServer에서 request에 응답하던 것과 동일한 역할을 수행할 수 있다.

### 1-4. proxy

개발 중 실제 백앤드 서버의 API를 테스트할 때 CORS 문제로 테스트에 어려움을 겪는 경우가 종종 있다.

localhost:xxxx를 백앤드에 등록하여 해결할 수 도 있지만 webpack devServer proxy를 사용하여 해결할 수 도 있다.

```js
devServer: {
  overlay: true,
  stats: 'errors-only',
  proxy: {
    '/api': 'http://server-domain',
  },
},
```

front 코드는 devServer에 api 응답을 요청하고, devServer는 백앤드 서버에 다시 응답을 요청한다.

이때 proxy가 CORS가 발생하지 않도록 처리한다.

다음 글도 참고하자. <https://react.vlpt.us/redux-middleware/09-cors-and-proxy.html>

## 2. 최적화

DefinePlguin을 사용하고 proess.env.NODE_ENV를 설정하면 해당 값이 전역변수로 주입된다.

mode를 정의하여 process.env.NODE_ENV 값에따라 분기할 수 있도록 처리한다.

```js
const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
};
```

package.json의 scirpt에 production을 추가하여 실행하보자.

```json
"scripts": {
  "build": "NODE_ENV=production webpack",
  "start": "NODE_ENV=production webpack-dev-server --progress"
},
```

yarn build를 실행하면 dist의 main.js가 난독화되어 생성된다.

### 2-1. css 파일 최적화

package를 설치한다.

```js
yarn add -D optimize-css-assets-webpack-plugin
```

webpack.config.js 파일에 추가한다.

```js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

devServer: {
  overlay: true,
  stats: 'errors-only',
  before: (app) => {
    app.use(apiMocker('/api', './mocks/api'));
  },
  hot: true,
},
optimization: {
  minimizer: mode === 'production' ? [new OptimizeCSSAssetsPlugin()] : []
},
```

이렇게 설정한 후 `NODE_ENV=production webpack`를 실행하면 dist 폴더의 css 파일의 공백이 모두 제거된 것을 확인할 수 있다.

### 2-2. TerserPlugin(terser-webpack-plugin)

js 파일을 압축하고, console 코드를 자동으로 삭제할 수 있다.

설치한다.

```js
yarn add -D terser-webpack-plugin
```

webpack.config.js에 추가한다.

```js
const TerserPlugin = require('terser-webpack-plugin');

optimization: {
  minimizer:
    mode === 'production'
      ? [
          new OptimizeCSSAssetsPlugin(),
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          }),
        ]
      : [],
},
```

webpack을 production 모드로 실행하면 bundle 파일에 적용된다.

### 2-3. code spliting

entry를 추가해보자.

```js
module.exports = {
  mode,
  entry: {
    main: './src/app.js',
    result: './src/result.js',
  },
}
```

result를 추가했다.

이 상태로 yarn build를 실행하면 dist 폴더에 result관련 파일들이 생성된다.

index.html을 살펴보면 app.js, result.js를 모두 로드하는 것을 볼 수 있다.

하지만 app.js와 result.js에 중복 코드가 많이 존재하게 된다.

이 중복 코드를 제거하기 위해 다음과 같이 설정한다.

```js
optimization: {
  minimizer:
    mode === 'production'
      ? [
          new OptimizeCSSAssetsPlugin(),
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          }),
        ]
      : [],
  splitChunks: {
    chunks: 'all',
  },
},
```

설정 후 yarn build를 실행하자.

설정 전 후 결과를 비교해보자.

```js
// 중복 제거 전
                                     Asset       Size  Chunks                    Chunk Names
cat01.jpg?e9138897b09dd1181948c510691fecd7    721 KiB          [emitted]  [big]
                                index.html  279 bytes          [emitted]
                                  main.css  153 bytes    0, 1  [emitted]         main
                                   main.js   16.2 KiB    0, 1  [emitted]         main
                       main.js.LICENSE.txt   55 bytes          [emitted]
                                 result.js   15.7 KiB       1  [emitted]         result
                     result.js.LICENSE.txt   55 bytes          [emitted]

// 중복 제거 후
                                     Asset       Size  Chunks                    Chunk Names
cat01.jpg?e9138897b09dd1181948c510691fecd7    721 KiB          [emitted]  [big]
                                index.html  325 bytes          [emitted]
                                  main.css  153 bytes    1, 2  [emitted]         main
                                   main.js   2.21 KiB    1, 2  [emitted]         main
                       main.js.LICENSE.txt   55 bytes          [emitted]
                                 result.js   1.71 KiB       2  [emitted]         result
                     result.js.LICENSE.txt   55 bytes          [emitted]
                    vendors~main~result.js   14.7 KiB       0  [emitted]         vendors~main~result
        vendors~main~result.js.LICENSE.txt   55 bytes          [emitted]
```

main.js, result.js 파일의 용량이 줄어들었다. 그리고 venders... 라는 파일이 추가되었다.

중복코드는 vendors... 파일에 포함된다.

### 2-4. externals

bundle할 필요가 없는 대상은 제외하는 것이 좋다.

bundle할 필요가 없는 대상이란 보통 package로 설치하는 라이브러리들이다.

axios를 처리해보자.

webpack.config.js 파일을 수정한다.

```js
optimization: {
  minimizer:
    mode === 'production'
      ? [
          new OptimizeCSSAssetsPlugin(),
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          }),
        ]
      : [],
  splitChunks: {
    chunks: 'all',
  },
},
externals: {
  axios: 'axios',
},
```

externals의 의미는 axios를 전역변수를 사용하는 것으로 간주한다는 의미다.

전역변수 처럼 사용하려면 node_modules/axios/dist/axios.min.js 파일을 html에서 로드해두면 된다.

build 할 때 이 파일을 dist 폴더에 복사한다.

복사를 위해 copy-webpack-plugin을 사용한다.

```js
yarn add -D copy-webpack-plugin
```

```js
const CopyPlugin = require('copy-webpack-plugin');
...

module.exports = {
  ...
  plugins: [
    ...
    new CopyPlugin([{
      from: './node_modules/axios/dist/axios.min.js',
      to: './axios.min.js',
    }])
  ],
};
```

plugins에 CopyPlugin 설정을 한다.

from, to를 설정하는데 to는 dist 경로를 생략해야 한다. dist를 추가하면 dist/dist/axios.min.js 가 된다.

src/index.html 파일에서 ./dist/axios 파일을 로드할 수 있도록 script를 추가한다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script src="axios.min.js"></script>
</body>
</html>
```

여기서도 경로에 주의하자.

dist 폴더의 파일들의 용량을 확인해보면 axios 파일을 제외하고 나머지 파일들의 용량이 크게 줄었다.

axios 파일의 용량이 크게 차지하고 있었음을 알 수 있다.
