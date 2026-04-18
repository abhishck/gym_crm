import { useEffect, useState } from "react";
import API from "../services/Api";
import { RotateCcw, Trash2 } from "lucide-react";

const RecentlyDeleted = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeleted();
  }, []);

  const fetchDeleted = async () => {
    try {
      setLoading(true);
      const res = await API.get("/members/deleted");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const restoreMember = async (id) => {
    try {
      await API.patch(`/members/restore/${id}`);

      setMembers((prev) => prev.filter((m) => m._id !== id));

    } catch (err) {
      alert("Failed to restore");
    }
  };

  const deletePermanent = async (id) => {
    if (!window.confirm("Delete permanently?")) return;

    try {
      await API.delete(`/members/permanent/${id}`);

      setMembers((prev) => prev.filter((m) => m._id !== id));

    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-semibold">
        Recently Deleted Members
      </h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th>Phone</th>
              <th>Deleted At</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No deleted members
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m._id} className="border-t">
                  <td className="p-4 font-medium">{m.name}</td>
                  <td>{m.phone}</td>

                  <td>
                    {new Date(m.deletedAt).toLocaleDateString()}
                  </td>

                  <td className="pr-4">
                    <div className="flex justify-end gap-3">

                      {/* Restore */}
                      <button
                        onClick={() => restoreMember(m._id)}
                        className="text-green-600 hover:scale-110"
                        title="Restore"
                      >
                        <RotateCcw size={18} />
                      </button>

                      {/* Permanent Delete */}
                      <button
                        onClick={() => deletePermanent(m._id)}
                        className="text-red-600 hover:scale-110"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentlyDeleted;