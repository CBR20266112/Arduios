# Dev Branch Notes

## 브랜치 운영 규칙

- main: 안정 실행 기준
- dev: 개발/백업용 브랜치
- 기능 개발은 dev에서 진행
- main은 항상 실행 가능한 상태를 유지

## 저장소 정리 기준

- GitHub에 올릴 파일만 관리
- node_modules/ 제외
- www/, build/, android/, ios/ 등의 빌드 산출물 제외
- .vscode/, 로컬 환경 파일, 로그, 스크린샷, 임시 파일 제외

## 작업 흐름

1. 기능 작업은 dev에서 진행
2. 안정화된 상태가 되면 main으로 병합
3. 큰 변경은 브랜치 단위로 관리
4. 되돌리기 쉬운 단위로 커밋

## 정리용 커밋 예시

- chore: add gitignore and branch notes
- docs: update README for branch workflow
- chore: prepare repository for stable main branch

## 안티그래비티로 이어가기

- 이 프로젝트는 웹앱 구조를 유지한 채 이어서 개발 가능
- 빌드 산출물은 Git 추적에서 제외
- 소스 파일은 루트 구조를 유지
- 로컬 실행/배포는 별도 환경에서 재생성

## 메모

이 문서는 GitHub 문서보다 빠르게 확인할 수 있게 개발 브랜치 안에 보관하는 용도입니다.
