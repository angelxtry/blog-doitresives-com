---
title: "ssh agent forwarding"
date: 2021-03-22 00:03:74
category: development
---

## 개요

- AWS에 VPC를 설정했다면 AWS의 주요 리소스는 public dns가 없기 때문에 개발자 장비에서 바로 접속할 수 없습니다.
- 보통 bastion 서버를 생성하여, bastion을 통해 접속합니다.
- bastion에 bastion을 통해 접속할 서버의 pem key를 저장하지 않고, 개발자 장비에만 두기 위해 ssh agent forwarding이라는 방식을 사용합니다.
- 이후 모든 내용은 MAC 기준으로 작성되었습니다.

## 처리방법

- bastion, bastion을 통해 접속할 서버의 pem key를 모두 local에 저장합니다.
	- 보통 ~/.ssh/perms 경로에 저장합니다.
- bastion에 대한 정보를 ~/.ssh/config에 입력합니다.
	- 입력 시 `ForwardAgent yes`를 추가합니다.

	```js
	## bastion
	Host bastion
	  HostName xxx
	  ForwardAgent yes
	  User xxx
	  ...
	```

- `ssh-add -l` 명령어로 bastion을 통해 접속할 서버의 pem key가 등록되어 있는지 확인합니다.
- bastion을 통해 접속할 서버의 pem key가 등록되어 있지 않다면 다음의 명령어로 추가합니다.

	```js
	ssh-add -K ~/.ssh/perms/perm_key_name
	```

- 이제 bastion에 ssh로 접속한 후 private dns로 bastion을 통해 접속할 서버에 접속할 수 있습니다.
