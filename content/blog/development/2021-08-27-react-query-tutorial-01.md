---
title: 2021-08-27 React Query Tutorial 01 소개
date: 2021-08-27 15:08:92
category: development
---

![React Query](https://drive.google.com/uc?export=view&id=1LnLV4-X-Yq2J2ttk85Kj4FQ1VYQpXKxt)

React Query! 이제 안 쓸 이유가 있을까? (첫 줄은 어그로!)

회사에서 새로운 프로젝트를 진행하면서 React Query를 도입해서 사용하고 있습니다. React Query를 실제로 사용한지는 2주 정도 되었습니다. 그동안 React Query를 사용하면서 느낀점들과 장점을 적어보려고 합니다.

(사실 이 글을 작성하면서 React Query에 대해 좀 더 깊게 공부해보려구요!)

## React Query 소개 및 장점

[공식 홈페이지](https://react-query.tanstack.com/overview) 에서 React Query를 다음과 같이 소개하고 있습니다.

> React Query is often described as the missing data-fetching library for React, but in more technical terms, it makes fetching, caching, synchronizing and updating server state in your React applications a breeze.
 
> React Query는 React app에서 server state를 가져오고, 캐싱하고, 동기화하고, 업데이트하는 작업을 쉽게 만들어줍니다!

저는 기존에 Redux를 많이 사용했습니다. 이번에 React Query를 사용해보니 Redux 대비 확연한 차이점과 장점을 알 수 있었습니다. React Query를 사용하면 Redux를 사용할 때보다 코드량이 많이 줄어듭니다. 서버에서 데이터를 수신할 때 reducer, redux-saga, 컴포넌트 등 여러 파일을 돌아다니면서 코드를 작성하지 않아도 됩니다. 그리고 화면의 데이터를 최신으로 갱신하기 위한 코드가 정말 간단합니다! 이것 외에도 여러가지 장점이 있습니다.

React Query의 기능을 간단하게 요약하여 정리해보면 다음과 같습니다.

- 클라이언트에서 서버 데이터의 캐시를 관리합니다.
- loading, error state를 관리합니다.
- pagination, infinite scroll도 쉽게 처리할 수 있도록 지원합니다.
- prefetching을 쉽게 처리할 수 있도록 지원합니다.
- error가 발생할 경우 자동으로 재시도합니다.
- request가 성공하거나 실패했을 때 각각 callback을 정의할 수 있습니다.

이런 기능들은 React Query를 사용하지 않아도 모두 구현할 수 있기는 합니다. 하지만 React Query는 이 기능들을 모두 내장하고 있어 코드량을 줄일 수 있고 사용하기 편리합니다.

React Query는 클라이언트와 서버의 중간 즈음에 위치하고 있는 듯한 느낌을 줍니다. 클라이언트에서 axois 나 ky 등을 이용하여 서버에 데이터를 요청하면 서버에 바로 요청이 전달되는 것이 아니라 React Query가 해당 요청을 관리하는 듯한 느낌을 받았습니다. 데이터가 캐시에 존재한다면 캐시의 데이터를 클라이언트에 전달하고, prefetching을 활용하여 당장 화면에 출력하지 않는 데이터를 관리하기도 합니다.

## Client state vs. Server state

React Query를 사용하려면 몇 가지 중요한 개념을 이해해야 합니다. 그 중 가장 처음에 등장하는 것이 `Client state vs Server state` 입니다.

- Client state
	- 서버에서 받아 온 정보가 아니라 각 client에서만 관리하는 state
	- 사용자가 선택한 언어, theme 등
- Server state
	- Client가 Server에서 받아오는 모든 정보

React Query는 `Server state`만을 관리합니다. 처음에 이 정보를 접했을 때 `그럼 Client state를 관리하는 무언가가 필요한거 아닌가?`  라고 생각했습니다. 하지만 실제로 사용해보니 Client state를 관리할 필요가 생기는 경우가 극히 드물었습니다.

## 기본 사용법

간단한 코드를 보면서 기본 사용법을 확인해봅시다.

[Unsplash](https://unsplash.com/)에서 고양이 사진을 가져오는 간단한 코드를 만들어보겠습니다. Unsplash api 를 사용하려면 회원가입 후 Secret key를 발급받아야 합니다. 이 과정은 쉽게 검색하여 확인할 수 있으니 따로 언급하지 않겠습니다.

작성된 코드는 https://github.com/angelxtry/react-query-tutorial 에서 확인할 수 있습니다.

먼저 이해를 돕기위해 폴더 구조부터 확인해봅시다. src 폴더 구조는 다음과 같습니다.

```bash
├── assets
│   ├── React-icon.svg
│   ├── css
│   │   └── index.css
│   └── icons
│   └── react-query-logo.svg
├── component
│   ├── App
│   │   ├── App.tsx
│   │   └── index.ts
│   └── index.ts
├── domains
│   └── CatImages
│       ├── api
│       │   └── index.ts
│       ├── component
│       │   └── CatImages.tsx
│       ├── index.ts
│       └── types.ts
├── index.tsx
└── types
    └── files.d.ts
```

(폴더 구조가 좀 복잡하네요. 개인 취향입니다;;)

yarn 이나 npm 등을 이용하여  react-query 를 설치한 후에 src/component/App/App.tsx 파일에 다음과 같이 기본 코드를 추가합니다.

```tsx
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { CatImages } from '@/domains/CatImages';

const queryClient = new QueryClient();

export const App = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className='text-white text-xl'>
        Unsplash Image Viewer (React Query Tutorial)
      </h1>
      <CatImages />
    </QueryClientProvider>
  );
};
```

Unsplash에서 (귀여운)고양이 이미지를 받아오기 위한 코드를 간단하게 작성합니다.

src/domains/CatImages/api/index.ts

```tsx
import ky from 'ky';

import { PagiInfo } from '@/domains/CatImages/types';

const { UNSPLASH_CLIENT_KEY } = process.env;

export const getCatImages = async (): Promise<PagiInfo> => {
  const url = 'https://api.unsplash.com/search/photos';
  const json = await ky(url, {
    searchParams: {
      client_id: UNSPLASH_CLIENT_KEY || '',
      query: 'cat',
      page: 1,
      per_page: 30,
    },
  }).json<PagiInfo>();
  return json;
};
```

Unsplash에서 발급받은 key를 관리하기 위해 dotenv를 사용했습니다. root 경로에 `.env.development` 파일을 만들고 각자 발급받은 키를 넣어주시면 됩니다.

이제 useQusery를 사용하여 `getCatImages` 호출하여 데이터를 받아봅시다.

src/domains/CatImages/component/CatImages.tsx

```tsx
import { useQuery } from 'react-query';

import { getCatImages } from '@/domains/CatImages/api';

export const CatImages = () => {
  const { data } = useQuery('catImages', getCatImages);

  return (
    <div className='container'>
      {data &&
        data.results.map((image, index) => (
          <figure key={image.id}>
            <img src={image.urls.small} alt={image.alt_description} />
            <figcaption className='transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110'>
              <a href={image.links.html} target='_blank' rel='noreferrer'>
                {index + 1}
              </a>
            </figcaption>
          </figure>
        ))}
    </div>
  );
};
```

이 상태로 실행해보면 다음과 같은 화면을 확인할 수 있습니다.

![app](https://drive.google.com/uc?=export=view&id=1pmfh3C5cc1S5Rl35Iq-dmtdL8bsUqnUz)

좀 더 자세히 확인하기 위해 Devtools를 활용해봅시다. React Query 의 Devtools 는 별도의 추가 설치 없이  import  만으로 쉽게 사용할 수 있습니다.  production mode 에서는 동작하지 않도록 기본으로 설정되어 있어  production build 시 제외하는 설정을 추가할 필요도 없이 그냥 사용하면 됩니다.

```tsx
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { CatImages } from '@/domains/CatImages';

const queryClient = new QueryClient();

export const App = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className='text-white text-xl'>
        Unsplash Image Viewer (React Query Tutorial)
      </h1>
      <CatImages />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
```

 설정하자마자 브라우저의 좌측 하단에  React Query 의 아이콘이 생성됩니다. 클릭하면 Devtools 를 확인할 수 있습니다.

devtools에서 볼 수 있듯이 React Query의 query 들을 4개의 상태를 가집니다.
1. fresh 
2. fetching
3. stale
4. inactive

각 상태가 무엇을 의미하는지 어렴풋이는 알 것 같지만 상세한 내용은 좀 더 찾아봐야 할 것 같습니다.

브라우저를  refocusing 하면 자동으로 refatching 이 발생하는 것을 확인할 수 있습니다.  React Query 는 항상 최신상태를 유지하기 위해 다른 작업을 하다가 다시 브라우저를 포커싱 할 때 자동으로  api call 을 실행합니다.

## 간단한 에러 처리

React Query 의  useQuery 는 다양한 값을 반환합니다. ([공식 페이지 참조](https://react-query.tanstack.com/reference/useQuery))

그 중에서 에러를 어떻게 확인할 수 있는지 간단하게 확인해봅시다. 에러 처리를 다른 방식으로도 할 수 있지만  useQuery 가  에러를 어떻게 다루는지만 살펴보려고 합니다.

```tsx
import { useQuery } from 'react-query';

import { getCatImages } from '@/domains/CatImages/api';
import { PagiInfo } from '@/domains/CatImages/types';
import { HTTPError } from 'ky';

export const CatImages = () => {
  const { data, error, isLoading } = useQuery<PagiInfo, HTTPError>(
    'catImages',
    getCatImages
  );

  if (isLoading) {
    return <div className='text-white text-xl'>Loading...</div>;
  }

  if (error) {
    return <div className='text-white text-xl'>{error.message}</div>;
  }

  return (
    <div className='container'>
      {data &&
        data.results.map((image, index) => (
          <figure key={image.id}>
            <img src={image.urls.small} alt={image.alt_description} />
            <figcaption className='transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110'>
              <a href={image.links.html} target='_blank' rel='noreferrer'>
                {index + 1}
              </a>
            </figcaption>
          </figure>
        ))}
    </div>
  );
};
```

api 호출에서 일부러 오타를 만들어 봅시다. console 을 살펴보면 에러가 발생하자 3번 다시 시도하는 것을 확인할 수 있습니다. React Query 는 추가로 설정하지 않아도 에러 발생 시 3회 다시 시도하도록 설정되어 있습니다. 3 번 호출하는 동안  isLoading 이  true 가  Loading...  이 출력됩니다.

##  마치며

 이번에는  React Query 의 간단한 소개만을 적었습니다. 아직 왜 React Query 를 써야만 하는가에 대한 이유가 부실한 것 같습니다. 다음 글에서 다양한 활용과 장점을 더 적어보겠습니다.