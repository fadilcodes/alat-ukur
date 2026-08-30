# Project Blueprint: E-Learning Alat Ukur Gamifikasi (Game-like UI & Optimized)

## 1. Tech Stack & Performance Tuning
- **Frontend & Framework:** Next.js, Tailwind CSS.
- **UI/UX Style:** Minimalist Game UI (Clean Look). Warna utama: Putih, Hijau, dan Abu-abu muda. Layout terpusat dengan Sidebar navigasi di kiri.
- **Animasi & Interaksi 2D:** Framer Motion. 
  - *Optimization:* Gunakan `React.memo` pada komponen SVG untuk mencegah re-render berlebih saat state form berubah.
- **Rendering 3D (Baut.glb & Kampas-rem.glb):** React Three Fiber (R3F) & @react-three/drei.
  - *Optimization:* Canvas 3D harus berjalan secara asinkron atau menggunakan `<Suspense>`. Pastikan 3D mesh di-load secara efisien dan state 3D dipisah dari global state UI untuk mencegah *freezing*.
- **State Management:** Zustand.

## 2. Asset Technical Specs (2D SVG Layers)
- **Vernier Caliper:** `base` (statis), `slider` (geser horizontal), `batang` (mengikuti slider).
- **Micrometer:** `base` (statis), `spindel` (gerak horizontal), `thimble-all` (geser/putar). 
  - *Note:* Angka pada `thimble-all` di-generate via kode (React state) dan dioverlay secara absolut di atas SVG, update dinamis.

## 3. Struktur Layout (Berdasarkan Sketsa)
- **Home:** Header besar di tengah, tombol "Ayo Belajar" & "Quiz Poin", dan area Leaderboard di bawahnya.
- **Sidebar Navigasi (Kiri):** Memiliki menu "BELAJAR ALAT UKUR", "Modul Belajar", "Latihan Simulasi", dan "Latihan Soal". Menu yang aktif di-highlight dengan warna abu-abu.
- **Main Content (Kanan):** - *Modul Belajar:* Teks penjelasan di dalam kotak bersudut tumpul (rounded box), gambar referensi di atas teks, tombol "Next" di kanan bawah.
  - *Latihan Simulasi:* Kanvas besar di tengah layar. Alat ukur SVG (2D) mendominasi, dengan switch tombol (Caliper/Micrometer) di atasnya. Objek 3D (kampas rem/baut) berada di bawah alat ukur, dilengkapi tombol "Latihan Mengukur".

## 4. Mekanisme Halaman Simulasi (Hybrid 2D & 3D)
- **Mode Bebas:** User bisa menggeser rahang 2D (Framer Motion). Objek 3D tidak draggable.
- **Mode Latihan (Game Loop):** Klik tombol "Latihan Mengukur" -> Muncul instruksi task (misal: ukur kedalaman) -> Objek 3D menjadi draggable.
- **Validasi Posisi:** Drag objek 3D ke hitbox di SVG 2D. 
  - *Salah:* Auto-bounce (objek memantul balik) + Notif Merah. 
  - *Benar:* Objek nge-snap -> User jepit barang pake SVG 2D -> Input angka ukuran -> Notif "Berhasil!" -> Lanjut task.