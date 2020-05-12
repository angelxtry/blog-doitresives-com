---
title: "Styled Components porps 사용법 및 warning 해결"
date: 2020-05-13 01:05:19
category: development
---

토이 프로젝트에 styled components를 사용하고 있다.

props를 전달하는 방법, 삽질한 내용을 정리해보자.

## props 전달

```tsx
interface ContainerType {
  isAddPage: boolean;
}

const FormContainer = styled(Form)<ContainerType>`
  display: grid;
  grid-template-rows: 100px 100px 100px 100px auto 100px;
  background-color: ${(props) => props.theme.colors.formBackgroundColor};
  width: 100vw;

  ${(props) =>
    props.isAddPage
      ? css`
          border-radius: 20px;
          box-shadow: 0 0 10px 0 rgba(50, 50, 50, 0.12);
        `
      : css``};

  @media (min-width: 600px) {
    width: 600px;
  }
`;

export default function BookInfoForm({ isAddPage }: BookInfoFormProps) {
  return (
    <FormContainer id="bookInfoForm" isAddPage={isAddPage}>
      <Label htmlFor="title">
      </Label>
    </FormContainer>
  );
}
```

코드의 일부를 가져왔다.

BookInfoForm 함수에서 FormContainer에 isAddPage라는 props를 전달한다.

type을 명시하기 위해 ContainerType이라는 interface를 사용했다.

이 코드를 실행하면 chrome에서 정상동작한다. 하지만 conole에 warning 메시지가 출력된다.

```js
Warning: React does not recognize the `isAddPage` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `isaddpage` instead. If you accidentally passed it from a parent component, remove it from the DOM element.
```

isaddpage로 수정하려다가 뭔가 이상해서 검색해보니 v4 버전의 버그라고 하는 것 같다.

`data-*` attributes 속성을 권장해서 코드를 고쳐봤다.

```tsx
interface ContainerType {
  'data-is-add-page': boolean;
}

const FormContainer = styled(Form)<ContainerType>`
  display: grid;
  grid-template-rows: 100px 100px 100px 100px auto 100px;
  background-color: ${(props) => props.theme.colors.formBackgroundColor};
  width: 100vw;

  ${(props) =>
    props['data-is-add-page']
      ? css`
          border-radius: 20px;
          box-shadow: 0 0 10px 0 rgba(50, 50, 50, 0.12);
        `
      : css``};

  @media (min-width: 600px) {
    width: 600px;
  }
`;

export default function BookInfoForm({ isAddPage }: BookInfoFormProps) {
  return (
    <FormContainer id="bookInfoForm" data-is-add-page={isAddPage}>
      <Label htmlFor="title">
      </Label>
    </FormContainer>
  );
}
```

위와 같이 코드를 수정하니 warning이 사라졌다.

## 느낀 점, 배운 점

styled components도 사용할 수록 익숙해지긴하는데 css를 간소하게 작성하는 능력이 아직 부족하다는 것을 느낀다.

조만간 날잡고 전체적으로 css를 한번 정리하는 시간을 가져야겠다.
