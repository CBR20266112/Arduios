/* ==========================================================================
   Service Worker (sw.js)
   아두이노 시뮬레이터 — 오프라인 캐싱 서비스워커
   ========================================================================== */

const CACHE_NAME = 'arduino-sim-v1';

// 오프라인에서도 동작해야 하는 핵심 파일 목록
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/i18n.js',
  '/js/store.js',
  '/js/components-data.js',
  '/js/workspace.js',
  '/js/app.js',
  '/js/tutorial.js',
  '/js/info-panel.js',
  '/js/projects.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

/* -----------------------------------------------------------------------
   설치 단계: 핵심 파일 사전 캐싱
   ----------------------------------------------------------------------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] 일부 파일 사전 캐싱 실패:', err);
      });
    })
  );
  // 즉시 활성화 (새 버전 대기 없이 바로 적용)
  self.skipWaiting();
});

/* -----------------------------------------------------------------------
   활성화 단계: 오래된 캐시 삭제
   ----------------------------------------------------------------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // 즉시 모든 클라이언트 제어 시작
  self.clients.claim();
});

/* -----------------------------------------------------------------------
   네트워크 요청 처리: 네트워크 우선, 실패 시 캐시 폴백
   ----------------------------------------------------------------------- */
self.addEventListener('fetch', (event) => {
  // POST 요청, 외부 URL은 캐시 처리 안 함
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // 네트워크 성공 시 캐시 갱신
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시 응답
        return caches.match(event.request).then((cached) => {
          return cached || new Response('오프라인 상태입니다. 인터넷을 확인해 주세요.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
          });
        });
      })
  );
});
