---
layout: post
comments: true
title: '간단한 git flow'
date: 2019-10-21 11:59:59
category: TIL

tags:
  - git
  - merge
  - pull request
---

다른 사람들과 협업하기 위한 간단한 git flow를 적어본다.

중앙 원격 저장소(?)를 간단한게 github, github repo라고 부르겠다.

## 1-1 github repo 생성

github에서 repo를 하나 생성한다.

## 1-2 develop branch 생성

github repo 웹페이지의 좌측 중앙에 있는 "Branch: master" 버튼을 클릭하여 "develop"을 입력하고 엔터를 치면 `develop` branch가 생성된다.

Setting -> Branches로 들어가서 Default branch를 develop로 변경하고 Update 버튼을 클릭한다.

`Default branch changed to develop` 라는 메시지가 출력된다.

이 상태에서 github repo를 clone하면 develop branch 상태로 clone이된다.

```js
> git status
On branch develop
Your branch is up-to-date with 'origin/develop'.
nothing to commit, working tree clean
```

## 1-3 feature branch 생성

local develop branch에서 feature branch를 생성한다.

feature branch의 이름은 `feature/[branch-name]`과 같은 형식으로 생성한다.

```js
> git checkout -b feature/npm-setting
```

`git branch`라는 명령으로 상태를 확인해볼 수 있다.

```js
> git branch
  develop
* feature/npm-setting
```

코드를 작성/수정한다.

## 1-4 feature branch push

코드 수정이 완료되었다면 add/commit을 수행한다.

commit 후 feature branch를 githup repo에 push 한다.

```js
> git push origin feature/[branch-name]
```

이렇게 하면 github repo의 새로운 `feature/[branch-name]` branch가 생성된다.

## 1-5 pull request

push한 `feature/[branch-name]`를 github repo의 develop branch에 merge하기 위해 pull request를 진행한다.

보통 github repo 웹페이지에 접속하여 `Pull request` 버튼을 클릭하여 처리한다.

## 1-6 merge 완료 후

merge까지 잘 되었다면 local에서 develop branch로 이동한다.

```js
> git checkout develop
```

github repo의 merge된 데이터를 가져온다.

```js
> git pull
```

local의 feature branch를 삭제한다.

```js
> git branch -D feature/[branch-name]
```

github repo의 해당 feature branch도 삭제한다.

```js
> git push origin :feature/[branch-name]
```

- 참고

[[GitHub] GitHub로 협업하는 방법[3] - Gitflow Workflow](https://gmlwjd9405.github.io/2018/05/12/how-to-collaborate-on-GitHub-3.html)

[Git 리모트(remote) 브랜치 생성 및 삭제하기](https://trustyoo86.github.io/git/2017/11/28/git-remote-branch-create.html)
