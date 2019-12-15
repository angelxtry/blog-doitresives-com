---
title: (HF) DB schema 설계
date: 2019-12-16 01:12:38
category: toy-project
---

새로운 프로젝트로 health friend를 시작했다.

회원가입을 후, 회원끼리 같이 운동을 할 수 있도록 매칭해주는 프로그램이다.

## 테이블

사용자 테이블(User)

회원 가입시 질문(JoinQuestion)

각 질문에 대한 응답(Motivation, ExerciseAbleDay, ExerciseAbleDistrict)

아직 사용자간의 관계를 어떻게 설정해야하는지는 고려하지 못했다.

## 고려사항

JoinQuestion 테이블에 언제든지 질문의 순서가 변경될 수 있도록 order 컬럼을 추가했다.

각 질문에 대한 응답은 multi select가 가능하도록 행이 추가될 수 있게 만들었다.

ExerciseAbleDay는 운동 가능한 요일을 의미하는데 월요일부터 일요일까지 7개가 고정되어 있으니 한 row에 모두 운동 가능한 요일을 모두 표현할 수 있도록 요일을 컬럼으로 만들었다.

모든 선택 값들은 회원가입 이후 매칭에 활용될 가능성이 있으므로 각 테이블에 raw data를 그대로 입력하지 않고 Code Define Table을 만들어서 정의했다.

Code는 체계를 만들지는 못하고 key, value 구조에 key는 고유한 값, value는 일련번호로만 정의했다.

## 이후 진행 계획

같이 프로젝트를 하는 동료들에게 테이블 내용을 설명하고 개선점을 같이 논의해보려고 한다.

이번 프로젝트는 TypeORM을 사용할 예정이다. TypeORM으로 테이블 정의하는 방법을 확인하고 정리해야 한다.

TypeORM을 이용하여 사용자(User 테이블) 간의 관계를 설정하는 방법도 확인해야 한다.
