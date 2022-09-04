---
title: 2022-09-04 Yarn Berry를 사용하자.
date: 2022-09-04 22:09:60
category: development
---


부제: npm은 이제 그만 보내주자.

요즘 Yarn Berry와 Yarn Workspace를 이용한 Monorepo가 유명한 듯 하여 찍먹을 해보았습니다. Yarn Berry를 사용해보니 내 컴에서는 잘 되는데 왜 다른 곳에서는 안되지? 했던 일들의 원인을 알게된 것 같네요. 앞으로는 Yarn Berry를 꼭 사용할 생각입니다.

- 주의
    - Yarn Berry에 대한 찍먹 수준의 글입니다.
    - Yarn Berry에 대한 심도있는 내용을 포함하고 있지 않습니다.
    - pnpm에 대한 설명은 없습니다.

## 간단한 소개

Node.js 를 위한 패키지 관리 시스템은 크게 npm, Yarn, pnpm이 있습니다. 그 중 오늘 얘기할 것은 Yarn Berry입니다.

Yarn Berry 는 Yarn의 최신 버전으로 Yarn Berry가 나오면서 Yarn 1 버전은 Yarn Classic으로 불리고 있습니다. Yarn Classic은 maintenance mode라고 하더군요. End of Life가 확정되지는 않은 것 같습니다.

출처: https://classic.yarnpkg.com/en/docs/install#mac-stable

처음 찾아볼 때 Yarn2? Yarn3? 등이 혼란스러웠는데 Yarn2, 3 모두 Yarn Berry를 의미합니다. Yarn Berry는 release 버전이 2.0.0 부터 시작해서 현재 v3.2.2 입니다.

참고로 Yarn은 Yet Another Resource Negotiator의 약자입니다.  `또 다른 자원 협상가?` `리소스 네고시에이터?` 같은 느낌이군요.

## npm, Yarn classic의 문제점

몇 가지 유명한 문제점들이 있지만 한 가지만 짚어볼까요?

### 유령 의존성(Phantom Dependency)

내 PC에서는 잘 동작하는데 다른 사람 PC에서는 특정 패키지가 없다고 오류가 발생하는 상황을 겪어보신 적이 있으신가요? 저는 최근에도 한번 경험을 했습니다.

npm, Yarn classic에서는 중복 설치되는 패키지를 효과적으로 관리하기 위해 hoisting 기법을 사용합니다.

![yarn-berry-0](https://drive.google.com/uc?export=view&id=11DRIPC_21MsDjiesnC2dw4HAaOTMG6C2)

출처: [toss tech - node_modules로부터 우리를 구원해 줄 Yarn Berry](https://toss.tech/article/node-modules-and-yarn-berry)

왼쪽 의존성 트리를 살펴봅시다.

A 패키지를 설치했습니다. A 패키지는 B 패키지에 대한 의존성이 있어 항상 함께 설치가 됩니다. 우리는 코드에서 A 패키지를 import 하여 사용할 수 있고, B 패키지를 직접 import 하여 사용할 수는 없습니다.

C 패키지를 설치했을 때 A 패키지에 의존성이 있다면 A, B는 중복으로 설치됩니다. 그래서 npm이나 Yarn classic은 의존성 트리를 오른쪽 처럼 관리합니다. 이때 직접 설치하지 않았던 B 패키지가 hoisting 되어 코드에서 직접 import 하여 사용할 수 있게 됩니다. B 패키지는 package.json에 명시되지 않았음에도요.

이런 상황이 반복되다보면 불필요한 패키지를 제거할 때 현재 사용 중인 패키지가 함께 삭제되는 일이 발생합니다. 결국 내 컴에서는 잘 동작하는데 다른 환경에서는 동작하지 않는 증상이 발생합니다. 해당 프로젝트를 git에서 clone받아 다시 설치하면 내 PC에서도 동작하지 않을 수 있습니다.

이런 현상을 유령 의존성이라고 합니다.

## Yarn Berry는 이런 문제를 어떻게 해결했을까

Yarn Berry는 Plug'n'Play 라는 방식을 도입하여 이 문제를 해결합니다. Yarn Berry는 패키지를 설치하면 .yarn/cache 폴더에 zip 파일로 패키지가 저장되고 .pnp.cjs 파일에 의존성을 찾을 수 있는 정보가 기록됩니다.

.pnp.cjs 파일 하나로 관리하기 때문에 좀 더 빠르고 효율적입니다.

Plug'n'Play 방식에서 패키지는 Zip 파일로 관리합니다. node_modules 처럼 폴더 방식으로 저장할 필요가 없기 때문에 빠르게 설치되고 패키지의 특정 버전은 단 하나만 zip 파일이 존재하기 때문에 중복 설치의 우려도 없어집니다. 실제로 어느 정도 규모가 있는 프로젝트의 전체 용량을 확인하면 Yarn Berry의 용량이 더 적은 것을 확인할 수 있습니다.

## 또 하나의 장점 zero install

node_modules로 관리되는 프로젝트보다 용량과 파일 갯수가 적기 때문에 의존성 자체를 Git으로 관리할 수 있습니다. 즉, git clone을 한 이후에 yarn install 같은 과정없이 해당 프로젝트를 바로 실행할 수 있습니다.

## 한번 사용해봅시다

Yarn Berry에 대해 아는 것이 없었을 때 가장 걱정인 점은 Yarn Berry가 전역으로 설치되어서 다른 프로젝트에도 영향을 주면 어쩌지? 가 걱정이었습니다. 막상 사용해보니 이런 고민은 전혀 하지 않아도 되더라고요. 정확히 원하는 프로젝트에만 적용할 수 있습니다.

두 번째 걱정은 해당 프로젝트에 큰 영향을 미치게 된다면 repo를 다시 만드는 게 낫지 않을까? 하는 걱정이었습니다. 이것도 기우였는데 Yarn Classic 에서 Yarn Berry로 전환이 정말 매끄러웠습니다.

기존에 Yarn Classic으로 만들어져있는 프로젝트가 있다고 가정하고 Yarn Berry를 적용해보겠습니다. 새로 만들거나, npm을 사용하고 있어도 거의 비슷한 과정으로 진행하면 됩니다.

Yarn Classic 적용 repo: https://github.com/angelxtry/yarn-classic-sample

해당 repo에 Yarn Berry를 적용해봅시다.

```bash
git clone https://github.com/angelxtry/yarn-classic-sample.git yarn-berry-sample
```

Yarn Berry 설정을 합니다.

```bash
yarn set version berry
```

설정 후 확인해보면 .yarn 폴더, .yarnrc.yml 파일이 추가되고, package.json 파일에 "packageManager": "yarn@3.2.3" 가 추가된 것을 확인할 수 있습니다.

이것만으로도 Yarn Berry를 사용할 수 있는 기본 환경이 설정되었습니다.

패키지를 설치합니다.

```
yarn
```

yarn dev 명령으로 해당 프로젝트를 실행해보면 정상적으로 동작합니다.

설치된 패키지는 .yarn/cache 폴더에서 확인할 수 있습니다.

![yarn-berry-1](https://drive.google.com/uc?export=view&id=1cUcmtZjpLtkVqU-8qtEx64I0UFlARcqX)

그리고 .pnp.cjs 파일에 의존성을 찾을 수 있는 정보가 기록됩니다.


![yarn-berry-2](https://drive.google.com/uc?export=view&id=1KEgeZaYTgKZPvFYrKcLyJYRjtXeRuZCE)


### Berry vs. Classic 용량 비교

Berry

```bash
> du -sh
 89M	.
```

Classic

```bash
> du -sh
264M	.
```

매우 간단한 프로젝트라서 Classic의 용량도 작은 편이지만 Berry와 비교하면 3배 이상 차이가 납니다.

### Zero install 적용과 배포

다음과 같이 gitignore 설정을 하면 Zero Install을 적용할 수 있다.

```null
...
  
/node_modules  
...

.yarn/*  
!.yarn/cache  
!.yarn/patches  
!.yarn/plugins  
!.yarn/releases  
!.yarn/sdks  
!.yarn/versions  
!.yarn/unplugged
```

Yarn Berry 적용 repo: https://github.com/angelxtry/yarn-berry-sample

해당 repo에서 clone 받은 후 yarn install 과정없이 yarn dev를 실행해도 정상동작 합니다만 배포나 다른 기종의 PC에서 동작에 문제가 있을 수 있습니다.

.yarnrc.yml 파일에 다음의 내용을 추가합니다.

```
supportedArchitectures:  
  os:  
    - "current"  
    - "darwin"  
    - "linux"  
  cpu:  
    - "current"  
    - "x64"  
    - "arm64"
```

그리고 다시 한번 yarn install을 진행하면 다음의 항목들이 추가 설치 됩니다.

```bash
> git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   .yarnrc.yml

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.yarn/cache/esbuild-darwin-64-npm-0.14.54-602c9b8d1f-8.zip
	.yarn/cache/esbuild-linux-64-npm-0.14.54-2cb8070ade-8.zip
	.yarn/cache/esbuild-linux-arm64-npm-0.14.54-494e5f1b94-8.zip
	.yarn/unplugged/esbuild-darwin-64-npm-0.14.54-602c9b8d1f/
	.yarn/unplugged/esbuild-linux-64-npm-0.14.54-2cb8070ade/
	.yarn/unplugged/esbuild-linux-arm64-npm-0.14.54-494e5f1b94/

no changes added to commit (use "git add" and/or "git commit -a")
```

이제 자동 배포나 기종이 다른 PC에서도 Zero Install이 적용됩니다.
