---
title: "[Design Systems with React & Storybook] 1. Styled Components"
date: 2020-06-29 17:06:99
category: development
---

요즘 front 개발에 재미를 붙였다. 주로 react와 styled-components를 사용하고 있다.

component를 만들고, component를 조합해서 화면을 만들어가는 것이 재미있기는 한데 점점 코드 중복이 많아지고, component 들이 깔끔하게 정리되지 않더라.

이것 저것 찾아보다가 <https://frontendmasters.com/>의 [Design Systems with React & Storybook](https://frontendmasters.com/courses/design-systems/)를 들었다.

강의는 만족스러웠다. front에 대한 기초 지식을 설명해주는 것도 도움이 많이 됐고, styled-components, storybook에 대해 조금이나마 더 알게되어서 좋았다.

강의를 들으면서 적어두었던 여기에 옮겨둔다.

## Styled-Components

### 1. 프로젝트 생성

create-react-app을 이용하여 프로젝트를 생성한다.

```cmd
yarn create react-app my-component-library
```

src 폴더의 모든 파일을 삭제하고 src/index.js 파일을 추가한다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import PrimaryButton from './components/Buttons';

const App = () => <h1>Hello World!</h1>;

ReactDOM.render(<App />, document.querySelector('#root'));
```

프로젝트를 실행해보자.

```cmd
yarn start
```

### 2. Buttons 추가

components/Buttons.js 파일을 생성한다.

```jsx
import styled from 'styled-components';

const PrimaryButton = styled.Button`
  background-color: red;
  border: none;
  color: white;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 2px;
  min-width: 100px;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
`;

export default PrimaryButton;
```

index.js 파일에서 PrimaryButton을 사용해보자.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import PrimaryButton from './components/Buttons';

const App = () => <PrimaryButton>Hello World!</PrimaryButton>;

ReactDOM.render(<App />, document.querySelector('#root'));
```

#### 공통 항목 추출

PrimaryButton의 css 중 공통으로 사용될만한 항목들을 분리한다.

```jsx
import styled from 'styled-components';

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 2px;
  min-width: 100px;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
`;

const PrimaryButton = styled(Button)`
  background-color: red;
  border: none;
  color: white;
`;

export default PrimaryButton;
```

#### 버튼 추가

Secondary, Tertiary Button도 추가해보자.

```jsx
import styled from 'styled-components';

const primaryBlue = '#030086';

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 2px;
  min-width: 100px;
  cursor: pointer;
  font-family: 'Roboto Mono', monospace;
`;

const PrimaryButton = styled(Button)`
  background-color: ${primaryBlue};
  border: none;
  color: white;
`;

export const SecondaryButton = styled(Button)`
  background: none;
  border: 2px solid ${primaryBlue};
  color: ${primaryBlue};
`;

export const TertiaryButton = styled(Button)`
  background: none;
  border: none;
  color: ${primaryBlue};
`;

export default PrimaryButton;
```

### 3. utils 추가 - Color, Type, Theme

utils 폴더를 만들고 color, typo, theme에 관련된 항목들을 정의한다.

src/utils/colors.js

```js
export const blue = {
  100: '#3a36e0',
  200: '#0804b8',
  300: '#030086',
  400: '#5f25a4',
  500: '#050449',
};

export const green = {
  100: '#529e66',
  200: '#367b48',
  300: '#276738',
};

export const yellow = {
  100: '#e1c542',
  200: '#cab23f',
  300: '#b49e35',
};

export const red = {
  100: '#d0454c',
  200: '#b54248',
  300: '#95353a',
};

export const neutral = {
  100: '#ffffff',
  200: '#f4f5f7',
  300: '#e1e1e1',
  400: '#737581',
  500: '#4a4b53',
  600: '#000000',
};
```

src/utils/typography.js

```js
export const primaryFont = '"Roboto Mono", monospace';

export const typeScale = {
  h1: '1.8rem',
  h2: '1.6rem',
  h3: '1.4rem',
  h4: '1.2rem',
  h5: '1.1rem',
  paragraph: '1rem',
  helpText: '0.8rem',
  copyrightText: '0.7rem',
};
```

src/utils/themes.js

```js
import { blue, neutral } from './colors';
import { primaryFont } from './typography';

export const defaultTheme = {
  primaryColor: blue[300],
  primaryColorHover: blue[200],
  primaryColorActive: blue[100],
  textColorOnPrimary: neutral[100],
  textColor: neutral[600],
  textColorInverted: neutral[100],
  primaryFont,
};
```

src/utils/index.js

```js
export * from './colors';
export * from './typography';
export * from './themes';
```

component/Buttons.js에 적용한다.

```jsx
import styled from 'styled-components';
import { defaultTheme, typeScale } from '../utils';

const Button = styled.button`
  padding: 12px 24px;
  font-size: ${typeScale.paragraph};
  border-radius: 2px;
  min-width: 100px;
  cursor: pointer;
  font-family: 'Roboto Mono', monospace;
`;

const PrimaryButton = styled(Button)`
  background-color: ${defaultTheme.primaryColor};
  border: none;
  color: white;
`;

export const SecondaryButton = styled(Button)`
  background: none;
  border: 2px solid ${defaultTheme.primaryColor};
  color: ${defaultTheme.primaryColor};
`;

export const TertiaryButton = styled(Button)`
  background: none;
  border: none;
  color: ${defaultTheme.primaryColor};
`;

export default PrimaryButton;
```

### 4. GlobalStyle 추가

우선 polished를 설치한다.

```cmd
yarn add polished
```

src/utils/Global.js 파일을 추가한다.

```js
import { createGlobalStyle } from 'styled-components';
import { primaryFont } from './typography';
import { normalize } from 'polished';

export const GlobalStyle = createGlobalStyle`
  ${normalize()}
  html {
    font-size: 16px;
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    font-family: ${primaryFont};
  }

  main {
    width: 90%;
    margin: 0 auto;
  }
`;
```

src/index.js에 GlobalStyle을 추가한다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import PrimaryButton, {
  SecondaryButton,
  TertiaryButton,
} from './components/Buttons';
import { GlobalStyle } from './utils';

const App = () => (
  <>
    <PrimaryButton>PrimaryButton</PrimaryButton>
    <SecondaryButton>SecondaryButton</SecondaryButton>
    <TertiaryButton>TertiaryButton</TertiaryButton>
    <GlobalStyle />
  </>
);

ReactDOM.render(<App />, document.querySelector('#root'));
```

### 5. Buttons state 추가

#### hover, focus, active

src/components/Buttons.js

```js
import styled from 'styled-components';
import { defaultTheme, typeScale } from '../utils';

const Button = styled.button`
  padding: 12px 24px;
  font-size: ${typeScale.paragraph};
  border-radius: 2px;
  min-width: 100px;
  cursor: pointer;
  font-family: 'Roboto Mono', monospace;
  transition: background-color 0.2s linear, color 0.2s linear;

  &:hover {
    background-color: ${defaultTheme.primaryColorHover};
    color: ${defaultTheme.textColorOnPrimary};
  }

  &:focus {
    outline: 3px solid ${defaultTheme.primaryColorHover};
    outline-offset: 2px;
  }

  &:active {
    background-color: ${defaultTheme.primaryColorActive};
    border-color: ${defaultTheme.primaryColorActive};
    color: ${defaultTheme.textColorOnPrimary};
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${defaultTheme.primaryColor};
  border: none;
  color: white;
`;

export const SecondaryButton = styled(Button)`
  background: none;
  border: 2px solid ${defaultTheme.primaryColor};
  color: ${defaultTheme.primaryColor};
`;

export const TertiaryButton = styled(Button)`
  background: none;
  border: none;
  color: ${defaultTheme.primaryColor};
`;

export default PrimaryButton;
```

근간이 되는 Button에 state를 추가했다.

#### disabled

src/utils/themes.js에 disabled state를 추가한다.

```js
import { blue, neutral } from './colors';
import { primaryFont } from './typography';

export const defaultTheme = {
  primaryColor: blue[300],
  primaryColorHover: blue[200],
  primaryColorActive: blue[100],
  textColorOnPrimary: neutral[100],
  textColor: neutral[600],
  textColorInverted: neutral[100],
  disabled: neutral[400],
  textOnDisabled: neutral[300],
  primaryFont,
};
```

src/components/Buttons.js

```jsx
const PrimaryButton = styled(Button)`
  background-color: ${defaultTheme.primaryColor};
  border: none;
  color: white;

  &:disabled {
    background-color: ${defaultTheme.disabled};
    color: ${defaultTheme.textOnDisabled};
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(Button)`
  background: none;
  border: 2px solid ${defaultTheme.primaryColor};
  color: ${defaultTheme.primaryColor};

  &:disabled {
    background: none;
    color: ${defaultTheme.disabled};
    border: ${defaultTheme.disabled};
    cursor: not-allowed;
  }
`;

export const TertiaryButton = styled(Button)`
  background: none;
  border: none;
  color: ${defaultTheme.primaryColor};

  &:disabled {
    background: none;
    color: ${defaultTheme.disabled};
    cursor: not-allowed;
  }
`;
```

### 6. styled-components-modifiers를 이용한 state 추가

styled-components-modifiers를 설치한다.

```cmd
yarn add styled-components-modifiers
```

src/components/Buttons.js

```js
import styled from 'styled-components';
import { defaultTheme, typeScale } from '../utils';
import { applyStyleModifiers } from 'styled-components-modifiers';

const BUTTON_MODIFIERS = {
  small: () => `
    font-size: ${typeScale.helpText};
    padding: 8px;
  `,
  large: () => `
    font-size: ${typeScale.h5}
    padding: 16px 24px;
  `,
};

const Button = styled.button`
  padding: 12px 24px;
  font-size: ${typeScale.paragraph};
  border-radius: 2px;
  min-width: 100px;
  cursor: pointer;
  font-family: 'Roboto Mono', monospace;
  transition: background-color 0.2s linear, color 0.2s linear;

  &:hover {
    background-color: ${defaultTheme.primaryColorHover};
    color: ${defaultTheme.textColorOnPrimary};
  }

  &:focus {
    outline: 3px solid ${defaultTheme.primaryColorHover};
    outline-offset: 2px;
  }

  &:active {
    background-color: ${defaultTheme.primaryColorActive};
    border-color: ${defaultTheme.primaryColorActive};
    color: ${defaultTheme.textColorOnPrimary};
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${defaultTheme.primaryColor};
  border: none;
  color: white;

  &:disabled {
    background-color: ${defaultTheme.disabled};
    color: ${defaultTheme.textOnDisabled};
    cursor: not-allowed;
  }

  ${applyStyleModifiers(BUTTON_MODIFIERS)}
`;

export const SecondaryButton = styled(Button)`
  background: none;
  border: 2px solid ${defaultTheme.primaryColor};
  color: ${defaultTheme.primaryColor};

  &:disabled {
    background: none;
    color: ${defaultTheme.disabled};
    border: ${defaultTheme.disabled};
    cursor: not-allowed;
  }

  ${applyStyleModifiers(BUTTON_MODIFIERS)}
`;

export const TertiaryButton = styled(Button)`
  background: none;
  border: none;
  color: ${defaultTheme.primaryColor};

  &:disabled {
    background: none;
    color: ${defaultTheme.disabled};
    cursor: not-allowed;
  }

  ${applyStyleModifiers(BUTTON_MODIFIERS)}
`;

export default PrimaryButton;
```

`BUTTON_MODIFIERS`를 추가하고 font-size와 padding을 조정하여 small, large 버튼의 상태를 만들었다.

그리고 각 버튼에 `applyStyleModifiers`이용하여 `BUTTON_MODIFIERS`를 적용한다.

src/index.js

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import PrimaryButton, {
  SecondaryButton,
  TertiaryButton,
} from './components/Buttons';
import { GlobalStyle } from './utils';

const App = () => (
  <>
    <PrimaryButton modifiers="small">PrimaryButton</PrimaryButton>
    <SecondaryButton modifiers={['large']}>SecondaryButton</SecondaryButton>
    <TertiaryButton disabled>TertiaryButton</TertiaryButton>
    <GlobalStyle />
  </>
);

ReactDOM.render(<App />, document.querySelector('#root'));
```

각 button에 modifiers를 이용하여 button의 추가 상태를 정의할 수 있다.

### 7 styled-components-modifiers를 이용한 state 추가 2

themes.js 파일에 warning, error, success를 정의한다.

```js
import { blue, neutral, yellow, red, green } from './colors';
import { primaryFont } from './typography';

export const defaultTheme = {
  primaryColor: blue[300],
  primaryColorHover: blue[200],
  primaryColorActive: blue[100],
  textColorOnPrimary: neutral[100],
  textColor: neutral[600],
  textColorInverted: neutral[100],
  disabled: neutral[400],
  textOnDisabled: neutral[300],
  primaryFont,
  status: {
    warningColor: yellow[100],
    warningColorHover: yellow[200],
    warningColorActive: yellow[300],
    errorColor: red[100],
    errorColorHover: red[200],
    errorColorActive: red[300],
    successColor: green[100],
    successColorHover: green[200],
    successColorActive: green[300]
  }
};
```

`BUTTON_MODIFIERS`에 각 상태를 추가한다.

```js
const BUTTON_MODIFIERS = {
  small: () => `
    font-size: ${typeScale.helpText};
    padding: 8px;
  `,
  large: () => `
    font-size: ${typeScale.h5};
    padding: 16px 24px;
  `,
  warning: () => `
    background: none;
    color: ${defaultTheme.status.warningColor};
    &:hover, &:focus {
      background-color: ${defaultTheme.status.warningColorHover};
      outline: 3px solid ${defaultTheme.status.warningColorHover};
      outline-offset: 2px;
      border: 2px solid transparent;
    }

    &:active {
      background-color: ${defaultTheme.status.warningColorActive};
    }
  `,
  primaryButtonWarning: () => `
    background-color: ${defaultTheme.status.warningColor};
    color: ${defaultTheme.textColorInverted};
  `,
  secondaryButtonWarning: () => `
    border: 2px solid ${defaultTheme.status.warningColor};
  `,
  error: () => `
    background: none;
    color: ${defaultTheme.status.errorColor};
    &:hover, &:focus {
      background-color: ${defaultTheme.status.errorColorHover};
      outline: 3px solid ${defaultTheme.status.errorColorHover};
      outline-offset: 2px;
      border: 2px solid transparent;
    }
    &:active {
      background-color: ${defaultTheme.status.errorColorActive};
    }
  `,
  primaryButtonError: () => `
    background-color: ${defaultTheme.status.errorColor};
    color: ${defaultTheme.textColorInverted};
  `,
  secondaryButtonError: () => `
    border: 2px solid ${defaultTheme.status.warningColor};
  `,
  success: () => `
    background: none;
    color: ${defaultTheme.status.successColor};
    &:hover, &:focus {
      background-color: ${defaultTheme.status.successColorHover};
      outline: 3px solid ${defaultTheme.status.successColorHover};
      outline-offset: 2px;
      border: 2px solid transparent;
    }
    &:active {
      background-color: ${defaultTheme.status.successColorActive};
    }
  `,
  primaryButtonSuccess: () => `
    background-color: ${defaultTheme.status.successColor};
    color: ${defaultTheme.textColorInverted};
  `,
  secondaryButtonSuccess: () => `
    border: 2px solid ${defaultTheme.status.warningColor};
  `,
};
```

index.js에서 다음과 같이 활용할 수 있다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import PrimaryButton, {
  SecondaryButton,
  TertiaryButton,
} from './components/Buttons';
import { GlobalStyle } from './utils';

const App = () => (
  <>
    <PrimaryButton modifiers={['small', 'error', 'primaryButtonError']}>
      PrimaryButton
    </PrimaryButton>
    <SecondaryButton modifiers={['large', 'warning', 'secondaryButtonWarning']}>
      SecondaryButton
    </SecondaryButton>
    <TertiaryButton disabled>TertiaryButton</TertiaryButton>
    <GlobalStyle />
  </>
);

ReactDOM.render(<App />, document.querySelector('#root'));
```

### 8. Theme 추가

themes.js 파일을 다음과 같이 수정한다.

```jsx
import { blue, neutral, yellow, red, green } from './colors';
import { primaryFont } from './typography';

export const defaultTheme = {
  primaryColor: blue[300],
  primaryColorHover: blue[200],
  primaryColorActive: blue[100],
  textColorOnPrimary: neutral[100],
  textColor: neutral[600],
  textColorInverted: neutral[100],
  disabled: neutral[400],
  textOnDisabled: neutral[300],
  primaryFont,
  status: {
    warningColor: yellow[100],
    warningColorHover: yellow[200],
    warningColorActive: yellow[300],
    errorColor: red[100],
    errorColorHover: red[200],
    errorColorActive: red[300],
    successColor: green[100],
    successColorHover: green[200],
    successColorActive: green[300],
  },
};

export const darkTheme = {
  primaryColor: neutral[100],
  primaryHoverColor: neutral[200],
  primaryActiveColor: neutral[300],
  textColorOnPrimary: blue[300],
  textColor: blue[300],
  textColorInverted: neutral[100],
  primaryFont: primaryFont,
  disabled: neutral[400],
  textOnDisabled: neutral[300],
  status: {
    warningColor: yellow[100],
    warningColorHover: yellow[200],
    warningColorActive: yellow[300],
    errorColor: red[100],
    errorColorHover: red[200],
    errorColorActive: red[300],
    successColor: green[100],
    successColorHover: green[200],
    successColorActive: green[300],
  },
};
```

src/index.js

```jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import PrimaryButton, {
  SecondaryButton,
  TertiaryButton,
} from './components/Buttons';
import { GlobalStyle, defaultTheme, darkTheme } from './utils';

const App = () => {
  const [useDarkTheme, setUseDarkTheme] = useState(false);
  return (
    <ThemeProvider theme={useDarkTheme ? darkTheme : defaultTheme}>
      <button
        style={{ margin: '0 16px 14px', padding: '8px', background: 'none' }}
        onClick={() => setUseDarkTheme(true)}
      >
        Dark Theme
      </button>
      <button
        style={{ margin: '0 16px 14px', padding: '8px', background: 'none' }}
        onClick={() => setUseDarkTheme(false)}
      >
        Default Theme
      </button>
      <div
        style={{
          background: useDarkTheme
            ? defaultTheme.primaryColor
            : darkTheme.primaryColor,
          width: '100vw',
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <PrimaryButton modifiers={['small']}>
          PrimaryButton
        </PrimaryButton>
        <SecondaryButton
          modifiers={['large']}
        >
          SecondaryButton
        </SecondaryButton>
        <TertiaryButton disabled>TertiaryButton</TertiaryButton>
        <GlobalStyle />
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
```

`ThemeProvider`를 추가하고 theme을 선택할 수 있도록 useState로 상태를 설정한다.

Buttons.js

```js
import styled from 'styled-components';
import { typeScale } from '../utils';
import { applyStyleModifiers } from 'styled-components-modifiers';

const BUTTON_MODIFIERS = {
  small: () => `
    font-size: ${typeScale.helpText};
    padding: 8px;
  `,
  large: () => `
    font-size: ${typeScale.h5};
    padding: 16px 24px;
  `,
  warning: ({ theme }) => `
    background: none;
    color: ${theme.status.warningColor};
    &:hover, &:focus {
      background-color: ${theme.status.warningColorHover};
      outline: 3px solid ${theme.status.warningColorHover};
      outline-offset: 2px;
      border: 2px solid transparent;
    }

    &:active {
      background-color: ${theme.status.warningColorActive};
    }
  `,
  primaryButtonWarning: ({ theme }) => `
    background-color: ${theme.status.warningColor};
    color: ${theme.textColorInverted};
  `,
  secondaryButtonWarning: ({ theme }) => `
    border: 2px solid ${theme.status.warningColor};
  `,
  error: ({ theme }) => `
    background: none;
    color: ${theme.status.errorColor};
    &:hover, &:focus {
      background-color: ${theme.status.errorColorHover};
      outline: 3px solid ${theme.status.errorColorHover};
      outline-offset: 2px;
      border: 2px solid transparent;
    }
    &:active {
      background-color: ${theme.status.errorColorActive};
    }
  `,
  primaryButtonError: ({ theme }) => `
    background-color: ${theme.status.errorColor};
    color: ${theme.textColorInverted};
  `,
  secondaryButtonError: ({ theme }) => `
    border: 2px solid ${theme.status.warningColor};
  `,
  success: ({ theme }) => `
    background: none;
    color: ${theme.status.successColor};
    &:hover, &:focus {
      background-color: ${theme.status.successColorHover};
      outline: 3px solid ${theme.status.successColorHover};
      outline-offset: 2px;
      border: 2px solid transparent;
    }
    &:active {
      background-color: ${theme.status.successColorActive};
    }
  `,
  primaryButtonSuccess: ({ theme }) => `
    background-color: ${theme.status.successColor};
    color: ${theme.textColorInverted};
  `,
  secondaryButtonSuccess: ({ theme }) => `
    border: 2px solid ${theme.status.warningColor};
  `,
};

const Button = styled.button`
  padding: 12px 24px;
  font-size: ${typeScale.paragraph};
  border-radius: 2px;
  min-width: 100px;
  cursor: pointer;
  font-family: 'Roboto Mono', monospace;
  transition: background-color 0.2s linear, color 0.2s linear;

  &:hover {
    background-color: ${props => props.theme.primaryColorHover};
    color: ${props => props.theme.textColorOnPrimary};
  }

  &:focus {
    outline: 3px solid ${props => props.theme.primaryColorHover};
    outline-offset: 2px;
  }

  &:active {
    background-color: ${props => props.theme.primaryColorActive};
    border-color: ${props => props.theme.primaryColorActive};
    color: ${props => props.theme.textColorOnPrimary};
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${props => props.theme.primaryColor};
  border: none;
  color: ${props => props.theme.textColorOnPrimary};

  &:disabled {
    background-color: ${props => props.theme.disabled};
    color: ${props => props.theme.textOnDisabled};
    cursor: not-allowed;
  }

  ${applyStyleModifiers(BUTTON_MODIFIERS)}
`;

export const SecondaryButton = styled(Button)`
  background: none;
  border: 2px solid ${props => props.theme.primaryColor};
  color: ${props => props.theme.primaryColor};

  &:disabled {
    background: none;
    color: ${props => props.theme.disabled};
    border: ${props => props.theme.disabled};
    cursor: not-allowed;
  }

  ${applyStyleModifiers(BUTTON_MODIFIERS)}
`;

export const TertiaryButton = styled(Button)`
  background: none;
  border: none;
  color: ${props => props.theme.primaryColor};

  &:disabled {
    background: none;
    color: ${props => props.theme.disabled};
    cursor: not-allowed;
  }

  ${applyStyleModifiers(BUTTON_MODIFIERS)}
`;

export default PrimaryButton;
```

src/index.js 에서 전달되는 theme 변수를 받아 theme을 설정한다.

### 9. Modal 추가

#### svg import

svg 파일을 import 해보자.

src/assets/illustrations 폴더를 만들고 svg 파일을 저장한다.

src/assets/index.js 파일을 추가한다.

```js
import SignUp from './illustrations/SignUp.svg';

export const Illustrations = {
  SignUp,
};
```

다른 방식으로 다음과 같이 svg 파일을 추가할 수 있다.

src/assets/icons/CloseIcon.js 파일을 추가한다.

```js
import React from 'react';
import styled from 'styled-components';

const CloseIconWrapper = styled.svg`
  width: 100%;
  height: 100%;
`;

export const CloseIcon = () => (
  <CloseIconWrapper aria-hidden="true">
    <path
      d="M14.0069 11.9675L23.6255 2.35078C23.872 2.08632 24.0062 1.73654 23.9998 1.37512C23.9934 1.0137 23.847 0.668862 23.5913 0.413259C23.3357 0.157657 22.9908 0.0112437 22.6293 0.00486683C22.2678 -0.00151001 21.9179 0.132647 21.6534 0.379074L12.0348 9.99581L2.4162 0.374423C2.15169 0.127997 1.80184 -0.00615949 1.44035 0.000217348C1.07886 0.00659419 0.733953 0.153006 0.478301 0.408609C0.222649 0.664211 0.0762072 1.00905 0.0698292 1.37047C0.0634511 1.73189 0.197634 2.08167 0.444109 2.34613L10.0627 11.9675L0.444109 21.5843C0.307017 21.712 0.197059 21.866 0.120795 22.0371C0.0445312 22.2083 0.0035228 22.393 0.000217153 22.5803C-0.00308849 22.7676 0.0313764 22.9537 0.101555 23.1274C0.171734 23.3011 0.276189 23.4589 0.408689 23.5914C0.541189 23.7239 0.699019 23.8283 0.872764 23.8985C1.04651 23.9686 1.23261 24.0031 1.41996 23.9998C1.60732 23.9965 1.79209 23.9555 1.96325 23.8792C2.13441 23.803 2.28846 23.693 2.4162 23.556L12.0348 13.9392L21.6534 23.556C21.9179 23.8024 22.2678 23.9366 22.6293 23.9302C22.9908 23.9238 23.3357 23.7774 23.5913 23.5218C23.847 23.2662 23.9934 22.9214 23.9998 22.5599C24.0062 22.1985 23.872 21.8487 23.6255 21.5843L14.0069 11.9675Z"
      fill="#737581"
    />
  </CloseIconWrapper>
);
```

#### Modal component 추가

```js
import React from 'react';
import styled from 'styled-components';
import { typeScale } from '../utils';
import { Illustrations, CloseIcon } from '../assets';
import { PrimaryButton } from './Buttons';

const ModalWrapper = styled.div`
  width: 800px;
  height: 600px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background-color: ${(props) => props.theme.formElementBackground};
  color: ${(props) => props.theme.textOnFormElementBackground};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 2px;
`;

const SignUpHeader = styled.h3`
  font-size: ${typeScale.h3};
  max-width: 70%;
  text-align: center;
`;

const SignUpText = styled.p`
  font-size: ${typeScale.paragraph};
  max-width: 70%;
  text-align: center;
`;

const CloseModalButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  position: absolute;
  top: 40px;
  right: 40px;
  width: 24px;
  height: 24px;
  padding: 0;
`;

export const SignUpModal = () => {
  return (
    <ModalWrapper>
      <img
        src={Illustrations.SignUp}
        alt="Sign up for an account"
        aria-hidden="true"
      />
      <SignUpHeader>Sign Up</SignUpHeader>
      <SignUpText>Sign up today to get access!</SignUpText>
      <PrimaryButton>Sign Up!</PrimaryButton>
      <CloseModalButton aria-label="Close modal">
        <CloseIcon />
      </CloseModalButton>
    </ModalWrapper>
  );
};
```

src/index.js 파일에 SignUpModal을 추가한다.

Modal을 컨트롤 할 수 있도록 useState를 추가하고 SignUpModal에 props로 전달한다.

```js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { SignUpModal } from './components';
import { GlobalStyle, defaultTheme, darkTheme } from './utils';

const App = () => {
  const [useDarkTheme, setUseDarkTheme] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <ThemeProvider theme={useDarkTheme ? darkTheme : defaultTheme}>
      <button
        style={{ margin: '0 16px 14px', padding: '8px', background: 'none' }}
        onClick={() => setUseDarkTheme(true)}
      >
        Dark Theme
      </button>
      <button
        style={{ margin: '0 16px 14px', padding: '8px', background: 'none' }}
        onClick={() => setUseDarkTheme(false)}
      >
        Default Theme
      </button>
      <button
        style={{ margin: '0 16px 14px', padding: '8px', background: 'none' }}
        onClick={() => setShowModal(!showModal)}
      >
        Toggle Modal
      </button>
      <div
        style={{
          background: useDarkTheme
            ? defaultTheme.primaryColor
            : darkTheme.primaryColor,
          width: '100vw',
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <SignUpModal showModal={showModal} setShowModal={setShowModal} />
        <GlobalStyle />
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
```

#### Modal에 animation 추가

react-spring 을 설치한다.

```cmd
yarn add react-spring
```

Modal에 animation을 추가한다.

```jsx
import React from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from 'react-spring';
import { typeScale } from '../utils';
import { Illustrations, CloseIcon } from '../assets';
import { PrimaryButton } from './Buttons';

const ModalWrapper = styled.div`
  width: 800px;
  height: 600px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background-color: ${(props) => props.theme.formElementBackground};
  color: ${(props) => props.theme.textOnFormElementBackground};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 2px;
`;

const SignUpHeader = styled.h3`
  font-size: ${typeScale.h3};
  max-width: 70%;
  text-align: center;
`;

const SignUpText = styled.p`
  font-size: ${typeScale.paragraph};
  max-width: 70%;
  text-align: center;
`;

const CloseModalButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  position: absolute;
  top: 40px;
  right: 40px;
  width: 24px;
  height: 24px;
  padding: 0;
`;

export const SignUpModal = ({ showModal, setShowModal }) => {
  const animation = useSpring({
    opacity: showModal ? 1 : 0,
    transform: showModal ? 'translateY(0)' : 'translateY(-200%)',
    config: config.slow,
  });
  return (
    <animated.div style={animation}>
      <ModalWrapper>
        <img
          src={Illustrations.SignUp}
          alt="Sign up for an account"
          aria-hidden="true"
        />
        <SignUpHeader>Sign Up</SignUpHeader>
        <SignUpText>Sign up today to get access!</SignUpText>
        <PrimaryButton>Sign Up!</PrimaryButton>
        <CloseModalButton aria-label="Close modal">
          <CloseIcon />
        </CloseModalButton>
      </ModalWrapper>
    </animated.div>
  );
};
```

### 배운 점, 느낀 점

내가 작성하던 코드보다 훨씬 더 깔끔하다. 하나 배웠으니 바로 써먹어봐야겠다.

앞으로는 어설프게 달려들지 말고 밑에서 부터 차근차근 쌓아간다는 느낌을 가지고 만들어야겠다.

나머지 내용도 잊어버리지 말고 정리하자.
