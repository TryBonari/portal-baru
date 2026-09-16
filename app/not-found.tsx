export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-stone-600 mb-6">
          Maaf, halaman atau data yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>
        <a
          href="/"
          className="inline-block w-full py-2 bg-emerald-900 text-white rounded-md text-sm font-medium hover:bg-emerald-800 transition"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
