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

  // ✅ Auto-select member from URL
 useEffect(() => {
  const memberIdFromURL = searchParams.get("memberId");

  if (memberIdFromURL && members.length > 0) {
    setForm((prev) => ({
      ...prev,
      memberId: memberIdFromURL,
    }));

    // remove query param after use
    navigate("/payments", { replace: true });
  }
}, [searchParams, members]);
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
    const confirmDelete = window.confirm("Delete this payment?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/payments/${id}`);
      fetchPayments(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Error deleting payment");
    }
  };

  // ✅ MEMBER MAP (fast lookup)
  const memberMap = useMemo(() => {
    const map = new Map();
    members.forEach((m) => map.set(m._id, m));
    return map;
  }, [members]);

  // ✅ Auto-fill amount when member changes (basic logic)
  useEffect(() => {
    if (!form.memberId) return;

    const member = memberMap.get(form.memberId);
    if (!member) return;

    // 🔥 You can improve this later with plan-based pricing
    if (!form.amount) {
      setForm((prev) => ({
        ...prev,
        amount: 500, // default amount (change if needed)
      }));
    }
  }, [form.memberId, memberMap]);

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

      // ✅ Redirect back to Members after 1 sec
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
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Member */}
                  <td className="p-4 font-medium">
                    {member ? (
                      member.name
                    ) : (
                      <span className="text-gray-400 italic">
                        Deleted Member
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="p-4 font-semibold text-gray-800">
                    ₹{p.amount}
                  </td>

                  {/* Method Badge */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        p.method === "cash"
                          ? "bg-green-100 text-green-600"
                          : p.method === "upi"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {p.method}
                    </span>
                  </td>

                  {/* Date + Time */}
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(p.paymentDate).toLocaleDateString()}
                    <div className="text-xs text-gray-400">
                      {new Date(p.paymentDate).toLocaleTimeString()}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deletePayment(p._id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          {/* Page Info */}
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          {/* Buttons */}
          <div className="flex gap-2">
            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 rounded-lg border disabled:opacity-50"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg border ${
                  currentPage === i + 1 ? "bg-black text-white" : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 rounded-lg border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Empty State */}
        {payments.length === 0 && (
          <div className="text-center p-8 text-gray-500">No payments found</div>
        )}
        {payments.length === 0 && (
          <div className="text-center p-6 text-gray-500">No payments found</div>
        )}
      </div>
    </div>
  );
};

export default Payments;
