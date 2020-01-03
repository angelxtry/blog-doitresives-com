---
title: 2019-12-03 eslint, prettier 설정
date: 2019-12-03 11:59:59
category: development
---

작은 프로젝트를 진행하고 있는데 prettier만 일부 사용하고 있다가 eslint를 사용해보니 엉성한 코드가 눈에 확 띄었다.

그래서 eslint와 prettier를 찾아보기 시작했다.

사실 prettier는 둘째치고 eslint가 중요하다는 것을 몰랐던 것은 아니었다.

몇 달 전에도 설정해두고 싶어서 찾아봤지만 워낙 아는 것이 없어 눈에 잘 안들어오더라.

프로젝트를 하면서 작은 지식이나마 조금 더 쌓였고, 필요성을 딱! 느끼는 그런 상황이 생기니까 찾아보는 내용들이 머리에 쏙쏙 들어오는 것 같다.

벨로퍼트님의 글을 많이 참조했다.

2018년도 10월 글이지만 아직도 유용하다고 생각된다.

[리액트 프로젝트에 ESLint 와 Prettier 끼얹기](https://velog.io/@velopert/eslint-and-prettier-in-react)

## 1. 설치 및 설정

### 1-1 eslint

기존에 만들어두었던 프로젝트 폴더에 eslint 설치부터 시작한다.

```js
npm i -D eslint
```

그리고 설정 파일을 만들기 위해 다음과 같이 입력한다.

```js
npx eslint --init
```

cmd 창에서 몇 가지 질문을 하는데 방향키와 enter로 응답하면 된다.

다시 설정할 수 있어 크게 중요하지 않은 내용인 것 같다.

다음과 같이 선택했다.

```js
? How would you like to use ESLint? To check syntax and find problems
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? React
? Does your project use TypeScript? No
? Where does your code run? Browser
? What format do you want your config file to be in? JSON
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest
? Would you like to install them now with npm? Yes
```

질문에 응답하면 `.eslintrc.json` 파일이 생성된다. 파일 내용은 다음과 같다.

```js
{
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    }
}
```

### 1-2 eslint-config-airbnb

[eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)를 설치한다.

다음과 같이 `eslint-config-airbnb`를 설치하는데 필요한 package들을 확인해보고

```js
npm info "eslint-config-airbnb@latest" peerDependencies
```

npx를 사용하던 npm을 사용하던 해당 package를 설치하면 된다.

다 설치하고나면 package.json 파일에 다음과 같이 표시된다.

```js
"devDependencies": {
  "eslint": "^6.1.0",
  "eslint-config-airbnb": "^18.0.1",
  "eslint-plugin-import": "^2.18.2"
  "eslint-plugin-jsx-a11y": "^6.2.3",
  "eslint-plugin-react": "^7.17.0",
  "eslint-plugin-react-hooks": "^1.7.0"
}
```

설치 후 `.eslintrc.json` 파일의 `extends`를 다음과 같이 변경하면 빨간줄 파티(?)를 경험할 수 있다.​

```json
"extends": [
    "airbnb",
    "airbnb/hooks"
],
```

내 수준에서는 eslint에서 지시하는 대로 코드를 고쳐보는 것도 좋은 경험이었다.

모르는 항목이 나오면 열심히 검색도 해봤는데 시간 장난 아니게 잡아먹는다.

정말 못 고치겠는 것들은 `.eslintrc.json` 파일에서 예외 처리를 하자.

예를 들어서

```js
JSX not allowed in files with extension '.js' eslint(react/jsx-filename-extension)
```

이런 메시지가 많이 출력되는데 확장자를 .js가 아니라 .jsx로 변경하라고 하는데 적용하기 어렵다면 `.eslintrc.json` 파일에 다음과 같이 입력하자.

```json
"rules": {
    "react/jsx-filename-extension": 0
}
```

오류 메시지 괄호 안의 내용을 그대로 붙어넣고 0, 1, 2를 선택하면 된다.

0은 off, 1은 warn, 2는 error다.

react-hooks 초심자에게는 react-hooks/exhaustive-deps rule이 정말 큰 도움이 된다.

### 1-3 prettier(eslint-config-prettier)

이제 prettier를 사용해보자.

prettier는 자동으로, 혹은 단축키 한 번 입력으로 코드를 예쁘게 변경해 준다.

`.prettierrc` 파일을 하나 만들고 다음의 내용을 입력한다.

```json
{
  "singleQuote": true,
  "arrowParens": "always",
  "trailingComma": "all",
  "printWidth": 80,
  "semi": true,
  "useTabs": false,
  "tabWidth": 2
}
```

하지만 추가 설정 없이 사용하다보면 prettier와 eslint-config-airbnb의 설정이 충돌하는 rule이 있어서 prettier로 코드를 변경하면 eslint가 빨간줄을 죽죽 그어 버린다.

열심히 빨간 줄을 지웠는데 실수로 prettier 단축키를 입력한다면...

그래서 [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)를 설치한다.

```js
npm i -D eslint-config-prettier
```

설치 후 `.eslintrc.json` 파일에 설정을 추가한다.

```json
"extends": [
    "airbnb",
    "airbnb/hooks",
    "prettier",
    "prettier/react"
],
```

`eslint-config-prettier`를 적용하면 빨간줄이 너무 많이 사라져서 아쉬운 감(?)이 있다.

뺄건 빼고, 넣을 건 넣고 적절하게 맞춰보자.

## 2. 결과물

`package.json`

```json
"devDependencies": {
  "eslint": "^6.1.0",
  "eslint-config-airbnb": "^18.0.1",
  "eslint-config-prettier": "^6.7.0",
  "eslint-plugin-import": "^2.18.2",
  "eslint-plugin-jsx-a11y": "^6.2.3",
  "eslint-plugin-react": "^7.17.0",
  "eslint-plugin-react-hooks": "^1.7.0"
}
```

`.eslintrc.json`

```json
{
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "airbnb",
        "airbnb/hooks",
        "prettier",
        "prettier/react"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/jsx-filename-extension": 0,
        "react/prop-types": 0
    }
}
```

`.prettierrc`

```json
{
  "singleQuote": true,
  "arrowParens": "always",
  "trailingComma": "all",
  "printWidth": 80,
  "semi": true,
  "useTabs": false,
  "tabWidth": 2
}
```

아직 많이 사용해보지 못해 rules가 별로 없다. 사용하다보면 추가될 내용이 많을 것 같다.

## 3. 배운 것

설정하고 글을 쓰다보니 예전에 eslint, prettier 등을 설정하고 싶은데 어떻게 해야하는지 모르겠어서 정말 답답해 했던 일이 생각났다.

그때와 뭐가 달라졌는지는 모르겠지만 이런 소소한 것 하나가 기분을 좋게 하고 지치지 않게 해준다.

계속 공부하고, 계속 글을 쓰자.
