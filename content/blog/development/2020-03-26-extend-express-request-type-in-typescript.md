---
title: 'Express Request 확장하기(TypeScript)'
date: 2020-03-26 15:03:75
category: development
---

## 문제점

Apollo-server-express로 서버를 만들고 있다.

인증 부분을 다음과 같이 작성했다.

```ts
const authMiddleware = async (
  req: express.Request,
  _: unknown,
  next: express.NextFunction
): Promise<void> => {
  const token = req.get('H-TOKEN');
  if (token) {
    const user = await decodeJWT(token);
    if (user) {
      req.user = user;
    } else {
      req.user = undefined;
    }
  }
  next();
};
app.use(authMiddleware);
```

req.user 에서 다음과 같은 에러가 발생한다.

```ts
Property 'user' does not exist on type 'Request'.ts(2339)
```

Request에 정의되어 있지 않은 user라는 property를 임의로 추가했기 때문에 발생하는 에러다.

예전에는 req를 any로 설정하고 넘어갔었는데, 이번에는 any를 최대한 사용하지 않고 싶었다.

## 해결방안

검색해보니 작성되어 있는 type을 확장할 수 있는 방법이 있었다.

src/types/express.d.ts 파일을 생성한다.

```ts
export {};

declare global {
  namespace Express {
    interface Request {
      user?: import('../entities/User').default;
    }
  }
}
```

그리고 tsconfig.json 파일에 다음 항목을 추가한다.

```json
"typeRoots": [
  "./src/types",
  "./node_modules/@types"
],
```

## 삽질 포인트

src/types/express.d.ts 파일을 작성하면서 시행착오를 많이 겪었다.

대부분의 검색 결과가 다음과 같았다.

```ts
import User from '../../entities/User';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
```

해결방안의 코드와 다른 점은 첫 줄의 `export {}`와 User type을 import 하는 방식, 2가지다.

global 객체를 확장할 때, 첫 줄의 `export {}`가 external module로 만들어 주는 역할을 한다.

그리고 global을 사용할 경우 User를 import 할 수 없게 된다. 이럴 때는 interface 안에서 바로 import를 하는 방식을 사용한다.
