---
title: "Write clean(er) Components & JSX를 읽고 일부 내용 요약"
date: 2020-06-19 01:06:17
category: development
---

[Write clean(er) Components & JSX](https://itnext.io/write-clean-er-components-jsx-1e70491baded)를 읽고 일부 내용을 기록해둔다.

## 필수 데이터가 없다면 렌더링 하지 말 것

```jsx
import React from "react";
import PropTypes from "prop-types";

const UserCard = ({ user }) => {
  return (
    <ul>
      <li>{user.name}</li>
      <li>{user.age}</li>
      <li>{user.email}</li>
    </ul>
  );
};

UserCard.propTypes = {
  user: PropTypes.object
};

UserCard.defaultProps = {
  user: {}
};

export default UserCard;
```

user props가 필수가 아니기 때문에 기본값이 필요하다. 그런데 user props의 기본값이 빈 object다.

이렇게 설정하면 `Cannot access property...` 에러를 피할 수 있지만 불필요한 렌더링을 하게 된다.

```jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

export const UserCard = ({ user }) => {
  return (
    <ul>
      <li>{user.name}</li>
      <li>{user.age}</li>
      <li>{user.email}</li>
    </ul>
  );
};

UserCard.propTypes = {
  user: PropTypes.object.isRequired
};

export const UserContainer = () => {
  const [user, setUser] = useState(null);
  
  // do some apiCall here
  
  return (
    <div>
      {user && <UserCard user={user} />}
    </div>
  );
};
```

이전 코드와 다른 점은 user props를 필수로 설정했다. 의미없이 빈 object를 기본값으로 설정하는 부분은 개선되었다.

하지만 여전히 문제가 남아있다. user의 초기값은 null이지만, api를 호출하는 과정에서 빈 object가 저장되어도 UserCard component가 렌더링된다.

**데이터의 존재 여부에 따라 component가 렌터링될 때, 랜더링 여부를 결정하는 것은 component 자신이 아니라, component를 호출하는 부모가 그 역할을 해야한다.**

```jsx
export const UserContainer = () => {
  const [user, setUser] = useState(null);
  
  // do some apiCall here
  
  return (
    <div>
      {user ? <UserCard user={user} /> : 'No data available'}
    </div>
  );
};
```

데이터가 없다면 간단하게 데이터가 없음을 출력하고, 로드 중이라면 스피너 등을 활용할 수 있다.

## 중첩하지 말고 빨리 리턴하자

```jsx
const NestedComponent = () => {
  // ...
  
  return (
    <>
      {!isLoading ? (
        <>
          <h2>Some heading</h2>
          <p>Some description</p>
        </>
      ) : <Spinner />}
    </>
  )
}
```

```jsx
const NestedComponent = () => {
  // ...
  
  if (isLoading) return <Spinner />
  
  return (
    <>
      <h2>Some heading</h2>
      <p>Some description</p>
    </>
  )
}
```

전자보다 후자의 코드가 더 깔끔하다.

## jsx 코드 내에 JavaScript를 최대한 덜 사용하도록 작성하자

```jsx
const CustomInput1 = ({ onChange }) => {
  return (
    <Input onChange={e => {
      const newValue = getParsedValue(e.target.value);
      onChange(newValue);
    }} />
  )
}
```

```jsx
const CustomInput2 = ({ onChange }) => {
  const handleChange = (e) => {
    const newValue = getParsedValue(e.target.value);
    onChange(newValue);
  };
  
  return (
    <Input onChange={handleChange} />
  )
}
```

둘 모두 onChange를 props로 받아 component에서 호출한다. 라인 수는 후자가 더 많지만, 후자처럼 작성하는 것이 더 낫다.

return 내부의 jsx 코드가 단순하고 명확한 것이 좋다.

## useEffect와 함께 useCallback을 사용하자

```jsx
import React, { useState, useEffect } from 'react'

import { fetchUserAction } from '../api/actions.js'

const UserContainer = () => {
  const [uset, setUser] = useState(null);
  
  const handleUserFetch = async () => {
    const result = await fetchUserAction();
    setUser(result);
  };
  
  useEffect(() => {
    handleUserFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if (!user) return <p>No data available.</p>
  
  return <UserCard data={user} />
};
```

```js
import React, { useState, useEffect, useCalllback } from 'react'

import { fetchUserAction } from '../api/actions.js'

const UserContainer = () => {
  const [uset, setUser] = useState(null);
  
  const handleUserFetch = useCalllback(async () => {
    const result = await fetchUserAction();
    setUser(result);
  }, []);
  
  useEffect(() => {
    handleUserFetch();
  }, [handleUserFetch]);
  
  if (!user) return <p>No data available.</p>
  
  return <UserCard data={user} />
};
```

전자와 후자를 비교해보자.

후자에서 handleUserFetch를 useEffect의 dependency에 추가했다.

그리고 handleUserFetch를 선언할 때 useCallback을 활용했다.

## 외부로부터 독립적인 로직을 만들자

```jsx
const UserCard = ({ user }) => {
  const getUserRole = () => {
    const { roles } = user;
    if (roles.includes('admin')) return 'Admin';
    if (roles.includes('maintainer')) return 'Maintainer';
    return 'Developer';
  }
  
  return (
    <ul>
      <li>{user.name}</li>
      <li>{user.age}</li>
      <li>{user.email}</li>
      <li>{getUserRole()}</li>
    </ul>
  );
}
```

getUserRole은 UserCard가 렌더링 될 때마다 다시 생성된다.

useCallback 등을 사용하는 것보다 다음과 같이 작성하는 것이 낫다.

```js
const getUserRole = (roles) => {
  if (roles.includes('admin')) return 'Admin';
  if (roles.includes('maintainer')) return 'Maintainer';
  return 'Developer';
}

const UserCard = ({ user }) => {
  return (
    <ul>
      <li>{user.name}</li>
      <li>{user.age}</li>
      <li>{user.email}</li>
      <li>{getUserRole(user.roles)}</li>
    </ul>
  );
}
```

아예 파일을 분리하는 것도 좋은 방식이다.

## inline style을 쓰지 말자

## HTML을 준수하자

## 과도하게 context를 사용하지 말자

## 느낀 점, 배운 것

딱 내 수준에 맞는 좋은 내용을 배웠다.

내 코드를 보면 이 글에 나온 좋은 코드와 나쁜 코드가 섞여있다. 뭐가 옳은 방향인지 모르고 코드를 작성했기에 그리 되었다.

이해한 부분을 지금 하고 있는 프로젝트부터 당장 적용해봐야겠다.

시간이 지날 수록 공부가 부족함을 더 많이 느낀다. 더 열심히 공부하고 적용해보자.
