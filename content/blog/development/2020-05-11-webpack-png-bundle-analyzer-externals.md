---
title: "CRA 없이 React + TypeScript + Webpack 프로젝트 만들기 #3"
date: 2020-05-12 00:05:82
category: development
---

관련 글

[CRA 없이 React + TypeScript + Webpack 프로젝트 만들기 #1](https://blog.doitreviews.com/development/2020-05-07-react-typescript-webpack/)

[CRA 없이 React + TypeScript + Webpack 프로젝트 만들기 #2](https://blog.doitreviews.com/development/2020-05-11-webpack-dev-server-and-svg/)

----

어제까지 설정했던 Webpack을 기반으로 CRA로 작성한 프로젝트를 Webpack으로 변경했다.

그 과정에서 추가 설정을 했거나, 삽질했던 내용을 적어둔다.

## 1. SVG가 아닌 PNG 파일을 처리하기 위한 file-loader

이번 프로젝트의 아이콘은 모두 SVG였지만 일부 이미지가 PNG였다. PNG를 처리하는 설정을 webpack.config.js에 추가한다.

```js
{
  test: /\.png$/,
  loader: 'file-loader',
  options: {
    name: 'images/[name].[ext]?[hash]',
  },
},
```

SVG를 처리했을 때와 동일하게 src/types/custom.d.ts 파일에 png 확장자를 처리할 수 있는 선언을 추가한다.

```ts
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}
```

다음과 같이 사용할 수 있다.

```tsx
import React from 'react';
import waterdropIconUrl, { ReactComponent as WaterdropIcon, } from './images/ic-btn-emo-waterdrop.svg';
import partyUrl from './images/party-8-240.png';

export default function App() {
  return (
    <div>
      React + TypeScript + Webpack!
      <div>
        <img src={waterdropIconUrl} alt="Waterdrop Icon" />
      </div>
      <WaterdropIcon />
      <div>
        <img src={partyUrl} alt="Party Icon" />
      </div>
    </div>
  );
}
```

## 2. BundleAnalyzerPlugin

production mode로 Webpack을 실행하여 bundle의 크기를 확인해보자.

```js
Asset       Size  Chunks                    Chunk Names
app.js    478 KiB       0  [emitted]  [big]  app
```

최적화를 할 여지가 있을지 webpack-bundle-analyzer로 확인해볼 수 있다.

```js
yarn add -D webpack-bundle-analyzer
```

webpack.config.js 에 추가한다.

```js
new BundleAnalyzerPlugin({
  openAnalyzer: false,
  analyzerMode: 'static',
  reportFilename: '../../report.html',
}),
```

openAnalyzer를 false로 설정하면 BundleAnalyzerPlugin가 실행된 후에 바로 브라우저에 결과가 출력되지 않도록 한다.

analyzerMode, reportFilename을 위와 같이 설정하면 report.html 파일이 지정된 경로에 생성된다.

report.html 파일을 브라우저로 확인해보면 다음과 같다.

![최초 분석 결과](https://drive.google.com/uc?export=view&id=19yr9Z2MYNGqvZ8tQ4BXGLLcZgKDAw0yC)

react-spinners가 크게 비중을 차지하고 있다. 실제로 사용되는 코드를 확인해보자.

```tsx
import { BeatLoader } from 'react-spinners';
```

이 코드를 다음과 같이 변경하자.

```tsx
import BeatLoader from 'react-spinners/BeatLoader';
```

위와 같이 코드를 수정한 후 다시 webpack을 실행해보자.

```js
Asset       Size  Chunks                    Chunk Names
app.js    418 KiB       0  [emitted]  [big]  app
```

![react-spinners 최적화](https://drive.google.com/uc?export=view&id=19_SMQfGBGNKE_ZW2x7o3EYPCZlmliyXN)

size가 약 60Kb 줄어들었고 이미지에서 볼륨이 작아진 것을 알 수 있다.

## 3. externals, CopyPlugin

axios 같은 library는 bundle에서 별도로 분리할 수 있다.

![axios 분리 전](https://drive.google.com/uc?export=view&id=10DKW44LeWGCcOoFzRmiSyGyUceLV6MHa)

Webpack의 externals 키워드와 copy-webpack-plugin을 활용한다.

```js
yarn add -D copy-webpack-plugin
```

```js
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
  new BundleAnalyzerPlugin({
    openAnalyzer: false,
    analyzerMode: 'static',
    reportFilename: '../../report.html',
  }),
  new CopyPlugin([
    {
      from: './node_modules/axios/dist/axios.min.js',
      to: './axios.min.js',
    },
  ]),
],
externals: {
  axios: 'axios',
},
```

위와 같이 설정한 후 src/index.html 파일에 axios를 로드하는 코드를 추가한다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document<%= env %></title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="/axios.min.js"></script>
  </body>
</html>
```

webpack을 다시 실행하면 bundle size가 더 줄어든 것을 확인할 수 있다.

```js
Asset       Size  Chunks                    Chunk Names
app.js    405 KiB       0  [emitted]  [big]  app
```

![axios 분리 후](https://drive.google.com/uc?export=view&id=1fDA4612lhFAviVJ8sAh77vSbvYe0hzMG)

용량이 약 13kb 줄어들었고 이미지에서 axios는 사라졌다.

externals로 의존성을 분리하는 것은 확인해보지는 못했지만 더 다양한 기능이 있는 것 같다.

index.html에 수동으로 axio를 추가하지 않는 방법도 있을 것 같은데...

## 느낀 점, 배운 것

아직 배포까지는 진행하지 않았지만 로컬에서 CRA를 Wabpack으로 대체하는 과정이 잘 처리되어서 기쁘다.

최적화 방법이 더 있다는 것을 자료를 찾아보면서 확인했지만 일단은 여기까지만 적용하려고 한다.

앞으로 개인 프로젝트를 할 때는 CRA를 쓰지 않고 Webpack 써야지~
