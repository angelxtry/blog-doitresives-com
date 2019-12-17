---
title: 2019-12-17 Typescript eslint setting
date: 2019-12-18 01:12:81
category: development
---

Typescript를 사용하기 위해 eslint 설정을 했다.

예전에는 tslint라는 것을 사용했었는데 tslint는 개발 중단 수순을 밟고 있고 eslint와 합쳐질 예정이라고 한다.

그래서 당연히 eslint 설정을 시도했다.

다음 글들을 참고했다.

[TSLint 에서 ESLint 로 이사하기](https://medium.com/@pks2974/tslint-%EC%97%90%EC%84%9C-eslint-%EB%A1%9C-%EC%9D%B4%EC%82%AC%ED%95%98%EA%B8%B0-ecd460a1e599)

[TypeScript ESLint 적용하기 (+ Airbnb)](https://ivvve.github.io/2019/10/09/js/ts/typescript-eslint&airbnb/)

## 과정

### 1. package 설치

[참조1](https://github.com/typescript-eslint/typescript-eslint#how-do-i-configure-my-project-to-use-typescript-eslint)

```js
yarn init -y
yarn add -D typescript
yarn add -D eslint eslint-config-airbnb-base eslint-plugin-import
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 2. eslint 설정

commend line으로 나오는 질문에 답을 선택하면 된다.

```js
yarn eslint --init
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? None of these
? Does your project use TypeScript? Yes
? Where does your code run? Node
? How would you like to define a style for your project? Use a popular style guide
? Which style guide do you want to follow? Airbnb: https://github.com/airbnb/javascript
? What format do you want your config file to be in? JavaScript
Checking peerDependencies of eslint-config-airbnb-base@latest
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest eslint-config-airbnb-base@latest eslint@^5.16.0 || ^6.1.0 eslint-plugin-import@^2.18.2 @typescript-eslint/parser@latest
? Would you like to install them now with npm? No
Successfully created .eslintrc.js file
```

여기까지 진행하고 테스트를 위해 적당히 index.ts 파일을 만들고, 코드를 넣어보니 eslint가 적용되지 않았다.

찾아보니 extension으로 설치한 eslint가 ts 확장자를 인식할 수 있게 설정을 추가해야 한다고 한다.

### 3. vscode 설정 파일에 추가

`setting.json`

```js
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
],
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```

마지막 항목은 파일이 저장될 때 eslint 기준에 맞게 자동으로 코드를 수정하는 옵션이다.

이것까지 설정하니 prettier를 잘 안쓰게 된다.

## 현재 .eslintrc.js

```js
module.exports = {
  env: {
    es6: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb-base'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'jest'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      { ts: 'never', js: 'never' }
    ],
    'class-methods-use-this': [0],
    'import/prefer-default-export': [0],
    'no-console': 0,
    'import/no-extraneous-dependencies': 0
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }]
      }
    }
  ]
};

```

일단 여기까지.
