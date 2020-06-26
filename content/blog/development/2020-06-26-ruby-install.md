---
title: "[Ruby] MAC에서 Ruby, Rails 설치"
date: 2020-06-26 14:06:53
category: development
---

참고 사이트 <https://tecadmin.net/install-ruby-on-debian/>

일부 항목은 이미 설치되어 있어 과정만 명시한다.

## 1.homebrew 설치

## 2. gpg 설치

`brew install gpg`

(gpg가 무엇인지 명확하게 이해하지 못했다. ruby가 목적이라 일단 넘어간다. 이런게 나중에 함정카드가 되던데...)

## 3. rvm 설치

<http://rvm.io/>

### GPG key 설치

### rvm 설치 확인

`\curl -sSL https://get.rvm.io | bash -s stable`

```cmd
$ rvm list

# No rvm rubies installed yet. Try 'rvm help install'.
```

## 4. rvm으로 ruby 설치

### 설치가능 버전 확인

`rvm list known`

### 2.7 버전 설치

`rvm install 2.7`

(무척 오래 걸린다.)

### default 설정

`rvm use 2.7 --default`

## 5. gem

(gem은 package 같은 느낌이다. gem을 관리하는 프로그램명도 gem인 듯하다.)

### 버전 확인

`gem -v`

### gem update

`gem update --system`

### bundler 설치

의존성 관리

`gem install bundler`

### Nokogiri 설치

(노코기리? 톱?)

HTML, XML 파싱

`gem install nokogiri`

### rails 설치

`gem install rails`

```cmd
$ rails -v
Rails 6.0.3.2
```

## 6. gemset

(local package, global package 같은 느낌?)

### gemset 목록 확인

`rvm gemset list`

## review

아직 용어가 많이 생소하지만 일단 진행해보자.
