---
title: 2020-01-02  AWS 서버 교체
date: 2020-01-02 20:01:00
category: development
---

이전 프로젝트 했던 서버를 유지하고 있다. 내가 만들고 싶었던 프로그램이 돌아가고 있고, 지금도 그 프로그램을 유용하게 사용하고 있다.

혹시 요금이 과하게 나오지 않을까 걱정이 되어서 아침 저녁으로 Bill을 확인하고 있었는데 언젠가부터 조금씩 비용이 발생하기 시작했다. 계속 사용 중이고, 유지보수도 계속 할 생각이어서 어느 정도의 비용은 감수하려고 했다. 하지만 월 30\$가 넘어가니 과하다는 생각이 들었다.

이런 저런 방법을 생각해보다가 임시방편으로 계정을 하나 더 만들고 신규 계정으로 이관하는 것으로 결정했다. 비용을 줄이려면 EC2를 줄이는 방법이 최선인데 당장 작업을 하기에는 시간이 부족하다고 판단해서 이관을 1차 목표로 잡았다.

옮기려고 하는 서버의 설정 정보는 다음과 같다.

## 설정 정보

Security Group

- inbound: 22, 80, 443, 3000

Load Balancer

- Port Configuration
  - 80 (HTTP) forwarding to 3000 (HTTP)
  - 443 (HTTPS, ACM Certificate) forwarding to 3000 (HTTP)

Health check

- HTTP:3000/index

## 작업 과정

1 새로운 EC2 생성

2 Elastic IP 적용

3 Security Group 생성 & 적용

4 서버 접속 후 서버 설정

```cmd
sudo apt-get update

sudo apt-get install -y build-essential

curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash --

sudo apt-get install -y nodejs

git clone

npm i --production

npm i -g sequelize-cli (only server)

npm i -g pm2

secret file copy

npm start
```

5 인증서 생성

- Load Balancer를 사용하려면 us-east-1에 인증서를 만들어야 한다.
- 인증서는 무료이니 일단 만든다.
- abc.com, \*.abc.com 생성
- CNAME을 기존 계정의 Route53에 등록
- 기다리면 Pending -> Issued로 변경됨

6 Load Balancer 생성

- Classic Load Balancer 선택
  - 방금 생성한 인증서 추가
  - health check 설정
  - 신규 서버 health check 확인

7 기존 계정 Route53에 신규 서버 등록

- Alias Target에 신규 계정 Load Balancer의 DNS name 등록
- 일정 시간 대기 후 접속 확인 -> 성공!

8 기존 계정의 자원 정리

- EC2 stop
- Elastic IP 삭제
- Load Balancer 삭제

## 간단 회고

막상 해보니 그리 어렵지 않은 작업이었다. Route53에 다른 계정의 자원이 잘 등록될까 궁금했는데 매끄럽게 잘 진행됐다.

이관 후 Security Group에서 불필요해 보이는 port를 삭제했다.

앞으로 예상되는 난관은 DB서버인데... 계획을 잘 세우고 진행해야 겠다 ㅋㅋ
