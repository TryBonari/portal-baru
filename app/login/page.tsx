"use client";

import { useState } from "react";
import LoginSiswa from "@/app/user/login/loginsiswa";
import RegistrasiSiswa from "@/app/user/login/registrasisiwa";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center p-4">
      {isRegister ? (
        <RegistrasiSiswa onSwitchToLogin={() => setIsRegister(false)} />
      ) : (
        <LoginSiswa onSwitchToRegister={() => setIsRegister(true)} />
      )}
    </div>
  );
}
