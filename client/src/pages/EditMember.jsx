import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/Api";
import MemberForm from "../components/MemberForm";

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchMember = async () => {
    try {
      const res = await API.get(`/members/${id}`);
      setMember(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (formData) => {
    setLoading(true);

    try {
      await API.put(`/members/${id}`, formData);
      navigate("/members");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating");
    } finally {
      setLoading(false);
    }
  };

  if (!member) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Member</h2>

      <MemberForm
        initialData={member}
        onSubmit={handleUpdate}
        loading={loading}
      />
    </div>
  );
};

export default EditMember;