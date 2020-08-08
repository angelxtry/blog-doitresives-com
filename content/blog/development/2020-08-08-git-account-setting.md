---
title: "Github에 ssh key 등록 및 폴더별로 계정 분리"
date: 2020-08-08 17:08:69
category: development
---

Github을 사용할 때 개인 계정과 회사 계정을 자동으로 분리해서 사용하기 위해 설정을 추가했다.

## ssh key 생성 및 등록

ssh키를 생성한다.

```js
cd ~/.ssh
ssh-keygen -t rsa -C [comment] -f [filename]
```

`filename, filename.pub` 파일 2개가 생성된다. 이 중  public key인 `filename.pub` 파일의 내용을 Github에 등록한다.

여기까지 진행하고 등록이 잘 되었는지 테스트를 해보자.

```js
ssh git@github.com
```

key를 만들 때 filename을 입력했다면 다음과 같은 에러 메세지를 만나게 된다.

```js
git@github.com: Permission denied (publickey).
```

이 문제를 해결하기 위해 `~/.ssh/config` 파일을 생성하여 다음과 같이 작성한다.

```js
host github.com
 HostName github.com
 IdentityFile ~/.ssh/[filename]
 User git
```

위와 같이 config 파일을 작성한 후 다시 테스트 해보면 다음과 같은 성공 메세지를 확인할 수 있다.

```cmd
Hi [username]! You've successfully authenticated, but GitHub does not provide shell access.
Connection to github.com closed.
```

동일한 방식으로 회사용으로 사용할 key를 하나 더 만든다. key는 파일명을 다르게 해서 구분한다.

## 이메일 주소 분리

commit 할 때 사용하는 이메일 주소를 전역으로 설정하면 `~/.gitconfig`에 다음과 같이 기록된다.

```js
[user]
  email = email@address
  name = nickname
```

회사 reop에 commit 할 때 회사 email로 자동으로 설정하기 위해 다음과 같이 설정한다.

```js
[user]
  email = email@adress
  name = nickname
[includeIf "gitdir:~/corp-repo-dir"]
  path = .gitconfig-corp
```

`includeIf` 기능을 이용하여 회사 폴더에서 git을 사용할 때는 `.gitconfig-corp` 파일을 사용하도록 설정했다.

`.gitconfig-corp` 파일은 다음과 같이 작성했다.

```js
[user]
  email = corp-email@address
  name = corp-nickname
```

이제 회사 폴더에서 commit을 하면 회사 email로 자동 설정된다.

## 참고자료

- [Git 계정 여러 개 동시 사용하기 - Outsider's Dev Story](https://blog.outsider.ne.kr/1448)
- [Github RSA host key 에러 :: 마이구미 - 마이구미의 HelloWorld](https://mygumi.tistory.com/75) 
