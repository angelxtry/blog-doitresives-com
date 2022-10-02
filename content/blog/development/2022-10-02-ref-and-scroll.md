---
title: 2022-10-02 버튼으로 scroll 기능 구현하기 (ref란 무엇인가)
date: 2022-10-02 22:10:48
category: development
---

이번에 회사에서 다음 버튼을 클릭하면 컴포넌트가 추가된 후 해당 영역으로 스크롤 되는 페이지를 만들었습니다.

대략 다음과 같은 동작을 합니다.

![ref-and-scroll-1](https://drive.google.com/uc?export=view&id=1ohlJdZH8UnBOVwf0cLN1-SuJGX3k5cMM)

이번 글에서는 다음 버튼을 클릭했을 때 원하는 지점으로 스크롤하는 기능을 어떻게 구현했는지, 그리고 그 과정에서 React의 ref에 대해 좀 더 자세하게 이해한 내용을 적어보려고 합니다.

## 1단계: 모든 컴포넌트는 한 페이지에!

처음에는 "일단 스크롤이면 ref를 사용하면 되겠지!" 라고 막연하게 생각했습니다. 컴포넌트 1, 컴포넌트 2, 컴포넌트 3 에 ref를 하나씩 전달하고 버튼을 누르면 순서대로 이동하게 만들었습니다.

```tsx
import { useEffect, useRef, useState } from 'react';  
  
import { Button } from '@/components/button';  
import FullSizePageContainer from '@/components/full-size-page-container';  
import Layout from '@/components/layout';  
  
const HomePage = () => {  
  const countryRef = useRef<HTMLDivElement>(null);  
  const platformRef = useRef<HTMLDivElement>(null);  
  const categoryRef = useRef<HTMLDivElement>(null);  
  
  const [componentId, setComponentId] = useState<number>(1);  
  
  const componentList = [  
    {  
      id: 1,  
      ref: countryRef,  
    },  
    {  
      id: 2,  
      ref: platformRef,  
    },  
    {  
      id: 3,  
      ref: categoryRef,  
    },  
  ];  
  
  const scrollToId = (itemId: number) => {  
    const component = componentList.find((item) => item.id === itemId);  
    if (!component) {  
      return;  
    }  
  
    component.ref.current?.scrollIntoView({ behavior: 'smooth' });  
  };  
  
  const onClickNext = () => {  
    setComponentId((prevState) => {  
      if (componentList.length > componentId) {  
        return prevState + 1;  
      }  
      return prevState;  
    });  
  };  
  
  useEffect(() => {  
    scrollToId(componentId);  
  }, [componentId]);  
  
  return (  
    <Layout>  
      <div className='w-full px-20 bg-white relative'>  
        <div ref={countryRef}>  
          <FullSizePageContainer>  
            <FullSizePageContainer.Title>  
              국가를 선택해 주세요.  
            </FullSizePageContainer.Title>  
            <div>  
              <div className='text-content-subtitle'>  
                국가 선택<span className='text-content-subtitle text-primary'>*</span>  
              </div>  
              <div className='pt-[20px]' />  
            </div>  
          </FullSizePageContainer>  
        </div>  
        <div ref={platformRef} className={`${componentId <= 1 && 'hidden'}`}>  
          <FullSizePageContainer>  
            <FullSizePageContainer.Title>  
              플랫폼을 선택해 주세요.  
            </FullSizePageContainer.Title>  
            <div>  
              <div className='text-content-subtitle'>  
                플랫폼 선택<span className='text-content-subtitle text-primary'>*</span>  
              </div>  
              <div className='pt-[20px]' />  
            </div>  
          </FullSizePageContainer>  
        </div>  
        <div ref={categoryRef} className={`${componentId <= 2 && 'hidden'}`}>  
          <FullSizePageContainer>  
            <FullSizePageContainer.Title>  
              카테고리를 선택해 주세요.  
            </FullSizePageContainer.Title>  
            <div>  
              <div className='text-content-subtitle'>  
                카테고리 선택<span className='text-content-subtitle text-primary'>*</span>  
              </div>  
              <div className='pt-[20px]' />  
            </div>  
          </FullSizePageContainer>  
        </div>  
      </div>  
      <div className='fixed bottom-10 right-20 space-x-4'>  
        <Button type='button' className='w-80' onClick={onClickNext}>  
          {componentList.length > componentId ? '다음' : '완료'}  
        </Button>  
      </div>  
    </Layout>  
  );  
};  
  
export default HomePage;
```

스크롤 후 머물러야 하는 컴포넌트에 대응하는 ref를 각각 생성하여 각 컴포넌트에 prop으로 전달했습니다. 스크롤 동작하게 하는 방법은 여러 가지가 있겠지만 브라우저에서 제공하는 [scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) API를 사용했습니다.

## 2단계: 컴포넌트를 분리하자.

국가, 플랫폼, 카테고리 선택에 다양한 컴포넌트가 추가되면서 점점 코드량이 많아질겁니다. 미리 개별 컴포넌트로 분리해둘 필요가 있었습니다.

```tsx
import { useEffect, useRef, useState } from 'react';  
  
import { Button } from '@/components/button';  
import CategoryComponent from '@/components/category-component';  
import CountryComponent from '@/components/country-component';  
import Layout from '@/components/layout';  
import PlatformComponent from '@/components/platform-component';  
  
const HomePage = () => {  
  const countryRef = useRef<HTMLDivElement>(null);  
  const platformRef = useRef<HTMLDivElement>(null);  
  const categoryRef = useRef<HTMLDivElement>(null);  
  
  const [componentId, setComponentId] = useState<number>(1);  
  
  const componentList = [  
    {  
      id: 1,  
      ref: countryRef,  
    },  
    {  
      id: 2,  
      ref: platformRef,  
    },  
    {  
      id: 3,  
      ref: categoryRef,  
    },  
  ];  
  
  const scrollToId = (itemId: number) => {  
    const component = componentList.find((item) => item.id === itemId);  
    if (!component) {  
      return;  
    }  
  
    component.ref.current?.scrollIntoView({ behavior: 'smooth' });  
  };  
  
  const onClickNext = () => {  
    setComponentId((prevState) => {  
      if (componentList.length > componentId) {  
        return prevState + 1;  
      }  
      return prevState;  
    });  
  };  
  
  useEffect(() => {  
    scrollToId(componentId);  
  }, [componentId]);  
  
  return (  
    <Layout>  
      <div className='w-full px-20 bg-white relative'>  
        <CountryComponent ref={countryRef} />  
        <PlatformComponent ref={platformRef} componentId={componentId} />  
        <CategoryComponent ref={categoryRef} componentId={componentId} />  
      </div>  
      <div className='fixed bottom-10 right-20 space-x-4'>  
        <Button type='button' className='w-80' onClick={onClickNext}>  
          {componentList.length > componentId ? '다음' : '완료'}  
        </Button>  
      </div>  
    </Layout>  
  );  
};  
  
export default HomePage;
```

```tsx
import { RefObject } from 'react';  
  
import FullSizePageContainer from '@/components/full-size-page-container';  
  
interface PlatFormComponentProps {  
  ref: RefObject<HTMLDivElement>;  
  componentId: number;  
}  
  
const PlatFormComponent = ({ ref, componentId }: PlatFormComponentProps) => (  
  <div ref={ref} className={`${componentId <= 1 && 'hidden'}`}>  
    <FullSizePageContainer>  
      <FullSizePageContainer.Title>플랫폼을 선택해 주세요.</FullSizePageContainer.Title>  
      <div>  
        <div className='text-content-subtitle'>  
          플랫폼 선택<span className='text-content-subtitle text-primary'>*</span>  
        </div>  
        <div className='pt-[20px]' />  
      </div>  
    </FullSizePageContainer>  
  </div>  
);  
  
export default PlatFormComponent;
```

코드로만 봤을 때는 문제가 없어 보일 수도 있습니다. 하지만 실제로 테스트해보면 다음 버튼을 클릭해도 다음 ref로 스크롤 되지 않습니다. 뭐가 문제일까요?

브라우저의 Console을 확인해보면 다음과 같은 `warning` 이 발생하고 있습니다.


> Warning: CountryComponent: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)

> Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

직역해보자면 ref는 prop으로 전달할 수 없고 child component에서 prop으로 전달하려고 하는 ref에 접근하려면 다른 방법을 사용해야 한다고 합니다.

이때 사용할 수 있는 것이 forwardRef 입니다.

### forwardRef 란?

React에서 브라우저에서 제공하는 컴포넌트(예를 들어 div, input 같은 element)에 ref를 전달하면, ref.current에 해당 DOM 노드의 참조가 저장됩니다. 하지만 CountryComponent 처럼 개발자가 직접 만든 함수형 컴포넌트는 일반적으로는 ref를 전달할 수 없습니다. 어떤 컴포넌트가 임의의 다른 컴포넌트의 DOM 노드에 접근하는 것을 막기 위한 React에서 의도된 부분이라고 합니다.

그래서 특정 컴포넌트의 DOM 노드를 외부에서 접근하려면 해당 컴포넌트에서 DOM 노드를 노출한다는 것을 선언해주어야 합니다. 이때 사용하는 것이 `forwardRef` 입니다.

```tsx
import { forwardRef } from 'react';  
  
import FullSizePageContainer from '@/components/full-size-page-container';  
  
interface PlatFormComponentProps {  
  componentId: number;  
}  
  
const PlatFormComponent = forwardRef<HTMLDivElement, PlatFormComponentProps>(  
  (props, ref) => (  
    <div ref={ref} className={`${props.componentId <= 1 && 'hidden'}`}>  
      <FullSizePageContainer>  
        <FullSizePageContainer.Title>플랫폼을 선택해 주세요.</FullSizePageContainer.Title>  
        <div>  
          <div className='text-content-subtitle'>  
            플랫폼 선택<span className='text-content-subtitle text-primary'>*</span>  
          </div>  
          <div className='pt-[20px]' />  
        </div>  
      </FullSizePageContainer>  
    </div>  
  ),  
);  
  
export default PlatFormComponent;
```

`forwardRef` 를 사용한 컴포넌트는 첫 번째 인자로 props, 두 번째 인자로 ref를 받습니다. 제네릭을 이용하여 타입을 정의하는데 이유는 잘 모르겠지만 순서는 반대로 되어 있네요 : )

분리한 모든 컴포넌트에 `forwardRef` 를 적용하면 warning이 해결되고, 정상적으로 동작합니다.

## 3단계: 좀 더 효율적인 코드로 만들어보자.

현재 코드는 컴포넌트를 분리할 수도 있고, 스크롤도 잘 동작하지만 아직 아쉬운 부분이 많이 남아 있습니다. 그중에서도 가장 불편한 부분이 스크롤에 포함될 컴포넌트가 추가될 때마다 수작업으로 ref를 추가해야 하는 점입니다.

이 부분을 개선해 봅시다.

```tsx
import { useEffect, useRef, useState } from 'react';  
  
import { Button } from '@/components/button';  
import CategoryComponent from '@/components/category-component';  
import CountryComponent from '@/components/country-component';  
import Layout from '@/components/layout';  
import PlatformComponent from '@/components/platform-component';  
  
const componentList = [  
  {    id: 1,  
    item: <CountryComponent />,  
  },  
  {  
    id: 2,  
    item: <PlatformComponent />,  
  },  
  {  
    id: 3,  
    item: <CategoryComponent />,  
  },  
];  
  
const HomePage = () => {  
  const [componentId, setComponentId] = useState<number>(1);  
  const componentRef = useRef<Map<number, HTMLDivElement> | null>(null);  
  
  const getMap = () => {  
    if (!componentRef.current) {  
      componentRef.current = new Map<number, HTMLDivElement>();  
    }  
    return componentRef.current;  
  };  
  
  const scrollToId = (itemId: number) => {  
    const map = getMap();  
    const item = map.get(itemId);  
    if (!item) {  
      return;  
    }  
    item.scrollIntoView({ behavior: 'smooth' });  
  };  
  
  const onClickNext = () => {  
    const currentComponent = componentList.find(  
      (component) => component.id === componentId,  
    );  
  
    if (!currentComponent) {  
      return;  
    }  
  
    setComponentId((prevState) => {  
      if (componentList.length > componentId) {  
        return prevState + 1;  
      }  
      return prevState;  
    });  
  };  
  
  useEffect(() => {  
    scrollToId(componentId);  
  }, [componentId]);  
  
  return (  
    <Layout>  
      <div className='w-full px-20 bg-white relative'>  
        {componentList.map((component) => (  
          <div  
            key={component.id}  
            ref={(node) => {  
              const map = getMap();  
              if (node) {  
                map.set(component.id, node);  
              } else {  
                map.delete(component.id);  
              }  
            }}  
            className={`${component.id > componentId && 'hidden'}`}  
          >            {component.item}  
          </div>  
        ))}  
      </div>  
      <div className='fixed bottom-10 right-20 space-x-4'>  
        <Button type='button' className='w-80' onClick={onClickNext}>  
          {componentList.length > componentId ? '다음' : '완료'}  
        </Button>  
      </div>  
    </Layout>  
  );  
};  
  
export default HomePage;
```

conponentList map 안의 div를 보면 ref에서 함수를 정의하고 있습니다. 이런 함수를 ref callback이라고 부릅니다. React에서 ref를 설정할 때 함수가 있으면 이 함수를 실행해줍니다. `componentsRef`에는 id와 HTMLDivElement의 DOM 노드가 Map으로 관리되어 스크롤을 동작시킬 때 필요한 DOM 노드를 참조할 수 있습니다.

## 마치며

저는 평소에 useRef hook을 이용하여 생성하는 ref에는 DOM 노드의 참조만을 저장할거라고 단순하게 생각했었습니다. 주로 그 용도로 ref를 사용하는 코드를 많이 봤었거든요. 그런데 이번에 Map을 저장하는 것을 보고 신기해서 좀 더 찾아보니 DOM 노드 뿐만 아니라 어떤 값이라도 저장할 수 있었네요. 앞으로 ref를 좀 더 적극적으로 사용할 것 같습니다.
