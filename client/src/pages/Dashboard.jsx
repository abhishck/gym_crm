import { useEffect, useState } from "react";
import API from "../services/Api";
import Card from "../components/Card";
import RevenueChart from "../components/RevenueChart";
import MembersPieChart from "../components/MembersPieChart";
import { groupRevenueByMonth } from "../components/chartUtils";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);

  // 🔹 Expiring pagination state
  const [expPage, setExpPage] = useState(1);
  const expPerPage = 3;

  useEffect(() => {
    fetchDashboard();
    fetchPayments();
  }, []);

  useEffect(() => {
    setExpPage(1);
  }, [data?.expiringSoon]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await API.get("/payments");
      const grouped = groupRevenueByMonth(res.data);
      setRevenueData(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Loading Skeleton
  if (!data) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // 🔹 Chart Data
  const membersData = [
    { name: "Active", value: data.activeMembers },
    { name: "Expired", value: data.expiredMembers },
    { name: "Expiring", value: data.expiringSoon.length },
  ];

  // 🔹 Expiring Pagination Logic
  const totalExpPages = Math.ceil(
    data.expiringSoon.length / expPerPage
  );

  const paginatedExpiring = data.expiringSoon.slice(
    (expPage - 1) * expPerPage,
    expPage * expPerPage
  );

  return (
    <div className="space-y-6 p-6">

      {/* 🔷 Header */}
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      {/* 🔷 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Members" value={data.totalMembers} />
        <Card title="Active Members" value={data.activeMembers} />
        <Card title="Expired Members" value={data.expiredMembers} />
        <Card title="Today's Attendance" value={data.todayAttendance} />
        <Card title="Monthly Revenue" value={`₹${data.monthlyRevenue}`} />
        <Card title="Yearly Revenue" value={`₹${data.yearlyRevenue}`} />
      </div>

      {/* 🔷 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <MembersPieChart data={membersData} />
      </div>

      {/* 🔷 Expiring Soon */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Expiring Soon</h3>
          <span className="text-sm text-gray-500">
            {data.expiringSoon.length} members
          </span>
        </div>

        {data.expiringSoon.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            🎉 No members expiring soon
          </div>
        ) : (
          <>
            {/* List */}
            <div className="space-y-3">
              {paginatedExpiring.map((member) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <span className="font-medium">{member.name}</span>

                  <span className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-600">
                    {new Date(member.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalExpPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-gray-500">
                  Page {expPage} of {totalExpPages}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setExpPage((p) => Math.max(p - 1, 1))
                    }
                    disabled={expPage === 1}
                    className="px-2 py-1 text-xs border rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    Prev
                  </button>

                  <button
                    onClick={() =>
                      setExpPage((p) =>
                        Math.min(p + 1, totalExpPages)
                      )
                    }
                    disabled={expPage === totalExpPages}
                    className="px-2 py-1 text-xs border rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;