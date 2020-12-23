---
title: "S3 bucket 권한 설정"
date: 2020-12-23 21:12:68
category: development
---

## why?

- 특정 S3 bucket에 특정 그룹의 유저만 접속해야 한다.
- 해당 그룹은 데이터 조회, 업로드, 삭제 권한이 필요하다.
- 해당 그룹은 해당 bucket 이외의 bucket을 조회하지 못한다.

## how?

둘 중 하나를 선택하거나 둘을 조합하여 사용한다.

- 1 S3의 특정 bucket에 bucket policy를 설정한다.
- 2 IAM의 policy를 생성하여 해당 그룹에 적용한다.

## question

- S3 bucket policy가 무엇인가요?
- IAM은 무엇의 약자인가요?
- IAM의 policy의 주요 key는 무엇이 있나요?
- S3의 특정 bucket에 특정 그룹만 권한을 주려면 어떻게 해야 할까요?

## detail

S3의 특정 bucket에 허가된 유저들만 접속하여 데이터 업로드, 삭제를 가능하게 할 필요가 생겼다.

당연히 가능할 것이라고 생각했지만 방법을 잘 몰라서 검색 후 적용했다.

방식은 2가지가 있었는데 특정 그룹을 생성하여 유저들을 해당 그룹에 포함시키고, 해당 그룹에 bucket에 대한 권한을 부여했다.

권한을 부여하기 위해서 IAM policy를 생성했다.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowListBucket",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::[BUCKET_NAME]"
        },
        {
            "Sid": "AllowObjectAccess",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::[BUCKET_NAME]/[FOLDER]/*"
        }
    ]
}
```

IAM policy는 크게 Version, Statement로 구성된다. Statement는 Sid, Effect, Action, Resource, Principal로 구성된다.(각 항목은 하단에서 다시 설명한다.)

위와 같이 설정하면 console로 AWS에 접속하여 S3의 bucket 목록조차 확인할 수 없게 된다.

그래서 브라우저에 해당 bucket의 주소를 입력하여 접속해야 한다.

```js
https://s3.console.aws.amazon.com/s3/bucket/[BUCKET_NAME]
```

해당 bucket에 접속하면 하위 폴더들을 확인할 수 있다.

특정 폴더에 `s3:PutObject`, `s3:GetObject`, `s3:DeleteObjec` 권한을 부여면 파일을 업로드, 삭제까지 가능하다.

단, Bucket Versioning을 enable 해 두었다면 파일을 삭제할 때 오류가 발생한다. 하지만 파일을 정상적으로 삭제된다.

## Policy 용어 설명

Version

- IAM policy json 문서 양식 버전
- `2020-10-17`을 디폴트 처럼 사용한다.

Statement

- 상세 규칙을 기술한다.

Sid

- unique id

Effect

- `Allow`, `Deny`

Action

- `서비스:작업`
- ex: `s3:PutObject`

Resource

- 해당 Statement에서 관리하는 객체
- ARN을 사용하여 지정한다.

Principal

- 보안 주체
- IAM의 identity-based policy에서는 사용하지 않는다.

## answer

- S3 bucket policy는 왜 사용하나요?
  - S3 리소스에 권한을 부여하기 위해 사용. JSON-baesd access policy language를 사용한다.
- IAM은 무엇의 약자인가요?
  - Identity and Access Management
- IAM의 policy의 주요 key는 무엇이 있나요?
  - 크게 Version, Statement로 구성된다.
  - Statement는 Sid, Effect, Action, Resource, Principal로 구성된다.
- S3의 특정 bucket에 특정 그룹만 권한을 주려면 어떻게 해야 할까요?
  - S3의 특정 bucket에 bucket policy를 설정한다.
  - IAM의 policy를 생성하여 해당 그룹에 적용한다.

## 참고자료

https://musma.github.io/2019/11/05/about-aws-iam-policy.html
