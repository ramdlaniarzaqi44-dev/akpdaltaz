import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, Users, BarChart, UserCircle, Save, Trash2, LogOut, CheckCircle, Lock, 
  User, GraduationCap, FileText, Sparkles, Layers, ClipboardList, CalendarDays, 
  Wand2, Pointer, AlertCircle, LayoutDashboard, Menu, Bell, Calendar, Printer, X, Download
} from 'lucide-react';

// --- INTEGRASI FIREBASE ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, setDoc, addDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2MEC0MDC648jsdnnVvZPxUEr3Q8wMA8U",
  authDomain: "akpdaltaz.firebaseapp.com",
  projectId: "akpdaltaz",
  storageBucket: "akpdaltaz.firebasestorage.app",
  messagingSenderId: "806388011819",
  appId: "1:806388011819:web:0fca84a5cda5fbd6cfeb6e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : "akpdaltaz";

// --- DATA & KONSTANTA ---
const BIDANG = { PRIBADI: "Pribadi", SOSIAL: "Sosial", BELAJAR: "Belajar", KARIR: "Karir" };

const AKPD_QUESTIONS = [
  { id: 1, bidang: BIDANG.PRIBADI, text: "Saya sering menunda atau melalaikan ibadah karena terlalu asyik bermain game atau scroll media sosial (doomscrolling)." },
  { id: 2, bidang: BIDANG.PRIBADI, text: "Saya sering merasa insecure (tidak percaya diri) dan overthinking saat melihat pencapaian orang lain di media sosial (FOMO)." },
  { id: 3, bidang: BIDANG.PRIBADI, text: "Saya mudah mengalami burnout (stres berat/kelelahan mental) meskipun hanya menghadapi masalah yang tergolong kecil." },
  { id: 4, bidang: BIDANG.PRIBADI, text: "Saya sering mendiagnosa sendiri (self-diagnosis) masalah psikologis saya berdasarkan konten di TikTok/Instagram tanpa ke ahlinya." },
  { id: 5, bidang: BIDANG.PRIBADI, text: "Saya terbiasa menggunakan kata-kata kasar atau toxic saat bermain game online maupun di media sosial." },
  { id: 6, bidang: BIDANG.PRIBADI, text: "Saya kesulitan menghentikan kebiasaan buruk yang merugikan kesehatan fisik (seperti begadang ekstrim, merokok, atau vaping)." },
  { id: 7, bidang: BIDANG.PRIBADI, text: "Saya merasa kesepian dan hampa di dunia nyata, meskipun saya memiliki banyak teman dan followers di dunia maya." },
  { id: 8, bidang: BIDANG.PRIBADI, text: "Saya kesulitan mengontrol keinginan berbelanja online atau menggunakan PayLater yang berujung pada kebiasaan boros." },
  { id: 9, bidang: BIDANG.PRIBADI, text: "Saya belum bisa menolak ajakan teman nongkrong walaupun saya tahu saya sedang memiliki tugas dan tanggung jawab lain." },
  { id: 10, bidang: BIDANG.PRIBADI, text: "Saya pernah atau sedang tergiur mencoba hal-hal berisiko di internet (seperti judi online/slot) karena ikut-ikutan tren." },
  { id: 11, bidang: BIDANG.PRIBADI, text: "Saya merasa kurang peduli dengan isu lingkungan (seperti membuang sampah sembarangan) karena lebih fokus pada hal-hal viral." },
  { id: 12, bidang: BIDANG.PRIBADI, text: "Saya sering mengambil keputusan secara impulsif (terburu-buru) saat sedang sangat emosi atau sedih." },
  { id: 13, bidang: BIDANG.PRIBADI, text: "Saya belum memiliki jadwal dan manajemen waktu yang baik antara waktu rebahan, bermain HP, dan beraktivitas produktif." },
  { id: 14, bidang: BIDANG.SOSIAL, text: "Saya lebih berani berpendapat, menyindir, atau marah lewat ketikan di medsos (keyboard warrior) daripada bicara tatap muka." },
  { id: 15, bidang: BIDANG.SOSIAL, text: "Saya pernah ikut-ikutan melakukan cyberbullying atau memboikot (cancel culture) seseorang di internet tanpa tahu fakta sebenarnya." },
  { id: 16, bidang: BIDANG.SOSIAL, text: "Saat berkumpul dengan teman atau keluarga, saya sering mengabaikan mereka karena terlalu sibuk dengan gadget saya (phubbing)." },
  { id: 17, bidang: BIDANG.SOSIAL, text: "Jika ada masalah dengan teman, saya lebih suka langsung memblokir akunnya atau memviralkannya daripada menyelesaikan baik-baik." },
  { id: 18, bidang: BIDANG.SOSIAL, text: "Saya mudah terpancing emosi dan ikut menyebarkan ujaran kebencian/SARA di kolom komentar media sosial." },
  { id: 19, bidang: BIDANG.SOSIAL, text: "Saya lebih suka mengerjakan proyek sekolah (P5) secara mandiri karena merasa teman sekelompok tidak bisa diandalkan (free rider)." },
  { id: 20, bidang: BIDANG.SOSIAL, text: "Saya merasa lebih nyaman dan terbuka menceritakan masalah pribadi ke teman online/akun alter (anonim) daripada ke keluarga." },
  { id: 21, bidang: BIDANG.SOSIAL, text: "Saya menganggap melanggar aturan sekolah (seperti membolos, datang terlambat, modifikasi seragam) sebagai hal yang biasa atau keren." },
  { id: 22, bidang: BIDANG.SOSIAL, text: "Saya kadang melupakan etika dasar kesopanan (mengucapkan permisi, tolong, maaf, terima kasih) saat berinteraksi dengan orang yang lebih tua." },
  { id: 23, bidang: BIDANG.SOSIAL, text: "Saya takut dijauhi oleh circle pertemanan saya jika saya tidak mengikuti tren atau gaya hidup mereka yang sebenarnya memberatkan saya." },
  { id: 24, bidang: BIDANG.SOSIAL, text: "Saya kadang menyebarkan foto aib, privasi, atau rahasia teman untuk dijadikan bahan candaan atau meme." },
  { id: 25, bidang: BIDANG.SOSIAL, text: "Saya sedang terjebak dalam hubungan pertemanan atau pacaran yang tidak sehat (toxic relationship) namun sulit melepaskannya." },
  { id: 26, bidang: BIDANG.BELAJAR, text: "Perhatian dan konsentrasi belajar saya sangat mudah teralihkan oleh notifikasi aplikasi chat atau media sosial." },
  { id: 27, bidang: BIDANG.BELAJAR, text: "Saya selalu menggunakan Sistem Kebut Semalam (SKS) untuk mengerjakan tugas karena terlalu banyak bersantai sebelumnya (Prokrastinasi)." },
  { id: 28, bidang: BIDANG.BELAJAR, text: "Saya lebih suka menonton video pendek (Shorts/Reels) dan merasa sangat malas/lelah jika harus membaca teks pelajaran yang panjang (krisis literasi)." },
  { id: 29, bidang: BIDANG.BELAJAR, text: "Saya sangat bergantung pada Artificial Intelligence (seperti ChatGPT/Brainly) untuk mengerjakan tugas tanpa berusaha memahaminya terlebih dahulu." },
  { id: 30, bidang: BIDANG.BELAJAR, text: "Saya sering mempercayai info atau materi edukasi dari influencer secara instan tanpa melakukan verifikasi ulang sumber kebenarannya." },
  { id: 31, bidang: BIDANG.BELAJAR, text: "Saya merasa kebingungan membagi waktu dan memprioritaskan antara tugas akademik, ekstrakurikuler, dan waktu bersantai." },
  { id: 32, bidang: BIDANG.BELAJAR, text: "Motivasi saya belajar terkadang hanya untuk konten (studygram) atau pamer nilai, bukan karena benar-benar ingin menguasai ilmunya." },
  { id: 33, bidang: BIDANG.BELAJAR, text: "Saya kurang memiliki inisiatif mencari materi tambahan secara mandiri jika guru tidak secara eksplisit menyuruh membacanya." },
  { id: 34, bidang: BIDANG.BELAJAR, text: "Saya merasa kesulitan mengaitkan materi pelajaran yang diajarkan di sekolah dengan kegunaannya di kehidupan masa kini." },
  { id: 35, bidang: BIDANG.BELAJAR, text: "Saya merasa kurang kreatif dan takut salah saat dituntut membuat proyek mandiri/kelompok (P5) yang inovatif." },
  { id: 36, bidang: BIDANG.BELAJAR, text: "Saya sering mengalami panik yang berlebihan (anxiety) ketika nilai saya turun sedikit atau merasa kalah saing dengan teman." },
  { id: 37, bidang: BIDANG.BELAJAR, text: "Saya merasa metode mengajar di kelas terlalu membosankan jika dibandingkan dengan visualisasi konten internet yang serba cepat." },
  { id: 38, bidang: BIDANG.BELAJAR, text: "Saya memiliki kecenderungan langsung menyerah atau menggunakan jasa 'joki tugas' saat menemui soal/proyek yang dirasa rumit." },
  { id: 39, bidang: BIDANG.BELAJAR, text: "Saya masih mentoleransi tindakan plagiarisme (copy-paste karya orang lain) asalkan tugas saya cepat selesai." },
  { id: 40, bidang: BIDANG.BELAJAR, text: "Saya kehilangan orientasi belajar karena merasa mata pelajaran yang dipelajari tidak sesuai dengan passion atau minat saya." },
  { id: 41, bidang: BIDANG.KARIR, text: "Saya bingung memilih mata pelajaran pilihan di Fase F (Kelas 11/12) karena takut salah langkah yang memengaruhi peluang masuk PTN." },
  { id: 42, bidang: BIDANG.KARIR, text: "Saya bercita-cita menjadi content creator, selebgram, atau pro-player esports, tapi tidak tahu bagaimana langkah realistis untuk mencapainya." },
  { id: 43, bidang: BIDANG.KARIR, text: "Passion dan minat karir saya berubah-ubah dengan sangat cepat mengikuti tren profesi yang sedang viral di media sosial." },
  { id: 44, bidang: BIDANG.KARIR, text: "Saya belum pernah mengeksplorasi secara serius bakat dan potensi terpendam saya selain dari apa yang terlihat keren di internet." },
  { id: 45, bidang: BIDANG.KARIR, text: "Saya kurang update atau kebingungan dengan sistem seleksi masuk Perguruan Tinggi Negeri terbaru (SNBP/SNBT) atau Perguruan Tinggi Kedinasan." },
  { id: 46, bidang: BIDANG.KARIR, text: "Saya menginginkan pekerjaan dengan gaji besar dan gaya hidup mewah sedari muda (hustle culture), namun sadar soft-skill saya masih kurang." },
  { id: 47, bidang: BIDANG.KARIR, text: "Saya sedang mengalami beda pendapat (konflik) dengan orang tua mengenai pilihan jurusan kuliah atau cita-cita saya." },
  { id: 48, bidang: BIDANG.KARIR, text: "Saya belum memiliki rencana cadangan (Plan B) jika saya gagal diterima di kampus impian atau jalur karir utama saya." },
  { id: 49, bidang: BIDANG.KARIR, text: "Saya merasa pesimis dan cemas memikirkan persaingan di dunia kerja nanti, karena melihat banyaknya lulusan yang kesulitan mendapat kerja." },
  { id: 50, bidang: BIDANG.KARIR, text: "Saya sulit membedakan peluang usaha riil dengan jebakan bisnis instan yang bertebaran di internet (seperti penipuan investasi atau trading palsu)." },
];

const AI_FORMULATION = {
  1: { rumusan: "Peningkatan kesadaran manajemen waktu ibadah vs penggunaan gawai.", topik: "Spiritualitas di Era Digital: Stop Doomscrolling", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  2: { rumusan: "Pengembangan konsep diri positif dan resiliensi terhadap fenomena FOMO.", topik: "Overcoming FOMO: Mencintai Diri di Dunia Maya", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  3: { rumusan: "Penguasaan teknik regulasi emosi dan manajemen stres (coping mechanism).", topik: "Self-Care: Strategi Sehat Mengatasi Burnout Pelajar", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  4: { rumusan: "Pemahaman literasi kesehatan mental dan bahaya self-diagnosis internet.", topik: "Mental Health Awareness: Fakta vs Self-Diagnosis", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  5: { rumusan: "Pengendalian perilaku verbal agresif (toxic) di dunia maya dan game.", topik: "Digital Etiquette: Komunikasi Positif di Internet", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  6: { rumusan: "Pemahaman pola hidup sehat dan pencegahan perilaku adiktif modern.", topik: "Gaya Hidup Sehat Gen Z: Bahaya Vaping & Begadang", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  7: { rumusan: "Keterampilan membangun hubungan interpersonal bermakna di dunia nyata.", topik: "Dari Virtual ke Realita: Mengatasi Kesepian Sosial", layanan: "Konseling Individu", rowId: "resp1" },
  8: { rumusan: "Literasi finansial dasar dan pengendalian perilaku konsumtif impulsif.", topik: "Cerdas Finansial Gen Z: Bahaya PayLater & Boros", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  9: { rumusan: "Peningkatan keterampilan asertif untuk menolak ajakan negatif/kurang produktif.", topik: "Berani Bilang 'TIDAK': Latihan Asertivitas Diri", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  10: { rumusan: "Pemahaman regulasi diri dan bahaya jebakan adiksi judi online/slot.", topik: "Jebakan Ilusi Kaya Instan: Bahaya Judi Online", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  11: { rumusan: "Peningkatan kepedulian dan kesadaran lingkungan sekitar.", topik: "Eco-Awareness: Menjadi Generasi Peduli Lingkungan", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  12: { rumusan: "Keterampilan pemecahan masalah dan pengambilan keputusan yang rasional.", topik: "Cerdas Emosi: Jangan Ambil Keputusan Saat Marah", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  13: { rumusan: "Penyusunan jadwal harian yang seimbang dan produktif.", topik: "Manajemen Waktu 24 Jam: Produktif Tanpa Rebahan", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  14: { rumusan: "Penguatan empati dan keterampilan komunikasi asertif di dunia maya.", topik: "Keyboard Warrior vs Digital Citizen yang Bijak", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  15: { rumusan: "Pemahaman bahaya cyberbullying, cancel culture, dan jejak digital.", topik: "Saring Sebelum Sharing: Bahaya Cancel Culture", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  16: { rumusan: "Membangun kesadaran interaksi tatap muka tanpa gangguan gawai (phubbing).", topik: "Stop Phubbing: Hadir Sepenuhnya untuk Orang Sekitar", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  17: { rumusan: "Keterampilan resolusi konflik yang sehat dan penyelesaian masalah teman.", topik: "Seni Menyelesaikan Masalah: Bukan Sekadar Blokir", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  18: { rumusan: "Penguatan toleransi dan penghindaran ujaran kebencian/SARA di medsos.", topik: "Toleransi di Ujung Jari: Stop Ujaran Kebencian", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  19: { rumusan: "Penguatan kemampuan kolaborasi dan gotong royong dalam kerja tim (Proyek P5).", topik: "Seni Berkolaborasi: Mengatasi Sindrom 'Free Rider'", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  20: { rumusan: "Keterampilan membangun komunikasi terbuka dengan keluarga/orang tua.", topik: "Menjembatani Komunikasi: Aku dan Orang Tuaku", layanan: "Konseling Individu", rowId: "resp1" },
  21: { rumusan: "Internalisasi nilai kedisiplinan dan kepatuhan terhadap norma sekolah.", topik: "Keren Itu Disiplin: Memahami Budaya Positif Sekolah", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  22: { rumusan: "Penerapan etika dan tata krama komunikasi lintas generasi.", topik: "Magic Words: Pentingnya Maaf, Tolong, dan Terima Kasih", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  23: { rumusan: "Peningkatan kemandirian identitas sosial dan resiliensi terhadap peer pressure.", topik: "Be Yourself: Menghadapi Tekanan Circle Pertemanan", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  24: { rumusan: "Pemahaman tentang privasi, etika pertemanan, dan batasan bercanda.", topik: "Etika Pertemanan: Batasan Candaan & Privasi", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  25: { rumusan: "Pemahaman ciri-ciri toxic relationship dan strategi melepaskan diri darinya.", topik: "Red Flags! Keluar dari Toxic Relationship", layanan: "Konseling Individu", rowId: "resp1" },
  26: { rumusan: "Keterampilan memfokuskan konsentrasi belajar tanpa distraksi digital.", topik: "Fokus Maksimal: Strategi Belajar Bebas Distraksi Medsos", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  27: { rumusan: "Strategi mengatasi prokrastinasi dan kebiasaan Sistem Kebut Semalam (SKS).", topik: "Selamat Tinggal Prokrastinasi & SKS", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  28: { rumusan: "Peningkatan daya tahan literasi bacaan dan daya nalar kritis.", topik: "Literasi Kuat, Masa Depan Hebat: Melawan Krisis Membaca", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  29: { rumusan: "Pemahaman integritas akademik dan pemanfaatan AI secara etis dan bijak.", topik: "AI untuk Belajar, Bukan untuk Curang (Academic Integrity)", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  30: { rumusan: "Keterampilan verifikasi informasi dan kemampuan berpikir kritis (Critical Thinking).", topik: "Kritis Menerima Info: Cara Membedakan Fakta dan Hoaks", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  31: { rumusan: "Kemampuan menyusun skala prioritas kegiatan akademik dan non-akademik.", topik: "Matriks Eisenhower: Cerdas Menentukan Prioritas", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  32: { rumusan: "Penemuan kembali motivasi belajar intrinsik bermakna (bukan sekadar pamer).", topik: "Find Your 'Why': Menumbuhkan Motivasi Belajar Sejati", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  33: { rumusan: "Peningkatan kemandirian belajar (self-regulated learning) tanpa paksaan.", topik: "Inisiatif Belajar: Menjadi Pelajar Mandiri", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  34: { rumusan: "Kemampuan mengkorelasikan materi pelajaran dengan tantangan kehidupan nyata.", topik: "Contextual Learning: Buat Apa Aku Belajar Ini?", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  35: { rumusan: "Peningkatan keberanian berpikir kreatif dan mencoba hal-hal inovatif.", topik: "Berani Beda: Menumbuhkan Kreativitas & Inovasi", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  36: { rumusan: "Pengelolaan ekspektasi akademik dan kecemasan menghadapi ujian sekolah.", topik: "Atasi Test Anxiety: Tenang Hadapi Ujian dan Nilai", layanan: "Konseling Individu", rowId: "resp1" },
  37: { rumusan: "Penyesuaian gaya belajar efektif di tengah metode mengajar yang konvensional.", topik: "Kenali Gaya Belajarmu: Visual, Auditori, atau Kinestetik?", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  38: { rumusan: "Membangun ketangguhan (grit) dan kemandirian menyelesaikan masalah akademik.", topik: "Daya Juang (Grit): Pantang Menyerah Menghadapi Soal Sulit", layanan: "Bimbingan Kelompok", rowId: "dasar3" },
  39: { rumusan: "Peningkatan kesadaran tentang hak cipta dan menghindari budaya plagiarisme.", topik: "Say No To Plagiarisme & Joki Tugas", layanan: "Bimbingan Klasikal", rowId: "dasar1" },
  40: { rumusan: "Kemampuan menyelaraskan kembali minat pribadi dengan kewajiban akademik.", topik: "Menghidupkan Kembali Passion Belajarmu", layanan: "Konseling Individu", rowId: "resp1" },
  41: { rumusan: "Pemahaman strategis dalam pemilihan Mata Pelajaran Pilihan Fase F Kurikulum Merdeka.", topik: "Strategi Jitu Memilih Mapel Pilihan Fase F Sesuai Karier", layanan: "Bimbingan Klasikal", rowId: "pem1" },
  42: { rumusan: "Eksplorasi wawasan karier modern (konten kreator/esports) secara realistis.", topik: "Realita Karier Modern: Siap Jadi Content Creator?", layanan: "Bimbingan Kelompok", rowId: "pem1" },
  43: { rumusan: "Pemantapan eksplorasi karier berdasarkan potensi diri, bukan sekadar tren viral.", topik: "Pilih Karier Berdasarkan Potensi, Bukan Hanya Tren", layanan: "Bimbingan Klasikal", rowId: "pem1" },
  44: { rumusan: "Pemahaman mendalam tentang bakat, minat, dan potensi terpendam individu.", topik: "Who Am I? Menggali Potensi, Bakat, dan Minat Diri", layanan: "Bimbingan Klasikal", rowId: "pem1" },
  45: { rumusan: "Literasi terbaru tentang jalur seleksi PTN (SNBP/SNBT) dan sekolah kedinasan.", topik: "Update Info Kampus: Strategi Lolos SNBP & SNBT", layanan: "Bimbingan Klasikal", rowId: "pem1" },
  46: { rumusan: "Pemahaman pentingnya keseimbangan hardskill & softskill untuk karier sukses.", topik: "Hustle Culture vs Kesiapan Softskill Masa Depan", layanan: "Bimbingan Kelompok", rowId: "pem1" },
  47: { rumusan: "Keterampilan advokasi diri dan negosiasi pilihan karier dengan orang tua.", topik: "Ketika Mimpiku Beda dengan Orang Tua", layanan: "Konseling Individu", rowId: "resp1" },
  48: { rumusan: "Kemampuan merancang perencanaan karier alternatif (Plan B).", topik: "Career Planning: Siapkan Plan B Jika Gagal!", layanan: "Bimbingan Kelompok", rowId: "pem1" },
  49: { rumusan: "Pembangunan optimisme dan kesiapan bersaing di dinamika dunia kerja industri 4.0.", topik: "Future Ready: Siap Bersaing di Dunia Kerja Global", layanan: "Bimbingan Klasikal", rowId: "pem1" },
  50: { rumusan: "Peningkatan kewaspadaan dan literasi kewirausahaan (menghindari bisnis bodong).", topik: "Cerdas Berwirausaha: Kenali Peluang vs Penipuan", layanan: "Bimbingan Klasikal", rowId: "pem1" },
};

// LIBRARY METODE PENGAJARAN (Dinamis untuk setiap RPL)
const TEACHING_METHODS = [
  {
    name: "Problem-Based Learning (PBL)",
    media: "Skenario Kasus (Print out), Kertas Plano, Spidol Marker",
    inti: [
      "Guru membagi kelas menjadi beberapa kelompok kecil (4-5 orang).",
      "Guru membagikan 'Kartu Kasus' yang berisi skenario masalah nyata yang relevan dengan topik hari ini.",
      "Tiap kelompok berdiskusi mendalam untuk mengidentifikasi akar masalah dan menyusun strategi pemecahan masalah (Problem Solving) di atas kertas plano.",
      "Perwakilan kelompok mempresentasikan hasil diskusi, dan kelompok lain memberikan tanggapan."
    ]
  },
  {
    name: "Gamifikasi Interaktif (Kahoot/Quizizz)",
    media: "Proyektor/LCD, Smartphone Siswa, Kuis Interaktif Online",
    inti: [
      "Guru mengarahkan siswa untuk menyiapkan gawai dan masuk ke tautan permainan kuis interaktif (Kahoot/Quizizz).",
      "Siswa berlomba menjawab pertanyaan-pertanyaan studi kasus terkait materi dengan cepat dan tepat.",
      "Setelah setiap pertanyaan, guru menjeda sejenak untuk meluruskan miskonsepsi (pembahasan singkat).",
      "Siswa dengan skor tertinggi (Top 3) diberikan apresiasi/reward untuk meningkatkan motivasi."
    ]
  },
  {
    name: "Jigsaw / Expert Group Discussion",
    media: "Bahan Bacaan/Artikel Terpilah, Sticky Notes, Papan Tulis",
    inti: [
      "Siswa dibagi menjadi kelompok asal. Tiap anggota kelompok asal diberi nomor urut 1, 2, 3, dst.",
      "Siswa dengan nomor yang sama berkumpul membentuk 'Kelompok Ahli' untuk membahas satu sub-topik spesifik.",
      "Setelah memahami materi di Kelompok Ahli, siswa kembali ke Kelompok Asal.",
      "Tiap ahli bergantian mengajarkan apa yang sudah dipelajarinya kepada anggota kelompok asalnya secara utuh."
    ]
  },
  {
    name: "Gallery Walk (Pameran Karya)",
    media: "Karton Manila, Spidol Warna-Warni, Lakban Kertas",
    inti: [
      "Tiap kelompok membuat Mind-Map atau Poster infografis terkait solusi dari topik bahasan.",
      "Hasil karya ditempelkan di dinding sekeliling kelas layaknya sebuah galeri pameran.",
      "Satu orang berjaga di pos (sebagai penjaga galeri), sementara anggota lain berkeliling mengunjungi pos lain untuk mendengar penjelasan.",
      "Pengunjung dapat meninggalkan komentar, saran, atau bintang (menggunakan sticky notes) di karya kelompok lain."
    ]
  },
  {
    name: "Roleplay / Sosiodrama Klasikal",
    media: "Naskah Skenario Singkat, Properti Sederhana",
    inti: [
      "Guru meminta beberapa siswa relawan untuk maju ke depan kelas memainkan peran (Roleplay) dari skenario yang telah disiapkan.",
      "Siswa lain bertugas sebagai pengamat kritis (Observer).",
      "Setelah drama selesai, guru memandu sesi tanya jawab: 'Apa yang dirasakan tokoh?', 'Apakah keputusannya tepat?'.",
      "Guru bersama siswa menyimpulkan nilai-nilai moral dan strategi tindakan dari drama tersebut."
    ]
  },
  {
    name: "Refleksi Mandiri & Talkshow Kelas",
    media: "Lembar Asesmen Diri, Mikrofon (Properti Talkshow)",
    inti: [
      "Guru memberikan waktu 5 menit bagi siswa untuk hening dan mengisi lembar refleksi mandiri terkait isu pribadinya.",
      "Guru menyulap setting kelas menjadi arena 'Talkshow'. Guru bertindak sebagai Host.",
      "Guru melempar pertanyaan pemantik ke forum, dan memberikan kesempatan siswa berpendapat secara terbuka layaknya narasumber.",
      "Terjadi dialog dua arah antara guru dan siswa yang memperkaya sudut pandang tanpa menghakimi."
    ]
  }
];

// LIBRARY REFERENSI TEORI UNTUK MATERI AI
const THEORY_REFERENCES = [
  "Teori Manajemen Waktu Matriks Eisenhower (Urgent vs Important)",
  "Konsep Mindfulness dan Grounding Technique dalam Psikologi",
  "Teori Pertumbuhan Pola Pikir (Growth Mindset) oleh Carol Dweck",
  "Pendekatan Cognitive Behavioral Therapy (CBT) oleh Aaron Beck",
  "Teori Kebutuhan Hierarki Abraham Maslow",
  "Konsep Kepribadian Karir RIASEC oleh John Holland",
  "Teori Belajar Sosial (Social Learning Theory) oleh Albert Bandura",
  "Teori Determinasi Diri (Self-Determination Theory) oleh Deci & Ryan",
  "Konsep Literasi Digital dan Jejak Digital (Digital Footprint)",
  "Psikologi Adiksi Dopamin (Dopamine Detox) pada Penggunaan Gadget"
];

function generateActionPlanData(item_id, bidang, layanan = "Bimbingan Klasikal", topik = "Topik Umum") {
  let aspek = "Aspek Umum", tujuan = "", profil = "Mandiri", capaian = "Capaian Umum", metode = "Diskusi", media = "Media Umum";
  let langkahInti = [], teori = THEORY_REFERENCES[item_id % THEORY_REFERENCES.length];

  if (bidang === BIDANG.PRIBADI) {
    aspek = "Kematangan Emosi & Landasan Hidup Religius"; profil = "Mandiri"; capaian = "Mencapai kematangan meregulasi diri dan emosi.";
  } else if (bidang === BIDANG.SOSIAL) {
    aspek = "Kesadaran Tanggung Jawab Sosial"; profil = "Bergotong Royong"; capaian = "Mampu berinteraksi empatik dan kolaboratif.";
  } else if (bidang === BIDANG.BELAJAR) {
    aspek = "Kematangan Intelektual"; profil = "Bernalar Kritis"; capaian = "Mengembangkan strategi belajar mandiri inovatif.";
  } else if (bidang === BIDANG.KARIR) { 
    aspek = "Wawasan dan Kesiapan Karir"; profil = "Bernalar Kritis"; capaian = "Mampu menyusun peta jalan karir dan pendidikan.";
  }
  
  tujuan = `Peserta didik mampu memahami dan menerapkan konsep "${topik}" untuk diterapkan sehari-hari.`;
  
  if (layanan.includes('Klasikal')) { 
    // Pilih metode dinamis berdasarkan ID masalah agar bervariasi
    const methodObj = TEACHING_METHODS[item_id % TEACHING_METHODS.length];
    metode = methodObj.name; 
    media = methodObj.media;
    langkahInti = methodObj.inti;
  } else if (layanan.includes('Kelompok')) { 
    metode = "Board Game Edukasi, Roleplay Interaktif, Focus Group Discussion"; media = "Kartu Skenario (Card Sort), Kertas Plano, Spidol"; 
    langkahInti = [
        `Tahap Kegiatan: Guru BK melempar topik ${topik} ke tengah forum. Tiap anggota berbagi pandangan.`,
        "Activity (Card Sort): Guru membagikan tumpukan kartu. Tiap anggota menarik kartu berisi dilema/situasi acak.",
        "Roleplay Spontan: Anggota mempraktikkan langsung bagaimana cara merespon situasi tersebut.",
        "Brainstorming: Kelompok mencari jalan keluar (problem solving) terbaik secara bersama-sama."
    ];
  } else { 
    metode = "Wawancara Konseling, CBT / Terapi Realita"; media = "Instrumen Asesmen Diri, Lembar Kontrak Perilaku"; 
    langkahInti = [
        "Eksplorasi Masalah: Mendorong konseli untuk menceritakan permasalahan secara mendalam.",
        "Identifikasi: Menggunakan pertanyaan terbuka dan refleksi perasaan untuk menggali akar masalah.",
        `Intervensi: Konselor membantu konseli menantang pemikiran irasional terkait ${topik}.`,
        "Action Plan: Berkolaborasi merumuskan target perubahan perilaku yang SMART."
    ];
  }
  return { aspek, tujuan, profil, capaian, metode, media, langkahInti, teori };
}

const DEFAULT_SCHEDULE_MARKS = {
  'prep1-1': true, 'prep2-2': true, 'prep3-3': true, 'prep4-4': true, 'prep4-5': true, 'prep5-6': true,
  'dasar2-8': true, 'dasar2-20': true, 'dasar2-34': true,
  'dasar4-4': true, 'dasar4-26': true,
  'dasar5-7': true, 'dasar5-24': true,
  'duk1-14': true, 'duk1-40': true,
  'duk2-1': true, 'duk2-5': true, 'duk2-9': true, 'duk2-14': true, 'duk2-18': true, 'duk2-22': true, 'duk2-26': true, 'duk2-30': true, 'duk2-34': true, 'duk2-38': true,
  'duk3-5': true,
  'duk5-20': true,
  'akun1-5': true, 'akun1-10': true, 'akun1-14': true, 'akun1-18': true, 'akun1-22': true, 'akun1-28': true, 'akun1-32': true, 'akun1-36': true, 'akun1-40': true,
  'akun2-21': true, 'akun2-43': true,
  'akun3-23': true, 'akun3-45': true,
};

const BrandLogo = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5L4 14L20 23L36 14L20 5Z" fill="#3b82f6"/>
    <path d="M8 19.5V28.5C8 28.5 14 35 20 35C26 35 32 28.5 32 28.5V19.5L20 26.5L8 19.5Z" fill="#93c5fd" opacity="0.9"/>
    <path d="M20 23L36 14V22.5C36 22.5 30 29 20 29V23Z" fill="#2563eb" opacity="0.5"/>
  </svg>
);

const DashboardCard = ({ bgClass, icon: Icon, title, value }) => (
  <div className={`rounded-lg p-5 text-white ${bgClass} relative overflow-hidden shadow-md`}>
    <div className="relative z-10">
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-90">{title}</div>
    </div>
    <Icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20 transform -rotate-12" />
  </div>
);

export default function App() {
  
  // =========================================================================
  // 1. STATE & HOOKS
  // =========================================================================
  const [fbUser, setFbUser] = useState(null); 
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  // Persistence State Login menggunakan LocalStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('akpd_user_session');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  }); 

  const [activeTab, setActiveTab] = useState('home');

  const [identitas, setIdentitas] = useState({
    provinsi: 'PEMERINTAH PROVINSI KALIMANTAN UTARA',
    dinas: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
    sekolah: 'SMAS AL-MULTAZAM', 
    kontak: 'Alamat: Jalan Diponegoro, Desa Padaidi, Kec. Sebatik | Email: admin@sman1sebatik.sch.id',
    kelas: 'XI-A', 
    pondok: 'Putra',
    tahun: '2023/2024', 
    tempatTanggal: 'Sebatik, 15 Juli 2024',
    kepalaSekolah: 'SUDIRMAN, S.Pd',
    nipKepalaSekolah: '197112312005021002',
    guru: 'HASNAWIAH, S.Pd',
    nipGuru: '197905052005022005',
    guruPutri: '',
    nipGuruPutri: '',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Shield_of_the_Ministry_of_Education_and_Culture_of_the_Republic_of_Indonesia.png/800px-Shield_of_the_Ministry_of_Education_and_Culture_of_the_Republic_of_Indonesia.png' 
  });

  const [students, setStudents] = useState([]);
  const [scheduleMarks, setScheduleMarks] = useState(DEFAULT_SCHEDULE_MARKS);
  const [rplData, setRplData] = useState(null);
  
  const [holidays, setHolidays] = useState([
    { id: 1, start: '2023-12-18', end: '2023-12-31', desc: 'Libur Semester Ganjil' },
    { id: 2, start: '2024-04-08', end: '2024-04-19', desc: 'Libur Idul Fitri' },
    { id: 3, start: '2024-06-24', end: '2024-06-30', desc: 'Libur Semester Genap' }
  ]);
  const [showHolidayModal, setShowHolidayModal] = useState(false);

  const [loginType, setLoginType] = useState('siswa');
  const [siswaForm, setSiswaForm] = useState({ name: '', noInduk: '', gender: 'L', kelas: 'X-A', pondok: 'Putra' });
  const [adminPin, setAdminPin] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // =========================================================================
  // 2. FIREBASE EFFECTS
  // =========================================================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.warn("Auth Firebase gagal. Beralih ke Mode Public Fallback.");
        setFbUser({ uid: "public_fallback" }); 
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        if(u) setFbUser(u);
    });

    const fallbackTimer = setTimeout(() => setIsAppLoading(false), 5000);

    return () => {
        unsubscribe();
        clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!fbUser) return;
    
    let loaded = { students: false, iden: false, sched: false, hol: false };
    const checkLoaded = () => { if (loaded.students && loaded.iden && loaded.sched && loaded.hol) setIsAppLoading(false); };

    if (fbUser.uid === "public_fallback") setIsAppLoading(false);

    const unsubStudents = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'students'), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      if(!loaded.students) { loaded.students = true; checkLoaded(); }
    }, (err) => { console.error(err); if(!loaded.students) { loaded.students = true; checkLoaded(); } });

    const unsubIdentitas = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'identitas'), (d) => {
      if(d.exists()) setIdentitas(prev => ({...prev, ...d.data()}));
      if(!loaded.iden) { loaded.iden = true; checkLoaded(); }
    }, (err) => { console.error(err); if(!loaded.iden) { loaded.iden = true; checkLoaded(); } });

    const unsubSchedule = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'scheduleMarks'), (d) => {
      if(d.exists()) setScheduleMarks(d.data());
      if(!loaded.sched) { loaded.sched = true; checkLoaded(); }
    }, (err) => { console.error(err); if(!loaded.sched) { loaded.sched = true; checkLoaded(); } });

    const unsubHolidays = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'holidays'), (d) => {
      if(d.exists() && d.data().list) setHolidays(d.data().list);
      if(!loaded.hol) { loaded.hol = true; checkLoaded(); }
    }, (err) => { console.error(err); if(!loaded.hol) { loaded.hol = true; checkLoaded(); } });

    return () => { unsubStudents(); unsubIdentitas(); unsubSchedule(); unsubHolidays(); };
  }, [fbUser]);

  // =========================================================================
  // 3. LOGIKA ANALISIS DENGAN FILTER KELAS & PONDOK
  // =========================================================================
  // Data siswa disaring berdasarkan kelas dan pondok yang sedang dilihat Admin di Identitas
  const filteredStudents = useMemo(() => {
    return students.filter(s => s.kelas === identitas.kelas && s.pondok === identitas.pondok);
  }, [students, identitas.kelas, identitas.pondok]);

  const analisisKelas = useMemo(() => {
    const totalStudents = filteredStudents.length;
    if (totalStudents === 0) return [];
    return AKPD_QUESTIONS.map(q => {
      const countYes = filteredStudents.filter(s => s.answers && s.answers[q.id]).length;
      const percentage = (countYes / totalStudents) * 100;
      let priority = "RENDAH";
      if (percentage >= 50) priority = "TINGGI";
      else if (percentage >= 20) priority = "SEDANG";
      return { ...q, count: countYes, percentage: percentage.toFixed(1), priority };
    });
  }, [filteredStudents]);

  const prioritasKebutuhan = useMemo(() => {
    return [...analisisKelas].filter(item => item.count > 0).sort((a, b) => b.percentage - a.percentage);
  }, [analisisKelas]);

  const analisisKonseli = useMemo(() => {
    const totalQuestions = AKPD_QUESTIONS.length;
    return filteredStudents.map(s => {
      const countYes = Object.values(s.answers || {}).filter(Boolean).length;
      const percentage = (countYes / totalQuestions) * 100;
      return { ...s, totalMasalah: countYes, percentage: percentage.toFixed(1) };
    });
  }, [filteredStudents]);

  // Tentukan Guru Penandatangan (Dinamis Putra/Putri)
  const isPutri = identitas.pondok === 'Putri';
  const currentGuru = (isPutri && identitas.guruPutri) ? identitas.guruPutri : identitas.guru;
  const currentNipGuru = (isPutri && identitas.nipGuruPutri) ? identitas.nipGuruPutri : identitas.nipGuru;

  const getMonthFromWeek = (weekIdx) => {
    const months = ["Juli", "Agustus", "September", "Oktober", "November", "Desember", "Januari", "Februari", "Maret", "April", "Mei", "Juni"];
    return months[Math.floor(weekIdx / 4)] || "Juli";
  };

  const getHolidayWeeks = (holiday) => {
      const weeks = new Set();
      if (!identitas.tahun || !holiday.start || !holiday.end) return weeks;
      const years = identitas.tahun.split('/');
      if (years.length !== 2) return weeks;
      const startYear = parseInt(years[0]);
      const endYear = parseInt(years[1]);

      let current = new Date(holiday.start);
      const endDate = new Date(holiday.end);
      
      while (current <= endDate) {
          const m = current.getMonth();
          const y = current.getFullYear();
          let relMonth = -1;
          if (y === startYear && m >= 6) relMonth = m - 6;
          else if (y === endYear && m <= 5) relMonth = m + 6;

          if (relMonth !== -1) {
              const day = current.getDate();
              const week = Math.min(Math.floor((day - 1) / 7), 3);
              const weekIdx = relMonth * 4 + week;
              weeks.add(weekIdx);
          }
          current.setDate(current.getDate() + 1);
      }
      return weeks;
  };

  const holidayMap = useMemo(() => {
    const map = {};
    if (!identitas.tahun) return map;
    const years = identitas.tahun.split('/');
    if (years.length !== 2) return map;
    const startYear = parseInt(years[0]);
    const endYear = parseInt(years[1]);

    holidays.forEach(h => {
        if (!h.start || !h.end) return;
        let current = new Date(h.start);
        const endDate = new Date(h.end);
        
        while (current <= endDate) {
            const m = current.getMonth();
            const y = current.getFullYear();
            let relMonth = -1;
            if (y === startYear && m >= 6) relMonth = m - 6; 
            else if (y === endYear && m <= 5) relMonth = m + 6; 

            if (relMonth !== -1) {
                const day = current.getDate();
                const week = Math.min(Math.floor((day - 1) / 7), 3);
                const weekIdx = relMonth * 4 + week;
                if (!map[weekIdx]) map[weekIdx] = h.desc;
            }
            current.setDate(current.getDate() + 1);
        }
    });
    return map;
  }, [holidays, identitas.tahun]);

  const weekGroups = useMemo(() => {
    const groups = [];
    let i = 0;
    while (i < 48) {
        if (holidayMap[i]) {
            let span = 1;
            let text = holidayMap[i];
            while (i + span < 48 && holidayMap[i + span] === text) {
                span++;
            }
            groups.push({ type: 'holiday', span, text, index: i });
            i += span;
        } else {
            groups.push({ type: 'work', span: 1, index: i });
            i++;
        }
    }
    return groups;
  }, [holidayMap]);


  // =========================================================================
  // 4. FUNGSI AKSI & MUTASI (PERSISTENCE)
  // =========================================================================

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('akpd_user_session', JSON.stringify(userData));
  };

  const handleLogout = () => { 
    setUser(null); 
    localStorage.removeItem('akpd_user_session');
    setActiveTab('home'); 
    setLoginType('siswa');
    setAdminPin('');
    setSiswaForm({ name: '', noInduk: '', gender: 'L', kelas: 'X-A', pondok: 'Putra' });
    setAnswers({});
    setSubmitted(false);
  };

  const handleIdentitasChange = (e) => setIdentitas({ ...identitas, [e.target.name]: e.target.value });
  
  const handleSaveIdentitas = async () => {
    try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'identitas'), identitas);
        alert("Identitas dan Pengaturan berhasil disimpan ke Database!");
    } catch (error) {
        console.error(error);
        alert("Gagal simpan ke Firebase. Aturan Firestore mungkin belum disesuaikan.");
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'students', id));
    } catch (error) {
        setStudents(students.filter(s => s.id !== id)); 
    }
  };

  const submitSiswa = async (e) => {
    if (e) e.preventDefault();
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'students'), {
            name: user.data.name,
            noInduk: user.data.noInduk,
            gender: user.data.gender,
            kelas: user.data.kelas,
            pondok: user.data.pondok,
            answers: answers,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Gagal simpan Firebase:", error);
        setStudents(prev => [...prev, {...user.data, answers, id: Date.now()}]); 
    }
    setSubmitted(true);
    const updatedUser = { ...user, hasSubmitted: true };
    loginUser(updatedUser); 
  };

  const toggleScheduleMark = async (rowId, weekIdx) => {
    const newMarks = { ...scheduleMarks, [`${rowId}-${weekIdx}`]: !scheduleMarks[`${rowId}-${weekIdx}`] };
    setScheduleMarks(newMarks); 
    try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'scheduleMarks'), newMarks);
    } catch (e) {}
  };

  const autoGenerateSchedule = async () => {
    const newMarks = { ...DEFAULT_SCHEDULE_MARKS };
    const klasikalItems = prioritasKebutuhan.filter(p => (AI_FORMULATION[p.id]?.layanan || '').includes("Klasikal"));
    const kelompokItems = prioritasKebutuhan.filter(p => (AI_FORMULATION[p.id]?.layanan || '').includes("Kelompok"));
    const responsifItems = prioritasKebutuhan.filter(p => (AI_FORMULATION[p.id]?.layanan || '').includes("Individu") || p.priority === "TINGGI");

    klasikalItems.forEach((_, index) => {
       const targetWeek = 4 + (index * 2);
       if (targetWeek < 46 && ![22, 23, 24, 46, 47].includes(targetWeek)) newMarks[`dasar1-${targetWeek}`] = true;
    });

    kelompokItems.forEach((_, index) => {
       const targetWeek = 6 + (index * 3);
       if (targetWeek < 46) newMarks[`dasar3-${targetWeek}`] = true;
    });

    if (responsifItems.some(p => p.priority === "TINGGI")) {
       newMarks[`duk4-12`] = true; newMarks[`duk4-32`] = true;
    }
    setScheduleMarks(newMarks);
    try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'scheduleMarks'), newMarks);
        alert("Jadwal Program berhasil digenerate otomatis ke Database!");
    } catch (error) {
        alert("Jadwal berhasil digenerate lokal.");
    }
  };

  const generateRPL = (item) => {
    const baseAiData = AI_FORMULATION[item.id] || { layanan: 'Bimbingan Klasikal', topik: 'Topik Umum', rumusan: 'Rumusan Umum', rowId: 'dasar1' };
    const aiActionData = generateActionPlanData(item.id, item.bidang, baseAiData.layanan, baseAiData.topik);
    let komponen = item.bidang === BIDANG.KARIR ? "Layanan Peminatan" : (baseAiData.layanan.includes("Konseling Individu") ? "Layanan Responsif" : "Layanan Dasar");
    
    let langkahAwal = [], langkahPenutup = [];
    let lkpdItems = [], instrumenProses = [];
    
    if (baseAiData.layanan === "Bimbingan Klasikal") {
      langkahAwal = [
        "Guru menyapa peserta didik dengan antusias, memimpin doa, dan mengecek kesiapan psikologis kelas.",
        "Ice Breaking Interaktif: Mengadakan mini-game 'Tebak Mitos atau Fakta' terkait isu yang akan dibahas.",
        "Menyampaikan tujuan layanan dan *rules of the game* hari ini dengan gaya komunikasi yang relevan dengan remaja."
      ];
      langkahPenutup = [
        "Guru BK bersama peserta didik menyimpulkan 'Cheat Sheet' (ringkasan tips praktis) dari aktivitas yang telah dilakukan.",
        "Peserta didik diarahkan untuk mengisi tautan Lembar Kerja Peserta Didik (LKPD) / Evaluasi Hasil via Google Form.",
        "Memberikan afirmasi positif (reinforcement) dan menutup sesi layanan dengan salam penutup."
      ];
      lkpdItems = [
        `Dari aktivitas yang kita lakukan tadi, hal baru apa yang paling mengubah cara pandangmu mengenai ${baseAiData.topik}?`,
        `Coba ingat kembali satu kebiasaan kurang baikmu terkait isu ini. Strategi apa yang akan kamu gunakan untuk mengalahkannya?`,
        `Tuliskan 2 Action Plan (Tindakan Nyata) yang akan kamu lakukan minggu ini sebagai bentuk komitmen perubahan positifmu!`,
      ];
      instrumenProses = [
        "Peserta didik terlihat antusias dan menikmati elemen interaktif selama kegiatan berlangsung.",
        "Peserta didik mampu bekerja sama secara gotong-royong di dalam kelompok (Kolaborasi).",
        "Peserta didik berani menyampaikan gagasan dan memberikan feedback secara kritis kepada kelompok lain."
      ];
    } else if (baseAiData.layanan === "Bimbingan Kelompok") {
      langkahAwal = [
        "Tahap Pembentukan: Guru BK menyambut hangat anggota kelompok, duduk melingkar, dan melakukan perkenalan *fun-fact*.",
        "Menyampaikan asas-asas bimbingan kelompok (terutama Kerahasiaan dan Keterbukaan) dengan suasana santai.",
        `Menjelaskan bahwa hari ini kelompok akan menjalankan misi khusus terkait isu ${baseAiData.topik}.`,
        "Tahap Peralihan (Transisi): Guru memastikan semua anggota merasa aman dan sepakat mengikuti dinamika permainan."
      ];
      langkahPenutup = [
        "Tahap Pengakhiran: Guru BK mengapresiasi keberanian tiap anggota dalam dinamika kelompok.",
        "Anggota kelompok memberikan kesan dan pesan (refleksi BMB3: Berpikir, Merasa, Bersikap, Bertindak, Bertanggungjawab).",
        "Menyepakati komitmen bersama dan merencanakan kegiatan lanjutan jika dirasa perlu.",
        "Menutup dinamika dengan tepuk tangan apresiasi, doa, dan salam perpisahan."
      ];
      lkpdItems = [
        `Apa *insight* (wawasan) berharga yang kamu peroleh setelah mendengar pandangan dari teman-temanmu tadi?`,
        `Sikap atau pemikiran apa yang berubah dalam dirimu setelah berada dalam kelompok ini?`,
        `Apa komitmen perilakumu ke depannya terkait penanganan isu ${baseAiData.topik}?`,
      ];
      instrumenProses = [
        "Anggota kelompok berpartisipasi aktif dan tidak canggung dalam melakukan diskusi/simulasi.",
        "Terjalin dinamika kelompok yang hidup, hangat, dan saling berempati antar anggota.",
        "Terlihat adanya perubahan wawasan dan kelegaan psikologis (katarsis) selama proses berlangsung."
      ];
    } else { 
      langkahAwal = [
        "Attending: Menerima konseli dengan hangat, senyum, dan postur tubuh terbuka (unconditional positive regard).",
        "Rapport: Membangun hubungan baik (Building Rapport) dengan obrolan ringan agar konseli merasa nyaman dan aman.",
        "Structuring: Menjelaskan asas kerahasiaan secara tegas, batas waktu sesi, dan peran konselor sebagai fasilitator, bukan hakim."
      ];
      langkahPenutup = [
        "Terminasi: Konselor membantu konseli membuat ringkasan dari seluruh proses sesi yang telah berjalan.",
        "Mengevaluasi komitmen konseli terhadap Action Plan / Kontrak Perilaku yang telah disepakati bersama.",
        "Menjadwalkan sesi follow-up (pertemuan lanjutan) untuk memantau progres konseli di minggu berikutnya.",
        "Menutup sesi konseling dengan salam hangat dan motivasi."
      ];
      lkpdItems = [
        `Apa 'Akar Masalah' yang baru benar-benar kamu sadari (insight) setelah sesi ngobrol kita hari ini?`,
        `Sebutkan kekuatan atau potensi positif yang sebenarnya terpendam dalam dirimu, yang bisa digunakan sebagai senjata mengatasi masalah tersebut!`,
        `Tuliskan Kontrak Perilaku (Janji pada diri sendiri) yang akan kamu penuhi dan laporkan pada sesi minggu depan.`,
      ];
      instrumenProses = [
        "Konseli menunjukkan sikap kooperatif dan mulai mengurangi sikap defensif (bertahan) dalam menceritakan masalahnya.",
        "Konseli menunjukkan kemampuan *insight* (kesadaran diri) yang meningkat di pertengahan sesi.",
        "Terbangun *Therapeutic Alliance* (hubungan saling percaya) yang sangat kuat antara konselor dan konseli."
      ];
    }

    const topicTextClean = item.text.replace('Saya ', '').toLowerCase();
    
    // Generator Materi Berbasis Literatur
    const materiText = {
      pendahuluan: `👋 **Halo Sobat Gen-Z!** Pernahkah kamu merasa *stuck* atau kewalahan saat menghadapi situasi terkait ${topicTextClean}? \n\nDi era digital yang serba instan ini, menguasai keterampilan manajemen diri terkait **${baseAiData.topik}** bukan lagi sekadar teori membosankan yang didengar di kelas, melainkan sebuah **"Survival Skill" (Skill Bertahan Hidup)** yang wajib kamu miliki. Berdasarkan analisis dari **${aiActionData.teori}**, kita mengetahui bahwa kebiasaan perilaku manusia sangat dipengaruhi oleh pola pikir, lingkungan, dan bagaimana otak kita memproses informasi. Mari kita bedah bersama!`,
      
      inti: `🔍 **Dinamika Permasalahan (Mengapa Ini Terjadi?):** \n\nDalam kacamata psikologi dan perkembangan remaja, masalah terkait ${baseAiData.topik} sering kali berakar dari konflik internal atau tuntutan eksternal. Secara teori, manusia rentan mengalami *cognitive distortion* (distorsi kognitif) atau salah berpikir ketika berada di bawah tekanan (*peer pressure*), kecemasan akan masa depan, atau distraksi teknologi yang memicu hormon dopamin berlebih.\n\nJika dibiarkan berlarut-larut, "HP (Health Point)" mentalmu akan terus terkuras habis, menurunkan produktivitas belajar, dan mengaburkan arah tujuan karirmu. Memahami trik psikologis di balik masalah ini adalah kunci mutlak untuk bisa menaklukkan "boss" di level ini!`,
      
      solusi: `🚀 **Level Up Strategy (Action Plan & Solusi Berbasis Teori):** \n\n1. 🧠 **Re-framing Pola Pikir (Self-Awareness):** Langkah pertama adalah menyadari distorsi pikiranmu. Ubah *mindset* negatif menjadi *growth mindset*. Alih-alih berkata "Aku tidak bisa", katakan "Aku sedang berproses."\n2. 🛡️ **Penerapan "Healthy Boundaries":** Tetapkan batasan tegas terhadap hal-hal yang mendistraksi. Gunakan teknik manajemen waktu yang terstruktur (seperti Pomodoro atau Matriks Prioritas).\n3. ⚡ **Latihan Perilaku Asertif:** Kamu berhak dan harus berani berkata "TIDAK" secara sopan pada ajakan atau tren yang berpotensi merugikan masa depanmu (mengurangi FOMO).\n4. 🤝 **Sistem Dukungan (Support System):** Ingat, mencari bantuan profesional bukanlah tanda kelemahan. Jangan ragu berdiskusi dengan guru BK atau keluarga untuk menyelaraskan tujuan dan mengatasi konflik.`
    };

    setRplData({
      ...item, baseAiData, aiActionData, komponen, langkahAwal, langkahInti: aiActionData.langkahInti, langkahPenutup, materiText, lkpdItems, instrumenProses
    });
  };

  // =========================================================================
  // 5. KOMPONEN RENDER (SUB-VIEWS)
  // =========================================================================

  function renderKopSuratCetak(title, isCompact = false) {
    return (
      <div className={`hidden print:block w-full border-b-[3px] border-double border-slate-800 pt-0 break-inside-avoid ${isCompact ? 'print:mb-1 print:pb-0.5' : 'print:mb-2 print:pb-1'}`}>
         <div className="flex items-center justify-between px-2 w-full">
            <img src={identitas.logoUrl} alt="Logo Sekolah" className={`object-contain ${isCompact ? 'w-16 h-16 print:w-12 print:h-12' : 'w-20 h-20'}`} onError={(e) => {e.target.style.display='none'}} />
            <div className="flex-1 text-center px-4 flex flex-col items-center justify-center">
               <h2 className={`font-extrabold uppercase tracking-wide text-black m-0 leading-none ${isCompact ? 'text-[11pt] print:text-[10pt]' : 'text-[13pt]'}`}>{identitas.provinsi}</h2>
               <h2 className={`font-extrabold uppercase tracking-wide text-black m-0 leading-none ${isCompact ? 'text-[10pt] print:text-[9pt]' : 'text-[12pt]'}`}>{identitas.dinas}</h2>
               <h1 className={`font-black uppercase tracking-wider text-black m-0 leading-none ${isCompact ? 'text-[13pt] print:text-[12pt] mt-0.5' : 'text-[16pt] mt-1'}`}>{identitas.sekolah}</h1>
               <p className={`text-black m-0 leading-none ${isCompact ? 'text-[8pt] print:text-[7.5pt] mt-0.5' : 'text-[9pt] mt-1'}`}>{identitas.kontak}</p>
            </div>
            <div className={`${isCompact ? 'w-16 h-16 print:w-12 print:h-12' : 'w-20 h-20'}`}></div>
         </div>
         <div className={`w-full flex justify-center ${isCompact ? 'mt-1 mb-1 print:mb-0.5' : 'mt-2'}`}>
           <h3 className={`font-bold underline uppercase text-center text-black m-0 leading-none ${isCompact ? 'text-[11pt] print:text-[10pt]' : 'text-[12pt]'}`}>{title}</h3>
         </div>
      </div>
    );
  }

  function renderTandaTanganCetak(isCompact = false) {
    return (
      <div className={`hidden print:flex justify-between px-10 text-slate-800 w-full break-inside-avoid ${isCompact ? 'print:mt-1 print:mb-0 text-[9pt] print:text-[8pt]' : 'print:mt-2 print:mb-0 text-[10pt]'}`}>
         <div className="text-center leading-tight">
             Mengetahui,<br/>Kepala Sekolah<br/><br/><br/>
             <b className="underline underline-offset-2 uppercase">{identitas.kepalaSekolah}</b><br/>
             NIP. {identitas.nipKepalaSekolah}
         </div>
         <div className="text-center leading-tight">
             {identitas.tempatTanggal}<br/>Guru BK/Konselor ({identitas.pondok})<br/><br/><br/>
             <b className="underline underline-offset-2 uppercase">{currentGuru}</b><br/>
             NIP. {currentNipGuru}
         </div>
      </div>
    );
  }

  function renderHolidayModal() {
    if (!showHolidayModal) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                <div className="bg-slate-100 border-b border-slate-200 p-4 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center"><CalendarDays className="w-5 h-5 mr-2 text-red-500"/> Pengaturan Hari Libur / Agenda</h3>
                    <button onClick={() => setShowHolidayModal(false)} className="text-slate-500 hover:text-slate-800"><X className="w-5 h-5"/></button>
                </div>
                <div className="p-6">
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const fd = new FormData(e.target);
                        const start = fd.get('start');
                        const end = fd.get('end');
                        const desc = fd.get('desc');
                        if(start && end && desc) {
                            const newHols = [...holidays, { id: Date.now(), start, end, desc }];
                            setHolidays(newHols);
                            try {
                                await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'holidays'), { list: newHols });
                            } catch(error) { console.error(error); }
                            e.target.reset();
                        }
                    }} className="flex gap-2 items-end mb-6 bg-slate-50 p-4 rounded border border-slate-200">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mulai</label>
                            <input type="date" name="start" required className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"/>
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sampai</label>
                            <input type="date" name="end" required className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"/>
                        </div>
                        <div className="flex-[2]">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keterangan Libur</label>
                            <input type="text" name="desc" required placeholder="Cth: Libur Semester" className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500"/>
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-bold text-sm shadow-sm h-[34px]">Tambah</button>
                    </form>

                    <h4 className="font-bold text-slate-700 text-sm mb-2 border-b pb-2">Daftar Hari Libur Terjadwal:</h4>
                    <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {holidays.length === 0 ? (
                            <p className="text-sm text-slate-500 italic text-center py-4">Belum ada hari libur yang ditambahkan.</p>
                        ) : holidays.map((h) => (
                            <div key={h.id} className="flex justify-between items-center bg-white border border-slate-200 rounded p-3 hover:border-red-200 transition-colors">
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{h.desc}</div>
                                    <div className="text-xs text-slate-500">{new Date(h.start).toLocaleDateString('id-ID')} s.d {new Date(h.end).toLocaleDateString('id-ID')}</div>
                                </div>
                                <button onClick={async () => {
                                    const newHols = holidays.filter(item => item.id !== h.id);
                                    setHolidays(newHols);
                                    try {
                                        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'holidays'), { list: newHols });
                                    } catch(error) { console.error(error); }
                                }} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  }

  function renderRplModal() {
    if (!rplData) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex justify-center overflow-y-auto p-4 sm:p-8 custom-scrollbar print:static print:bg-transparent print:p-0 print:m-0 print:block print:overflow-visible">
        <div className="bg-white max-w-[900px] w-full shadow-2xl relative print:w-full print:max-w-none print:shadow-none print:bg-white print:m-0 print:p-0">
          <div className="sticky top-0 bg-slate-100 border-b border-slate-300 p-4 flex justify-between items-center z-10 print-hide shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-indigo-600"/> Paket Lengkap Layanan BK (AI Generated)</h3>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-indigo-700 flex items-center shadow-sm">
                <Download className="w-4 h-4 mr-2" /> Download / Cetak PDF
              </button>
              <button onClick={() => setRplData(null)} className="bg-white border border-slate-300 text-slate-600 px-3 py-2 rounded hover:bg-slate-50 shadow-sm"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="p-8 sm:p-12 print-container font-sans text-slate-900 leading-snug bg-white text-[10pt] print:text-[9.5pt] print:leading-tight" id="printable-rpl">
             
             {/* --- HALAMAN 1: RPL UTAMA --- */}
             <div className="w-full print:block break-inside-avoid-page">
                 {renderKopSuratCetak("RENCANA PELAKSANAAN LAYANAN (RPL) BIMBINGAN DAN KONSELING", true)}

                 <table className="w-full border-collapse border border-black mb-2 break-inside-avoid print:text-[9.5pt]">
                   <tbody>
                     <tr className="bg-slate-200 font-bold text-center break-inside-avoid"><td colSpan="4" className="border border-black print:p-1 p-2">SPESIFIKASI</td></tr>
                     <tr className="break-inside-avoid">
                        <td className="border border-black print:p-1 p-2 font-bold w-1/4 bg-slate-50">Komponen Layanan</td>
                        <td className="border border-black print:p-1 p-2 w-1/4">{rplData.komponen} ({rplData.baseAiData.layanan})</td>
                        <td className="border border-black print:p-1 p-2 font-bold w-1/4 bg-slate-50">Bidang</td>
                        <td className="border border-black print:p-1 p-2 w-1/4">{rplData.bidang}</td>
                     </tr>
                     <tr className="break-inside-avoid">
                        <td className="border border-black print:p-1 p-2 font-bold bg-slate-50">Topik Layanan</td>
                        <td className="border border-black print:p-1 p-2 font-semibold text-blue-900 print:text-black">{rplData.baseAiData.topik}</td>
                        <td className="border border-black print:p-1 p-2 font-bold bg-slate-50">Sasaran</td>
                        <td className="border border-black print:p-1 p-2">Siswa Kelas {identitas.kelas}</td>
                     </tr>
                     <tr className="break-inside-avoid">
                        <td className="border border-black print:p-1 p-2 font-bold bg-slate-50">Metode / Teknik</td>
                        <td className="border border-black print:p-1 p-2">{rplData.aiActionData.metode}</td>
                        <td className="border border-black print:p-1 p-2 font-bold bg-slate-50">Sem / TP</td>
                        <td className="border border-black print:p-1 p-2">Ganjil/Genap - {identitas.tahun}</td>
                     </tr>
                     <tr className="break-inside-avoid">
                        <td className="border border-black print:p-1 p-2 font-bold bg-slate-50">Media / Alat</td>
                        <td className="border border-black print:p-1 p-2">{rplData.aiActionData.media}</td>
                        <td className="border border-black print:p-1 p-2 font-bold bg-slate-50">Alokasi Waktu</td>
                        <td className="border border-black print:p-1 p-2">1 x 45 Menit</td>
                     </tr>
                     <tr className="bg-slate-200 font-bold text-center break-inside-avoid"><td colSpan="4" className="border border-black print:p-1 p-2">TUJUAN LAYANAN</td></tr>
                     <tr className="break-inside-avoid">
                        <td colSpan="4" className="border border-black print:p-1 p-2 align-top">
                           <div className="mb-1"><b>Capaian Layanan:</b> {rplData.aiActionData.capaian}</div>
                           <div className="mb-1"><b>Dimensi Profil Pelajar:</b> {rplData.aiActionData.profil}</div>
                           <div><b>Tujuan Umum:</b> {rplData.aiActionData.tujuan}</div>
                           <div className="mt-1"><b>Tujuan Khusus:</b> 
                              <ol className="list-decimal ml-5 mt-0.5 space-y-0.5">
                                 <li>Peserta didik mampu mengidentifikasi isu terkait materinya.</li>
                                 <li>Peserta didik mampu menemukan alternatif solusi dari permasalahan tersebut.</li>
                                 <li>Peserta didik mampu menerapkan perilaku positif dalam keseharian.</li>
                              </ol>
                           </div>
                        </td>
                     </tr>
                   </tbody>
                 </table>

                 <div className="font-bold text-[10pt] mb-1.5 mt-2 bg-slate-800 text-white px-2 py-1 inline-block break-inside-avoid print:bg-slate-200 print:text-black print:border print:border-black">LANGKAH KEGIATAN</div>
                 <table className="w-full border-collapse border border-black mb-2 break-inside-avoid print:text-[9.5pt]">
                   <thead>
                     <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-black print:p-1 p-2 w-[15%]">TAHAP</th>
                        <th className="border border-black print:p-1 p-2 w-[85%]">URAIAN KEGIATAN LAYANAN</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="break-inside-avoid">
                        <td className="border border-black print:p-1 p-2 font-bold text-center bg-slate-50 align-top">Tahap Awal<br/><span className="font-normal text-[8pt]">(Pendahuluan)</span></td>
                        <td className="border border-black print:p-1 p-2 align-top"><ul className="list-disc ml-4 space-y-0.5">{rplData.langkahAwal.map((l, i) => <li key={`aw-${i}`}>{l}</li>)}</ul></td>
                     </tr>
                     <tr className="break-inside-avoid">
                        <td className="border border-black print:p-1 p-2 font-bold text-center bg-slate-50 align-top">Tahap Inti<br/><span className="font-normal text-[8pt]">(Kegiatan)</span></td>
                        <td className="border border-black print:p-1 p-2 align-top"><ul className="list-disc ml-4 space-y-0.5">{rplData.langkahInti.map((l, i) => <li key={`in-${i}`}>{l}</li>)}</ul></td>
                     </tr>
                     <tr className="break-inside-avoid">
                        <td className="border border-black print:p-1 p-2 font-bold text-center bg-slate-50 align-top">Tahap Penutup<br/><span className="font-normal text-[8pt]">(Terminasi)</span></td>
                        <td className="border border-black print:p-1 p-2 align-top"><ul className="list-disc ml-4 space-y-0.5">{rplData.langkahPenutup.map((l, i) => <li key={`pe-${i}`}>{l}</li>)}</ul></td>
                     </tr>
                   </tbody>
                 </table>
                 {renderTandaTanganCetak(true)}
             </div>

             {/* --- HALAMAN 2: MATERI LAYANAN DENGAN GAMBAR --- */}
             <div className="break-before-page pt-2 w-full print:block">
                <div className="w-full flex justify-center mt-2 mb-6">
                   <h3 className="font-bold text-[14pt] underline uppercase text-center text-black m-0 leading-tight">LAMPIRAN 1: MATERI LAYANAN</h3>
                </div>
                <div className="text-center mb-6 break-inside-avoid flex flex-col items-center w-full">
                   <h4 className="font-extrabold text-blue-900 mt-1 uppercase text-lg print:text-black">{rplData.baseAiData.topik}</h4>
                   <div className="mt-4 mb-4 flex justify-center w-full">
                     <img 
                       src={`https://picsum.photos/seed/${encodeURIComponent(rplData.baseAiData.topik || 'BK')}/800/350`} 
                       alt="Ilustrasi Materi Layanan" 
                       className="w-full max-w-2xl h-56 object-cover rounded-lg shadow-md border border-slate-200 print:shadow-none print:border-black" 
                     />
                   </div>
                </div>
                
                <div className="border border-slate-300 p-5 bg-slate-50 text-justify space-y-3 mb-6 leading-relaxed rounded break-inside-avoid print:border-black print:bg-white print:text-[10pt]">
                   <p className="whitespace-pre-line"><b>A. Pengantar dan Pemahaman</b><br/>{rplData.materiText.pendahuluan}</p>
                   <p className="whitespace-pre-line"><b>B. Dinamika Permasalahan</b><br/>{rplData.materiText.inti}</p>
                   <p className="whitespace-pre-line"><b>C. Strategi dan Solusi Berbasis: {rplData.aiActionData.teori}</b><br/>{rplData.materiText.solusi}</p>
                   <p className="text-xs text-slate-500 italic mt-6 text-center border-t border-slate-300 pt-3 print:text-black print:border-black">-- Materi ini dikembangkan oleh Guru BK disesuaikan dengan dinamika kelas / konseli --</p>
                </div>
             </div>

             {/* --- HALAMAN 3: LKPD --- */}
             <div className="break-before-page pt-2 w-full print:block">
                <div className="w-full flex justify-center mt-2 mb-6">
                   <h3 className="font-bold text-[14pt] underline uppercase text-center text-black m-0 leading-tight">LAMPIRAN 2: LEMBAR KERJA (LKPD) / REFLEKSI</h3>
                </div>
                
                <div className="text-center mb-6 mt-4 break-inside-avoid flex flex-col items-center w-full">
                   <h4 className="font-bold text-lg uppercase text-slate-800 mb-2 print:text-black">{rplData.baseAiData.topik}</h4>
                   <p className="font-semibold print:text-[10pt]">Nama: .............................................................. | Kelas: ............................................</p>
                </div>
                
                <div className="border border-black p-6 bg-white min-h-[450px] break-inside-avoid shadow-sm print:shadow-none">
                   <p className="mb-4 italic text-slate-700 print:text-black">Jawablah pertanyaan refleksi di bawah ini berdasarkan pemahaman dan perasaanmu secara mandiri dan jujur!</p>
                   <ol className="list-decimal ml-5 space-y-12">
                      {rplData.lkpdItems.map((lkpd, i) => (
                        <li key={`lk-${i}`} className="font-medium text-[10.5pt]">
                           {lkpd}
                           <div className="mt-8 border-b border-dashed border-slate-400 print:border-black"></div>
                           <div className="mt-8 border-b border-dashed border-slate-400 print:border-black"></div>
                        </li>
                      ))}
                   </ol>
                </div>
             </div>

             {/* --- HALAMAN 4: INSTRUMEN PENILAIAN --- */}
             <div className="break-before-page pt-2 w-full print:block">
                <div className="w-full flex justify-center mt-2 mb-6">
                   <h3 className="font-bold text-[14pt] underline uppercase text-center text-black m-0 leading-tight">LAMPIRAN 3: INSTRUMEN PENILAIAN BK</h3>
                </div>
                
                <div className="break-inside-avoid w-full">
                  <div className="text-left mb-3 flex w-full">
                     <h4 className="font-bold mt-1 uppercase bg-slate-800 text-white inline-block px-3 py-1 print:bg-slate-200 print:text-black print:border print:border-black">A. INSTRUMEN PENILAIAN PROSES</h4>
                  </div>
                  <p className="mb-2 italic text-[9pt]">Lembar observasi ini diisi oleh Guru BK/Konselor selama proses layanan berlangsung.</p>
                  <table className="w-full border-collapse border border-black mb-6 print:text-[10pt]">
                     <thead>
                       <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-black print:p-1.5 p-2 w-10">NO</th>
                          <th className="border border-black print:p-1.5 p-2">INDIKATOR OBSERVASI (PROSES)</th>
                          <th className="border border-black print:p-1.5 p-2 w-24">SKOR (1-4)</th>
                       </tr>
                     </thead>
                     <tbody>
                       {rplData.instrumenProses.map((indikator, i) => (
                         <tr key={`ip-${i}`} className="break-inside-avoid">
                            <td className="border border-black print:p-1.5 p-2 text-center font-bold">{i+1}</td>
                            <td className="border border-black print:p-1.5 p-2">{indikator}</td>
                            <td className="border border-black print:p-1.5 p-2"></td>
                         </tr>
                       ))}
                       <tr className="bg-slate-50 break-inside-avoid">
                          <td colSpan="2" className="border border-black print:p-1.5 p-2 font-bold text-right">TOTAL SKOR PENILAIAN PROSES:</td>
                          <td className="border border-black print:p-1.5 p-2"></td>
                       </tr>
                     </tbody>
                  </table>
                  <p className="text-[9pt] text-slate-500 -mt-4 mb-8 print:text-black">*Keterangan Skor: 1=Kurang Baik, 2=Cukup Baik, 3=Baik, 4=Sangat Baik</p>
                </div>

                <div className="break-inside-avoid w-full">
                  <div className="text-left mb-3 flex w-full">
                     <h4 className="font-bold mt-1 uppercase bg-slate-800 text-white inline-block px-3 py-1 print:bg-slate-200 print:text-black print:border print:border-black">B. INSTRUMEN PENILAIAN HASIL (LAISEG)</h4>
                  </div>
                  <p className="mb-2 italic text-[9pt]">Penilaian menggunakan kriteria UCA (Understanding, Comfortable, Action) sesuai panduan POP BK Kurikulum Merdeka.</p>
                  <table className="w-full border-collapse border border-black mb-6 break-inside-avoid print:text-[10pt]">
                     <thead>
                       <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-black print:p-1.5 p-2 w-10">NO</th>
                          <th className="border border-black print:p-1.5 p-2 w-1/4">ASPEK UCA</th>
                          <th className="border border-black print:p-1.5 p-2">DESKRIPSI KRITERIA EVALUASI</th>
                          <th className="border border-black print:p-1.5 p-2 w-24">SKOR (1-4)</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr className="break-inside-avoid">
                          <td className="border border-black print:p-1.5 p-2 text-center font-bold">1</td>
                          <td className="border border-black print:p-1.5 p-2 font-bold text-blue-900 print:text-black">Understanding<br/><span className="text-[9pt] text-slate-500 font-normal print:text-black">(Pemahaman)</span></td>
                          <td className="border border-black print:p-1.5 p-2">Peserta didik mendapatkan wawasan baru dan memahami secara utuh materi/topik tentang <i>{rplData.baseAiData.topik}</i>.</td>
                          <td className="border border-black print:p-1.5 p-2"></td>
                       </tr>
                       <tr className="break-inside-avoid">
                          <td className="border border-black print:p-1.5 p-2 text-center font-bold">2</td>
                          <td className="border border-black print:p-1.5 p-2 font-bold text-blue-900 print:text-black">Comfortable<br/><span className="text-[9pt] text-slate-500 font-normal print:text-black">(Perasaan Positif)</span></td>
                          <td className="border border-black print:p-1.5 p-2">Peserta didik merasa nyaman, lega, termotivasi dan memiliki sikap positif setelah mengikuti layanan ini.</td>
                          <td className="border border-black print:p-1.5 p-2"></td>
                       </tr>
                       <tr className="break-inside-avoid">
                          <td className="border border-black print:p-1.5 p-2 text-center font-bold">3</td>
                          <td className="border border-black print:p-1.5 p-2 font-bold text-blue-900 print:text-black">Action<br/><span className="text-[9pt] text-slate-500 font-normal print:text-black">(Rencana Aksi)</span></td>
                          <td className="border border-black print:p-1.5 p-2">Peserta didik telah merumuskan rencana tindakan nyata (Action Plan) untuk mengembangkan perilakunya menjadi lebih baik.</td>
                          <td className="border border-black print:p-1.5 p-2"></td>
                       </tr>
                       <tr className="bg-slate-50 break-inside-avoid">
                          <td colSpan="3" className="border border-black print:p-1.5 p-2 font-bold text-right">TOTAL SKOR KETERCAPAIAN LAYANAN:</td>
                          <td className="border border-black print:p-1.5 p-2"></td>
                       </tr>
                     </tbody>
                  </table>
                </div>
             </div>

          </div>
        </div>
      </div>
    );
  }

  function renderBeranda() {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <DashboardCard bgClass="bg-[#17a2b8]" icon={Users} title={`Siswa ${identitas.kelas} (${identitas.pondok})`} value={filteredStudents.length} />
          <DashboardCard bgClass="bg-[#28a745]" icon={FileText} title="Butir AKPD Aktif" value="50" />
          <DashboardCard bgClass="bg-[#ffc107]" icon={AlertCircle} title="Isu Prioritas Tinggi" value={prioritasKebutuhan.filter(k => k.priority === 'TINGGI').length} />
          <DashboardCard bgClass="bg-[#dc3545]" icon={GraduationCap} title="Tahun Ajaran" value={identitas.tahun} />
        </div>
        <div className="bg-[#007bff] text-white p-6 rounded-lg shadow-sm mb-6 border border-blue-600 relative overflow-hidden print-hide">
          <h2 className="text-xl font-bold mb-2">Selamat datang di Sistem Rekomendasi Program BK</h2>
          <p className="opacity-90 text-sm max-w-3xl">
            Sistem ini memfasilitasi Anda untuk merancang Program Tahunan (Prota), Program Semester (Promes), dan Rencana Pelaksanaan Layanan (RPL) Lengkap secara otomatis berdasarkan hasil Angket Kebutuhan Peserta Didik (AKPD).
          </p>
        </div>
      </div>
    );
  }

  function renderIdentitasForm() {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><CalendarDays className="w-5 h-5 mr-2 text-blue-600" /> Pengaturan Identitas & Tahun Ajaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="col-span-1 md:col-span-2"><h3 className="font-bold text-slate-700 border-b pb-2">Kop Surat & Logo Sekolah</h3></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Provinsi / Kemenag</label><input type="text" name="provinsi" value={identitas.provinsi} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Dinas / Instansi</label><input type="text" name="dinas" value={identitas.dinas} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nama Sekolah</label><input type="text" name="sekolah" value={identitas.sekolah} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">URL Logo Surat / Sekolah</label><input type="text" name="logoUrl" value={identitas.logoUrl} onChange={handleIdentitasChange} placeholder="Masukkan Link URL Gambar Logo" className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="col-span-1 md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Kontak & Alamat Laporan</label><input type="text" name="kontak" value={identitas.kontak} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>

          <div className="col-span-1 md:col-span-2 mt-4"><h3 className="font-bold text-slate-700 border-b pb-2">Filter Tampilan Data Saat Ini</h3></div>
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tampilkan Data Kelas</label>
              <select name="kelas" value={identitas.kelas} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="X-A">X-A</option><option value="X-B">X-B</option><option value="X-C">X-C</option>
                  <option value="XI-A">XI-A</option><option value="XI-B">XI-B</option><option value="XI-C">XI-C</option>
                  <option value="XII-A">XII-A</option><option value="XII-B">XII-B</option><option value="XII-C">XII-C</option>
              </select>
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tampilkan Data Asrama/Pondok</label>
              <select name="pondok" value={identitas.pondok || 'Putra'} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="Putra">Putra</option>
                  <option value="Putri">Putri</option>
              </select>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Tahun Pelajaran</label><input type="text" name="tahun" value={identitas.tahun} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>

          <div className="col-span-1 md:col-span-2 mt-4"><h3 className="font-bold text-slate-700 border-b pb-2">Identitas Penandatangan</h3></div>
          <div className="col-span-1 md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Tempat & Tanggal (Tanda Tangan)</label><input type="text" name="tempatTanggal" value={identitas.tempatTanggal} onChange={handleIdentitasChange} placeholder="Contoh: Sebatik, 15 Juli 2024" className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nama Kepala Sekolah</label><input type="text" name="kepalaSekolah" value={identitas.kepalaSekolah} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">NIP Kepala Sekolah</label><input type="text" name="nipKepalaSekolah" value={identitas.nipKepalaSekolah} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          
          <div className="mt-2"><label className="block text-sm font-medium text-slate-700 mb-1">Nama Guru BK (Putra)</label><input type="text" name="guru" value={identitas.guru} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="mt-2"><label className="block text-sm font-medium text-slate-700 mb-1">NIP Guru BK (Putra)</label><input type="text" name="nipGuru" value={identitas.nipGuru} onChange={handleIdentitasChange} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          
          <div className="mt-2"><label className="block text-sm font-medium text-slate-700 mb-1">Nama Guru BK (Putri)</label><input type="text" name="guruPutri" value={identitas.guruPutri || ''} onChange={handleIdentitasChange} placeholder="Kosongkan jika sama" className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="mt-2"><label className="block text-sm font-medium text-slate-700 mb-1">NIP Guru BK (Putri)</label><input type="text" name="nipGuruPutri" value={identitas.nipGuruPutri || ''} onChange={handleIdentitasChange} placeholder="Kosongkan jika sama" className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" /></div>
        </div>
        <button onClick={handleSaveIdentitas} className="mt-8 bg-blue-600 text-white px-6 py-2.5 font-bold rounded shadow hover:bg-blue-700"><Save className="w-4 h-4 inline mr-2"/> Simpan Perubahan</button>
      </div>
    );
  }

  function renderDataMasuk() {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in print-container">
        {renderKopSuratCetak("Laporan Data Masuk Siswa")}
        <div className="flex justify-between items-center mb-4 print-hide">
          <h2 className="text-xl font-bold text-slate-800 flex items-center"><Users className="w-5 h-5 mr-2 text-blue-600" /> Data Masuk Siswa</h2>
          <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-slate-700 flex items-center shadow-sm">
             <Printer className="w-4 h-4 mr-2" /> Cetak Data
          </button>
        </div>
        <div className="overflow-x-auto print-no-overflow rounded border border-slate-200 print-no-border">
          <table className="w-full text-[10pt] text-left whitespace-nowrap">
            <thead className="text-[10pt] font-bold text-slate-700 uppercase bg-slate-100 border-b border-black">
              <tr className="break-inside-avoid">
                <th className="px-4 py-3 border-r border-l border-black w-10">No</th>
                <th className="px-4 py-3 border-r border-black min-w-[200px]">Nama & NIS</th>
                {AKPD_QUESTIONS.map(q => <th key={q.id} className="px-1 py-3 text-center border-r border-black" title={q.text}>Q{q.id}</th>)}
                <th className="px-4 py-3 text-center border-r border-black print-hide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={AKPD_QUESTIONS.length + 3} className="px-4 py-8 text-center text-slate-500 border border-black">Belum ada data untuk kelas/pondok ini.</td></tr>
              ) : filteredStudents.map((student, index) => (
                <tr key={student.id} className="border-b border-black hover:bg-slate-50 break-inside-avoid">
                  <td className="px-4 py-3 text-center font-medium border-r border-l border-black">{index + 1}</td>
                  <td className="px-4 py-3 border-r border-black"><div className="font-semibold">{student.name}</div><div className="text-[9pt] text-slate-500">{student.noInduk} • {student.gender}</div></td>
                  {AKPD_QUESTIONS.map(q => (
                    <td key={q.id} className={`px-1 py-3 text-center border-r border-black ${student.answers && student.answers[q.id] ? 'bg-blue-50 print:bg-blue-100' : ''}`}>
                      {student.answers && student.answers[q.id] ? <span className="text-blue-600 font-bold">1</span> : <span className="text-slate-300">0</span>}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center print-hide border-r border-black"><button onClick={() => handleDeleteStudent(student.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4 mx-auto" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderTandaTanganCetak()}
      </div>
    );
  }

  function renderProfilKelas() {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in print-container">
        {renderKopSuratCetak("Laporan Analisis Profil Kelas (Butir Instrumen)")}
        <div className="flex justify-between items-center mb-4 print-hide">
          <h2 className="text-xl font-bold text-slate-800 flex items-center"><BarChart className="w-5 h-5 mr-2 text-blue-600" /> Profil Kelas (Analisis Butir)</h2>
          <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-slate-700 flex items-center shadow-sm">
             <Printer className="w-4 h-4 mr-2" /> Cetak Profil Kelas
          </button>
        </div>
        <div className="overflow-x-auto rounded border border-slate-200 print-no-border print-no-overflow">
          <table className="w-full text-[10pt] text-left border-collapse border-black">
            <thead className="bg-slate-100 border-b border-black text-[10pt] uppercase text-slate-700">
              <tr className="break-inside-avoid">
                <th className="px-4 py-3 w-16 text-center border-r border-black border-l">No</th>
                <th className="px-4 py-3 border-r border-black min-w-[300px]">Pernyataan Isu / Masalah</th>
                <th className="px-4 py-3 border-r border-black w-24">Bidang</th>
                <th className="px-4 py-3 text-center border-black w-24 border-r">Pemilih</th>
                <th className="px-4 py-3 text-center border-black w-32 border-r">% Kelas</th>
                <th className="px-4 py-3 text-center border-black border-r w-28">Prioritas</th>
              </tr>
            </thead>
            <tbody>
              {analisisKelas.map(item => (
                <tr key={item.id} className="border-b border-black hover:bg-slate-50 break-inside-avoid">
                  <td className="px-4 py-3 text-center font-medium border-r border-black border-l">{item.id}</td>
                  <td className="px-4 py-3 border-r border-black text-slate-800 leading-relaxed">{item.text}</td>
                  <td className="px-4 py-3 border-r border-black"><span className="text-[9pt] uppercase font-bold text-slate-500 print:text-black">{item.bidang}</span></td>
                  <td className="px-4 py-3 text-center font-bold border-r border-black">{item.count}</td>
                  <td className="px-4 py-3 text-center border-r border-black font-semibold">{item.percentage}%</td>
                  <td className="px-4 py-3 text-center border-r border-black">
                    <span className={`px-2 py-1 text-[9pt] rounded font-bold ${item.priority === 'TINGGI' ? 'bg-red-100 text-red-700 print:text-black' : item.priority === 'SEDANG' ? 'bg-orange-100 text-orange-700 print:text-black' : 'bg-slate-100 text-slate-600 print:text-black'}`}>
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderTandaTanganCetak()}
      </div>
    );
  }

  function renderProfilKonseli() {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in print-container">
        {renderKopSuratCetak("Laporan Analisis Profil Konseli (Individu)")}
        <div className="flex justify-between items-center mb-4 print-hide">
          <h2 className="text-xl font-bold text-slate-800 flex items-center"><UserCircle className="w-5 h-5 mr-2 text-blue-600" /> Profil Konseli / Individu</h2>
          <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-slate-700 flex items-center shadow-sm">
             <Printer className="w-4 h-4 mr-2" /> Cetak Profil Konseli
          </button>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded print-no-border print-no-overflow">
          <table className="w-full text-[10pt] text-left border-collapse border-black">
            <thead className="bg-slate-100 border-b border-black text-[10pt] uppercase text-slate-700">
              <tr className="break-inside-avoid">
                <th className="px-4 py-3 text-center w-16 border-r border-black border-l">No</th>
                <th className="px-4 py-3 border-r border-black">Identitas Siswa</th>
                <th className="px-4 py-3 text-center border-r border-black w-32">Total Masalah</th>
                <th className="px-4 py-3 text-center border-r border-black w-32">% Kebutuhan</th>
                <th className="px-4 py-3 w-64 border-r border-black">Intensitas Masalah</th>
              </tr>
            </thead>
            <tbody>
              {analisisKonseli.map((s, idx) => (
                <tr key={s.id} className="border-b border-black hover:bg-slate-50 break-inside-avoid">
                  <td className="px-4 py-3 text-center border-r border-black border-l">{idx + 1}</td>
                  <td className="px-4 py-3 border-r border-black"><div className="font-semibold text-slate-800">{s.name}</div><div className="text-[9pt] text-slate-500">{s.noInduk}</div></td>
                  <td className="px-4 py-3 text-center font-bold text-slate-700 border-r border-black print:text-black">{s.totalMasalah}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-700 border-r border-black print:text-black">{s.percentage}%</td>
                  <td className="px-4 py-3 border-r border-black">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-300 print:border-black">
                        <div className={`h-full ${parseFloat(s.percentage) > 50 ? 'bg-red-500 print:bg-slate-800' : parseFloat(s.percentage) > 20 ? 'bg-orange-400 print:bg-slate-500' : 'bg-green-500 print:bg-slate-300'}`} style={{width: `${s.percentage}%`}}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderTandaTanganCetak()}
      </div>
    );
  }

  function renderDeskripsiKebutuhan() {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in print-container">
        {renderKopSuratCetak("Rumusan Deskripsi Kebutuhan & Topik RPL")}
        <div className="flex justify-between items-center mb-4 print-hide">
          <h2 className="text-xl font-bold text-slate-800 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-600" /> Deskripsi Kebutuhan & Topik RPL</h2>
          <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-slate-700 flex items-center shadow-sm">
             <Printer className="w-4 h-4 mr-2" /> Cetak Rumusan
          </button>
        </div>
        <div className="overflow-x-auto rounded border border-slate-200 print-no-border print-no-overflow">
           <table className="w-full text-[10pt] text-left border-collapse border-black">
            <thead className="bg-slate-100 text-slate-800 border-b border-black text-[10pt] uppercase">
              <tr className="break-inside-avoid">
                <th className="px-4 py-3 w-24 text-center border-r border-l border-black">Prioritas</th>
                <th className="px-4 py-3 border-r border-black w-1/4">Masalah Ditemukan</th>
                <th className="px-4 py-3 border-r border-black">Rumusan Kebutuhan (AI)</th>
                <th className="px-4 py-3 border-r border-black">Topik RPL / Materi</th>
                <th className="px-4 py-3 w-32 text-center border-r border-black">Rekomendasi Layanan</th>
              </tr>
            </thead>
            <tbody>
              {prioritasKebutuhan.map(item => {
                const aiData = AI_FORMULATION[item.id] || { rumusan: '-', topik: '-', layanan: '-' };
                return (
                  <tr key={item.id} className="border-b border-black hover:bg-slate-50 break-inside-avoid">
                    <td className="px-4 py-3 text-center border-r border-l border-black align-top font-bold text-slate-600 print:text-black">{item.priority}<br/><span className="text-[9pt] text-slate-400 print:text-black">{item.percentage}%</span></td>
                    <td className="px-4 py-3 border-r border-black text-slate-700 align-top print:text-black">{item.text}</td>
                    <td className="px-4 py-3 border-r border-black text-blue-900 font-medium align-top print:text-black">{aiData.rumusan}</td>
                    <td className="px-4 py-3 border-r border-black align-top font-bold text-slate-800">{aiData.topik}</td>
                    <td className="px-4 py-3 text-center border-r border-black align-top text-[10pt] font-semibold">{aiData.layanan}</td>
                  </tr>
                );
              })}
            </tbody>
           </table>
        </div>
        {renderTandaTanganCetak()}
      </div>
    );
  }

  function renderKomponenProgram() {
    const grouped = { "Layanan Dasar": [], "Layanan Responsif": [], "Peminatan & Perencanaan Individual": [], "Dukungan Sistem": [{ id: 'ds1', topik: 'Administrasi BK' }] };
    prioritasKebutuhan.forEach(item => {
      const aiData = AI_FORMULATION[item.id] || { layanan: 'Layanan Dasar', topik: 'Topik Umum' };
      let comp = "Layanan Dasar";
      if (item.bidang === BIDANG.KARIR) comp = "Peminatan & Perencanaan Individual";
      else if (aiData.layanan.includes("Konseling Individu") || item.priority === "TINGGI") comp = "Layanan Responsif";
      grouped[comp].push({ id: item.id, topik: aiData.topik, layanan: aiData.layanan });
    });
    const dataKomponen = Object.keys(grouped).map(key => {
      const items = grouped[key];
      const jumlah = items.length;
      return { komponen: key, items, jumlah, jp: jumlah * 2 };
    }).filter(g => g.jumlah > 0);

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in print-container">
        {renderKopSuratCetak("Komponen Program Bimbingan & Konseling")}
        <div className="flex justify-between items-center mb-4 print-hide">
          <h2 className="text-xl font-bold text-slate-800 flex items-center"><Layers className="w-5 h-5 mr-2 text-blue-600" /> Komponen Program BK</h2>
          <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-slate-700 flex items-center shadow-sm">
             <Printer className="w-4 h-4 mr-2" /> Cetak Komponen
          </button>
        </div>
        <div className="overflow-x-auto rounded border border-slate-200 print-no-border print-no-overflow">
           <table className="w-full text-[10pt] text-left border-collapse border-black">
            <thead className="bg-slate-100 text-slate-800 border-b border-black text-[10pt] uppercase">
              <tr className="break-inside-avoid">
                <th className="px-4 py-3 w-16 text-center border-r border-l border-black">No</th>
                <th className="px-4 py-3 border-r border-black w-56">Komponen Program</th>
                <th className="px-4 py-3 border-r border-black">Materi / Topik Kegiatan</th>
                <th className="px-4 py-3 w-24 text-center border-r border-black">Jml Layanan</th>
                <th className="px-4 py-3 w-28 text-center border-r border-black">Waktu / JP</th>
              </tr>
            </thead>
            <tbody>
              {dataKomponen.map((comp, idx) => (
                comp.items.map((item, itemIdx) => (
                  <tr key={item.id} className="border-b border-black hover:bg-slate-50 break-inside-avoid">
                    {itemIdx === 0 && <td rowSpan={comp.items.length} className="px-4 py-3 text-center border-r border-l border-black align-top font-bold text-slate-500 print:text-black">{idx + 1}</td>}
                    {itemIdx === 0 && <td rowSpan={comp.items.length} className="px-4 py-3 border-r border-black align-top font-bold text-blue-900 bg-slate-50 print:text-black">{comp.komponen}</td>}
                    <td className="px-4 py-3 border-r border-black text-slate-700 print:text-black">• {item.topik}</td>
                    {itemIdx === 0 && <td rowSpan={comp.items.length} className="px-4 py-3 text-center border-r border-black align-top font-bold bg-slate-50">{comp.jumlah}</td>}
                    {itemIdx === 0 && <td rowSpan={comp.items.length} className="px-4 py-3 text-center border-r border-black align-top font-bold bg-slate-50">{comp.jp} JP</td>}
                  </tr>
                ))
              ))}
            </tbody>
           </table>
        </div>
        {renderTandaTanganCetak()}
      </div>
    );
  }

  function renderActionPlan() {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in print-container">
        {renderKopSuratCetak("Action Plan (Rencana Kegiatan BK)")}
        <div className="flex justify-between items-center mb-4 print-hide">
           <h2 className="text-xl font-bold text-slate-800 flex items-center"><ClipboardList className="w-5 h-5 mr-2 text-blue-600" /> Action Plan & Cetak Paket Layanan</h2>
           <div className="flex gap-2">
             <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-slate-700 flex items-center shadow-sm">
                 <Printer className="w-4 h-4 mr-2" /> Cetak Action Plan
             </button>
             <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center"><Wand2 className="w-3 h-3 mr-1"/> Full AI Bundle Ready</span>
           </div>
        </div>
        <p className="text-sm text-slate-500 mb-4 print-hide">Klik tombol <b>"Cetak RPL Lengkap"</b> untuk membuat dokumen otomatis yang berisi <b>RPL Utama, Materi Layanan, LKPD, dan Instrumen Penilaian</b> dalam satu file PDF siap cetak.</p>
        
        <div className="overflow-x-auto rounded border border-slate-300 shadow-sm print-no-border print-no-overflow">
           <table className="w-full text-[10pt] text-left border-collapse border-black">
            <thead className="bg-slate-100 text-slate-800 border-b border-black text-[10pt] uppercase">
              <tr className="break-inside-avoid">
                <th className="px-3 py-3 text-center border-r border-l border-black w-12">NO</th>
                <th className="px-3 py-3 border-r border-black min-w-[200px]">TUJUAN LAYANAN</th>
                <th className="px-3 py-3 border-r border-black min-w-[150px]">KOMPONEN LAYANAN</th>
                <th className="px-3 py-3 border-r border-black min-w-[200px]">MATERI / TOPIK</th>
                <th className="px-3 py-3 border-r border-black min-w-[150px] text-center print-hide">AKSI AI</th>
              </tr>
            </thead>
            <tbody className="text-[10pt]">
              {prioritasKebutuhan.map((item, idx) => {
                const baseAiData = AI_FORMULATION[item.id] || { layanan: 'Bimbingan Klasikal', topik: 'Topik Umum', rumusan: 'Rumusan Umum' };
                const aiActionData = generateActionPlanData(item.id, item.bidang, baseAiData.layanan, baseAiData.topik);
                let komponen = item.bidang === BIDANG.KARIR ? "Peminatan" : (baseAiData.layanan.includes("Konseling Individu") || item.priority === "TINGGI" ? "Responsif" : "Layanan Dasar");
                return (
                  <tr key={item.id} className="bg-white border-b border-black hover:bg-slate-50 align-top break-inside-avoid">
                    <td className="px-3 py-3 text-center border-r border-l border-black font-bold">{idx + 1}</td>
                    <td className="px-3 py-3 border-r border-black text-slate-700 print:text-black">{aiActionData.tujuan}</td>
                    <td className="px-3 py-3 border-r border-black font-semibold text-blue-700 print:text-black">
                      {komponen} <br/><span className="text-[9pt] text-slate-500 font-normal print:text-slate-700">({baseAiData.layanan})</span>
                    </td>
                    <td className="px-3 py-3 border-r border-black font-bold text-blue-900 print:text-black">{baseAiData.topik}</td>
                    <td className="px-3 py-3 text-center align-middle border-r border-black print-hide">
                      <button 
                        onClick={() => generateRPL(item)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded shadow text-[10px] font-bold inline-flex items-center justify-center w-full"
                      >
                         <Printer className="w-3 h-3 mr-1" /> Cetak RPL Lengkap
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
           </table>
        </div>
        {renderTandaTanganCetak()}
      </div>
    );
  }

  function renderProta() {
    const months = ["Juli", "Agustus", "September", "Oktober", "November", "Desember", "Januari", "Februari", "Maret", "April", "Mei", "Juni"];
    
    const renderWeeks = (rowId, isTextSpan = false, textSpanContent = "") => {
      if (isTextSpan) {
          return (
              <td colSpan={48} className="border border-slate-300 border-black px-3 italic text-slate-600 bg-slate-50 font-semibold text-[9pt] print:text-[8pt] text-left align-middle print:h-[14px]">
                  {textSpanContent}
              </td>
          );
      }

      return Array.from({length: 48}).map((_, i) => {
          const isMarked = scheduleMarks[`${rowId}-${i}`];
          let bgClass = isMarked ? 'bg-[#3b82f6] text-white font-bold print:text-white print:bg-slate-600 print:print-color-adjust:exact -webkit-print-color-adjust:exact' : '';
          return (
              <td key={i} onClick={() => toggleScheduleMark(rowId, i)} className={`border border-slate-300 border-black text-center text-[9pt] print:text-[8pt] print:h-[14px] cursor-pointer hover:bg-blue-200 transition-colors ${bgClass}`}>
                {isMarked ? 'X' : ''}
              </td>
          );
      });
    };

    const renderSectionHeader = (no, title, bgClass) => (
        <tr className={`section-row ${bgClass} break-inside-avoid`}>
            <td className="text-center italic font-normal print:text-black border border-black">{no}</td>
            <td className="col-kegiatan text-white print:text-black border border-black">{title}</td>
            {Array.from({length: 48}).map((_, i) => (
                <td key={`sec-${title}-${i}`} className="border border-black p-0"></td>
            ))}
        </tr>
    );

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in print-container">
        {renderKopSuratCetak("Program Tahunan (Prota) - Bimbingan dan Konseling", true)}
        <div className="flex justify-between items-center mb-6 print-hide">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center"><CalendarDays className="w-5 h-5 mr-2 text-blue-600"/> Program Tahunan (Prota) - Matriks Jadwal Kegiatan</h2>
            <p className="text-slate-500 text-sm mt-1">Sesuai format resmi PDF. Klik kotak untuk mengisi jadwal. <strong className="text-blue-600 font-semibold">Tabel ini terhubung ke Program Semester.</strong></p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowHolidayModal(true)} className="flex items-center text-sm font-bold bg-red-50 text-red-600 px-4 py-2.5 rounded shadow hover:bg-red-100 transition-colors border border-red-200">
              <CalendarDays className="w-4 h-4 mr-2" /> Atur Hari Libur
            </button>
            <button onClick={autoGenerateSchedule} className="flex items-center text-sm font-bold bg-blue-600 text-white px-4 py-2.5 rounded shadow hover:bg-blue-700 transition-colors">
              <Wand2 className="w-4 h-4 mr-2" /> Auto-Generate Jadwal
            </button>
            <button onClick={() => window.print()} className="flex items-center text-sm font-bold bg-slate-800 text-white px-4 py-2.5 rounded shadow hover:bg-slate-700 transition-colors">
              <Printer className="w-4 h-4 mr-2" /> Cetak Prota
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-slate-300 shadow-sm pb-4 custom-scrollbar print-no-border print-no-overflow">
          <style>{`
            .gantt-table { width: 100%; border-collapse: collapse; table-layout: fixed; min-width: 1400px; }
            @media print { 
              .gantt-table { min-width: 100%; font-size: 8px !important; line-height: 1.1 !important; margin-bottom: 0 !important; border: 1px solid black !important; } 
              .col-kegiatan { width: 220px !important; font-size: 8.5px !important; white-space: normal !important; line-height: 1.1 !important; padding: 2px 4px !important;} 
              .week-header { width: auto !important; font-size: 6px !important; height: 14px !important; padding: 0 !important;} 
              .gantt-table th, .gantt-table td { height: 14px !important; padding: 0 !important; border: 1px solid black !important; overflow: hidden !important; }
              .gantt-table .col-no, .gantt-table .col-kegiatan { overflow: hidden !important; }
              .month-header { height: 14px !important; font-size: 8px !important; padding: 0 !important;}
              .section-row td { height: 15px !important; font-size: 8px !important; padding: 1px 4px !important; }
              .col-no { width: 20px !important; }
            }
            .gantt-table th, .gantt-table td { border: 1px solid black !important; height: 26px; white-space: nowrap; overflow: visible; }
            .gantt-table .col-no { width: 30px; text-align: center; overflow: hidden; }
            .gantt-table .col-kegiatan { width: 280px; text-align: left; padding-left: 10px; font-size: 11px; font-weight: 600; color: #334155; overflow: hidden; white-space: normal; line-height: 1.2; }
            .gantt-table .month-header { background-color: #1e3a8a; color: #ffffff; font-size: 11px; text-align: center; }
            .gantt-table .week-header { background-color: #f1f5f9; color: #475569; font-size: 10px; text-align: center; font-weight: bold; width: 20px;}
            .gantt-table .section-row td { background-color: #e2e8f0; color: #0f172a; font-weight: 700; font-size: 11px; text-align: left; padding-left: 12px; text-transform: uppercase; }
            .gantt-table .section-blue { background-color: #0070c0 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
            .gantt-table .section-green { background-color: #00b050 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
            .gantt-table .section-l-green { background-color: #92d050 !important; color: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
          `}</style>
          
          <div className="text-center mb-6 mt-2 print-hide">
            <h2 className="font-bold text-xl uppercase tracking-wide text-slate-800">Jadwal Kegiatan Bimbingan dan Konseling</h2>
            <h2 className="font-bold text-lg uppercase text-slate-700">{identitas.sekolah}</h2>
            <p className="font-semibold text-sm uppercase text-slate-500">Tahun Pelajaran {identitas.tahun}</p>
          </div>

          <table className="gantt-table mt-4 border-t-0 break-inside-avoid">
            <thead>
              <tr>
                <th rowSpan="2" className="col-no bg-slate-100 border-black print:text-black print:bg-slate-200">No</th>
                <th rowSpan="2" className="col-kegiatan bg-slate-100 border-black print:text-black print:bg-slate-200">Komponen & Kegiatan Layanan</th>
                {months.map(m => (<th key={m} colSpan="4" className={`month-header border-black print:text-black print:bg-slate-300 print:-webkit-print-color-adjust:exact ${m === 'Juli' || m === 'Januari' ? 'bg-[#f97316]' : 'bg-[#1e3a8a]'}`}>{m}</th>))}
              </tr>
              <tr>{Array(12).fill(0).map((_, mi) => Array(4).fill(0).map((_, wi) => (<th key={`${mi}-${wi}`} className="week-header border-black print:text-black print:bg-slate-100">{wi + 1}</th>)))}</tr>
            </thead>
            <tbody>
              {/* HOLIDAY ROW DENGAN MERGE CELL HORIZONTAL */}
              <tr className="h-10 print:h-[20px] border-b-2 border-black break-inside-avoid bg-slate-50 print:bg-slate-100">
                  <td colSpan="2" className="border-r border-black print:border-black text-right pr-3 font-bold text-[10px] print:text-[8px] uppercase align-middle text-slate-500 print:text-black">
                      
                  </td>
                  {weekGroups.map(group => {
                      if (group.type === 'holiday') {
                          return (
                              <td key={`head-hol-${group.index}`} colSpan={group.span} className="border border-black bg-red-500 print:bg-red-500 print:print-color-adjust:exact -webkit-print-color-adjust:exact align-middle p-0 text-center">
                                  <div className="w-full h-full flex items-center justify-center overflow-hidden px-1">
                                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[9px] print:text-[6.5pt] font-bold text-white print:text-white uppercase tracking-wider drop-shadow-sm">
                                          {group.text}
                                      </span>
                                  </div>
                              </td>
                          );
                      } else {
                          return <td key={`head-work-${group.index}`} className="border border-black bg-slate-50 print:bg-slate-100"></td>;
                      }
                  })}
              </tr>

              {renderSectionHeader('1', 'PERSIAPAN', 'section-blue print:!bg-slate-400')}
              <tr className="break-inside-avoid"><td className="text-center text-xs border border-black"></td><td className="col-kegiatan border border-black">Pembagian tugas guru bimbingan dan konseling/konselor</td>{renderWeeks('prep1')}</tr>
              <tr className="break-inside-avoid"><td className="text-center text-xs border border-black"></td><td className="col-kegiatan border border-black">Assesmen kebutuhan (Angket Masalah Siswa)</td>{renderWeeks('prep2')}</tr>
              <tr className="break-inside-avoid"><td className="text-center text-xs border border-black"></td><td className="col-kegiatan border border-black">Menyusun program bimbingan dan konseling</td>{renderWeeks('prep3')}</tr>
              <tr className="break-inside-avoid"><td className="text-center text-xs border border-black"></td><td className="col-kegiatan border border-black">Konsultasi program bimbingan dan konseling</td>{renderWeeks('prep4')}</tr>
              <tr className="break-inside-avoid"><td className="text-center text-xs border border-black"></td><td className="col-kegiatan border border-black">Pengadaan sarana / prasarana BK</td>{renderWeeks('prep5')}</tr>
              
              {renderSectionHeader('2', 'PELAKSANAAN', 'section-green print:!bg-slate-400')}
              {renderSectionHeader('', 'LAYANAN DASAR', 'section-l-green print:!bg-slate-300')}
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Bimbingan Klasikal</td>{renderWeeks('dasar1')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Bimbingan Kelas Besar/Lintas Kelas</td>{renderWeeks('dasar2')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Bimbingan Kelompok</td>{renderWeeks('dasar3')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Pengembangan Media BK</td>{renderWeeks('dasar4')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Papan Bimbingan</td>{renderWeeks('dasar5')}</tr>
              
              {renderSectionHeader('', 'LAYANAN RESPONSIF', 'bg-[#ffff00] print:!bg-slate-300 text-black')}
              {/* Responsive Services di-MERGE CELL secara mendatar sesuai instruksi */}
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Konseling Individual</td>{renderWeeks('resp1', true, "Disesuaikan secara fleksibel sepanjang semester")}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Konseling Kelompok</td>{renderWeeks('resp2', true, "Disesuaikan secara fleksibel sepanjang semester")}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Referal (Alih Tangan Kasus)</td>{renderWeeks('resp3', true, "Disesuaikan secara fleksibel sepanjang semester")}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Bimbingan Teman Sebaya</td>{renderWeeks('resp4', true, "Disesuaikan secara fleksibel sepanjang semester")}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Konferensi Kasus</td>{renderWeeks('resp5', true, "Disesuaikan secara fleksibel sepanjang semester")}</tr>

              {renderSectionHeader('', 'PEMINATAN DAN PERENCANAAN INDIVIDUAL', 'bg-purple-200 print:!bg-slate-300 text-black')}
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Bimbingan Klasikal Peminatan</td>{renderWeeks('pem1')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Konseling Karir</td>{renderWeeks('pem2')}</tr>

              {renderSectionHeader('', 'DUKUNGAN SISTEM', 'bg-[#daeef3] print:!bg-slate-300 text-black')}
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Pengembangan Jejaring</td>{renderWeeks('duk1')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Kegiatan Manajemen BK</td>{renderWeeks('duk2')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Pengembangan Staf</td>{renderWeeks('duk3')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Kunjungan Rumah</td>{renderWeeks('duk4')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Kolaborasi</td>{renderWeeks('duk6')}</tr>
              <tr className="break-inside-avoid"><td className="text-center border border-black"></td><td className="col-kegiatan italic font-normal border border-black">Pengembangan Profesi Konselor</td>{renderWeeks('duk5')}</tr>

              {renderSectionHeader('3', 'AKUNTABILITAS & PELAPORAN', 'bg-slate-300 print:!bg-slate-400 text-black')}
              <tr className="break-inside-avoid"><td className="text-center text-xs border border-black"></td><td className="col-kegiatan border border-black">Evaluasi Proses</td>{renderWeeks('akun1')}</tr>
              <tr className="break-inside-avoid"><td className="text-center text-xs border border-black"></td><td className="col-kegiatan border border-black">Evaluasi Hasil</td>{renderWeeks('akun4')}</tr>
              <tr className="break-inside-avoid"><td className="text-center text-xs border border-black"></td><td className="col-kegiatan border border-black">Supervisi BK</td>{renderWeeks('akun2')}</tr>
              <tr className="break-inside-avoid"><td className="text-center text-xs border border-black"></td><td className="col-kegiatan border border-black">Pembuatan Laporan</td>{renderWeeks('akun3')}</tr>
              
              {/* HOLIDAY ROWS SECTION AT THE BOTTOM */}
              {holidays.length > 0 && renderSectionHeader('', 'AGENDA / HARI LIBUR NASIONAL', 'bg-red-100 print:!bg-red-200 text-red-800')}
              {holidays.map((h, idx) => {
                 const activeWeeks = getHolidayWeeks(h);
                 const cells = [];
                 let i = 0;
                 while (i < 48) {
                     if (activeWeeks.has(i)) {
                         let span = 1;
                         while(i + span < 48 && activeWeeks.has(i + span)) {
                             span++;
                         }
                         cells.push(
                            <td key={i} colSpan={span} className="bg-red-500 print:bg-red-500 print:print-color-adjust:exact -webkit-print-color-adjust:exact text-center border border-black p-0 align-middle">
                               <div className="w-full flex items-center justify-center overflow-hidden px-1">
                                   <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[9px] print:text-[7pt] font-bold text-white print:text-white uppercase drop-shadow-sm">
                                       {h.desc}
                                   </span>
                               </div>
                            </td>
                         );
                         i += span;
                     } else {
                         cells.push(<td key={i} className="border border-slate-300 border-black print:h-[14px]"></td>);
                         i++;
                     }
                 }
                 return (
                     <tr key={h.id} className="break-inside-avoid h-8 print:h-[18px]">
                         <td className="text-center border border-black print:text-black"></td>
                         <td className="col-kegiatan border border-black print:text-black italic">{h.desc}</td>
                         {cells}
                     </tr>
                 );
              })}

            </tbody>
          </table>

          {renderTandaTanganCetak(true)}
        </div>
      </div>
    );
  }

  function renderPromes() {
    const promesRows = prioritasKebutuhan.map((item, index) => {
      const baseAiData = AI_FORMULATION[item.id] || { layanan: '', topik: '', rowId: '' };
      let komponen = item.bidang === BIDANG.KARIR ? "Peminatan" : (baseAiData.layanan.includes("Konseling Individu") || item.priority === "TINGGI" ? "Layanan Responsif" : "Layanan Dasar");
      
      const activeMonthsGanjil = new Set();
      const activeMonthsGenap = new Set();
      const rId = baseAiData.rowId; 
      
      if (rId) {
          for (let i = 0; i < 48; i++) {
              if (scheduleMarks[`${rId}-${i}`]) {
                  const month = getMonthFromWeek(i);
                  if (i < 24) activeMonthsGanjil.add(month);
                  else activeMonthsGenap.add(month);
              }
          }
      }
      
      return {
        id: item.id, no: index + 1, komponen, materi: baseAiData.topik, 
        waktuGanjil: Array.from(activeMonthsGanjil).join(', '),
        waktuGenap: Array.from(activeMonthsGenap).join(', ')
      };
    }).filter(row => row.waktuGanjil !== "" || row.waktuGenap !== ""); 

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in print-container">
        {renderKopSuratCetak("Program Semester (Promes) Bimbingan & Konseling", true)}
        <div className="flex justify-between items-start mb-6 print-hide">
           <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-600" /> Program Semester (Promes) Rincian</h2>
              <p className="text-slate-500 text-sm mt-1">Rincian topik pelayanan semesteran yang terekstrak otomatis dari pengisian matriks Program Tahunan.</p>
           </div>
           <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-slate-700 flex items-center shadow-sm">
               <Printer className="w-4 h-4 mr-2" /> Cetak Promes
           </button>
        </div>
        <div className="overflow-x-auto rounded border border-slate-200 print-no-border print-no-overflow">
           <table className="w-full text-[10pt] text-left border-collapse border-black">
            <thead className="bg-slate-100 text-slate-700 text-[10pt] uppercase border-b border-black">
              <tr className="break-inside-avoid">
                <th className="px-4 py-3 text-center border-r border-l border-black w-12">No</th>
                <th className="px-4 py-3 border-r border-black w-40">Komponen Layanan</th>
                <th className="px-4 py-3 border-r border-black min-w-[200px]">Topik / Materi Layanan</th>
                <th className="px-4 py-3 min-w-[150px] font-bold text-orange-800 bg-orange-50 border-r border-black text-center print:text-black">Smt Ganjil (Jul-Des)</th>
                <th className="px-4 py-3 min-w-[150px] font-bold text-green-800 bg-green-50 border-r border-black text-center print:text-black">Smt Genap (Jan-Jun)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[10pt]">
              {promesRows.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500 italic border-l border-r border-b border-black">Belum ada layanan yang dijadwalkan. Silakan atur matriks di menu Program Tahunan (Prota).</td></tr>
              ) : promesRows.map((row, idx) => (
                <tr key={row.id} className="bg-white hover:bg-slate-50 transition-colors align-top border-b border-black break-inside-avoid">
                  <td className="px-4 py-3 text-center border-r border-l border-black font-bold text-slate-500 print:text-black">{idx + 1}</td>
                  <td className="px-4 py-3 border-r border-black font-semibold text-slate-700 print:text-black">{row.komponen}</td>
                  <td className="px-4 py-3 border-r border-black font-bold text-blue-900 bg-slate-50 print:text-black">{row.materi}</td>
                  <td className="px-4 py-3 text-center font-semibold text-orange-700 bg-orange-50/50 border-r border-black leading-relaxed print:text-black">{row.waktuGanjil || '-'}</td>
                  <td className="px-4 py-3 text-center font-semibold text-green-700 bg-green-50/50 border-r border-black leading-relaxed print:text-black">{row.waktuGenap || '-'}</td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
        {renderTandaTanganCetak(true)}
      </div>
    );
  }

  function renderAdminScreen() {
    return (
      <div className="min-h-screen flex bg-[#f4f6f9] text-slate-800 font-sans">
        
        {/* CSS GLOBAL KHUSUS PRINT */}
        <style>{`
          .print-only { display: none; }
          .print-flex-only { display: none; }
          @media print {
            @page { size: ${activeTab === 'prota' || activeTab === 'promes' ? 'A4 landscape' : 'A4 portrait'}; margin: 1cm; }
            body * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print-only { display: block !important; }
            .print-flex-only { display: flex !important; }
            .print-hide { display: none !important; }
            .print-no-overflow { overflow: visible !important; }
            .print-no-border { border: none !important; box-shadow: none !important; }
            aside, header.top-nav { display: none !important; }
            .ml-64 { margin-left: 0 !important; }
            main { padding: 0 !important; margin: 0 !important; overflow: visible !important; height: auto !important; }
            body, html, #root { height: auto !important; overflow: visible !important; background-color: white !important; }
            ${rplData ? `
              .main-wrapper-content { display: none !important; }
            ` : `
              body { background-color: white !important; }
              .bg-[#f4f6f9] { background-color: white !important; }
            `}
            .break-before-page { page-break-before: always; break-before: page; display: block; width: 100%; }
            .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
            .break-inside-avoid-page { break-inside: avoid-page; page-break-inside: avoid; }
            table { page-break-inside: auto; }
            tr, td, th { page-break-inside: avoid; break-inside: avoid; }
          }
        `}</style>

        {/* SIDEBAR */}
        <aside className="w-64 bg-[#002147] text-slate-300 flex flex-col fixed h-full z-30 shadow-xl transition-all duration-300 print-hide">
          <div className="h-16 flex items-center justify-center border-b border-white/10 bg-[#001833]">
            <BrandLogo className="w-7 h-7 mr-2" />
            <h1 className="text-xl font-bold text-white tracking-wide">E-AKPD<span className="text-blue-400"> SMA</span></h1>
          </div>

          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-400 overflow-hidden flex items-center justify-center flex-shrink-0">
               <User className="w-6 h-6 text-slate-500" />
            </div>
            <div className="overflow-hidden">
               <div className="font-bold text-white text-sm truncate">{identitas.guru}</div>
               <div className="text-[11px] text-green-400 flex items-center gap-1 mt-0.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online - Admin</div>
            </div>
          </div>

          <nav className="flex-1 mt-4 space-y-1 px-3 overflow-y-auto custom-scrollbar pb-4">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 px-2 mt-2">Data & Analisis</div>
            {[
              { id: 'home', label: 'Beranda', icon: LayoutDashboard },
              { id: 'identitas', label: 'Tahun Ajaran & Identitas', icon: CalendarDays },
              { id: 'data', label: 'Data Masuk Siswa', icon: Users },
              { id: 'kelas', label: 'Profil Kelas', icon: BarChart },
              { id: 'siswa', label: 'Profil Konseli', icon: UserCircle },
              { id: 'deskripsi', label: 'Deskripsi Kebutuhan', icon: FileText },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${activeTab === tab.id ? 'bg-[#007bff] text-white shadow-sm font-medium' : 'hover:bg-white/10 hover:text-white'}`}>
                <tab.icon className={`w-4 h-4 mr-3 shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} /> {tab.label}
              </button>
            ))}

            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 px-2 mt-6">Penyusunan Program</div>
            {[
              { id: 'komponen', label: 'Komponen Program', icon: Layers },
              { id: 'actionplan', label: 'Action Plan (RPL)', icon: ClipboardList },
              { id: 'prota', label: 'Program Tahunan (Prota)', icon: CalendarDays },
              { id: 'promes', label: 'Program Semester (Promes)', icon: Calendar },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${activeTab === tab.id ? 'bg-[#007bff] text-white shadow-sm font-medium' : 'hover:bg-white/10 hover:text-white'}`}>
                <tab.icon className={`w-4 h-4 mr-3 shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} /> {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/80 rounded transition-colors"><LogOut className="w-4 h-4 mr-2" /> Logout</button>
          </div>
        </aside>

        {/* MAIN CONTENT WRAPPER */}
        <div className="ml-64 flex-1 flex flex-col min-h-screen overflow-hidden print:ml-0 print:overflow-visible">
          <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-6 z-20 sticky top-0 top-nav print-hide">
            <div className="flex items-center">
              <Menu className="w-5 h-5 text-slate-500 mr-4 cursor-pointer hover:text-slate-700" />
              <h2 className="font-semibold text-slate-700 text-lg uppercase tracking-wide">
                {activeTab === 'home' && 'Beranda Utama'}
                {activeTab === 'identitas' && 'Tahun Ajaran & Identitas'}
                {activeTab === 'data' && 'Data Masuk Siswa'}
                {activeTab === 'kelas' && 'Profil Kelas'}
                {activeTab === 'siswa' && 'Profil Konseli'}
                {activeTab === 'deskripsi' && 'Deskripsi Kebutuhan'}
                {activeTab === 'komponen' && 'Komponen Program'}
                {activeTab === 'actionplan' && 'Action Plan (RPL)'}
                {activeTab === 'prota' && 'Program Tahunan (Prota)'}
                {activeTab === 'promes' && 'Program Semester (Promes)'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
               <button className="relative text-slate-500 hover:text-slate-700">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border-2 border-white">3</span>
               </button>
               <div className="h-8 w-px bg-slate-200 mx-2"></div>
               <div className="flex items-center gap-2 cursor-pointer">
                  <div className="text-right hidden sm:block">
                     <div className="text-sm font-bold text-slate-700 leading-tight">Admin BK</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                     <User className="w-4 h-4 text-blue-600" />
                  </div>
               </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto relative print:p-0 print:overflow-visible">
             <div className={`max-w-[1400px] mx-auto main-wrapper-content`}>
                {activeTab === 'home' && renderBeranda()}
                {activeTab === 'identitas' && renderIdentitasForm()}
                {activeTab === 'data' && renderDataMasuk()}
                {activeTab === 'kelas' && renderProfilKelas()}
                {activeTab === 'siswa' && renderProfilKonseli()}
                {activeTab === 'deskripsi' && renderDeskripsiKebutuhan()}
                {activeTab === 'komponen' && renderKomponenProgram()}
                {activeTab === 'actionplan' && renderActionPlan()}
                {activeTab === 'prota' && renderProta()}
                {activeTab === 'promes' && renderPromes()}
             </div>
             
             {renderRplModal()}
             {renderHolidayModal()}
             
          </main>
        </div>
      </div>
    );
  }

  function renderLoginScreen() {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-slate-100">
          <div className="bg-[#002147] p-8 text-center text-white relative flex flex-col items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full"></div>
            <BrandLogo className="w-12 h-12 mb-3 drop-shadow-md" />
            <h1 className="text-2xl font-bold mb-1">E-AKPD SMA</h1>
            <p className="text-blue-200 text-sm">Sistem Rekomendasi Peminatan & BK</p>
          </div>
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button className={`flex-1 py-3.5 text-sm font-bold transition-colors ${loginType === 'siswa' ? 'bg-white text-[#007bff] border-b-2 border-[#007bff]' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setLoginType('siswa')}>Login Siswa</button>
            <button className={`flex-1 py-3.5 text-sm font-bold transition-colors ${loginType === 'admin' ? 'bg-white text-[#007bff] border-b-2 border-[#007bff]' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setLoginType('admin')}>Login Admin BK</button>
          </div>
          <div className="p-8">
            {loginType === 'siswa' ? (
              <form onSubmit={e => { e.preventDefault(); loginUser({role:'siswa', data:{...siswaForm, answers:{}}}); }} className="space-y-4">
                <div className="relative group">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Nama Lengkap</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-focus-within:bg-blue-600 group-focus-within:text-white transition-all duration-300"><User className="w-5 h-5" /></div>
                    <input required type="text" className="w-full pl-14 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-700 text-sm" placeholder="Masukkan nama..." value={siswaForm.name} onChange={e => setSiswaForm({...siswaForm, name: e.target.value})} />
                  </div>
                </div>
                <div className="relative group">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Nomor Induk / NIS</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-focus-within:bg-blue-600 group-focus-within:text-white transition-all duration-300"><GraduationCap className="w-5 h-5" /></div>
                    <input required type="text" className="w-full pl-14 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-700 text-sm" placeholder="Contoh: 2117.001" value={siswaForm.noInduk} onChange={e => setSiswaForm({...siswaForm, noInduk: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative group">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Kelas</label>
                      <select required className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-700 text-sm" value={siswaForm.kelas || 'X-A'} onChange={e => setSiswaForm({...siswaForm, kelas: e.target.value})}>
                          <option value="X-A">X-A</option><option value="X-B">X-B</option><option value="X-C">X-C</option>
                          <option value="XI-A">XI-A</option><option value="XI-B">XI-B</option><option value="XI-C">XI-C</option>
                          <option value="XII-A">XII-A</option><option value="XII-B">XII-B</option><option value="XII-C">XII-C</option>
                      </select>
                    </div>
                    <div className="relative group">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Asrama/Pondok</label>
                      <select required className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-700 text-sm" value={siswaForm.pondok || 'Putra'} onChange={e => setSiswaForm({...siswaForm, pondok: e.target.value, gender: e.target.value === 'Putra' ? 'L' : 'P'})}>
                          <option value="Putra">Putra</option>
                          <option value="Putri">Putri</option>
                      </select>
                    </div>
                </div>

                <button type="submit" className="w-full mt-6 bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">MULAI MENGISI</button>
              </form>
            ) : (
              <form onSubmit={e => { e.preventDefault(); adminPin === '1234' ? loginUser({role:'admin'}) : alert('PIN Salah'); }} className="space-y-5">
                <div className="relative group">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">PIN Akses</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-focus-within:bg-[#002147] group-focus-within:text-white transition-all duration-300"><Lock className="w-5 h-5" /></div>
                    <input type="password" required className="w-full pl-14 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#002147] outline-none transition-all font-bold text-slate-700 tracking-widest" placeholder="••••" value={adminPin} onChange={e => setAdminPin(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="w-full mt-4 bg-gradient-to-r from-[#002147] to-[#003b82] text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">MASUK DASHBOARD</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderSiswaScreen() {
    if (submitted || user?.hasSubmitted) return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f4f6f9] text-center p-4">
        <CheckCircle className="w-20 h-20 text-green-500 mb-4"/>
        <h1 className="text-2xl font-bold text-slate-800">Selesai! Terima Kasih.</h1>
        <p className="text-slate-500 mt-2 mb-8">Data angket Anda telah tersimpan ke server BK.</p>
        <button onClick={handleLogout} className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg shadow-sm font-semibold hover:bg-slate-50 flex items-center">
          <LogOut className="w-4 h-4 mr-2"/> Kembali ke Halaman Login
        </button>
      </div>
    );

    return (
      <div className="bg-[#f4f6f9] min-h-screen p-4 pb-24 max-w-3xl mx-auto space-y-4 font-sans">
        <div className="bg-gradient-to-br from-[#002147] to-[#004080] text-white p-6 sm:p-8 rounded-2xl shadow-lg mb-8 mt-4 relative overflow-hidden border border-blue-800/50">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
           <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
           
           <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
             <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner flex-shrink-0"><BrandLogo className="w-14 h-14 drop-shadow-xl" /></div>
             <div className="text-center sm:text-left flex-1">
               <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-400/30 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md shadow-sm"><GraduationCap className="w-4 h-4 text-blue-300" /><span className="text-xs font-bold text-blue-100 uppercase tracking-widest">{user?.data?.noInduk}</span></div>
               <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-sm">Halo, {user?.data?.name}!</h1>
               <p className="text-blue-100 text-sm mt-3 font-medium leading-relaxed max-w-xl">Silakan isi instrumen angket kebutuhan (AKPD) ini dengan jujur. Centang pernyataan yang paling menggambarkan kondisimu saat ini.</p>
             </div>
           </div>
        </div>

        {AKPD_QUESTIONS.map(q => (
          <div key={q.id} onClick={() => setAnswers({...answers, [q.id]: !answers[q.id]})} className={`p-4 border rounded-lg cursor-pointer transition-all ${answers[q.id] ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
             <div className="flex items-start gap-3">
               <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${answers[q.id] ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-slate-50'}`}>{answers[q.id] && <CheckCircle className="w-3.5 h-3.5" />}</div>
               <div className={`text-sm leading-relaxed ${answers[q.id] ? 'text-blue-900 font-medium' : 'text-slate-700'}`}>{q.text}</div>
             </div>
          </div>
        ))}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex justify-center">
           <div className="max-w-3xl w-full flex justify-between items-center">
              <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 font-semibold text-sm">Batal</button>
              <button onClick={submitSiswa} className="bg-[#007bff] text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition-transform active:scale-95">
                 KIRIM JAWABAN SEKARANG
              </button>
           </div>
        </div>
      </div>
    );
  }

  function renderLoadingScreen() {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-200">
           <div className="h-full bg-blue-600 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
        </div>
        <div className="relative flex justify-center items-center mb-8 animate-bounce">
            <svg className="w-32 h-32 drop-shadow-xl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5 L10 20 L10 50 C10 75 30 90 50 95 C70 90 90 75 90 50 L90 20 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="3"/>
              <path d="M 25 65 Q 40 85 50 75" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" fill="none"/>
              <path d="M 75 65 Q 60 85 50 75" stroke="#10b981" strokeWidth="6" strokeLinecap="round" fill="none"/>
              <circle cx="50" cy="40" r="10" fill="#3b82f6"/>
              <path d="M 50 55 L 50 70 M 35 55 Q 50 60 65 55 M 42 80 L 50 70 L 58 80" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M 50 15 L 52 22 L 59 22 L 53 26 L 55 33 L 50 28 L 45 33 L 47 26 L 41 22 L 48 22 Z" fill="#f59e0b"/>
            </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">Memuat E-AKPD...</h2>
        <p className="text-slate-500 font-medium animate-pulse text-sm text-center">Menghubungkan & menyinkronkan data dengan server BK</p>
      </div>
    );
  }

  // =========================================================================
  // 6. MAIN RENDER / APP ROUTER
  // =========================================================================
  if (isAppLoading) return renderLoadingScreen();
  if (!user) return renderLoginScreen();
  if (user.role === 'siswa') return renderSiswaScreen();
  return renderAdminScreen();
}