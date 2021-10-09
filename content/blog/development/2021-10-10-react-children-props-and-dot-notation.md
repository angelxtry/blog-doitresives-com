---
title: 2021-10-10-react-children-props-and-dot-notation
date: 2021-10-10 02:10:75
category: development
---

![Children](https://drive.google.com/uc?export=view&id=1RTDssGCuGtUQLW3iludlihVkipLsFsbx)

컴포넌트에서 `ReactNode`를 props로 받아서 처리할 때 개별 props가 아니라 `children`을 사용하여 유연하게 처리하는 방법을 고민해봤습니다. 여기에 `Dot notation`도 함께 사용했습니다. 그리고 props의 타입도 최대한 유연하게 설정할 수 있도록 처리했습니다.

아래 내용은 동일한 코드가 여러 번 반복됩니다. 최종 버전을 바로 보고 싶은 분은 가장 마지막 코드만 보시면 됩니다.

## 개별 Props를 처리하는 공통 컴포넌트

회사에서 진행하고 있는 프로젝트에서 다음 유형의 공통 컴포넌트가 사용되고 있었습니다. 이 컴포넌트든 다른 여러 컴포넌트에서 사용하는 Layout의 일부입니다. 두 개의 prop을 받아 적절한 위치에 사용합니다.

```tsx
import { DefaultLayout } from '@/component/Layout/DefaultLayout';
import { MainHeader } from '@/component/Layout/MainHeader';

interface ContentLayoutProps {
  contentHeader: ReactNode;
  contentBody: ReactNode;
}

export const ContentLayout = ({ contentHeader, contentBody }: ContentLayoutProps) => {
  return (
    <DefaultLayout>
      <MainHeader />
      <Layout>
        <Header>{contentHeader}</Header>
        <Body>{contentBody}</Body>
      </Layout>
    </DefaultLayout>
  );
};
```

ContentLayout 컴포넌트는 다음처럼 사용되고 있었습니다.

```tsx
import { ContentHeader, ContentLayout } from '@/component';
import { CatalogRegisterForm } from '@/domain/Catalog/component';

export const CatalogRegister = () => {
  return (
    <ContentLayout
      contentHeader={<ContentHeader title='카탈로그 등록 페이지' />}
      contentBody={<CatalogRegisterForm />}
    />
  );
};
```

컴포넌트의 변화가 없다면 이 상태로도 나쁘지 않은 것 같습니다. 하지만 요구사항은 계속 변경되고 코드는 계속 수정됩니다. 만약 ContentBodyDetail 이라는 컴포넌트를 추가해야 한다고 생각해봅시다. 다음과 같이 수정하면 됩니다.

## 공통 컴포넌트 Props 추가

```tsx
interface ContentLayoutProps {
  contentHeader: ReactNode;
  contentBody: ReactNode;
  contentBodyDetail: ReactNode;
}

export const ContentLayout = ({ contentHeader, contentBody, contentBodyDetail }: ContentLayoutProps) => {
  return (
    <DefaultLayout>
      <MainHeader />
      <Layout>
        <Header>{contentHeader}</Header>
        <Content>{contentBody}</Content>
        <Content>{contentBodyDetail}</Content>
      </Layout>
    </DefaultLayout>
  );
};
```

```tsx
import { ContentHeader, ContentLayout } from '@/component';
import { CatalogBlockListRegisterForm, CatalogRegisterForm } from '@/domain/Catalog/component';

export const CatalogRegister = () => {
  return (
    <ContentLayout
      contentHeader={<ContentHeader title='카탈로그 등록 페이지' />}
      contentBody={<CatalogRegisterForm />}
	  contentBodyDetail={<CatalogBlockListRegisterForm />}
    />
  );
};
```

코드를 수정하고 저장하면 다른 곳에서 오류가 발생하는 것을 확인할 수 있습니다. ContentLayout는 CatalogRegister 컴포넌트 외에도 많이 사용되었습니다. prop이 추가되었으니 에러가 발생하는 것은 당연합니다. 추가한 컴포넌트를 optional로 변경해서 에러를 해결합시다.

```tsx
interface ContentLayoutProps {
  contentHeader: ReactNode;
  contentBody: ReactNode;
  contentBodyDetail?: ReactNode;
}

export const ContentLayout = ({ contentHeader, contentBody, contentBodyDetail }: ContentLayoutProps) => {
  return (
    <DefaultLayout>
      <MainHeader />
      <Layout>
        <Header>{contentHeader}</Header>
        <Content>{contentBody}</Content>
        {contentBodyDetail ?? <Content>{contentBodyDetail}</Content>}
      </Layout>
    </DefaultLayout>
  );
};
```


에러는 해결했지만 이렇게 코드를 수정하다보니 고민이 생깁니다.

- ContentLayout에 컴포넌트가 추가될 때마다 props를 늘려야 하나?
- 추가하는 컴포넌트는 항상 optional로 설정해야 할까?

## Props를 children으로 변경(Dot notation 적용)

이런 고민을 해결하기 위해 ContentLayout 컴포넌트를 다음과 같이 수정했습니다. 기존 ContentLayout을 사용하던 컴포넌트들을 모두 수정해야 하는 번거로움이 있습니다만 분명한 장점이 있다고 판단해서 다음과 같이 진행했습니다.

```tsx
import { DefaultLayout } from '@/component/Layout/DefaultLayout';
import { MainHeader } from '@/component/Layout/MainHeader';

interface ContentLayoutProps {
  children: ReactNode;
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <DefaultLayout>
      <MainHeader />
      <Layout>{children}</Layout>
    </DefaultLayout>
  );
};

const ContentLayoutHeader = ({ children }: ContentLayoutProps) => {
  return <Header>{children}</Header>;
};

const ContentLayoutBody = ({ children }: ContentLayoutProps) => {
  return <Content>{children}</Content>;
};

ContentLayout.Header = ContentLayoutHeader;
ContentLayout.Body = ContentLayoutBody;
```

Header, Body는 평범한 컴포넌트입니다. 단지 `ContentLayout.Header`로 정의를 추가해서 ContentLayout과 밀접하게 사용된다는 것을 명시해주었습니다.

이 컴포넌트는 다음과 같이 사용합니다.

```tsx
import { ContentHeader, ContentLayout } from '@/component';
import { CatalogRegisterForm } from '@/domain/Catalog/component';

export const CatalogRegister = () => {
  return (
	<ContentLayout>
      <ContentLayout.Header>
        <ContentHeader title='카탈로그 등록 페이지' />
      </ContentLayout.Header>
      <ContentLayout.Body>
        <CatalogRegisterForm />
      </ContentLayout.Body>
    </ContentLayout>
  );
};
```

아직 장점이 명확하게 느껴지지 않을 수 있습니다. 똑같이 컴포넌트를 하나 추가해보겠습니다. 처음의 과정과 동일하게 BodyDetail을 추가할 수 있도록 처리했습니다.

```tsx
import { DefaultLayout } from '@/component/Layout/DefaultLayout';
import { MainHeader } from '@/component/Layout/MainHeader';

interface ContentLayoutProps {
  children: ReactNode;
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <DefaultLayout>
      <MainHeader />
      <Layout>{children}</Layout>
    </DefaultLayout>
  );
};

const ContentLayoutHeader = ({ children }: ContentLayoutProps) => {
  return <Header>{children}</Header>;
};

const ContentLayoutBody = ({ children }: ContentLayoutProps) => {
  return <Content>{children}</Content>;
};

const ContentLayoutBodyDetail = ({ children }: ContentLayoutProps) => {
  return <Content>{children}</Content>;
};


ContentLayout.Header = ContentLayoutHeader;
ContentLayout.Body = ContentLayoutBody;
ContentLayout.BodyDetail = ContentLayoutBodyDetail;
```

이렇게 작성해도 ContentLayout을 사용하던 기존 컴포넌트들에는 영향을 주지 않습니다. BodyDetail을 사용하려면 다음과 같이 작성합니다.

```tsx
import { ContentHeader, ContentLayout } from '@/component';
import { CatalogBlockListRegisterForm, CatalogRegisterForm } from '@/domain/Catalog/component';

export const CatalogRegister = () => {
  return (
    <ContentLayout>
      <ContentLayout.Header>
        <ContentHeader title='카탈로그 등록 페이지' />
      </ContentLayout.Header>
      <ContentLayout.Body>
        <CatalogRegisterForm />
      </ContentLayout.Body>
      <ContentLayout.BodyDetail>
        <CatalogBlockListRegisterForm />
      </ContentLayout.BodyDetail>
    </ContentLayout>
  );
};
```

## Props의 타입을 개선 - WithChildren

(WithChildren은 [TypeScript + React: Component patterns](https://fettblog.eu/typescript-react-component-patterns/) 의 내용을 가져왔습니다.)

ContentLayout 컴포넌트에서 하나만 더 신경 써 봅시다. props의 타입(interface)은 children 하나만 포함되어 있습니다. 해당 컴포넌트 외에도 동일한 인터페이스르 자주 사용하게 될 겁니다. 좀 더 직관적인 이름으로 변경하고 컴포넌트 내부가 아니라 공통 타입을 선언하는 파일로 변경합니다.

```ts
type WithChildren = {
  children: ReactNode;
};
```

정의한 타입을 import 하여 사용합니다.

```tsx
import { DefaultLayout } from '@/component/Layout/DefaultLayout';
import { MainHeader } from '@/component/Layout/MainHeader';
import { WithChildren } from '@/types';

export const ContentLayout = ({ children }: WithChildren) => {
  return (
    <DefaultLayout>
      <MainHeader />
      <Layout>{children}</Layout>
    </DefaultLayout>
  );
};

const ContentLayoutHeader = ({ children }: WithChildren) => {
  return <Header>{children}</Header>;
};

const ContentLayoutBody = ({ children }: WithChildren) => {
  return <Content>{children}</Content>;
};

const ContentLayoutBodyDetail = ({ children }: WithChildren) => {
  return <Content>{children}</Content>;
};


ContentLayout.Header = ContentLayoutHeader;
ContentLayout.Body = ContentLayoutBody;
ContentLayout.BodyDetail = ContentLayoutBodyDetail;
```

조금 더 깔끔해졌네요. WithChildren은 다른 컴포넌트에서도 잘 사용할 것 같습니다.

## WithChildren 확장

WithChildren을 조금 더 개선해볼까요. ContentLayout에 ReactNode가 아닌 contentTitle prop이 추가되었습니다!(억지 설정이 너무 심하네요;) 개별적으로 props의 타입을 설정할 수도 있지만 WithChildren을 확장해봅시다.

```ts
export type WithChildren<T = unknown> = T & {
  children: ReactNode;
};
```

WithChildren을 위와 같이 정의하면 필요에 따라 확장하여 사용할 수 있습니다.

```tsx
import { DefaultLayout } from '@/component/Layout/DefaultLayout';
import { MainHeader } from '@/component/Layout/MainHeader';
import { WithChildren } from '@/types';

type ContentLayoutProps = WithChildren<{
  contentTitle: string;
}>;

export const ContentLayout = ({ children, contentTitle }: ContentLayoutProps) => {
  return (
    <DefaultLayout>
      <MainHeader />
      {contentTitle}
      <Layout>{children}</Layout>
    </DefaultLayout>
  );
};

const ContentLayoutHeader = ({ children }: WithChildren) => {
  return <Header>{children}</Header>;
};

const ContentLayoutBody = ({ children }: WithChildren) => {
  return <Content>{children}</Content>;
};

const ContentLayoutBodyDetail = ({ children }: WithChildren) => {
  return <Content>{children}</Content>;
};

ContentLayout.Header = ContentLayoutHeader;
ContentLayout.Body = ContentLayoutBody;
ContentLayout.BodyDetail = ContentLayoutBodyDetail;
```

## 마치며

ReactNode를 props로 받을 때 개별 prop으로 사용하기 보다 children으로 처리하고 dot notation 방식을 추가하는 것이 조금 더 좋은 코드라고 생각됩니다. 앞으로 적극적으로 사용해보고 좀 더 나은 방법이 있을지 고민해보려고 합니다.

## 참고자료

[TypeScript + React: Component patterns](https://fettblog.eu/typescript-react-component-patterns/)
