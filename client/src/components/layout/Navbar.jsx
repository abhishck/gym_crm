import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">

      {/* Title */}
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        <span className="text-gray-600 text-sm">Admin</span>

        {/* Avatar */}
        <div className="w-8 h-8 bg-gray-300 rounded-full" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-100 transition"
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;