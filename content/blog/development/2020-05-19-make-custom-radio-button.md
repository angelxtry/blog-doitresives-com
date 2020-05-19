---
title: Custom Radio Button을 만들어보자
date: 2020-05-19 14:05:71
category: development
---

![Color Selector](https://drive.google.com/uc?export=view&id=1SDFCBcqKIRX6zRBUxqAfTZrKX8liZWHp)

요런 걸 만들어보자.

색깔은 라디오 버튼으로 만들었다.

색깔을 선택하면 스마일 이모지가 선택한 색깔로 이동한다.

여기서 사용해 볼 수 있다.

<https://blog.doitreviews.com/custom-radio-button/>

## 1. 준비

이전에 만들어 둔 git repo를 clone하자.

<https://github.com/angelxtry/react-typescript-without-cra>

git clone 후 yarn으로 package를 설치한다.

styled-components를 사용할 것이다. 설치하다.

```js
yarn add styled-components
yarn add -D @types/styled-components
```

불필요한 파일들을 삭제하자.

폴더 및 파일을 다음과 같다.

```js
tree -I node_modules
.
├── README.md
├── package.json
├── src
│   ├── App.tsx
│   ├── images
│   ├── index.html
│   ├── index.tsx
│   └── types
│       └── custom.d.ts
├── tsconfig.json
├── webpack.config.js
└── yarn.lock
```

## 2. Custom Radio Button 생성

CustomRadioButton.tsx 파일을 생성한다.

```tsx
import React from 'react';

const Colors = [
  { name: 'RED', hex: '#ffb598' },
  { name: 'ORANGE', hex: '#ffdcaa' },
  { name: 'PURPLE', hex: '#d7beff' },
  { name: 'CYAN', hex: '#c7f5ed' },
  { name: 'BLUE', hex: '#c2dbff' },
];

export function CustonRadioButton() {
  return (
    <>
      {Colors.map((color) => (
        <div key={color.name}>
          <input
            id={color.name}
            type="radio"
            name="color-selector"
            value={color.name}
          />
          <label htmlFor={color.name}>{color.name}</label>
        </div>
      ))}
    </>
  );
}
```

기본적인 라디오 버튼을 생성했다.

App.tsx

```tsx
import React from 'react';
import { CustonRadioButton } from './CustonRadioButton';

export default function App() {
  return (
    <div>
      <h1>색깔을 선택하세요!</h1>
      <CustonRadioButton />
    </div>
  );
}
```

화면에 출력했다.

## 3. 스타일 추가, 라디오 버튼 숨기기

styled-components로 스타일을 추가한다.

```tsx
import React from 'react';
import styled from 'styled-components';
import selectIconUrl from './images/ic-selected.svg';

const Colors = [
  { name: 'RED', hex: '#ffb598' },
  { name: 'ORANGE', hex: '#ffdcaa' },
  { name: 'PURPLE', hex: '#d7beff' },
  { name: 'CYAN', hex: '#c7f5ed' },
  { name: 'BLUE', hex: '#c2dbff' },
];

const ColorSelectorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
  margin-top: 8px;
  padding: 10px;
  border: 1px solid salmon;
`;

const Label = styled.label`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props) => props.color};
`;

const RadioButton = styled.input`
  display: none;
  &:checked + ${Label} {
    background: center url(${selectIconUrl}) no-repeat ${(props) => props.color};
  }
`;

export function CustonRadioButton() {
  return (
    <>
      <ColorSelectorContainer>
        {Colors.map((color) => (
          <div key={color.name}>
            <RadioButton
              id={color.name}
              type="radio"
              name="color-selector"
              value={color.name}
              color={color.hex}
            />
            <Label htmlFor={color.name} color={color.hex} />
          </div>
        ))}
      </ColorSelectorContainer>
    </>
  );
}
```

label과 input에 color.hex를 전달하여 backgroundColor를 설정한다.

input에 `display: none;`을 적용하면 라디오 버튼이 사라지고 label만 남는다.

## 4. 초기값 설정, 선택한 색 출력

몇 가지 기능을 더 추가해보자.

라디오 버튼이 생성될 때 하나의 값이 선택되어 있도록 초기값을 설정하도록 한다.

그리고 특정 색을 선택하면 해당 색의 이름이 출력되고 border가 해당 색으로 변경되도록 설정한다.

CustomRadioButton.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import selectIconUrl from './images/ic-selected.svg';

type Color = {
  name: string;
  hex: string;
};

const Colors: Color[] = [
  { name: 'RED', hex: '#ffb598' },
  { name: 'ORANGE', hex: '#ffdcaa' },
  { name: 'PURPLE', hex: '#d7beff' },
  { name: 'CYAN', hex: '#c7f5ed' },
  { name: 'BLUE', hex: '#c2dbff' },
];

const ColorSelectorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
  margin-top: 8px;
  padding: 10px;
  border: 5px solid ${(props) => props.color};
`;

const Label = styled.label`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props) => props.color};
`;

const RadioButton = styled.input`
  display: none;
  &:checked + ${Label} {
    background: center url(${selectIconUrl}) no-repeat ${(props) => props.color};
  }
`;

const SelectResult = styled.div`
  font-family: 'apple sd gothic neo';
`;

interface CustonRadioButtonProps {
  initialColor: Color;
}

export function CustonRadioButton({ initialColor }: CustonRadioButtonProps) {
  const [selectedColor, setSelectedColor] = useState<Color>(initialColor);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const selected = Colors.filter((color) => color.name === value);
    if (selected) {
      setSelectedColor(selected[0]);
    }
  };

  return (
    <>
      <ColorSelectorContainer color={selectedColor.hex}>
        {Colors.map((color) => (
          <div key={color.name}>
            <RadioButton
              id={color.name}
              type="radio"
              name="color-selector"
              value={color.name}
              checked={color.name === selectedColor.name}
              color={color.hex}
              onChange={onChange}
            />
            {/* {color.name} */}
            <Label htmlFor={color.name} color={color.hex} />
          </div>
        ))}
      </ColorSelectorContainer>
      <SelectResult>{selectedColor.name}</SelectResult>
    </>
  );
}
```

App.tsx

```tsx
import React from 'react';
import { CustonRadioButton } from './CustonRadioButton';

export default function App() {
  const initialColor = { name: 'RED', hex: '#ffb598' };
  return (
    <div>
      <h1>색깔을 선택하세요!</h1>
      <CustonRadioButton initialColor={initialColor} />
    </div>
  );
}
```

## 느낀 것, 배운 것

앞으로는 라디오 버튼 만들 때 어떻게 만들었더라... 하지 않겠지?
