// sw.js
// let targetUrl;

self.addEventListener('install', event => {
    console.log('Service Worker terinstall');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker aktif');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Tentukan URL Web B yang ingin Anda ambil datanya
  const targetUrl = 'https://meionovels.com/novel/mizu-zokusei-no-mahou-tsukai-ln/volume-2-chapter-2/';

  // Periksa apakah permintaan berasal dari halaman Anda dan ditujukan ke target URL
  // Jika Anda membuat permintaan fetch dari Web A ke '/proxy-api', Service Worker akan mencegatnya
  // dan mengubahnya menjadi permintaan ke Web B.
  if (event.request.url.includes('/fetch')) {

    // Buat URL baru yang sebenarnya menunjuk ke Web B
    const newUrl = event.request.url.replace(/.*/, targetUrl);
    const modifiedRequest = new Request(newUrl, {
      method: event.request.method,
      headers: event.request.headers,
      body: event.request.body,
      mode: 'cors', // Penting agar fetch dari service worker tidak diblokir
      credentials: 'omit' // Atau 'include' jika Anda perlu mengirim cookie
    });

    // Mencegat respons dari fetch ke Web B
    event.respondWith(
      fetch(modifiedRequest)
        .then(response => {
          // Kloning respons karena objek respons hanya bisa dibaca sekali
          const clonedResponse = response.clone();
          const headers = new Headers(clonedResponse.headers);

          // Hapus header CORS yang mungkin ada dari respons Web B agar tidak konflik
          headers.delete('Access-Control-Allow-Origin');
          headers.delete('Access-Control-Allow-Credentials');

          // Kembalikan respons baru ke browser di Web A
          return new Response(clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: headers
          });
        })
        .catch(error => {
          console.error('Proxy fetch gagal:', error);
          return new Response('Data tidak tersedia', { status: 503 });
        })
    );
  }
});
