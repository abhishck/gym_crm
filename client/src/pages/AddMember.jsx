import MemberForm from "../components/MemberForm";
import API from "../services/Api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      await API.post("/members", formData);
      navigate("/members");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Add Member</h2>
      <MemberForm onSubmit={handleAdd} loading={loading} />
    </div>
  );
};

export default AddMember;