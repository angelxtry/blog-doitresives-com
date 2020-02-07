---
title: '[GraphQL-TypeORM] DataLoader'
date: 2020-02-04 20:02:99
category: development
---

## 1. intro

이번 프로젝트의 백앤드에서 GraphQL과 TypeORM을 사용했습니다.

여러가지 재미있는 일들이 많았지만 그 중 GraphQL DataLoader 얘기를 해보려고 합니다.

GraphQL의 확연한 특징 중 하나는 하나의 중첩된(nested) 정보를 자연스럽게 로드할 수 있다는 점입니다. 여기서 자연스럽게 로드한다는 의미는 Client 입장에서 서버에 추가 개발 요청없이 특정 데이터와 연결된 데이터를 query에 포함하거나 제외할 수 있다는 뜻입니다.

예를들어 이번 프로젝트의 서버에 다음과 같은 query를 전달하여 응답을 요청할 수 있습니다.

```graphql

query {
  users {
    id
    role
    email
    nickname
  }
}

```

users를 `root field`라고 부르고 하위의 모든 값들을 `payload` 라고 부릅니다. 여기에서 id, role, email, nickname 같은 payload는 user 테이블에 포함된 정보입니다.

서버에 추가 개발 요청없이 motivations라는 payload를 추가할 수 있습니다.

```graphql

query {
  users {
    id
    role
    email
    nickname
    motivations {
      id
      motivation
    }
  }
}

```

motivations는 user 테이블이 아닌 motivations라는 별도의 테이블에 저장된 정보입니다.

이번 프로젝트는 main이 되는 user 테이블을 중심으로 6개의 테이블이 연결되어 있습니다.

![table 전체 구조](https://drive.google.com/uc?export=view&id=1Moaj0RpswE4pdbshOS3o6v0svnDFm5hn)

Client는 권한이 있다면 users query를 이용하여 6개 테이블의 정보를 자유롭게 조회할 수 있습니다. 물론 공짜로 이루어지는 것은 아닙니다. 서버에서는 users query에서 다른 테이블을 잘 조회할 수 있도록 필요한 GraphQL schema와 resolver를 꼼꼼하게 만들어야 합니다. 하지만 상황에 따라 특정 End point를 추가로 만들어야 하는 수고로움에 비해 상당히 편리합니다.

저는 user schema에서 시작하여 다른 테이블의 정보를 로드하는 schema와 resolver를 하나씩 만들어가고 있었습니다.

하나의 테이블이 연결될 때마다 간단한 테스트를 진행했습니다. 테이블의 연결이 완료될 때 즈음에 조금 더 많은 더미 데이터를 입력하여 테스트를 시도하게 됩니다.

여기서 부터 문제가 발생하기 시작했습니다.

## 2. 뭐가 문제인가요?

50 user의 더미 데이터를 만들어서 모든 테이블에 데이터를 저장했습니다. 그리고 Playground에서 users query를 실행하여 다른 테이블의 정보를 잘 불러오는지 확인했습니다. 데이터는 잘 불러오지만 예상보다 속도가 매우 느렸습니다. 성능이 좋지않은 local 환경에서 동작한다는 것을 감안해도 너무 느렸습니다. 그래서 로그를 확인해봤습니다.

로그를 보니 생각보다 매우 많은 횟수의 select query가 실행된 것을 확인할 수 있었습니다. 터미널 창의 스크롤에 밀려 처음 실행된 query는 확인할 수도 없었습니다.

원인 파악을 위해 기존 정보를 모두 지우고 10명의 정보를 저장 한 후 users schema를 로드해봤습니다. 그리고 TypeORM의 log를 확인해보았습니다.

(TypeORM의 ormconfig.json에서 logging: true로 설정하면 실행 query를 확인할 수 있습니다.)

```sql
SELECT `User`.`id` AS `User_id`, `User`.`role` AS `User_role`, `User`.`email` AS `User_email`, `User`.`nickname` AS `User_nickname`, FROM `user` `User`

SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["1a47396b-84dc-4af3-95aa-f808df29f818"]
SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["f7fef52e-9365-4ffe-b63a-40c0d1c4a4c8"]
SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["1a9e52ef-9598-49a8-9a5c-e4d51c833bd5"]
SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["5e77d06d-92e6-44bb-9407-2381fceffbb4"]
SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["4382b69f-24d2-4a2a-a7b2-4f26828b425a"]
SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["6f75379d-0f77-45d1-8a5e-44cbf4d95353"]
SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["9dca636e-4f7e-4341-9d79-1c7a5dc129a0"]
SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["cc5f3a89-a99d-430a-889a-6dd8549855ff"]
SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["b3fde181-7861-4d7e-9853-2ce3eaf0d9d5"]
SELECT `Motivations`.`id` AS `Motivations_id`, `Motivations`.`motivation` AS `Motivations_motivation`, `Motivations`.`ownerId` AS `Motivations_ownerId` FROM `motivations` `Motivations` WHERE `Motivations`.`ownerId` = ? -- PARAMETERS: ["d8a57b0d-4def-496e-b900-e447a2b63b29"]
```

결과를 보면 users 테이블 조회 1번 + motivation 테이블 조회 10번(user 수) 총 11번의 query가 실행되었습니다.

이번 프로젝트에서 user 테이블과 연결된 테이블이 총 6개입니다. 최초 테스트에서 user 50명의 전체 정보를 조회했을 때 총 301번의 query가 실행되었을 것입니다. 이것이 실행 속도를 느리게 한 원인이었습니다.

이 문제가 GraphQL을 도입하면 반드시 짚고 넘어가야 하는 `N+1 Problem` 입니다.

user 테이블과 연결된 테이블을 join하여 데이터를 로드할 경우 user테이블 조회 1번, 연결 테이블 조회 N번(user 수 만큼) 조회한다고 해서 `N+1 Problem`입니다.

user, motivations 테이블 같이 간단한 join이 필요할 때, user 별로 각각 select query를 수행하는 것은 한번에 query를 실행하는 것에 비해 IO 비용이 과다하게 발생합니다. 결국 동일한 데이터를 가져올 때 속도가 느려질 수 밖에 없습니다.

기술 스택으로 GraphQL을 선정하고 사전 정보를 검색하면서 `N+1 Problem` 이란 용어가 있다는 것을 알고는 있었습니다. 하지만 이렇게 직접 접해보니 신기하고 재미있었습니다. 당연히 해결책이 있을 것이라 기대하고 검색을 시작했습니다.

## 3. 어떻게 해결했나요?

`N+1 Problem`을 해결하기 위해 DataLoader를 사용했습니다.

DataLoader Github 페이지를 보면 다음과 같이 소개하고 있습니다.

> DataLoader is a generic utility to be used as part of your application's data fetching layer to provide a simplified and consistent API over various remote data sources such as databases or web services via batching and caching.
>
> (DataLoader는 batch 또는 cache를 이용하여 안정적인 data fetch를 돕는 utility 입니다.)

동작 방식을 간단히 요약하면 다음과 같습니다.

1. event loop의 하나의 tick동안 요청받은 key를 모아서
2. 모은 key를 이용하여 DB select를 한번에 처리

적용하기에 앞서 기존 코드를 좀 더 확인해보겠습니다.

user schema는 다음과 같습니다. 일부 생략했습니다.

```graphql
extend type Query {
  users: [User]!
}

type User {
  id: ID!
  role: String!
  email: String!
  nickname: String!
  messageToFriend: String
  motivations: [Motivation]!
  following: [Follow]!
  followers: [Follow]!
  friends: [Friends]!
  createdAt: DateTime!
}
`;
```

이 user schema를 이용하여 motivations를 로드하면 다음의 resolver를 호출합니다.

```ts
const userResolver = {
  Query: {
    users: combineResolvers(isAuthenticated, async () =>
      getUserRepository().getAllUser()),
  }

  User: {
    motivations: async (user: any) =>
      getMotivationRepository().findByUserId(user.id),
  }
}
```

getAllUser 메서드는 user 테이블의 모든 정보를 로드하고, findByUserId 메서드가 user 수 만큼 반복 호출되면서 motivations 테이블의 정보를 불러오는 구조 입니다.

처음부터 user 테이블과 motivations 테이블을 join하여 한번에 데이터를 모두 로드해두면 select 횟수를 줄일 수는 있습니다. 하지만 motivations 데이터가 필요없을 때에도 계속 motivation 데이터를 로드해야 하는 오버로드가 생기게 됩니다.

문제 해결을 위해 DataLoader를 적용해 보았습니다.

먼저 설치합니다.

```ts
yarn add dataloader
```

DataLoader를 적용할 때 schema는 전혀 변경하지 않아도 됩니다.

userResolver에서 dataloader를 import 한 후에 motivationLoader라는 Dataloader를 생성합니다.

```ts
import Dataloader from 'dataloader';
...

const motivationLoader = new Dataloader<string, Motivations[]>(
  (userIds: readonly string[]) => getUserRepository().batchMotivations(userIds),
  { cache: false }
);
```

motivationLoader는 제네릭 클래스로써 `string`, `Motivations[]` 타입 파라미터를 받습니다.

`string`은 DataLoader.load 메서드의 인자의 타입이고, `Motivations[]`은 DataLoader.load 메서드의 리턴값이 `Promise<Motiovation[][]>`이라는 것을 의미합니다.

userResolver에서 motivationLoader.load를 호출합니다.

```ts
const userResolver = {
  ...
  User: {
    // DataLoader 적용 전
    // motivations: async (user: any) =>
    //   getMotivationRepository().findByUserId(user.id),

    motivations: async (user: any) => motivationLoader.load(user.id),
  }
}
```

load에는 motivations를 조회하기 위해 key가 되는 user.id를 전달합니다. 기존과 마찬가지로 motivationLoader는 user 수 만큼 호출됩니다. 하지만 실행 방식은 다릅니다.

앞서 설명한 것 처럼 motivationLoader는 event loop의 tick 동안 전달받은 user.id를 모으고 있다가 한번에 batchMotivations 메서드에 전달합니다. batchMotivations의 인자는 user.id로 구성된 string 배열이 됩니다.

```ts
async batchMotivations(userIds: readonly string[]) {
  const users = await this.createQueryBuilder('user')
    .leftJoinAndSelect('user.motivations', 'motivations')
    .where('user.id IN (:...userIds)', { userIds })
    .getMany();
  const userMap: { [key: string]: Motivations[] } = {};
  users.forEach((u) => {
    userMap[u.id] = u.motivations;
  });
  const result = userIds.map((id) => userMap[id]);
  return result;
}
```

TypeORM의 Query Builder를 이용하여 user 테이블과 motivations 테이블을 left join으로 join 하여 select 했습니다. 이 때 where문에 in 조건으로 인자로 전달받은 userId가 한번에 전달됩니다.

Query Builder가 실행되어 users 변수에 저장되는 데이터는 다음과 같이 생겼습니다.

```ts
[ User {
    id: '1a47396b-84dc-4af3-95aa-f808df29f818',
    role: 'USER',
    email: 'angelxtry@gmail.com',
    nickname: 'Suho Lee',
    messageToFriend: 'hello',
    motivations: [] },
  User {
    id: '1a9e52ef-9598-49a8-9a5c-e4d51c833bd5',
    role: 'USER',
    email: 'legendarysuho@gmail.com',
    nickname: 'suho legend',
    messageToFriend: 'hello',
    motivations:
     [ [Motivations], [Motivations], [Motivations], [Motivations] ] },
  ...
]
```

이 data를 userMap이라는 key가 userId고 value가 motivaions 배열인 임시 object를 생성하고 다시 인자로 받은 userId를 이용하여 배열로 변환하여 리턴합니다.

### 주의사항 1. readonly

```ts
const motivationLoader = new Dataloader<string, Motivations[]>(
  (userIds: readonly string[]) => getUserRepository().batchMotivations(userIds),
  { cache: false }
);
```

​motivationLoader를 선언할 때 userIds의 타입을 readonly로 설정해야 Typescript 오류가 발생하지 않습니다.

`dataloader/index.d.ts`를 보면 `ReadonlyArray`로 정의되어 있습니다.

Typescript에 익숙하지 않아 이 부분을 해결하지 못해 처음에 상당히 어려움을 겪었습니다.

### 주의사항 2. left join

```ts
const users = await this.createQueryBuilder('user')
  .leftJoinAndSelect('user.motivations', 'motivations')
  .where('user.id IN (:...userIds)', { userIds })
  .getMany();
```

```graphql
type User {
  ...
  motivations: [Motivation]!
}
`;
```

user schema의 motivations을 위와 같이 정의했다면 user 테이블을 기준으로 motivations 테이블을 left join으로 연결해야 합니다.

inner join으로 처리하면 motivations 데이터가 없을 경우 null로 처리되어 에러가 발생합니다.

### 주의사항 3. cache

```ts
const motivationLoader = new Dataloader<string, Motivations[]>(
  (userIds: readonly string[]) => getUserRepository().batchMotivations(userIds),
  { cache: false }
);
```

`cache: false`가 없는 경우, motivations 수정했을 때 DB 테이블에는 데이터 변경이 적용되었지만 query를 실행하면 cache되어 있는 변경 전 데이터가 로드되는 경우가 있습니다.

## 4. 뭐가 좋아졌나요?

DataLoader를 적용한 후 결과를 확인해 보겠습니다.

```sql
SELECT `User`.`id` AS `User_id`, `User`.`role` AS `User_role`, `User`.`email` AS `User_email`, `User`.`nickname` AS `User_nickname` FROM `user` `User`

SELECT
`user`.`id` AS `user_id`, `user`.`role` AS `user_role`, `user`.`email` AS `user_email`, `user`.`nickname` AS `user_nickname`,
`motivations`.`id` AS `motivations_id`, `motivations`.`motivation` AS `motivations_motivation`, `motivations`.`ownerId` AS `motivations_ownerId`
FROM `user` `user`
LEFT JOIN `motivations` `motivations`
ON `motivations`.`ownerId`=`user`.`id`
WHERE `user`.`id` IN (?)
```

DataLoader를 적용하기 전 11번 select가 실행되었던 로직이 2번만 select하도록 변경됐습니다.

실행시간에 얼마나 개선이 있었는지 확인해보기 위해 데이터를 추가하여 테스해봤습니다.

500 user의 정보를 입력한 후 DataLoad 적용 전 후를 비교했습니다.

시간 측정은 Postman을 이용했으며 초반 10회 정도를 제외하고 이후 10회의 평균입니다.

DataLoader 적용 전: 1318ms

DataLoader 적용 후: 117ms

select query 실행 횟수나 실행시간 모두 크게 줄어든 것을 확인할 수 있었습니다.

## 회고

GraphQL을 사용할 때 DataLoader를 사용하는 것은 선택이 아니라 필수라고 판단됩니다.

DataLoader 적용에는 성공했지만 몇가지 아쉬움이 남습니다.

당장 급한 불을 끄기 위해 DataLoader를 적용했지만 효율적으로 사용하고 있는지에 대해서는 아직 확신이 없습니다. 적용 코드를 좀 더 찾아보려고 합니다.

그리고 DataLoader 내부를 좀 더 이해해보고 싶습니다.

아쉬운 부분이 있지만 GraphQL과 DataLoader를 사용해 본 것은 무척 즐거운 경험이었습니다.
