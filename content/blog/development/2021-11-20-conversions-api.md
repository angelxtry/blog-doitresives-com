---
title: 2021-11-20 Google Tag Manager를 이용하여 페이스북 픽셀/Conversions API 실행
date: 2021-11-20 03:11:20
category: development
---

![SSGTM](https://drive.google.com/uc?export=view&id=1P7WlYiOWw242gcP-pb9tr20IHH2iiD_i)

## 개요

회사 업무 중에 갑자기 페이스북 픽셀과 Conversions API를 설정할 일이 있었습니다. 이게 프론트의 업무냐고 하면 살짝 애매하지만 좋은 경험이 될거라고 생각했고, 실제로도 많은 걸 배웠습니다.

잘 아는 분야가 아니라서 내용이 많이 부족할 수 있지만 그래도 기록으로 남겨두고 싶어 적어보려고 합니다.

### 배경설명
- 페이스북 Conversions API
  - Conversions API는 웹사이트에서 발생하는 이벤트 데이터를 웹 브라우저를 거치지 않고 웹사이트의 서버에서 페이스북 서버로 바로 전송하는 API를 의미합니다.
  - 페이스북은 전 세계적으로 대단한 영향력을 발휘하고 있는 광고 플랫폼입니다. 페이스북에 광고를 하려고 알아보다 보면 자연스럽게 픽셀이라는 단어를 접하게 됩니다.
  - 픽셀은 페이스북 광고를 통해 웹사이트에 접근한 사용자의 행동 정보를 수집할 수 있게 도와주는 제품입니다.
  - 웹사이트에 페이스북 픽셀을 설치하면 유저의 이벤트 데이터를 페이스북 쿠키와 함께 브라우저를 통해 전달됩니다.
  - 이 방식은 페이스북 쿠키에 의존하기 때문에 Ad Blocker나 브라우저의 정책 변화에 따라 많은 영향을 받습니다.
  - 반면, Conversions API는 서버에서 서버로 데이터가 이동하기 때문에 픽셀에 비해 좀 더 정확한 데이터 수집이 가능합니다.
  - 픽셀과 Conversions API 중 하나만 실행해도 데이터 수집이 가능하지만 페이스북에서는 두 개를 동시에 실행하는 것을 권장합니다.
  - 픽셀과 Conversions API를 실행하는 방식은 여러가지가 있습니다. 저는 Google Tag Manager를 이용하여 두 개를 함께 동작하도록 설정했습니다.

<br />

- Google Tag Manager Server-Side (SSGTM)
  - SSGTM은 간단하게 설명하면 서버에서 실행되는 Google Tag Manager(GTM)입니다. GTM과 동일하게 태그, 트리거, 변수를 사용할 수 있습니다.
  - GTM과 SSGTM의 차이는 SSGTM에는 엔드 포인트가 존재합니다. 이 엔드 포인트를 통해 데이터를 전송하면 SSGTM은 다른 서버로 데이터를 전송하는 프록시 역할을 할 수 있습니다.
  
<br />

- Google Tag Manager Server-Side를 이용하여 페이스북 Conversions API 실행
  - Conversions API를 구현하려면 페이스북에 데이터를 전송할 서버가 필요합니다. 이 서버를 SSGTM으로 대체할 수 있습니다. GTM을 사용하여 SSGTM으로 데이터를 전송하면 SSGTM은 수신한 데이터를 페이스북으로 전송합니다.

<br />

- 이커머스 도메인에서 페이스북 픽셀 이벤트 정의
  - 페이스북이 미리 정의해 둔 이커머스 도메인의 이벤트는 `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase` 등이 있습니다.
  - 이 글에서는 `PageView` 이벤트만 구성해보려고 합니다.

## Google Tag Manager의 데이터 수집 방식

- 특정 이벤트에 해당하는 데이터를 웹페이지에서 수집하기 위해 다양한 방식을 사용할 수 있습니다.
- 이번 작업에서는 2가지 방식을 사용했습니다.
  - GTM에서 활용하는 `dataLayer`에 저장한 데이터를 사용
  - 개발자가 특정 웹페이지에 전역 변수로 저장한 데이터를 사용

## Google Tag Manager의 이벤트와 페이스북 이벤트 매핑

- 페이스북에 데이터를 전달할 때 페이스북에서 지정한 특정 키워드를 사용해야 합니다.
- GTM -> SSGTM -> 페이스북 경로로 데이터를 전달하기 위해 GTM -> SSGTM 과정에서 부터 정해진 키워드를 사용해야 합니다.
- 정해진 키워드는 페이스북에서 사용하는 키워드로 자동 변환되어 전달됩니다.

<br />

(키워드는 관련 링크를 참조해주세요.)

## 실행 과정

- 실행 과정을 요약하면 다음과 같습니다.
  - 웹페이지에 GTM script를 설치합니다. 
  - SSGTM을 설정합니다.
  - GTM에 페이스북 픽셀 관련 설정을 추가합니다.
  - GTM에 페이스북 Conversions API 관련 설정을 추가합니다.
  - 유저가 웹페이지에 방문하면 GTM을 통해 픽셀 Event가 실행됩니다.
  - GTM에서 픽셀 Event가 실행되는 동시에 Conversions API 이벤트가 실행되어 SSGTM에 데이터를 전송합니다.
  - SSGTM에서는 Conversions API 이벤트를 수신하여 페이스북에 전달합니다.(Conversions API 방식)
  
<br />

- GTM 계정을 생성하고 GTM script를 웹사이트에 설치하는 부분은 생략하겠습니다.
- 페이스북 픽셀 ID와 페이스북 API Access Token 발급 과정도 생략합니다.
  
## Google Tag Manager Server-Side 설정

### 1. 서버 컨테이너 생성

SSGTM을 사용하려면 우선 서버 컨테이너를 생성해야 합니다.

- GTM -> 관리자 -> 컨테이너에서 `+` 클릭

![GGSTM 서버 컨테이너](https://drive.google.com/uc?export=view&id=1g1PqdcUQOS_8odlVCE-e2TBfmFB6qWbQ)

- 컨테이너 만들기
  - 컨테이너 이름: server-side container
  - 타겟 플랫폼: Server 선택
    
![SSGTM 컨테이너 만들기](https://drive.google.com/uc?export=view&id=1a6F9PAHURhoQoDVlaIKCh2eJkf-j0Yk9)

![SSGTM 컨테이너 프로비저닝](https://drive.google.com/uc?export=view&id=1iJz87hxRYGi9858dt3SvkH0cLlflH5bh)
- Install Google Tag Manager
  - Automatically provision tagging server 선택
- billing account 설정

billing account까지 무사히 설정하셨다면 일반적인 GTM과 유사하게 생긴 SSGTM을 확인할 수 있습니다.

### 2. 클라이언트 생성

![SSGTM 클라이언트 생성](https://drive.google.com/uc?export=view&id=1Q-H_2EmFRRYTaksddICZFnhkQnKTgqUc)
GTM을 통해 데이터를 수신하기 위한 클라이언트를 생성합니다. 서버 컨테이너를 생성하면 자동으로 생성되어 있는 GA4 클라이언트를 사용해도 무방합니다.

- 클라이언트 선택 -> 새로 만들기 클릭
- Google 애널리틱스: GA4 선택
- 기본 GA4 경로 체크
- 클라이언트 이름: GA4

### 3. 태그 생성

- SSGTM에서 수신한 데이터를 페이스북에 전달하는 태그를 생성해야 합니다. 페이스북에서 공식적으로 Conversions API를 위해 만든 템플릿을 사용합니다. 
- 태그의 이벤트는 GTM에서 발생한 모든 GA4 이벤트를 수신할 경우 동작하도록 트리거를 설정합니다.

![SSGTM 태그 생성](https://drive.google.com/uc?export=view&id=1FOfEVt5-kc2_w6fO_9fJUQugDyTADI1Q)
- 태그
  - 태그 -> 새로 만들기 -> 태그 구성 클릭 -> 커뮤니티 템플릿 갤러리 선택 -> 페이스북 Conversions API Tag 선택(facebookincubator 제공) -> 작업공간에 추가
  - 태그명: 페이스북 Conversions API
  - 태그 구성
    - 픽셀 ID, API Access Token을 입력합니다.
    - Action Source: Website를 선택합니다.

![SSGTM 트리거 ](https://drive.google.com/uc?export=view&id=1aPdCHj3okOLZLBc4tBkA_ShFdlDifNYP)

- 트리거
  - 하단의 트리거를 클릭합니다.
  - 트리거 선택 창에서 `+`를 클릭합니다.
  - 트리거 구성을 클릭하고 맞춤 설정을 선택합니다.
  - 내용 보강
  - 트리거명: All GA4 Events
  - 트리거 구성
    - 맞춤설정
    - 일부 이벤트
    - Client Name, 같음, GA4
  - 트리거 설정은 좀 더 세밀하게 설정할 수 있지만 일단 이렇게만 설정합니다.

- 여기까지 설정하면 GTM을 통해 발송하는 이벤트를 SSGTM이 수신할 수 있게 됩니다.

## Google Tag Manager 설정

- GTM은 웹사이트의 각 이벤트에 대응하는 태그를 2개씩 만들어야 합니다.
- 하나는 페이스북 픽셀을 실행하는 태그고, 다른 하나는 Conversions API를 호출하는 태그입니다.

### 1. 중복 제거를 위해 Event Id 추가

![GTM Event Id 생성 1](https://drive.google.com/uc?export=view&id=1tYf1CkRbbj5FeG5D9PCr1WbuG7RyPCyu)

![GTM Event Id 생성 2](https://drive.google.com/uc?export=view&id=1-RW9NId1YNC7HQ-N4i37Ex-fWvs2OU-A)

GTM에서 동작하는 픽셀과 Conversions API가 동일한 요청이라는 것을 페이스북에 알려주기 위해 Event Id라는 변수를 사용합니다.

PageView 이벤트는 커뮤니티 템플릿 갤러리에 있는 Event Id라는 변수를 활용하면 됩니다. 하지만 DataLayer를 사용하는 이벤트는 DataLayer에서 추출한 값을 Event Id로 사용해야 합니다.

- 변수 -> 사용자 정의 변수 -> 새로 만들기
- 변수명: Event-Id
- Event Id 작성자: mbaersch 템플릿 선택

### 2. 페이스북 픽셀 설정

#### 태그 템플릿: 페이스북 픽셀 템플릿 추가

GTM에서 픽셀 이벤트를 페이스북에 전달하기 위해 페이스북에서 제공한 템플릿을 사용합니다.

- 태그 -> 새로 만들기 -> 태그 구성 -> 커뮤니티 템플릿 갤러리 -> 페이스북 픽셀 선택

#### 태그: PageView 이벤트 추가

태그 -> 새로 만들기

태그명: 페이스북-픽셀-PageView (페이스북-픽셀-이벤트명)

태그 구성 -> 페이스북 픽셀 선택
- 페이스북 픽셀 Id: `{{페이스북 픽셀 Id (고객사명)}}`
- Event Name: Standard -> `PageView`
- More Settings -> Event ID: `{{Event-Id}}`

트리거
- All Pages

### 3. 페이스북 Conversions API 설정

#### 태그: Conversions API 설정 및 PageView 이벤트

태그명: 페이스북-ConverionAPI-Config

태그 구성 -> Google 애널리틱스: GA4 구성
- 측정 ID: G-xxxxxxx (G-로 시작하는 임의의 값)
  - 이 구성이 로드될 때 페이지 조회 이벤트 전송 check
  - 서버 컨테이너로 전송 check
    - 서버 컨테이너 URL
  - 설정할 필드
    - first_party_collection: true
    - fbp: {{FBP Cookie}}
    - fbc: {{FBC Cookie}}
    - event_id: {{Event-Id}}
  - 고급 설정
    - 태그 실행 옵션: 페이지당 한 번

트리거
- All Pages 

## 적용 결과 확인하기

### Google Tag Manager

![GTM 미리보기](https://drive.google.com/uc?export=view&id=1gQwCh5k-SJueYdAzU9Udk4dUB0zIe3lq)
- GTM에는 미리보기 기능이 있습니다. 미리보기를 이용하면 디버깅과 유사한 작업을 할 수 있습니다.
- 태그를 하나씩 추가할 때마다 미리보기로 확인하는 것을 추천합니다.
- 미리보기에서 정상적으로 동작해도 실제로 적용하면 정상 동작 하지 않는 경우가 있으니, 실제 적용 후 확인도 꼭 필요합니다.

![GTM 미리보기 sumarry](https://drive.google.com/uc?export=view&id=1oZMKpF02aEsrdh--LUtRN6EVso6G1nAu)

- 미리보기(Preview)
  - 미리보기 버튼 클릭 -> GTM을 적용한 웹사이트 입력 -> Connect 버튼 클릭
  - 미리보기 페이지와 작업한 태그가 적용된 웹사이트가 실행됩니다.
  - 미리보기 페이지 좌측에 웹페이지에서 발생한 이벤트가 기록됩니다.
  - Tags 탭에는 설정한 태그 중 웹사이트의 특정 페이지에서 실행된 태그가 표시됩니다.
    - 실행된 Tag는 Tags Fired에, 실행되지 않은 태그는 Tags Not Fired에 표시됩니다.
    - 각 태그를 클릭하면 상세 정보를 볼 수 있습니다.
  - Variables 탭에는 GTM에서 설정한 변수들의 값을 확인할 수 있습니다.
    - 웹사이트에서 특정 이벤트를 동작하면 해당 이벤트를 통해 변수의 값이 변경되는 것을 확인할 수 있습니다.
  - Data Layer 탭에는 웹사이트에서 Data Layer에 추가한 이벤트를 확인할 수 있습니다.
    - 웹사이트에서 특정 이벤트가 발생하면 Data Layer에 데이터를 추가하도록 코드를 작성해야 Data Layer를 사용할 수 있습니다. 
    - 웹사이트에서 특정 이벤트를 동작하면 해당 이벤트를 통해 Data Layer의 값이 변경되는 것을 확인할 수 있습니다.

### Google Tag Manager Server-Side

![SSGTM Preview](https://drive.google.com/uc?export=view&id=1ecEtQhyVhB48N3CLKmccwHVfhG5IBE_W)

- SSGTM에도 미리보기 기능이 있습니다.
- 미리보기를 실행하고 웹사이트의 이벤트를 발생시키면 데이터가 수신되는 것을 확인할 수 있습니다.

![SSGTM Preview Summary](https://drive.google.com/uc?export=view&id=1F31owkh7KzIbYVuOmsi2iodwxlyLSSdd)

- 미리보기 페이지에는 좌측 Summary에 GTM에서 수신된 이벤트들이 표시됩니다.
- 각 이벤트를 클릭하면 Request, Tags, Variables, Event Data를 확인할 수 있습니다.
  - Request
      - GTM에서 들어온 Incomming HTTP Request와 SSGTM에서 페이스북 서버로 전달하는 Outgoing HTTP Request from Server를 확인할 수 있습니다.
      - Outgoing HTTP Request from Server가 정상적으로 호출되면 페이스북에서 POST-200 응답을 보낸 것이 표시됩니다.
      - 실제 데이터가 제대로 전달되었는지 확인하려면 Outgoing HTTP Request from Server를 클릭하여 상세정보에서 데이터를 확인해야 합니다.
      - POST-400 응답을 받았을 경우 Outgoing HTTP Request from Server 상세정보 최하단의 Response Body에서 에러 메시지를 확인할 수 있습니다.
  - Tags
      - SSGTM에서 어떤 태그가 실행되었는지 표시됩니다.
  - Variables
      - SSGTM에 설정된 변수들이 표시됩니다.
  - Event Data
      - GTM에서 전달받은 데이터들이 표시됩니다.
- 태그 실행을 확인할 때 Event Data 탭에서 GTM에서 전달받은 데이터를 먼저 확인하고, 해당 데이터가 페이스북에 잘 전달되었는지 Request 탭에서 확인할 수 있습니다.

### 페이스북에서 Conversions API 수신 확인

- business.facebook.com으로 접속합니다.
- 이벤트 관리자 -> 설정한 픽셀에 해당하는 데이터 소스 선택 -> 이벤트 테스트를 선택합니다.
- TEST로 시작하는 테스트 코드를 확인하여 SSGTM의 태그에 입력합니다.
- GTM이 설치된 웹페이지에서 이벤트를 실행하면 페이스북의 이벤트 테스트 페이지에 브라우저에서 발생한 이벤트와 서버에서 발생한 이벤트가 확인됩니다.

![SSGTM Facebook TestId](https://drive.google.com/uc?export=view&id=1_wBVFKsBTEdrzYf5KYTUp4lsouy252GW)
![Facebook Result](https://drive.google.com/uc?export=view&id=18odbPJoz14We4nzHYtxD6k-l9OCC0n9s)

- 수신된 이벤트의 PageView 이벤트를 보면 브라우저와 서버 2개가 수신되었고, 하나는 중복 제거가 된 것을 확인할 수 있습니다.

## 마치며

글을 작성하다보니 의미를 정확하게 파악하지 못한 부분들이 많이 보이네요. 이대로 글을 적어도 되나 고민을 많이 했지만 일단 적어봤습니다.

SSGTM을 이용하여 Pixel과 Conversions API를 동작시키는 방법이 있다는 걸 확인하는 차원에서 읽어주시길 바랍니다.

읽어주셔서 감사합니다!


## 관련 링크

[FACEBOOK CONVERSIONS API USING GA4 WEB TAGS AND A GTM SERVER](https://www.simoahava.com/analytics/facebook-conversions-api-gtm-server-side-tagging/)
