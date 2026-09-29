"use client";

import { useState } from "react";

interface PaymentModalProps {
  amount: number;
  monthName: string;
  yearName: string;
}

export default function UserPaymentMethodSelector({ amount, monthName, yearName }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("qris");

  const methods = [
    {
      id: "qris",
      name: "QRIS",
      desc: "Scan QR menggunakan BCA, Mandiri, GoPay, OVO, ShopeePay, dll",
      instructions: "Silakan hubungi bagian Tata Usaha / Keuangan sekolah untuk scan QRIS statis/dinamis resmi sekolah.",
    },
    {
      id: "transfer",
      name: "Transfer Bank",
      desc: "Pilih bank tujuan transfer",
      instructions: "Transfer ke salah satu rekening di bawah. Cantumkan NIS dan Nama Siswa pada berita transfer. Setelah transfer simpan bukti untuk verifikasi admin.",
      banks: [
        { code: "BRI", name: "Bank BRI", rek: "0034-01-009876-53-2", an: "SMK/SMA Portal Sekolah" },
        { code: "BNI", name: "Bank BNI", rek: "0345-6789-12", an: "SMK/SMA Portal Sekolah" },
        { code: "BCA", name: "Bank BCA", rek: "686-012-3456", an: "SMK/SMA Portal Sekolah" },
        { code: "MANDIRI", name: "Bank Mandiri", rek: "123-00-9876543-2", an: "SMK/SMA Portal Sekolah" },
        { code: "BERSAMA", name: "Bank Bersama / ATB (Transfer Antar Bank)", rek: "8199-99-012345-6", an: "SMK/SMA Portal Sekolah (Bank Bersama)" },
      ] as const,
    },
    {
      id: "ewallet",
      name: "E-Wallet",
      desc: "Pilih dompet digital (Dana, GoPay, OVO, dll)",
      instructions: "Kirim saldo ke nomor/VA official Keuangan Sekolah sesuai pilihan E-Wallet di bawah dan simpan bukti transaksi untuk verifikasi.",
      wallets: ["Dana", "GoPay", "OVO", "ShopeePay", "LinkAja", "DOKU"] as string[],
    },
    {
      id: "direct",
      name: "Pembayaran Langsung (Tunai)",
      desc: "Bayar langsung di loket Keuangan / TU Sekolah",
      instructions: "Kunjungi loket Tata Usaha pada jam operasional sekolah (Senin - Jumat, 08:00 - 15:00 WIB) untuk menyerahkan uang tunai dan mendapatkan kuitansi.",
    },
  ];

  const currentMethod = methods.find((m) => m.id === selectedMethod);

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-stone-900">Pilih Metode Pembayaran</h2>
        <p className="text-sm text-stone-600 mt-1">
          Tagihan Bulan <span className="font-semibold text-stone-800">{monthName}</span> ({yearName}) sebesar{" "}
          <span className="font-bold text-emerald-800">Rp {amount.toLocaleString("id-ID")}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={`text-left p-4 rounded-lg border transition flex flex-col gap-1 ${
                isSelected
                  ? "border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700"
                  : "border-stone-200 bg-stone-50/50 hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">{method.name}</span>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? "border-emerald-700 bg-emerald-700" : "border-stone-300"
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
              </div>
              <p className="text-xs text-stone-500">{method.desc}</p>
            </button>
          );
        })}
      </div>

      {currentMethod && (
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col gap-2">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Instruksi Pembayaran: {currentMethod.name}
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">{currentMethod.instructions}</p>
          
          {"banks" in currentMethod && (
            <div className="mt-2 space-y-2">
              {currentMethod.banks?.map((b) => (
                <div key={b.code} className="bg-white border border-stone-200 p-3 rounded text-sm">
                  <div className="font-semibold text-stone-800">{b.name}</div>
                  <div className="font-mono text-emerald-900 font-bold tracking-tight">{b.rek}</div>
                  <div className="text-xs text-stone-500">a.n. {b.an}</div>
                </div>
              ))}
            </div>
          )}

          {"wallets" in currentMethod && (
            <div className="mt-2 flex flex-wrap gap-2">
              {currentMethod.wallets?.map((w) => (
                <span key={w} className="bg-white border border-stone-200 px-2.5 py-1.5 rounded text-sm font-semibold text-emerald-900">
                  {w}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 text-xs text-stone-500 bg-white border border-stone-200 p-3 rounded">
            Catatan: Setelah melakukan pembayaran, status akan diperbarui oleh Admin / Tata Usaha setelah verifikasi.
          </div>
        </div>
      )}
    </div>
  );
}
