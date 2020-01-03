---
title: 2019-12-30 Return to Github page
date: 2019-12-30 13:12:87
category: blog
---

AWS를 이용하여 블로그를 잠시 운영했다.

AWS의 여러 서비스를 사용해보고 싶었다. 그래서 Gatsby로 만들고 빌드해서 정적 파일을 S3에 올리고, CloudFront와 Route53을 이용하여 도메인 연결과 https 설정을 했다.

그런데 소소하게 비용이 발생하는 것을 보고 있으니 굳이 비용을 내면서 AWS를 고집할 가치가 있는지 의문이 들었다. 그래서 github으로 복귀하기로 결정.

먼저 CloudFront를 삭제했다. 정지하는데 약간 시간이 걸리더라.

그리고 Gatsby에 deploy script를 변경하여 빌드한 파일들을 S3에 올리던 것을 github에 올라가도록 수정했다.

```json
"scripts": {
  "deploy": "gatsby build && gh-pages -d public -b master -r 'git@github.com:angelxtry/angelxtry.github.io.git'",
}
```

실제로 deploy를 실행해보니 permission 문제가 발생했다. 생각해보니 지금까지 Github을 https 방식으로 인증을 하고 있었다. 예전에 왜 https 방식의 인증을 선택했는지는 잘 기억이 안난다. 아무든 이 기회에 ssh 방식으로 전환!

`.ssh` 경로에 있는 공개키를 Github에 등록하고, 로컬에서 remote repo를 지우고 ssh로 다시 등록했다.

```js
git remote remove origin
git remote add origin git@github.com:angelxtry/blog-doitresives-com.git
```

그리고 다시 배포하니 성공했다. `https://angelxtry.github.io/` 으로 접속하면 잘 된다.

이제 도메인을 연결해보자.

해당 repo -> Settings -> GitHub Pages에 보면 Custom domain을 넣을 수 있는 항목이 있다. 넣고 저장한다.

마지막으로 도메인을 구입한 곳으로 가서 Github에서 지정한 IP를 등록하면 된다.

현재는 [여기](https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)에서 확인할 수 있다.

https 설정은 Github의 도메인을 입력했던 항목 바로 아래 `Enforce HTTPS`라는 항목이 있다. 도메인을 입력한 직후에는 비활성화 되어 있는 것 같다. 최대 24시간이 걸릴 수 있다라고 써있었던 것 같은데 조금 있으니 활성화가 되었다. 당연히 체크. 체크하고 나면 https 접속이 바로 되는 듯 하다.

아무든 다시 Github page로 복귀했다.
