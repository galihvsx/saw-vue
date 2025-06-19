# SAW Solver

## Sistem Pendukung Keputusan - Metode Simple Additive Weighting (SAW)

### Informasi Mahasiswa
- **Nama:** Galih Putro Aji
- **NPM:** 1101221174

## Deskripsi Proyek

Aplikasi ini merupakan implementasi dari metode Simple Additive Weighting (SAW) untuk membantu pengambilan keputusan. SAW merupakan salah satu metode dalam Sistem Pendukung Keputusan (SPK) yang menggunakan penjumlahan terbobot dari rating kinerja pada setiap alternatif di semua kriteria.

## Fitur Utama

- Penambahan dan pengelolaan kriteria beserta bobot
- Penambahan dan pengelolaan alternatif
- Input nilai alternatif untuk setiap kriteria
- Perhitungan otomatis menggunakan metode SAW
- Menampilkan hasil perangkingan alternatif

## Teknologi yang Digunakan

- Vue.js 3 dengan Composition API
- Pinia untuk state management
- Tailwind CSS dan DaisyUI untuk UI components
- Vite sebagai build tool

## Cara Menjalankan Aplikasi

1. Clone repository ini
2. Install dependensi yang diperlukan:
   ```
   yarn install
   ```
3. Jalankan aplikasi dalam mode development:
   ```
   yarn dev
   ```
4. Buka browser dan akses `http://localhost:5173`

## Cara Penggunaan

1. Tambahkan kriteria dengan nama, bobot, dan tipe (benefit/cost)
   - Benefit: semakin besar nilai semakin baik
   - Cost: semakin kecil nilai semakin baik
   - Total bobot kriteria secara ideal berjumlah 1
2. Tambahkan alternatif-alternatif yang akan dibandingkan
3. Isi nilai untuk setiap alternatif pada setiap kriteria
4. Klik tombol "Hitung Hasil" untuk melihat peringkat alternatif

## Contoh Data

Untuk contoh data dapat dilihat pada file Excel yang disertakan (saw_excel.xlsx).

## Penjelasan Video

Penjelasan lebih lanjut tentang aplikasi ini dapat dilihat pada video berikut:

[![Video Penjelasan SAW Decision Helper](https://img.youtube.com/vi/GKZv9mvYgoA/0.jpg)](https://youtu.be/GKZv9mvYgoA)

## Implementasi Metode SAW

Metode SAW yang diimplementasikan pada aplikasi ini meliputi langkah-langkah:

1. Normalisasi matriks keputusan
   - Untuk kriteria benefit: nilai dibagi dengan nilai maksimum pada kriteria tersebut
   - Untuk kriteria cost: nilai minimum pada kriteria tersebut dibagi dengan nilai
2. Penghitungan nilai preferensi untuk setiap alternatif
3. Perangkingan alternatif berdasarkan nilai preferensi

## Lisensi

Proyek ini dibuat untuk keperluan tugas kuliah Sistem Pendukung Keputusan.
