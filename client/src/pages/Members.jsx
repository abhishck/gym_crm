import { useEffect, useState, useMemo } from "react";
import API from "../services/Api";
import { Search, Trash2, Pencil, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("expiryDate");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Status logic
  const getStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = (expiry - today) / (1000 * 60 * 60 * 24);

    if (expiry < today) return "expired";
    if (diff <= 5) return "expiring";
    return "active";
  };

  // 🔹 Filter + Sort
  const filteredMembers = useMemo(() => {
    let data = [...members];

    if (search) {
      data = data.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.phone.includes(search)
      );
    }

    if (statusFilter !== "all") {
      data = data.filter(
        (m) => getStatus(m.expiryDate) === statusFilter
      );
    }

    data.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "expiryDate")
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      return 0;
    });

    return data;
  }, [members, search, statusFilter, sortBy]);

  // 🔹 Pagination Logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Delete
  const deleteMember = async (id) => {
    if (!confirm("Delete this member?")) return;
    await API.delete(`/members/${id}`);
    fetchMembers();
  };

  return (
    <div className="p-6 space-y-4">

      {/* 🔷 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Members</h1>

        <button
          onClick={() => navigate("/add-member")}
          className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          + Add Member
        </button>
      </div>

      {/* 🔷 Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center">
        
        {/* Search */}
        <div className="flex items-center border rounded-xl px-3 py-2 w-full md:w-64">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status */}
        <select
          className="border rounded-xl px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="expiring">Expiring Soon</option>
          <option value="expired">Expired</option>
        </select>

        {/* Sort */}
        <button
          onClick={() =>
            setSortBy(sortBy === "name" ? "expiryDate" : "name")
          }
          className="flex items-center gap-2 border px-3 py-2 rounded-xl"
        >
          <ArrowUpDown size={16} />
          Sort: {sortBy}
        </button>
      </div>

      {/* 🔷 Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Expiry</th>
              <th>Status</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No members found
                </td>
              </tr>
            ) : (
              paginatedMembers.map((m) => {
                const status = getStatus(m.expiryDate);

                return (
                  <tr
                    key={m._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{m.name}</td>
                    <td>{m.phone}</td>
                    <td>
                      {new Date(m.joinDate).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(m.expiryDate).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          status === "active"
                            ? "bg-green-100 text-green-700"
                            : status === "expired"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="pr-4">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() =>
                            navigate(`/edit-member/${m._id}`)
                          }
                          className="text-blue-600 hover:scale-110 transition"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/payments?member=${m._id}`)
                          }
                          className="text-green-600 text-xs font-medium"
                        >
                          Renew
                        </button>

                        <button
                          onClick={() => deleteMember(m._id)}
                          className="text-red-600 hover:scale-110 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🔷 Pagination */}
      {filteredMembers.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">

          {/* Info */}
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredMembers.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredMembers.length}</span>
          </p>

          {/* Controls */}
          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(p - 1, 1))
              }
              disabled={currentPage === 1}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  currentPage === i + 1
                    ? "bg-black text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Members;