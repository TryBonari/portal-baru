export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;

    // Known handled user errors
    const safePrefixes = [
      "Nama", "NIS", "NISN", "Jenis", "Tanggal", "Tahun", "Status", "Kelas", "Jurusan",
      "ID", "Kode", "Tipe", "Ukuran", "Konten", "Judul", "Pesan", "Password", "Access",
      "Semua", "Gagal", "Siswa", "Guru", "Kombinasi"
    ];

    if (safePrefixes.some(prefix => msg.startsWith(prefix))) {
      return msg;
    }

    // File/Upload errors
    if (msg.includes("Tipe file") || msg.includes("format") || msg.includes("didukung")) {
      return "Format file tidak didukung. Harap gunakan JPG, PNG, atau WebP.";
    }
    if (msg.includes("Ukuran") || msg.includes("terlalu besar")) {
      return "Ukuran file terlalu besar. Maksimal 2MB.";
    }
    if (msg.includes("Konten file") || msg.includes("rusak")) {
      return "File tidak valid atau rusak.";
    }
    if (msg.includes("Gagal memproses") || msg.includes("penyimpanan")) {
      return "Gagal memproses file. Silakan coba lagi.";
    }

  }

  return "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.";
}
