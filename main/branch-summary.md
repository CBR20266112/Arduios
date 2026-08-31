# Main Branch Summary

## 현재 기준

- main: 안정 실행 기준
- dev: 개발 및 백업용

## 사용 규칙

- main은 항상 실행 가능한 상태를 유지
- 기능 개발은 dev에서 진행
- 안정화된 내용만 main에 반영
- GitHub 업로드 전에는 불필요한 파일을 제외

## 제외 항목

- node_modules/
- build outputs
- local environment files
- IDE config
- temporary and large generated files

## 메모

이 문서는 main 브랜치에서 저장소를 빠르게 확인할 때 쓰는 간단한 안내용 문서입니다.
