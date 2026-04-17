import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "admin123"; // ⚠️ change this

const Login = () => {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  const isAdmin = localStorage.getItem("isAdmin");
  if (isAdmin) {
    navigate("/");
  }
}, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      navigate("/");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Password Input */}
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Enter password"
              className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;