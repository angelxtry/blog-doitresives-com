---
title: "[Design Systems with React & Storybook] 2. Storybook"
date: 2020-06-29 22:06:91
category: development
---

## 1. 설치

storybook을 설치한다.

```cmd
npx -p @storybook/cli sb init
```

설치가 완료되면 src/stories, .storybook 폴더가 생성된다.

scr/components에 코드를 추가할 것이므로 src/stories 폴더는 삭제한다.

## 2. addon-docs

addon을 설치한다.

```cmd
yarn add @storybook/preset-create-react-app actions @storybook/addon-docs
```

.storybook/main.js에 addon-docs를 추가한다.

```js
module.exports = {
  stories: ['../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
};
```

src/components/Button.stories.mdx 파일을 추가한다.

```js
import { Meta, Story, Preview } from '@storybook/addon-docs/blocks';
import { PrimaryButton, SecondaryButton, TertiaryButton } from './Buttons';

<Meta title="Design System|Buttons" component={PrimaryButton} />

# Buttons

Buttons are used to trigger actions within an application.

## Usage

Buttons are used to trigger internal actions within your web applications.

## Primary Buttons

Primary buttons are used as a call to action and indicate the most important action on a page.

<Preview withToolbar>
  <Story name="primary">
    <PrimaryButton>Hello world</PrimaryButton>
  </Story>
</Preview>

## Secondary Buttons

Primary buttons are used as a call to action and indicate the most important action on a page.

<Preview withToolbar>
  <Story name="secondary">
    <SecondaryButton>Hello world</SecondaryButton>
  </Story>
</Preview>

## Tertiary Buttons

Primary buttons are used as a call to action and indicate the most important action on a page.

<Story name="tertiary">
  <TertiaryButton>Hello world</TertiaryButton>
</Story>
```

## 3. addon-backgrouds,addon-contexts

addon-backgrouds,addon-contexts를 설치한다.

```cmd
yarn add @storybook/addon-backgrounds @storybook/addon-contexts
```

.storybook 폴더에 contexts.js 파일을 추가한다.

```js
import { ThemeProvider } from 'styled-components';
import { defaultTheme, darkTheme } from '../src/utils';

export const contexts = [
  {
    icon: 'box',
    title: 'Themes',
    components: [ThemeProvider],
    params: [
      {
        name: 'Default Theme',
        props: { theme: defaultTheme, default: true },
      },
      {
        name: 'Dark Theme',
        props: { theme: darkTheme },
      },
    ],
    options: {
      deep: true,
      disable: false,
      cancelable: false,
    }
  },
];
```

.storybook 폴더에 preview.js 파일을 추가한다.

```js
import { addParameters, addDecorator } from '@storybook/react';
import { withContexts } from '@storybook/addon-contexts/react';
import { contexts } from './contexts';

addParameters({
  backgrounds: [
    { name: 'Default Theme', value: '#ffffff', default: true },
    { name: 'Dark Theme', value: '#050449' },
  ],
});

addDecorator(withContexts(contexts));
```

storybook을 다시 실행하면 상단 메뉴에 아이콘이 추가된 것을 확인할 수 있다.

해당 아이콘을 클릭하면 Theme과 background color를 변경가능하다.

## 4. action

action을 추가하면 특정 UI의 동작을 확인할 수 있다.

```js
import { Meta, Story, Preview } from '@storybook/addon-docs/blocks';
import { action } from '@storybook/addon-actions';
import { PrimaryButton, SecondaryButton, TertiaryButton } from './Buttons';

<Meta title="Design System|Buttons" component={PrimaryButton} />

# Buttons

Buttons are used to trigger actions within an application.

## Usage

Buttons are used to trigger internal actions within your web applications.

## Primary Buttons

Primary buttons are used as a call to action and indicate the most important action on a page.

<Preview withToolbar>
  <Story name="primary">
    <PrimaryButton onClick={action('button-click')}>Hello world</PrimaryButton>
  </Story>
</Preview>

## Secondary Buttons

Primary buttons are used as a call to action and indicate the most important action on a page.

<Preview withToolbar>
  <Story name="secondary">
    <SecondaryButton>Hello world</SecondaryButton>
  </Story>
</Preview>

## Tertiary Buttons

Primary buttons are used as a call to action and indicate the most important action on a page.

<Story name="tertiary">
  <TertiaryButton>Hello world</TertiaryButton>
</Story>
```

## 5. addon-knobs

addon-knobs를 설치한다.

```cmd
yarn add @storybook/addon-knobs
```

.storybook/main.js에 konbs를 추가한다.

```js
module.exports = {
  stories: ['../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-contexts/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-knobs',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
};
```

.storybook/preview.js에도 knobs를 추가한다.

```js
import { addParameters, addDecorator } from '@storybook/react';
import { withContexts } from '@storybook/addon-contexts/react';
import { withKnobs } from '@storybook/addon-knobs';
import { contexts } from './contexts';

addParameters({
  backgrounds: [
    { name: 'Default Theme', value: '#ffffff', default: true },
    { name: 'Dark Theme', value: '#050449' },
  ],
});

addDecorator(withContexts(contexts));
addDecorator(withKnobs);
```

src/components/Buttons.stories.mdx에서 knobs를 활용할 수 있다.

```js
import { Meta, Story, Preview } from '@storybook/addon-docs/blocks';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { PrimaryButton, SecondaryButton, TertiaryButton } from './Buttons';

<Meta title="Design System|Buttons" component={PrimaryButton} />

# Buttons

Buttons are used to trigger actions within an application.

## Usage

Buttons are used to trigger internal actions within your web applications.

## Primary Buttons

Primary buttons are used as a call to action and indicate the most important action on a page.

<Preview withToolbar>
  <Story name="primary">
    <PrimaryButton disabled={boolean("Disabled", false)} onClick={action('button-click')}>Hello world</PrimaryButton>
  </Story>
</Preview>

## Secondary Buttons

Primary buttons are used as a call to action and indicate the most important action on a page.

<Preview withToolbar>
  <Story name="secondary">
    <SecondaryButton>Hello world</SecondaryButton>
  </Story>
</Preview>

## Tertiary Buttons

Primary buttons are used as a call to action and indicate the most important action on a page.

<Story name="tertiary">
  <TertiaryButton>Hello world</TertiaryButton>
</Story>
```

## 6. Storybook에 Modals 추가

src/components/Modals.stories.mdx 파일을 추가한다.

```js
import { Meta, Story, Preview } from '@storybook/addon-docs/blocks';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { SignUpModal } from './Modals';

<Meta title="Design System|Modals" component={SignUpModal} />

# Modals

Modals are dialogs which overlay content to convey.

## Usage

Use modals to call the user to action or complete a task.

## Sign Up Modal

The SignUpModal is used to prompt the user to create an account.

<Preview withToolbar>
  <Story name="signUp">
    <SignUpModal showModal={boolean('Show Modal', true)} />
  </Story>
</Preview>
```

## 7. addon-a11y accessibility

addon-a11y를 설치한다.

```cmd
yarn add @storybook/addon-a11y
```

main.js와 preview.js에 등록한다.

```js
module.exports = {
  stories: ['../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-contexts/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y/register',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
};
```

```js
import { addParameters, addDecorator } from '@storybook/react';
import { withContexts } from '@storybook/addon-contexts/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { contexts } from './contexts';

addParameters({
  backgrounds: [
    { name: 'Default Theme', value: '#ffffff', default: true },
    { name: 'Dark Theme', value: '#050449' },
  ],
});

addDecorator(withContexts(contexts));
addDecorator(withKnobs);
addDecorator(withA11y);
```

storybook의 하단 Accessibility tab에서 a11y 항목을 확인할 수 있다.

## 배운 것, 느낀 것

사이드 프로젝트에 Storybook을 붙여보고 싶은 마음이 무럭무럭 생긴다. 공부한 것을 주욱 적다보니, 왜 Storybook을 사용하는지, 장점이 무엇인지 등은 따로 적지 않았다. 순서가 반대지만 이 내용도 한번 적어봐야겠다.

Storybook을 사용해보면서 드는 생각은 Design system을 만들기에도 좋은 도구지만, 기존 프로젝트를 문서화하기에도 좋은 도구라고 생각된다.

꼭 사용해보자.
