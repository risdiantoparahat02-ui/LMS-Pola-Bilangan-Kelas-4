# LMS Pola Bilangan — Versi PWA (bisa dipasang & luring)

Paket ini membuat aplikasi "Pola Bilangan" bisa **dipasang (install)** di HP/laptop
dan dipakai **luring/offline** setelah sekali dibuka saat ada internet.

## Isi paket
| File | Fungsi |
|------|--------|
| `index.html` | Aplikasi utama (semua materi & fitur di dalamnya) |
| `manifest.json` | Identitas aplikasi (nama, ikon, warna) agar bisa di-*install* |
| `sw.js` | *Service worker* — menyimpan aplikasi agar jalan tanpa internet |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Ikon aplikasi |

## Cara memasang di GitHub Pages
1. Unggah **semua file di atas** ke repository (letakkan di satu folder yang sama / root).
2. Aktifkan **GitHub Pages** (branch `main`, folder `/root`).
3. Buka alamat halamannya di HP saat ada internet, lalu pilih
   **Pasang aplikasi / Add to Home screen** dari menu browser (Chrome).

> PWA wajib dibuka lewat **https** (GitHub Pages sudah https). Membuka berkas
> langsung (file://) tidak akan mengaktifkan mode install/offline.

## Cara kerja luring
- Buka aplikasi **sekali saat ada internet** → aplikasi otomatis tersimpan.
- Setelah itu bisa dibuka **tanpa sinyal** (materi, aktivitas, asesmen, refleksi,
  dan games Membuat Pola).
- Yang tetap butuh internet: **video**, **unduh materi dari Google Drive**, dan
  **kirim hasil belajar online** ke guru.

_Catatan: jika mengubah `index.html`, naikkan nomor `CACHE` di `sw.js`
(mis. `...-v1` → `...-v2`) agar perangkat yang sudah memasang mendapat versi terbaru._
