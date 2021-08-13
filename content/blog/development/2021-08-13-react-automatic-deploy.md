---
title: 2021-08-13 Github Action을 이용한 Front 배포 자동화
date: 2021-08-13 19:08:31
category: development
---

Github Action을 통해 AWS에 배포 자동화 설정을 해봅시다!

![Github Action](https://drive.google.com/uc?export=view&id=1Z3McB_9l-YFZqHWTnVc2CczkxRifI5KI)

회사에서 새로운 프로젝트를 진행하고 있습니다. 아직 시작한지 얼마 되지 않았지만 초기부터 배포를 하고 진행하는 것이 더 낫다고 판단해서 일단 배포를 진행했습니다.

이번 작업의 주요 포인트는 다음과 같습니다.
- Github Action을 통해 배포 자동화
	- PR이 merge되면 자동 배포
- S3의 public access 차단
- CloudFront를 통해 접근
<br />
<br />

구체적으로 다음과 같은 순서로 진행했습니다.
1. S3 버킷 생성
2. CloudFront 연동
3. Route53으로 도메인 연결
4. 배포 자동화를 위한 IAM 생성
5. 배포 자동화를 위한 Github Action 생성

각 항목들을 하나씩 적어보겠습니다. 작업 내용들 중 일부 디테일한 내용은 생략되었습니다.

## 1. S3 버킷 생성

React App 배포에 S3를 사용하기로 결정했습니다.(Netlify도 써보고 싶다!) 그래서 먼저 S3 부터 생성합니다.  S3 버킷 생성은 간단합니다. Bucket name을 설정하고 Create bucket 버튼을 클릭하는 것이 전부입니다.

저는 Bucket name을 보통 설정하려는 도메인으로 입력합니다. 이렇게 설정해두면 AWS 다른 리소스에서 사용하기에 편했던 것 같습니다.

정적 호스팅을 하기 위해 Block all public access를 체크를 해제하여 퍼블릭 읽기 엑세스를 허용하거나, Static website hosting을 enable 하는 경우도 있긴하지만 이번 프로젝트에서는 그렇게 처리하지 않았습니다. Public access를 차단하면 Object URL 등을 통해 S3의 파일에 접근할 수 없습니다.  그리고 Static website hosting을 enable하지 않았기 때문에 Bucket website endpoint를 통해 React App에 접근할 수 없습니다.

React App에 public한 접근은 다음에 설명하는 CloudFront URL을 통해서만 가능합니다.

## 2. CloudFront 연동

![CloudFront 설정 1](https://drive.google.com/uc?export=view&id=1qbxLcZ3zf7P0XihTIAay6CYzxGsAbyVk)

CloudFront에 접속하여 `Create distribution` 버튼을 클릭합니다.  `Origin domain` 을 클릭하여 방금 생성한 S3 버킷을 선택할 수 있습니다.

Name을 적당히 입력합니다. 저는 S3와 동일하게 입력했습니다.

Origin domain을 S3를 선택하면 `S3 bucket access` 항목이 새롭게 나타납니다. S3 bucket access에서는 `OAI(Origiin Access Identity)` 사용 여부를 선택할 수 있습니다. OAI를 설정하면 사용자가 S3 버킷에 직접 접근하지 않고 CloudFront를 통해서만 S3의 파일에 접근할 수 있습니다. S3에서 Block all public access를 체크 해제하지 않은 경우 이 설정을 꼭 해야 합니다. `Yes use OAI (bucket can restrict access to only CloudFront)`를 선택하고 `Create new OAI` 버튼을 클릭하여 OAI를 생성합니다. 그리고 `Yes, update the bucket policy`를 선택합니다. S3 생성 시 Bucket policy에 아무것도 입력하지 않았지만 이 옵션을 선택하면 CloudFront 설정을 모두 끝내고 나면 자동으로 OAI를 위한 Bucket policy가 생성됩니다.
<br />
<br />

![ClounFront 설정 2](https://drive.google.com/uc?export=view&id=1ECBIyE3Pd7L4lzZGq7AQPqxF2f-g-gbW)

Default cache behavior에서는 `Viewer protocol policy: Redirect HTTP to HTTPS`, `Allowed HTTP methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE` 정도를 설정합니다.

<br />
<br />

![ClounFront 설정 3](https://drive.google.com/uc?export=view&id=11RijI1YL37WU7mRhVXa1zZbSBawqWghq)

마지막으로 Settings에서 `Alternate domain name (CNAME)`에 원하는 도메인을 넣고, 인증서를 선택하고, Description 정도를 설정합니다.

`Create distribution` 버튼을 클릭한 후 S3의 Bucket policy를 확인하면 다음과 같은 정책이 저장되어 있습니다.

```json
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity [CloudFront Distribution ID]"
            },
            "Action": "s3:GetObject",
            "Resource": [S3 ARN]
        }
    ]
}
```

## 3. Route53으로 도메인 연결

Route53에 등록해 둔 도메인(미리 등록한 도메인이 있어야 합니다!)을 선택한 후 `Create record`를 선택합니다.

![Route53 설정](https://drive.google.com/uc?export=view&id=108BIkK8QcuzEXkR5AwiC-aPRrGtis3xQ)

`Record name`을 입력하고, `Record type`은 `A - ...` 를 선택합니다.(이미 선택되어 있습니다!)
Route traffic to 옆의 Alias 버튼을 클릭하면 endpoint를 선택할 수 있습니다. 여기서 `Alias to CloudFront distribution`을 선택하고, `Choose distribution`에 방금 생성한 CloudFront를 선택합니다. 간혹 선택 항목이 없을 때도 있는데 CloudFront에서 해당 항목을 복사하여 붙여넣으면 됩니다.

## 4. 배포 자동화를 위한 IAM 생성

IAM에 접속하여 `Users`를 선택한 후 `Add users` 버튼을 클릭합니다.

![IAM 설정 1](https://drive.google.com/uc?export=view&id=1WffUoleFBHqpUmorSiPqcJNX1qo5YQkM)

User name을 github-action-deploy로 설정하고 `Access type`을 `Programmatic access`를 선택하고 Next 버튼을 클릭합니다.

![[iam-02.png]](https://drive.google.com/uc?export=view&id=1xdzRg1_TYfO7CExJu-oLY6It0G31FIyy)

`Attach existing policies directly`를 선택하면 이미 만들어져 있는 permission을 선택할 수 있습니다. 여기서  `AmazonS3FullAccess`와 `CloudFrontFullAccess`를 검색하여 선택 한 후 Next 버튼을 클릭합니다.  `AmazonS3FullAccess`는 Github Action에서 생성한 파일을 업로드 하기 위한 권한이고, `CloudFrontFullAccess`는 S3를 업로드 한 후 CloudFront의 캐시 갱신을 위한 권한입니다.

좀 더 디테일하게 permission을 설정할 수도 있겠지만 제가 아직 그 부분은 미숙하네요.

Tag를 적당히 설정 한 후 Next 버튼을 클릭합니다.

`Create User` 버튼을 클릭하면 `Access key ID`와 `Secret access key`를 확인할 수 있습니다.  Secret access key는 이 때만 확인 가능하니 잘 관리하시길 바랍니다.

AWS에서 설정은 모두 끝났습니다.  이 상태로도 수동으로 React App을 배포하면 사용자가 접속 가능 합니다.

이제 배포 자동화를 위해 Github으로 갑니다!

### 5. 배포 자동화를 위한 Github Action 생성

![[github-01.png]](https://drive.google.com/uc?export=view&id=1j4bBx5bFukrW8ZQkjlEKphVSybbD5znK)

Github Action에서 사용하기 위해 AWS의 각종 정보를 Secrets으로 설정합니다.

저는 다음과 같이 설정했습니다.

- `AWS_ACCESS_KEY_ID`: 배포를 위해 이번에 생성한 IAM 유저의 Access key ID

- `AWS_REGION`: S3의 region

- `AWS_SECRET_ACCESS_KEY`: 배포를 위해 이번에 생성한 IAM 유저의 Secret access key

- `DEV_AWS_DISTRIBUTION_ID`: CloudFront Distribution Id

- `DEV_AWS_S3_BUCKET`: S3 버킷 이름

GithubAction을 생성하기 위해 React App 폴더에 `.github/workflows` 폴더를 생성하고 yml 파일을 하나 추가합니다. 저는 develop 환경에서 배포 자동화를 먼저 설정하기 위해 development.yml 파일을 생성했습니다. 이후에 production.yml 파일을 추가하여 production 환경의 배포 자동화를 설정할 예정입니다.

develop 환경에서는 Pull Request와 리뷰를 마치고 merge가 될 때 자동으로 배포되도록 설정했습니다.

development.yml 파일은 다음과 같습니다.

```yml
name: development deployment

on:
  pull_request:
    branches:
      - develop
    types: [closed]

jobs:
  deploy:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-versions: [14.x]

    steps:
      - name: Checkout source code.
        uses: actions/checkout@v2

      - name: Install Dependencies
        run: yarn

      - name: Build
        run: yarn build:dev

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy to S3
        run: aws s3 sync ./dist s3://${{ secrets.DEV_AWS_S3_BUCKET }} --delete

      - name: Invalidate CloudFront Cache
        run: aws cloudfront create-invalidation --distribution-id ${{secrets.DEV_AWS_DISTRIBUTION_ID}} --paths "/*"
```

Github Action은 Workflow, Event, Job, Step 등으로 구성됩니다. 여기에 작성한 YAML 전체가 Workflow가 됩니다.

위 코드를 한 단계씩 살펴보겠습니다.

### Event

```yml
on:
  pull_request:
    branches:
      - develop
    types: [closed]
```

Event는 Workflow를 실행시키는 조건입니다. 현재 설정을 보면 develop branch에 Pull Request가 closed되면 Workflow가 실행됩니다.

### Job

```yml
jobs:
  deploy:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-versions: [14.x]
```

Job은 Workflow를 구성하고 있는 여러 Step들의 묶음입니다. 이번 설정에서는 Pull Request가 merge 될 경우에만 동작하도록 했습니다. ubuntu-latest 버전의 가상환경이 실행되고 node version은 14로 설정했습니다.

### Step

```yml
steps:
  - name: Checkout source code.
	uses: actions/checkout@v2

  - name: Install Dependencies
	run: yarn

  - name: Build
	run: yarn build:dev

  - name: Configure AWS Credentials
	uses: aws-actions/configure-aws-credentials@v1
	with:
	  aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
	  aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
	  aws-region: ${{ secrets.AWS_REGION }}

  - name: Deploy to S3
	run: aws s3 sync ./dist s3://${{ secrets.DEV_AWS_S3_BUCKET }} --delete

  - name: Invalidate CloudFront Cache
	run: aws cloudfront create-invalidation --distribution-id ${{secrets.DEV_AWS_DISTRIBUTION_ID}} --paths "/*"
```

Step은 구체적으로 실행되는 항목들입니다.

순차적으로 살펴보면 Github 해당 레포에서 source를 checkout 하여 가져오고, yarn으로 dependency를 설치하고 build합니다. yarn build:dev는 package.json에 설정한 build를 위한 script입니다. 그리고 Github secrets으로 설정한 값들을 활용하여 AWS Credential을 확인합니다.

정상적으로 butid가 되었다면 S3에 파일을 배포합니다. React 번들링 시 파일명에 hash 값이 추가되도록 설정해 두었기 때문에 단순히 S3에 파일을 copy하는 것이 아니라 sync 하도록 설정했습니다. sync 시 `--delete` 옵션을 추가해야만 신규 번들링에 생성되지 않은 파일이 S3에서 삭제됩니다.

마지막으로 CloudFront에서 캐시를 갱신하기 위해 invalidation을 실행합니다.

AWS IAM에 S3, CloudFront permission을 추가해야만 마지막 2개의 step을 실행할 수 있습니다.

## 마치며

이 글에서는 배포 자동화를 위해 기본적인 항목들을 설정했습니다. 여기서 설명하지 못한, 그리고 제가 잘 모르는 설정이 많이 있을 수 있습니다. 설명이 잘못되었거나, 꼭 체크해야할 중요한 설정이 있다면 덧글을 남겨주세요.

읽어주셔서 감사합니다!
