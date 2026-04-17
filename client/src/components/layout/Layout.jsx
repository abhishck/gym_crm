import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;