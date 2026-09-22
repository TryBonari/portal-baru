import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UserProfilPage() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("student_session")?.value;
  if (!sessionUserId) redirect("/login");
  const userId = parseInt(sessionUserId, 10);
  
  // Explicit identity check: Fetch user and their bound student record.
  // Using findFirst with explicit filters to ensure no cross-leakage.
  const user = await prisma.user.findFirst({
    where: { 
      id: userId,
      role: "STUDENT"
    },
    include: { 
      student: { 
        include: { 
          class: { 
            include: { 
              department: true 
            } 
          } 
        } 
      } 
    },
  });

  if (!user || !user.student) {
    redirect("/login");
  }

  const student = user.student;
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Profil Saya</h1>
        <p className="text-sm text-stone-600 mt-1">Data akademik Anda yang dikelola oleh admin sekolah.</p>
      </div>
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-8">
        {student.avatarUrl ? (
          <img src={student.avatarUrl} alt={student.name} className="w-32 h-32 rounded-lg object-cover border border-stone-200" />
        ) : (
          <div className="w-32 h-32 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 text-3xl font-bold">{student.name.charAt(0)}</div>
        )}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          {[
            { label: "Nama Lengkap", value: student.name },
            { label: "NIS", value: student.nis || "-" },
            { label: "NISN", value: student.nisn || "-" },
            { label: "Jenis Kelamin", value: student.gender === "LAKI_LAKI" ? "Laki-laki" : student.gender === "PEREMPUAN" ? "Perempuan" : "-" },
            { label: "Tempat Lahir", value: student.birthPlace || "-" },
            { label: "Tanggal Lahir", value: student.birthDate ? new Date(student.birthDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-" },
            { label: "Tahun Masuk", value: student.admissionYear ? String(student.admissionYear) : "-" },
            { label: "Status", value: student.status },
            { label: "Kelas", value: student.class ? `${student.class.grade} ${student.class.department?.code || ""} ${student.class.number}`.trim() : "-" },
            { label: "Jurusan", value: student.class?.department?.name || "-" },
            { label: "Tingkat", value: student.class?.grade || "-" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-stone-500 uppercase text-[10px] font-bold tracking-wider">{item.label}</p>
              <p className="font-semibold text-stone-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-stone-400">Data bersifat baca saja. Hubungi admin jika ada yang perlu diperbarui.</p>
    </>
  );
}
