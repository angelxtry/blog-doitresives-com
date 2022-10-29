---
title: 2022-10-30 React Conditional Rendering
date: 2022-10-30 00:10:89
category: development
---

![conditional-rendering](https://drive.google.com/uc?export=view&id=1lwYzPMfeG14VGY2zxc0LPQGxzKkbOnNy)

## TL;DR

- 간단한 조건부 랜더링은 `&&` 나 삼항연산자를 사용
- 조금 더 복잡한 경우에는 if/else를 사용하거나 별도의 함수로 분리

---

React를 사용하다보면 조건부 랜더링을 자주 사용하게 됩니다. 간단하게는 logical and 연산자를 사용하는 것 부터 시작해서 복잡한 것은 switch case를 사용하여 복잡한 분기를 처리하기도 합니다. 저는 logical and 연산자를 사용하다가도 종종 예상하지 못한 에러를 만들기도 하고, 복잡한 분기를 만들 때면 잘 정리되지 않은 더러운 코드를 왕창 만들기도 했습니다. 어떻게 하면 조건부 랜더링 코드를 더 잘 만들 수 있을까? 하는 생각에 내용을 찾아보기 시작했습니다.

이 글에서는 제가 찾아본 몇 개의 글에서 추천하는 조건부 랜더링 방식을 나열해보고 그 중에서 마음에 드는 몇 가지 패턴을 찾아보려고 합니다. (다들 알고 있는 뻔한 얘기일 수도 있습니다.)

## React BETA Conditional Rendering

시작은 React BETA 문서입니다.

[Conditional Rendering](https://beta.reactjs.org/learn/conditional-rendering)

BETA 문서에서 3가지 방식으로 조건부 랜더링을 표현합니다.

### 1. 삼항 연산자

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? name + ' ✔' : name}
    </li>
  );
}
```

### 2. Logical AND operator

```jsx
function Item({ name, isPacked }) {
  return (  
    <li className="item">    
      {name} {isPacked && '✔'}  
    </li>
  );
}
```

### 3. if 문

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}
```

if문은 사용하는 스타일을 코드가 장황하지만 가장 유연해서 추가적인 코드가 더 있어도 가장 표현하기 좋습니다.


## Use ternaries rather than && in JSX - Kent C. Dodds

두 번째 글은 Kent C. Dodds의 [Use ternaries rather than && in JSX](https://kentcdodds.com/blog/use-ternaries-rather-than-and-and-in-jsx) 입니다.

글에서 예제로 나온 다음의 코드는 에러가 발생할 여지가 있습니다. (React BETA 문서에서도 이 문제를 언급합니다.)

```jsx
function ContactList({contacts}) {
  return (
    <div>
      <ul>
        {contacts.length &&
          contacts.map(contact => (
            <li key={contact.id}>
              {contact.firstName} {contact.lastName}
            </li>
          ))}
      </ul>
    </div>
  )
}
```

contacts가 빈 배열일 경우 `0` 이 출력됩니다. `!!contacts.length` , `contacts.length > 0`  등과 같이 `&&` 왼쪽의 조건을 변경하면 문제가 없긴 합니다만 실수의 여지를 줄이기 위해 다음과 같이 작성하기를 권장합니다.

```jsx
function ContactList({contacts}) {
  return (
    <div>
      <ul>
        {contacts.length
          ? contacts.map(contact => (
              <li key={contact.id}>
                {contact.firstName} {contact.lastName}
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}
```

if 문을 선호한다면 다음과 같이 작성하는 것도 좋다고 합니다.

React BETA 문서에서 얘기하는 것과 비슷한 방식입니다.

```jsx
function ContactList({contacts}) {
  let contactsElements = null
  if (contacts.length) {
    contactsElements = contacts.map(contact => (
      <li key={contact.id}>
        {contact.firstName} {contact.lastName}
      </li>
    ))
  }

  return (
    <div>
      <ul>{contactsElements}</ul>
    </div>
  )
}
```

## Good advice on JSX conditionals - Vladimir Klepov

세 번째 글은 [Good advice on JSX conditionals](https://blog.thoughtspile.tech/2022/01/17/jsx-conditionals/) 입니다.

이 글에서 얘기하는 몇 가지 팁만 추려봤습니다.

1.  `{number && <JSX />}` 대신 `{number > 0 && <JSX />}`를 사용하세요.

2. Logical OR 연산자 `||`를 사용할 때는 괄호를 꼭 사용하세요. `{(cond1 || cond2) && <JSX />}`

3. 삼항 연산자 2개의 분기를 같이 사용하지 마세요. `&&` 블록으로 분리하거나 함수로 추출해서 if / else를 사용하세요.

4. props.children은 실제로 콘텐츠가 포함되어 있는지 알 수 없습니다.

1번은 앞에서 이미 언급했던 내용이라 넘어가고 2번 부터 정리해보겠습니다.

### 2. Logical OR 연산자 `||`를 사용할 때는 괄호를 꼭 사용하세요. `{(cond1 || cond2) && <JSX />}`

```tsx
import { Layout } from '@/components/layout';  
  
type ValueOf<T> = T[keyof T];  
const UserTypes = {  
  admin: 'admin',  
  authorized: 'authorized',  
  restricted: 'restricted',  
  anonymous: 'anonymous',  
} as const;  
type UserTypes = ValueOf<typeof UserTypes>;  
  
const NotAuthorizedNotification = ({ userType }: { userType: UserTypes }) => (  
  <div>  
    {userType === UserTypes.anonymous
    || userType === UserTypes.restricted 
    && <div>You do not have permission.</div>}  
  </div>  
);  
  
export const VladimirKlepovPage = () => (  
  <Layout>  
    <NotAuthorizedNotification userType={UserTypes.anonymous} />  
    <div>This content is only allowed for authorized user.</div>  
  </Layout>  
);
```

조금 억지스러운 예제입니다. userType이 anonymous 이거나 restricted 이면 NotAuthorizedNotification가 출력되도록 하는 것이 원래 의도입니다. 하지만 위 코드의 경우 userType이 anonymous임에도 불구하고 NotAuthorizedNotification가 출력되지 않습니다.

Logical AND 연산자는 Logical OR 보다 우선순위가 높습니다. 그래서 위 코드의 조건부 랜더링 로직은 다음과 같이 처리됩니다.

```tsx
{userType === UserTypes.anonymous
|| (userType === UserTypes.restricted && <div>You do not have permission.</div>)}  
```

의도대로 처리하기 위해서는 다음과 같이 작성해야 합니다.

```tsx
{(userType === UserTypes.anonymous || userType === UserTypes.restricted)
 && <div>You do not have permission.</div>}  
```

### 3. 삼항 연산자 2개의 분기를 같이 사용하지 마세요. `&&` 블록으로 분리하거나 함수로 추출해서 if / else를 사용하세요.

삼항 연산자를 중첩해서 사용한 코드입니다.

```jsx
{isEmoji 
  ? <EmojiButton />  
  : isCoupon 
  ? <CouponButton />  
  : isLoaded && <ShareButton />}
```

논란의 여지가 있을 수 있지만 코드 중복의 가능성이 있더라도 `&&` 블록을 사용하는 것이 더 명확해보입니다.

```jsx
{isEmoji && !isCoupon && <EmojiButton />}
{!isEmoji && isCoupon && <CouponButton />}
{!isEmoji && !isCoupon && isLoaded && <ShareButton />}
```

별도의 함수로 추출할 수도 있습니다.

```jsx
const getButton = () => {  
  if (isEmoji) return <EmojiButton />;  
  if (isCoupon) return <CouponButton />;  
  return isLoaded ? <ShareButton /> : null;  
};
```

### 4. props.children은 실제로 콘텐츠가 포함되어 있는지 알 수 없습니다.

```tsx
const Wrap = ({ children }: PropsWithChildren) => {  
  if (!children) return null;  
  return <div>{children}</div>;  
};
```

위 코드는 prop으로 children을 받고, children이 없으면 null을 리턴합니다.

```tsx
export const VladimirKlepovPage = () => {  
  return (  
    <Layout>  
      <Wrap />  
    </Layout>  
  );  
};
```

이 경우는 정상적으로 동작합니다. console.log로 확인해보면 undefined가 출력됩니다. 하지만 빈 배열이 전달될 경우 다르게 동작합니다.


```tsx
export const VladimirKlepovPage = () => {  
  const userList: string[] = [];  
  return (  
    <Layout>  
      <Wrap>  
        {userList.map((element) => (  
          <div key={element}>{element}</div>  
        ))}  
      </Wrap>  
    </Layout>  
  );  
};
```

이 경우 children은 빈 배열이 되고 Wrap은 `<div></div>`를 리턴합니다. 단지 화면에 출력되는 것이 없을 뿐이죠.

```tsx
const DisplayChildren = ({ children }: PropsWithChildren) =>  
  children ? <div>{children}</div> : <div>no children</div>;
```

이런 컴포넌트를 사용하면 문제가 발생할 수 있으니 주의해야 합니다.

## 마치며

앞으로 매우 간단한 조건부 랜더링은 `&&` 나 삼항연산자를 사용하고, 조금 더 복잡한 경우에는 if/else를 사용하거나 별도의 함수로 분리하는 방식으로 코드를 작성하려고 합니다. 그보다 더 복잡한 조건부 랜더링이 필요하다면 패턴매칭 같은 방식을 고려하는 것이 좋을 것 같습니다.

위에 나열된 코드는 대부분 원글에 포함된 코드를 그대로 사용했습니다.
