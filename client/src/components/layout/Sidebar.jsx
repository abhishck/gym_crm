import { Link } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, CalendarCheck } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed">
      <div className="p-5 text-2xl font-bold border-b border-gray-700">
        Gym CRM
      </div>

      <nav className="p-4 space-y-4">
        <Link to="/" className="flex items-center gap-2 hover:text-yellow-400">
          <LayoutDashboard size={20} /> Dashboard
        </Link>

        <Link to="/members" className="flex items-center gap-2 hover:text-yellow-400">
          <Users size={20} /> Members
        </Link>

        <Link to="/add-member" className="flex items-center gap-2 hover:text-yellow-400">
          <Users size={20} /> Add Member
        </Link>

        <Link to="/payments" className="flex items-center gap-2 hover:text-yellow-400">
          <CreditCard size={20} /> Payments
        </Link>

        <Link to="/attendance" className="flex items-center gap-2 hover:text-yellow-400">
          <CalendarCheck size={20} /> Attendance
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;