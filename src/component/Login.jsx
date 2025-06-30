import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../auth/Firebase";
import Logo from "../img/sp.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/genre");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Pengguna tidak ditemukan.");
      } else if (err.code === "auth/wrong-password") {
        setError("Kata sandi salah.");
      } else if (err.code === "auth/invalid-email") {
        setError("Pengguna Tidak Ditemukan");
      } else {
        setError("Gagal Masuk! Periksa nama pengguna dan kata sandi Anda.");
      }
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center px-3 sm:px-4">
      {/* Dekorasi Blur */}
      <div className="absolute w-60 h-40 bg-purple-300 opacity-20 blur-3xl rounded-full top-5 left-5"></div>
      <div className="absolute w-72 h-48 bg-purple-300 opacity-20 blur-3xl rounded-full bottom-5 right-5"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-white p-5 shadow rounded-md">
          <form className="w-full space-y-4" onSubmit={handleLogin}>
            <div className="flex flex-col items-center mb-4">
              <img src={Logo} alt="Logo" className="w-20 mb-2" />
              <h2 className="text-gray-800 font-semibold text-lg border-b border-gray-300 w-full text-center pb-1">
                Masuk
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 text-xs text-center">
                {error}
              </p>
            )}
            {resetMessage && (
              <p className="text-purple-600 bg-purple-50 border border-purple-200 rounded px-2 py-1 text-xs text-center">
                {resetMessage}
              </p>
            )}

            {/* Email */}
            <input
              type="email"
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-purple-400 focus:outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              type="password"
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-purple-400 focus:outline-none"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Tombol Login */}
            <button
              type="submit"
              className="w-full px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Masuk
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-3 text-sm">
          <p className="text-gray-600">
            Belum punya akun?{" "}
            <Link
              to={"/"}
              className="text-purple-500 hover:underline font-medium"
            >
              Kembali
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
