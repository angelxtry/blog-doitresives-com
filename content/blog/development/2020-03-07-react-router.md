---
title: 'React Router 간단 정리'
date: 2020-03-07 15:03:97
category: development
---

React Router를 간단히 정리하고 넘어가자.

현재 React Router 버전은 5.1.2이다.

## 1. Route

```tsx
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  );
};

export default App;
```

### path, component, exact

`Route`는 여러가지 프로퍼티가 추가될 수 있다.

```tsx
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </BrowserRouter>
  );
};
```

브라우저의 주소창에 `http://localhost:3000/about`라고 입력하면 Home과 About이 동시에 출력된다.

오작동한 것이 아니라 매칭되는 항목을 모두 브라우저에 출력하기 때문에 정상 동작이다.

이런 경우 `exact`를 사용한다.

```tsx
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/about" exact component={About} />
    </BrowserRouter>
  );
};
```

### Swtch

`Switch`는 Route 중 하나가 매칭되면 다른 항목은 신경쓰지 않고 리턴한다.

```tsx {4,7}
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </BrowserRouter>
  );
};
```

exact를 제외하고 Switch로 Route를 감싸주었다.

이렇게 하면 '/'은 정상 동작한다. 하지만 '/about'의 경우 '/'에서 이미 Home이 매칭되기 때문에 Home이 출력되고 끝난다.

상황에 맞게 Switch와 exact를 적절히 사용하면 된다.

### 404 처리

정해진 route에 일치하지 않는 주소가 입력되었을 경우 404 페이지로 보낼 수 있다.

```tsx {7}
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/" render={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};
```

NotFound 같은 컴포넌트가 없다면 함수로 html을 리턴해도 된다.

```tsx {7}
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
        <Route path="/" render={() => <div>404</div>} />
      </Switch>
    </BrowserRouter>
  );
};
```

## 2. Link

링크를 클릭했을 때 특정 페이지로 이동하려면 `Link`를 사용한다.

```tsx {2,10}
import React from 'react';
import { Link } from 'react-router-dom';

interface Props {}

const Home: React.FC<Props> = () => {
  return (
    <>
      <div>Home</div>
      <Link to="/about">go to about</Link>
    </>
  );
};

export default Home;
```

`to`라는 프로퍼티를 이용하여 이동할 페이지를 지정한다.

해당 링크를 클릭하면 주소가 '/about'으로 변경되고 About 페이지가 출력된다.

## 3. history

`history` prop을 이용하여 버튼에 페이지 이동을 추가할 수도 있다.

```tsx {2,3,5,7,14-21,26-28}
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

type Props = RouteComponentProps;

const Home: React.FC<Props> = ({ history }) => {
  return (
    <>
      <div>Home</div>
      <div>
        <Link to="/about">go to about</Link>
      </div>
      <button
        type="button"
        onClick={() => {
          history.push('/about');
        }}
      >
        click to go to about
      </button>
    </>
  );
};

Home.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
};

export default Home;
```

버튼을 클릭했을 때 특정 이벤트를 처리하고 about 페이지로 이동하려면 위와 같이 작성한다.

history.push 위에 특정 이벤트를 처리하는 코드를 넣으면 된다.

그리고 history를 추가하면 TypeScript의 타입과 Prop Type가 필요하다고 vscode에서 알려준다.

history의 타입은 `RouteComponentProps`을 사용하여 명시한다.

prop types는 추가해보려고 애쓰다가 결국 `react-router-prop-types` package를 설치하여 처리했다.

## 4. location

history외에 loacation과 match를 인자로 받을 수 있다.

```tsx {7-9,30-31}
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

type Props = RouteComponentProps;

const Home: React.FC<Props> = ({ history, location, match }) => {
  console.log({ location });
  console.log({ match });
  return (
    <>
      <div>Home</div>
      <div>
        <Link to="/about">go to about</Link>
      </div>
      <button
        type="button"
        onClick={() => {
          history.push('/about');
        }}
      >
        click to go to about
      </button>
    </>
  );
};

Home.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default Home;
```

location은 다음과 같이 생긴 object다.

```ts
{
  pathname: '/';
  search: '';
  hash: '';
  state: undefined;
}
```

브라우저의 주소창에 `http://localhost:3000/?page=1` 과 같은 주소가 입력되면 location은 다음과 같이 출력된다.

```ts
{
  pathname: '/';
  search: '?page=1';
  hash: '';
  state: undefined;
}
```

search를 파싱하여 원하는 값을 전달받을 수 있다.

주소를 이용하지 않고 Link의 `state`로도 인자를 전달할 수 있다.

```tsx {14-23}
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

type Props = RouteComponentProps;

const Home: React.FC<Props> = ({ history, location, match }) => {
  console.log({ location });
  console.log({ match });
  return (
    <>
      <div>Home</div>
      <div>
        <Link
          to={{
            pathname: '/about',
            state: {
              value: 'abc',
            },
          }}
        >
          go to about
        </Link>
      </div>
      <button
        type="button"
        onClick={() => {
          history.push('/about');
        }}
      >
        click to go to about
      </button>
    </>
  );
};

Home.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default Home;
```

`Link`를 이용하여 about 페이지를 출력할 때 `state`를 이용하여 값을 전달했다.

전달받은 값은 다음과 같이 확인할 수 있다.

```tsx {10-12}
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

type Props = RouteComponentProps;

const About: React.FC<Props> = ({ location, match }) => {
  console.log({ location });
  console.log({ match });
  const data = location.state as { value: string };
  console.log(data.value); // abc
  return <div>About</div>;
};

About.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};
export default About;
```

about 페이지에서 `location`을 출력해보면 다음과 같다.

```ts
{
  pathname: '/about';
  search: '';
  hash: '';
  state: {
    value: 'abc';
  }
  key: 'sbset9';
}
```

## 5. match

match를 이용하여 주소 뒤에 추가되는 가변 인자를 받을 수 있다.

주소창에 직접 `http://localhost:3000/post/50`를 입력해보자.

```tsx {5,9-10}
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

type Props = RouteComponentProps<{ id: string }>;

const Post: React.FC<Props> = ({ match }) => {
  console.log({ match });
  const { id } = match.params;
  return <div>Post {id}</div>;
};

Post.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default Post;
```

`RouteComponentProps`에 match의 타입을 추가했다.

match를 출력해보면 다음과 같다.

```ts
{
  path: '/post/:id';
  url: '/post/50';
  isExact: true;
  params: {
    id: '50';
  }
}
```

match로 id를 받아서 서버에서 데이터를 받아오는 작업을 처리할 수 있다.

```tsx {10-12}
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

type Props = RouteComponentProps<{ id: string }>;

const Post: React.FC<Props> = ({ match }) => {
  console.log({ match });
  const { id } = match.params;
  useEffect(() => {
    fetch(`http://abc.com/post/${id}`);
  }, [id]);
  return <div>Post {id}</div>;
};

Post.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default Post;
```

## 5. withRouter

컴포넌트를 만들 때는 `withRouter`를 사용하는 것이 편리하다.

```tsx
import React from 'react';
import { withRouter } from 'react-router-dom';

const ResumeButton = withRouter(({ history }) => {
  return (
    <button
      type="button"
      onClick={() => {
        history.push('/post/resume');
      }}
    >
      Resume
    </button>
  );
});

export default ResumeButton;
```

버튼을 하나 만들었다. 클릭하면 resume page로 이동하는 버튼이다.

`withRouter`를 이용하여 함수 전체를 감싸주면 history, location, match 같은 param들을 사용할 수 있다.

## 6. useHistory

withRouter 대신 `useHistory`라는 hook을 사용할 수도 있다.

```tsx {2,5}
import React from 'react';
import { useHistory } from 'react-router-dom';

const ResumeButton = () => {
  const history = useHistory();
  return (
    <button
      type="button"
      onClick={() => {
        history.push('/post/resume');
      }}
    >
      Resume
    </button>
  );
};

export default ResumeButton;
```

동일하게 동작한다.

## 7. useLocation

location도 useHistory와 마찬가지로 `useLocation`이라는 hook이 존재한다.

```tsx {2,12-14}
import React from 'react';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

type Props = RouteComponentProps;

const About: React.FC<Props> = ({ location }) => {
  console.log({ location });
  const data = location.state as { value: string };
  console.log(data.value); // abc

  const locationHook = useLocation();
  const hookData = locationHook.state as { value: string };
  console.log(hookData.value);

  return <div>About</div>;
};

About.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};
export default About;
```

## 8. useParams

match를 사용하여 받아오던 주소의 가변인자는 `useParams`라는 hook을 사용하여 처리할 수 있다.

```tsx {2,5}
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Post: React.FC = () => {
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://abc.com/post/${id}`);
  }, [id]);
  return <div>Post {id}</div>;
};

export default Post;
```

## 9. 정리

hook을 적절히 사용하면 코드가 간단해진다. 다른 문제가 없다면 hook을 사용하자.

특정 페이지로 이동하는 링크를 만들고 싶다면 `Link`

특정 페이지로 이동할 때 주소에 추가하지 않고 데이터를 전달하려면 `Link`의 `state`를 활용한다.

주소에서 가변인자를 받아 활용하려면 `match`, `useParams`

컴포넌트를 만들 때는 `withRouter`, `useHistory`
