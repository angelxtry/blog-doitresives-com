---
title: "[Webpack] Webpack에 한번 더 간단히 정리해보자."
date: 2020-04-29 21:04:30
category: development
---

어제에 이어 오늘도 webpack

Webpack의 필요성을 느끼고는 있지만 명확하게 설명하지 못해서 검색을 해봤다.

[뒤늦게 알아보는 '왜 Webpack인가?'](https://dev.zzoman.com/2017/09/04/why-do-you-need-to-learn-about-webpack/)

설득력있게 잘 정리된 글이다. 참고하자.

[webpack 개념](https://beomy.tistory.com/41)

loader, plugin 등의 정의를 참고하자.

[인프런의 프론트앤드 개발환경의 이해와 실습](https://www.inflearn.com/course/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD/dashboard)을 듣고 있다.

일부 내용을 정리해본다.

## 1. webpack 기본

다음과 같은 html이 있다.

./index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script type="module" src="./src/app.js"></script>
</body>
</html>
```

./src/app.js

```js
import * as math from './math.js';

console.log(math.sum(1, 2));
```

./src/math.js

```js
export function sum(a, b) {
  return a + b;
}
```

local-web-server 같은 간단한 웹 서버를 실행하고 브라우저로 접속하면 index.html, app.js math.js 파일 3개를 다운받는다.

webpack을 이용해보자.

webpack을 설치한다.

```js
yarn add -D webpack webpack-cli
```

필수적으로 설정해야 하는 옵션 3가지다.

mode, entry, output

다음의 command를 실행해보자.

```js
npx webpack --mode development --entry ./src/app.js --output ./dist/main.js
```

결과는 다음과 같다.

dist 폴더에 main.js 파일이 생성된다.

index.html 파일을 수정하자.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script src="./dist/main.js"></script>
</body>
</html>
```

webpack을 이용하여 app.js, math.js을 하나로 합쳐 main.js를 만들었고 html에서 main.js 만을 로드했다.

브라우저에서 확인해보면 파일 2개만을 다운받는다.

## 2. config file

webpack.config.js 파일을 생성한다.

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js'
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js'
  }
}
```

package.json에 scripts를 등록한다.

```json
"scripts": {
  "build": "webpack"
},
```

`yarn webpack`으로 실행한다.

## 3. loader

webpack은 모든 파일을 모듈로 간주한다.

webpack은 자바스크립트 파일만 읽어 올 수 있다.

loader는 스타일시트나 이미지 등을 webpack이 이해 할 수 있는 모듈로 변경한다.

간단하게 loader의 원리를 확인해보자.

my-webpack-loader.js 파일을 생성한다.

```js
module.exports = function myWebpackLoader(content) {
  console.log('myWebpackLoader run!');
  return content;
};
```

loader는 함수 형태로 작성한다. myWebpackLoader는 인자를 그대로 return 하면서 console.log를 출력한다.

webpack.config.js 파일에 my-webpack-loader.js 를 추가해보자.

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [path.resolve('./my-webpack-loader.js')],
      },
    ],
  },
};
```

loader는 module로 추가한다.

test는 정규 표현식으로 모든 js 파일을 설정한다.

use에는 방금 작성한 loader를 추가한다.

`yarn build`로 webpack을 실행하면 현재 폴더에 js 파일이 2개이기 때문에 터미널에 `myWebpackLoader run!`이 2번 출력된다.

my-webpack-loader.js 파일을 다음과 같이 변경해보자.

```js
module.exports = function myWebpackLoader(content) {
  return content.replace('console.log(', 'alert(');
};
```

브라우저에서 해당 파일을 열면 console.log에 출력되던 값이 alert으로 출력되는 것을 확인할 수 있다.

### 3-1. css-loader

자주 사용하는 loader로 css-loader가 있다.

```js
yarn add -D css-loader
```

css 파일을 만들고 app.js에서 import 한다.

./src/app.css

```css
body {
  background-color: green;
  min-height: 100vh;
}
```

./src/app.js

```js
import * as math from './math.js';
import './app.css';

console.log(math.sum(1, 2));
```

이 상태로 webpack을 실행한 후 html 파일을 브라우저로 열어보면 아직 css가 적용되지 않았다.

./dist/main.js 파일을 검색해보면 css 내용이 포함되어 있지만 아직 적용된 것은 아니다.

### 3-2. style-loader

css를 적용하기 위해 style-loader를 사용한다.

style-loader는 css를 html에 inline style로 추가한다.

```js
yarn add -D style-loader
```

webpack.config.js

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
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

css-loader가 먼저 실행되고 style-loader가 실행되어야 하기 때문에 순서에 주의해야 한다.

webpack 실행 후 브라우저로 html 파일을 확인하면 background-color이 변경된 것을 알 수 있다.

### 3-3. file-loader

배경 이미지를 추가해보자.

먼저 file-loader를 설치한다.

```js
yarn add -D file-loader
```

src/app.css

```css
body {
  min-height: 100vh;
  background: center/50% no-repeat url('./cat01.jpg');
}
```

webpack.config.js

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader',
        options: {
          publicPath: './dist',
          name: '[name].[ext]?[hash]',
        }
      }
    ],
  },
};
```

module의 file-loader 부분을 살펴보자.

확장자가 jpg인 항목들을 처리한다. use가 아니라 loader라는 key로 file-loader를 추가했다.

options에는 publicPath와 name을 설정한다.

publicPath는 cat01.jpg 파일이 배포시에 위치하는 경로를 지정한다.

name은 main.js 파일에서 관리되는 파일명이다.

main.js에서 찾아보면 cat01.jpg?e9138897b09dd1181948c510691fecd7 과 같은 형식으로 이름이 설정된다.

파일명 뒤의 query string으로 설정된 hash는 webpack이 실행될 때마다 변경되는 값이다.

브라우저 등에서 이미지가 캐시되어 오작동하는 것을 방지하기 위한 방법이다.

### 3-4. url-loader

한 페이지에서 작은 이미지 여러개를 사용한다면 data uri schema를 이용하는 것이 좋다.

url-loader는 작은 이미지 파일을 base64로 인코딩해서 JavaScript문자열로 변환해준다.

우선 file-loader를 이용하여 새로운 이미지 파일을 추가해보자.

source/app.js

```js
import './app.css';
import party from './party-8-240.png';

document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML = `
    <img src="${party}" />
  `;
});
```

png 파일을 import 하고 load가 끝나면 body에 png를 추가한다.

webpack.config.js

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
          publicPath: './dist',
          name: '[name].[ext]?[hash]',
        }
      }
    ],
  },
};
```

file-loader에서 처리하는 파일의 확장자를 추가했다.

webpack을 실행하면 추가한 이미지 파일도 함께 dist 폴더로 이동되고 브라우저에 출력된다.

이제 party 이미지를 url-loader를 이용하여 js 파일에 추가해보자.

먼저 url-loader를 설치한다.

```js
yarn add -D url-loader
```

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          publicPath: './dist',
          name: '[name].[ext]?[hash]',
          limit: 20000, // 20k
        }
      }
    ],
  },
};
```

file-loader를 url-loader로 변경했다.

그리고 options에 limit를 추가하여 20k byte 미만인 파일들을 url-loader에 의해 js 파일에 추가되도록 설정했다.

webpack을 실행하면 dist 폴더에 party 이미지는 존재하지 않지만 브라우저에는 출력된다.

main.js 파일을 확인하면 base64로 변환된 코드를 확인할 수 있다.

## 4. plugin

plugin은 번들된 파일을 다루기 위해 사용한다.

plugin을 하나 생성하여 webpack에 추가해보자.

my-webpack-plugin.js

```js
class MyWebpackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('My Plugin', (stats) => {
      console.log('MyWebpackPlugin: Done');
    });
  }
}

module.exports = MyWebpackPlugin;
```

plugin은 class로 만든다.

```js
const path = require('path');
const MyWebpackPlugin = require('./my-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          publicPath: './dist',
          name: '[name].[ext]?[hash]',
          limit: 20000, // 20k
        },
      },
    ],
  },
  plugins: [new MyWebpackPlugin()],
};
```

webpack.config.js 파일에 생성한 plugin을 추가했다.

이 plugin은 webpack을 실행하면 터미널에 MyWebpackPlugin: Done를 출력한다.

my-webpack-plugin.js를 수정해보자.

```js
class MyWebpackPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const source = compilation.assets['main.js'].source();
      console.log(source);
      callback();
    })
  }
}

module.exports = MyWebpackPlugin;
```

compilation을 이용해서 번들된 결과물에 접근할 수 있다.

위 코드는 main.js의 코드를 출력한다.

```js
class MyWebpackPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const source = compilation.assets['main.js'].source();

      compilation.assets['main.js'].source = () => {
        const banner = [
          '/**',
          ' * Banner plugin result.',
          ' * Build Data: 2020-04-29',
          ' */',
        ].join('\n');
        return banner + '\n\n' + source;
      }
      callback();
    })
  }
}

module.exports = MyWebpackPlugin;
```

webpack을 실행하면 main.js의 상단에 banner를 추가한다.

### 4-1. BannerPlugin

BannerPlugin은 webpack에서 기본으로 제공하는 plugin이다.

bundle 파일에 특정 내용을 주석으로 추가할 수 있다.

```js
const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          publicPath: './dist',
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
        Commit Version: ${child_process.execSync('git rev-parse --short HEAD')}
        Author: ${child_process.execSync('git config user.name')}
      `,
    }),
  ],
};
```

baner에 Build Date, Commit Version 등을 추가했다.

node의 `child_process`를 이용하면 터미널에서 command를 실행한 결과를 가져올 수 있다.

### 4-2. DefinePlugin

DefinePlugin도 webpack 내장 plugin이다.

development, production 분기에 많이 사용된다.

```js
const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          publicPath: './dist',
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
  ],
};
```

source/api.js

```js
console.log('VALUE: ', VALUE);
console.log('STRING: ', STRING);
console.log('API.DOMAIN: ', api.domain);

// VALUE:  2
// STRING:  1 + 1
// API.DOMAIN:  https://api.domain.com
```

webpack을 실행하면 webpack.config.js의 DefinePlugin에 정의한 변수들을 source에서 사용할 수 있다.

VALUE는 값으로 출력된다. 문자열 그대로 사용하려면 JSON.stringify를 사용한다.

### 4-3. HtmlTemplatePlugin

HtmlTemplatePlugin은 bundle 파일을 html에 script tag를 이용하여 자동으로 삽입해주거나, 특정 조건에 따라 html을 수정할 수 있다.

HtmlTemplatePlugin은 package를 설치해야 한다.

```js
yarn add -D html-webpack-plugin
```

index.html 파일을 src 폴더로 옮기고, main.js를 불러오던 script를 삭제하자.

src/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
</body>
</html>
```

webpack.config.js

```js
const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
    }),
  ],
};
```

src 폴더로 옮긴 index.html 파일을 template으로 지정한다.

webpack을 실행하면 dist 폴더에 index.html 파일이 생성된다. 그리고 자동으로 dist/main.js를 로드하는 코드가 추가된다.

index.html의 경로를 옮겼기 때문에 url-loader의 경로도 함께 수정해야 한다.

```js
const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
    }),
  ],
};
```

templateParameters를 이용하여 특정 변수를 mode에 맞게 분기처리 할 수 있다.

```js
const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
      minify: process.env.NODE_ENV === 'production' ? {
        collapseWhitespace: true,
        removeComments: true,
      } : false,
    }),
  ],
};
```

html 파일의 공백을 없애거나 주석을 제거할 수 있다.

### 4-4. CleanWebpackPlugin

CleanWebpackPlugin은 webpack을 실행할 때마다 output 폴더를 자동으로 삭제한다.

별도로 package 설치가 필요하다.

```js
yarn add -D clean-webpack-plugin
```

```js
const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
  ],
};
```

### 4-5. MiniCssExtractPlugin

css 파일이 점점 커져서 bundle 파일이 과도하게 커지는 것은 비효율 적이다.

그래서 css 파일과 js 파일은 분리하는 것이 좋다.

MiniCssExtractPlugin을 사용하면 js, css를 분리할 수 있다.

package를 설치한다.

```js
yarn add -D mini-css-extract-plugin
```

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

plugins 부분부터 살펴보자.

```js
...(process.env.NODE_ENV === 'production'
  ? [new MiniCssExtractPlugin({ filename: '[name].css' })]
  : []),
```

production mode 일 때만 적용한다. development 일 때는 파일 하나인 것인 더 편하다.

MiniCssExtractPlugin은 loader도 같이 적용해주어야 한다.

rule을 살펴보자.

```js
{
  test: /\.css$/,
  use: [
    process.env.NODE_ENV === 'production'
      ? MiniCssExtractPlugin.loader
      : 'style-loader',
    'css-loader',
  ],
},
```

development일 경우 style-loader와 css-loader를 사용한다.

production 일 경우 style-loader 대신 MiniCssExtractPlugn.loader를 사용한다.

테스트를 위해 다음과 같은 command를 입력한다.

```js
NODE_ENV=production yarn build
```

webpack.config.js 에 mode가 development로 설정되어 있지만 command에서 NODE_ENV를 production으로 설정하면 production으로 실행된다.

dist 폴더에 main.css 가 생성되었다. 그리고 내용을 확인해보면 main.js와 동일하게 banner도 적용되었다.

dist/index.html에 자동으로 main.css를 로드하는 코드도 추가되었다.

## 5. 느낀 점, 배운 것

Webpack에 좀 더 익숙해졌다.

module, plugin의 사용법을 좀 더 실용적으로 익혔다.

지금 진행하고 있는 프로젝트에 당장 적용해보고 싶은 것이 생겼다.

- svg 아이콘을 url-loader를 사용하여 처리해보자.

다음 단계로 CRA로 만든 프로젝트에 webpack을 적용하는 방법, CRA없이 프로젝트를 생성하고 잘 관리하는 법을 확인해보자.
