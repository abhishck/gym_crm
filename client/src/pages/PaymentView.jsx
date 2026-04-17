import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/Api";
import { ArrowLeft } from "lucide-react";

const PaymentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, []);

  const fetchPayment = async () => {
  try {
    console.log("Payment ID:", id);

    if (!id) {
      console.error("❌ ID is missing");
      return;
    }

    const res = await API.get(`/payments/single/${id}`);
    setPayment(res.data);

  } catch (err) {
    console.error("❌ API ERROR:", err.response?.data || err.message);
    alert("Failed to load payment");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div className="p-6">Loading...</div>;
  if (!payment) return <div className="p-6">Payment not found</div>;

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-semibold">Payment Details</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow space-y-4 max-w-xl">

        <div>
          <p className="text-gray-500 text-sm">Member</p>
          <p className="font-medium">
            {payment.memberId?.name}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Phone</p>
          <p>{payment.memberId?.phone}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Amount</p>
          <p className="font-semibold text-lg">₹{payment.amount}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Method</p>
          <p className="capitalize">{payment.method}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Date</p>
          <p>{new Date(payment.paymentDate).toLocaleString()}</p>
        </div>

      </div>
    </div>
  );
};

export default PaymentView;