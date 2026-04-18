import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import Payments from "./pages/Payments";
import Attendance from "./pages/Attendance";
import EditMember from "./pages/EditMember";
import Login from "./components/Login.jsx";
import PaymentView from "./pages/PaymentView.jsx";
import RecentlyDeleted from "./pages/RecentlyDeleted.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Public Route */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes */}
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="add-member" element={<AddMember />} />
          <Route path="payments" element={<Payments />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="edit-member/:id" element={<EditMember />} />
          <Route path="payments/view/:id" element={<PaymentView />} />
          <Route path="/deleted-members" element={<RecentlyDeleted/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;