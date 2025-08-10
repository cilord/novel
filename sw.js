// sw.js

self.addEventListener('install', event => {
    console.log('Service Worker terinstall');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker aktif');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    // Memeriksa jika permintaan berasal dari domain yang ingin kita bypass
    // if (event.request.url.startsWith('https://meionovels.com/')) {
        const clonedRequest = event.request.clone();
        console.log('test fetch');
        event.respondWith(
      fetch(clonedRequest)
        .then(response => {
          // Kloning respons karena objek respons tidak dapat diubah
          const clonedResponse = response.clone();
          
          // Buat objek header baru dari respons asli
          const headers = new Headers(clonedResponse.headers);
          
          // Tambahkan atau ubah header yang dibutuhkan untuk CORS
          headers.set('Access-Control-Allow-Origin', '*'); // Mengizinkan dari semua domain
          headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          // Buat respons baru dengan body dan header yang dimodifikasi
          return new Response(clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: headers
          });
        })
        .catch(error => {
          console.error('Fetch gagal:', error);
          return new Response('Proxy API tidak tersedia', { status: 503 });
        })
    );
    // }
});