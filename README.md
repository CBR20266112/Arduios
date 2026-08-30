# Adios

아두이노 교육용 시뮬레이터 프로젝트입니다. 웹앱 형태로 동작하며, 필요 시 Capacitor 기반 Android/iOS 앱으로 확장할 수 있습니다.

## 브랜치 운영 원칙

- main: 실행 가능한 안정 버전 기준
- dev: 기능 개발, 실험, 백업용 작업 브랜치

이 저장소는 GitHub 업로드용 정리본으로 운영하며, 기능 개발은 그대로 유지하되 저장소 관리와 백업 구조를 단순하게 유지합니다.

## GitHub 업로드 시 제외 항목

다음 항목은 커밋 대상에서 제외합니다.

- node_modules/
- www/ 등 빌드 산출물
- android/, ios/ 등 플랫폼 빌드 결과물
- .env, 로컬 환경 파일, 로그, 스크린샷 등 개인 환경 산출물
- 대용량 임시 파일 및 캐시

## 로컬 개발 기본 절차

1. 저장소를 클론합니다.
2. main 또는 dev 브랜치로 이동합니다.
3. 의존성을 설치합니다: npm install
4. 로컬 실행: npm run dev
5. 안정화가 필요한 경우 dev에서 작업 후 main으로 병합합니다.

## 안티그래비티로 이어가는 기준

이 프로젝트는 안티그래비티(또는 다른 개발 환경)에서 이어서 개발할 때도 구조를 단순하게 유지합니다.

- 소스 파일은 루트에 직접 유지
- 빌드 산출물은 Git 추적에서 제외
- 브랜치 전환은 main / dev 중심으로 유지
- 기능 개발 중이더라도 저장소 정리와 백업 작업은 별도로 수행

## 커밋 기준

커밋은 기능 단위가 아니라 의미 있는 정리 단위로 작성합니다.

- chore: add gitignore and branch notes
- docs: update README for branch workflow
- chore: prepare repository for stable main branch
