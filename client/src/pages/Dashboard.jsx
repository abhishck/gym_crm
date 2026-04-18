import { useEffect, useState } from "react";
import API from "../services/Api";
import Card from "../components/Card";
import RevenueChart from "../components/RevenueChart";
import MembersPieChart from "../components/MembersPieChart";
import { groupRevenueByMonth } from "../components/chartUtils";
import { MessageCircle } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);

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

  // ✅ WhatsApp Function
 const sendWhatsApp = (member) => {
  if (!member.phone) {
    alert("No phone number available");
    return;
  }

  let phone = member.phone.replace(/\D/g, "");

  if (!phone.startsWith("91")) {
    phone = "91" + phone;
  }

  const message = `Hi ${member.name}, your gym membership is expiring on ${new Date(
    member.expiryDate
  ).toLocaleDateString()}. Please renew soon.`;

  const encodedMessage = encodeURIComponent(message);

  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

  window.open(url, "_blank");
};

  // 🔹 Loading
  if (!data) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
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

  // 🔹 Pagination
  const totalExpPages = Math.ceil(data.expiringSoon.length / expPerPage);

  const paginatedExpiring = data.expiringSoon.slice(
    (expPage - 1) * expPerPage,
    expPage * expPerPage
  );

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Members" value={data.totalMembers} />
        <Card title="Active Members" value={data.activeMembers} />
        <Card title="Expired Members" value={data.expiredMembers} />
        <Card title="Today's Attendance" value={data.todayAttendance} />
        <Card title="Monthly Revenue" value={`₹${data.monthlyRevenue}`} />
        <Card title="Yearly Revenue" value={`₹${data.yearlyRevenue}`} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <MembersPieChart data={membersData} />
      </div>

      {/* 🔥 EXPIRING SOON */}
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
            {/* LIST */}
            <div className="space-y-3">
              {paginatedExpiring.map((member) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <div>
                    <span className="font-medium">{member.name}</span>

                    <div className="text-xs text-gray-500">
                      {member.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">

                    {/* Expiry */}
                    <span className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-600">
                      {new Date(member.expiryDate).toLocaleDateString()}
                    </span>

                    {/* 🔥 WhatsApp Button */}
                    <button
                      onClick={() => sendWhatsApp(member)}
                      className="text-green-600 hover:scale-110"
                      title="Send WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </button>

                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalExpPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-gray-500">
                  Page {expPage} of {totalExpPages}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setExpPage((p) => Math.max(p - 1, 1))}
                    disabled={expPage === 1}
                    className="px-2 py-1 text-xs border rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    Prev
                  </button>

                  <button
                    onClick={() =>
                      setExpPage((p) => Math.min(p + 1, totalExpPages))
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