---
layout: post
comments: true
title: "Next.js에 react-helmet 적용"
date: 2019-11-22 11:59:59
category: development
tags:
  - Next.js
  - react-helmet
---

메신저나 페이스북에 링크를 적었을 때 미리보기가 지원되는 기능을 추가하고 싶었다.

찾아보니 head에 meta tag를 넣으면 된다고.

그래서 작업~~삽질~~을 시작했다.

## 1. 일단 검색

react head meta tag 등의 키워드로 검색을 해보니, `react-meta-tags`, `react-helmet` 등이 나왔다.

`react-helmet`은 express 보안 패키지와 이름이 같아서 처음에는 보안 관련 패키지인줄 알았다.

조금 훑어보니 `react-helmet`이 내가 원하는 그거더라. 그래서 사용하기로 결정.

## 2. 설치

```js
npm i react-helmet
```

## 3. 적용해볼까

현재 만들고 있는 프로젝트는 Next.js로 되어있다.

그래서 다른 페이지에도 한 번에 적용할 수 있도록 `_app.js`에 적용을 시도했다.

<script src="https://gist.github.com/angelxtry/05688625f06c975df569b6dd2a60152d.js"></script>

짠~ 잘되더라. 그래서 그냥 끝!인줄 알았다.

SSR에서 meta tag가 적용됐는지 확인해보려면 postman으로 html을 받아보라고 하더라고.

받아봤는데 없네. 열심히 적어놓은 meta tag가 없어.

내가 지금 보는 웹페이지에는 있는데 postman으로 받은 데이터에는 없어.

아... SSR이 안됐구나.

이리저리 검색하다가 [Next.js로 정적 웹사이트 만들기 - 1. Next.js 구조](https://salgum1114.github.io/nextjs/2019-05-06-nextjs-static-website-1/) 글을 찾았다.

내용을 보니 `_document.js`에 정적으로 meta tag를 넣을 수 있는 방법이 있었다.

<script src="https://gist.github.com/angelxtry/e78ed51fb4821a765931f4d78ecce943.js"></script>

오! 잘 된다! postman으로 실행해봐도 title, meta가 잘 들어가 있는 것이 확인된다.

그럼 `react-helmet`은 왜 쓰는거지?

아무생각 없이 가져다 쓰려고 했는데 이제 보니 meta 등의 tag를 동적으로 변경하기 위해 react-helmet을 사용하나보다.

그리고 계속 refresh 하다보니 다음과 같은 경고가 계속 발생하고 있었다.

`Warning: <title> should not be used in _document.js's <Head>. https://err.sh/next.js/no-document-title`

찾아보니 title은 _app.js에 넣으라고 하네.

다시 _app.js 파일에 meta tag들을 다 모아놓고 _document.js 파일을 수정한다.

<script src="https://gist.github.com/angelxtry/ee04a501d6e32e7cb17fd8d7f0a3172b.js"></script>

`Helmet.renderStatic()`을 실행하면 link, meta, script, style, title과 htmlAttributes, bodyAttributes가 만들어진다.

이것은 _app.js에 작성한 항목들인 것 같다.

render() 함수에서 이것들을 풀고 react component를 꺼내서 각 항목에 전달한다.

아이고 참 어렵넹.

`_app.js`를 맨 앞에 써 놓은 것 처럼 작성하면 다음과 같은 에러가 발생한다.

`Error: "MyDocument.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`

그래서 _app.js를 다음과 같이 변경한다.

<script src="https://gist.github.com/angelxtry/8922dc0abb6347f6bf6a764b94e2b90c.js"></script>

이렇게 글까지 썼지만 아직도 잘 모르겠는 부분이 많다 ㅠㅠ

갈길이 멀구나 ㅋㅋㅋㅋ 그래도 재미있으니 다행이다.
