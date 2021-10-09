---
title: 2021-09-12 Recursive tree menu 만들어보기
date: 2021-09-12 21:09:31
category: development
---

![Recursive](https://drive.google.com/uc?export=view&id=1bafXXfLOaZm-H4Em2ngfYK_1kvO7g_Z5)

React로 recursive tree menu를 만들어 봅시다!

회사에서 업무로 사이드바에 트리 메뉴를 추가할 일이 생겼습니다. 트리 메뉴를 만들려면 단순하게 하드코딩 할 수도 있고, 여러 유명한 라이브러리를 사용할 수도 있을 것 같습니다. 아직 회사에서 어떤 방식으로 진행할지는 확정짓지는 않았습니다.

그러다 문득 재귀로 직접 구현해보고 싶다는 생각이 들었습니다. 회사 코드에 적용하지는 않겠지만 재미있을 것 같았습니다.

기존에 만들었던 코드에 사이드바를 붙이면서 시작해봅시다.

https://github.com/angelxtry/react-query-tutorial/tree/6073d1eed6c50933e24259deb7c213046c02ed6e

먼저 데이터를 만들어봅시다. 이번에 만들 트리 메뉴는 실용적인 역할보다는 재귀 방식의 단순 트리 메뉴에 집중할 것이기 때문에 데이터도 간소하게 만들겁니다. 

- menuData.ts

```tsx
interface Branch {
  id: string;
  label: string;
  children?: Tree;
}

type Tree = Branch[];

export const menuData: Tree = [
  {
    id: '1',
    label: '고양이',
    children: [
      {
        id: '2',
        label: '페르시안',
      },
      {
        id: '3',
        label: '메인쿤',
      },
      {
        id: '4',
        label: '벵골',
      },
    ],
  },
  {
    id: '5',
    label: '강아지',
    children: [
      {
        id: '6',
        label: '셰퍼드',
      },
      {
        id: '7',
        label: '리트리버',
      },
    ],
  },
];
```

데이터를 작성하기 전에 타입을 먼저 설정했습니다. Branch, Tree를 이용하여 재귀구조를 표현했습니다. children이라는 어휘가 어색하게 느껴집니다만 일단 넘어갑니다. 😢

타입에 맞게 데이터를 작성합니다.

타입은 다른 파일에서 계속 사용하게 될 테니까 별도의 파일로 분리하겠습니다.

- types.ts

```tsx
export interface Branch {  
 id: string;  
 label: string;  
 children?: Tree;  
}  
  
export type Tree = Branch[];
```

이제 트리 메뉴 컴포넌트를 만들어봅시다.

```tsx
import { useState } from 'react';

import { menuData } from '@/component/TreeMenu/menuData';
import { Branch, Tree } from '@/component/TreeMenu/types';

interface TreeComponentProps {
  data: Tree;
}

interface BranchComponentProps {
  branch: Branch;
}

const BranchComponent = ({ branch }: BranchComponentProps) => {
  const [open, toggleOpen] = useState(false);
  const hasChildren = branch.children && branch.children.length;
  return (
    <>
      <div
        key={branch.id}
        onClick={() => toggleOpen(!open)}
        role='presentation'
      >
        {branch.label}
      </div>
      {open &&
        hasChildren &&
        branch.children?.map((child: Branch) => {
          return <BranchComponent key={child.id} branch={child} />;
        })}
    </>
  );
};

const TreeComponent = ({ data }: TreeComponentProps) => {
  return (
    <>
      {data.map((branch: Branch) => {
        return <BranchComponent key={branch.id} branch={branch} />;
      })}
    </>
  );
};

export const TreeMenu = () => {
  return <TreeComponent data={menuData} />;
};
```

우선 하나의 파일에 우다다다 코드를 작성했습니다.

간단하게 구조를 보면 `TreeMenu`는 외부에서 사용하기 위한 진입점입니다. menuData를 `TreeComponent`에 제공합니다.

`TreeComponent`는 data를 순회하면서 `BranchComponent`를 생성합니다. 최상위 menu가 하나가 아니기에 TreeComponent에서 부터 map을 사용합니다. `BranchComponent`는 재귀를 수행합니다. 스타일과 추가적인 기능이 주로 추가될 컴포넌트입니다.

여기까지 작성한 `TreeMenu` 컴포넌트를 Sidebar 컴포넌트에 쉽게 추가할 수 있습니다.

결과물을 한번 확인해봅시다.

![1차결과](https://drive.google.com/uc?export=view&id=1-PgnP2uPZo2gyuPZ2dK0indhVa9MplBR)

전혀 스타일이 없어 트리 메뉴같지 않지만 일단 동작은 합니다.

컴포넌트를 분리하고 다듬어 봅시다.

- TreeMenu.tsx

```tsx
import { menuData } from '@/component/TreeMenu/menuData';
import { TreeComponent } from '@/component/TreeMenu/TreeComponent';

export const TreeMenu = () => {
  return <TreeComponent menuData={menuData} />;
};
```

- TreeComponent.tsx

```tsx
import { BranchComponent } from '@/component/TreeMenu/BranchComponent';
import { Branch, Tree } from '@/component/TreeMenu/types';

interface TreeComponentProps {
  menuData: Tree;
}

export const TreeComponent = ({ menuData }: TreeComponentProps) => {
  return (
    <>
      {menuData.map((branch: Branch) => {
        return <BranchComponent key={branch.id} branch={branch} />;
      })}
    </>
  );
};
```

- BranchComponent.tsx

```tsx
import { useState } from 'react';
import { MdChevronRight, MdKeyboardArrowDown } from 'react-icons/md';

import { Branch } from '@/component/TreeMenu/types';

interface BranchComponentProps {
  branch: Branch;
}

export const BranchComponent = ({ branch }: BranchComponentProps) => {
  const [open, toggleOpen] = useState(false);
  const hasChildren = branch.children && branch.children.length > 0;
  return (
    <>
      <div
        onClick={() => toggleOpen(!open)}
        role='presentation'
        className='flex flex-row items-center p-2 pl-4'
      >
        {branch.label}
        {hasChildren && (open ? <MdKeyboardArrowDown /> : <MdChevronRight />)}
      </div>
      {hasChildren &&
        branch.children?.map((child: Branch) => {
          return (
            <div key={child.id} className='pl-6'>
              {open && <BranchComponent key={child.id} branch={child} />}
            </div>
          );
        })}
    </>
  );
};
```

앞서 얘기한 것 처럼 BranchComponent에 스타일을 주로 추가했습니다.

![2차 결과](https://drive.google.com/uc?export=view&id=1Br0WDK1qXKVBWnynE6bHX7-j2WnJ5cOW)

딱 원하는 수준 만큼 트리 메뉴를 작성했습니다. 재귀 방식으로 컴포넌트를 작성한 것의 장점은 메뉴가 추가되거나 수정될 때 컴포넌트를 수정할 필요가 없이 데이터만 수정하면 됩니다. 트리 메뉴 데이터를 추가해봅시다.

- menuData.ts

```tsx
import { Tree } from '@/component/TreeMenu/types';

export const menuData: Tree = [
  {
    id: '1',
    label: '고양이',
    children: [
      {
        id: '2',
        label: '페르시안',
        children: [
          {
            id: '8',
            label: '냐용이',
          },
          {
            id: '9',
            label: '냥이',
          },
        ],
      },
      {
        id: '3',
        label: '메인쿤',
      },
      {
        id: '4',
        label: '벵골',
      },
    ],
  },
  {
    id: '5',
    label: '강아지',
    children: [
      {
        id: '6',
        label: '셰퍼드',
      },
      {
        id: '7',
        label: '리트리버',
      },
    ],
  },
  {
    id: '10',
    label: '다음은?',
  },
];
```

최상단 메뉴(id: 10)도 추가했고 고양이 > 페르시안 하위에 3번째 레벨의 메뉴(id: 8, 9)를 추가했습니다.

결과를 확인해봅시다.

![데이터 추가 결과](https://drive.google.com/uc?export=view&id=10wyUGZo52WYpWST_Z2BWRrjNDkfxJN-I)

잘 처리되었습니다!

사실 프로덕션 코드를 재귀로 작성하는 것은 몇 가지 위험성을 가지고 있다고 생각합니다.

일단 재귀 코드는 코드가 복잡할 가능성이 높고, 코드가 복잡하다면 작성자 본인 외에 다른 팀원들이 잘 이해하지 못할 수 있습니다. 물론 작성한 사람도 시간이 지나면 자신의 코드를 이해하기 어려울 수도 있죠 후후 😝

그리고 재귀 코드는 데이터가 많을 경우 문제가 발생합니다. 이 글의 예시에서 나온 데이터 정도는 전혀 문제가 되지 않겠지만 데이터가 늘어나는 것은 누구라도 예측하기 어렵습니다.

---

글을 작성한 후에 코드와 결과물을 살펴보니 문제점이 있다는 것을 알게되었습니다. 😭

![문제점](https://drive.google.com/uc?export=view&id=1ZXQo9Mrq0E_R7WzCcwU9vQZBSPN_C_jd)

개발자 도구를 열어보니 아직 트리 메뉴가 펼쳐지지 않았는데 div가 추가되어 있었습니다.

원인을 알 것 같은데 아직 해결을 못했습니다. 조만간 해결을 시도해 보고 이 글에 내용을 추가해보겠습니다.

이 글의 코드는 https://github.com/angelxtry/react-query-tutorial 여기에서 확인할 수 있습니다.