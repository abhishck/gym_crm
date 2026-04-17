import { useState, useEffect } from "react";

const MemberForm = ({ initialData = {}, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    joinDate: "",
    planDuration: "",
  });

 useEffect(() => {
  if (initialData && initialData._id) {
    setForm({
      name: initialData.name || "",
      phone: initialData.phone || "",
      joinDate: initialData.joinDate
        ? initialData.joinDate.split("T")[0]
        : "",
      planDuration: initialData.planDuration || "",
    });
  }
}, [initialData?._id]); // ✅ only depend on ID

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateExpiry = () => {
    if (!form.joinDate || !form.planDuration) return "";

    const date = new Date(form.joinDate);
    date.setDate(date.getDate() + Number(form.planDuration));

    return date.toLocaleDateString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      planDuration: Number(form.planDuration),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-lg"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-lg"
      />

      <input
        type="date"
        name="joinDate"
        value={form.joinDate}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-lg"
      />

      <input
        type="number"
        name="planDuration"
        placeholder="Plan Duration (days)"
        value={form.planDuration}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-lg"
      />

      {calculateExpiry() && (
        <div className="bg-gray-100 p-3 rounded-lg text-sm">
          Expiry: <span className="font-medium">{calculateExpiry()}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        {loading ? "Saving..." : "Save"}
      </button>

    </form>
  );
};

export default MemberForm;