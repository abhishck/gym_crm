import { useEffect, useState, useMemo } from "react";
import API from "../services/Api";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const Payments = () => {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  const [form, setForm] = useState({
    memberId: "",
    amount: "",
    method: "cash",
  });

  const [loading, setLoading] = useState(false);

  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  useEffect(() => {
    fetchMembers();
    fetchPayments();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [payments]);

  // ✅ FIXED: Auto-select member + default amount
  useEffect(() => {
    const memberIdFromURL = searchParams.get("member");

    if (!memberIdFromURL || members.length === 0) return;

    const memberExists = members.find((m) => m._id === memberIdFromURL);

    if (!memberExists) return;

    setForm({
      memberId: memberIdFromURL,
      amount: 500, // default amount (you can customize)
      method: "cash",
    });

    // Optional: remove query param after use
    navigate("/payments", { replace: true });
  }, [searchParams, members, navigate]);

  const fetchMembers = async () => {
    try {
      const res = await API.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members");
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await API.get("/payments");
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payments");
    }
  };

  const deletePayment = async (id) => {
    console.log("🟡 Delete clicked for ID:", id);

    const confirmDelete = window.confirm("Delete this payment?");
    if (!confirmDelete) {
      console.log("❌ User cancelled delete");
      return;
    }

    try {
      console.log("🚀 Sending DELETE request...");

      const res = await API.delete(`/payments/${id}`);

      console.log("✅ Delete API response:", res);
      console.log("📦 Response data:", res.data);

      // 🔥 check if backend actually confirmed delete
      if (res.status !== 200 && res.status !== 204) {
        console.warn("⚠️ Unexpected status:", res.status);
      }

      // 🔥 instant UI update
      setPayments((prev) => {
        const filtered = prev.filter((p) => p._id !== id);
        console.log("🧹 Updated payments list:", filtered);
        return filtered;
      });

      toast.success("Payment deleted successfully");
    } catch (err) {
      console.error("❌ DELETE ERROR FULL:", err);

      // Axios detailed debug
      if (err.response) {
        console.log("📌 Error status:", err.response.status);
        console.log("📌 Error data:", err.response.data);
        console.log("📌 Error headers:", err.response.headers);
      } else if (err.request) {
        console.log("📡 No response received:", err.request);
      } else {
        console.log("⚠️ Axios setup error:", err.message);
      }

      toast.error("Error deleting payment");
    }
  };

  // ✅ Member map
  const memberMap = useMemo(() => {
    const map = new Map();
    members.forEach((m) => map.set(m._id, m));
    return map;
  }, [members]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.memberId || !form.amount) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await API.post("/payments", {
        ...form,
        amount: Number(form.amount),
      });

      toast.success("Payment added successfully");
      setCurrentPage(1);

      setForm({
        memberId: "",
        amount: "",
        method: "cash",
      });

      fetchPayments();

      navigate("/members", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Error adding payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payments</h2>

      {/* Add Payment Form */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4 max-w-2xl">
        <h3 className="text-lg font-medium">Add Payment</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Member Select */}
          <select
            name="memberId"
            value={form.memberId}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.phone})
              </option>
            ))}
          </select>

          {/* Amount */}
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount"
            className="w-full p-3 border rounded-lg"
          />

          {/* Payment Method */}
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Add Payment"}
          </button>
        </form>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="p-4">Member</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Method</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.map((p) => {
              const member =
                typeof p.memberId === "object"
                  ? p.memberId
                  : memberMap.get(p.memberId);

              return (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">
                    {member ? (
                      member.name
                    ) : (
                      <span className="text-gray-400 italic">
                        Deleted Member
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-semibold">₹{p.amount}</td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                      {p.method}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {new Date(p.paymentDate).toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* 👁 View Button */}
                      <button
                        onClick={() => navigate(`/payments/view/${p._id}`)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded"
                        title="View Payment"
                      >
                        👁
                      </button>

                      {/* 🗑 Delete Button */}
                      <button
                        onClick={() => deletePayment(p._id)}
                        className="p-2 hover:bg-red-100 text-red-500 rounded"
                        title="Delete Payment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1 ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {payments.length === 0 && (
          <div className="text-center p-6 text-gray-500">No payments found</div>
        )}
      </div>
    </div>
  );
};

export default Payments;
