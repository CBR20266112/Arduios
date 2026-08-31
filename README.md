# Adios

아두이노 교육용 시뮬레이터 정적 웹앱입니다.

## 브랜치

- main: 안정 실행 기준
- dev: 개발/백업용

## GitHub Pages URL

https://cbr20266112.github.io/Arduios/

> 저장소 소유자 이름은 `CBR20266112` 이며, 이 이름을 기준으로 Pages URL이 결정됩니다.

## 실행 방식

- GitHub 저장소의 main 브랜치 기준으로 배포
- 루트의 index.html이 진입점
- 별도 로컬 서버 없이 GitHub Pages에서 바로 실행 가능
- 정적 파일은 상대 경로로 연결됨

## 제외 항목

다음은 GitHub에 올리지 않습니다.

- node_modules/
- 빌드 산출물
- 로컬 환경 파일
- .vscode/
- 임시 파일 및 대용량 캐시

## 기본 유지 규칙

- main은 실행 가능한 안정 버전만 유지
- 기능 개발은 dev에서 진행
- 안정된 내용만 main으로 병합
- GitHub Pages는 main 기준으로 확인
