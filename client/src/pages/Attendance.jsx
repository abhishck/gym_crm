import { useEffect, useState } from "react";
import API from "../services/Api";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const Attendance = () => {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [memberMap, setMemberMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMembers();
    fetchAttendance();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await API.get("/members");

      const map = {};
      res.data.forEach((m) => {
        map[m._id] = m;
      });

      setMembers(res.data);
      setMemberMap(map);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/today");
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkedInSet = new Set(
    attendance.map((a) => a.memberId?.toString())
  );

  const handleCheckIn = async (memberId) => {
    setLoadingId(memberId);

    try {
      await API.post("/attendance", { memberId });
      fetchAttendance();
    } catch (err) {
      alert("Already checked in or error");
    } finally {
      setLoadingId(null);
    }
  };

  // 🔍 Filter
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search)
  );

  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Attendance</h2>

        <div className="bg-black text-white px-4 py-2 rounded-lg text-sm">
          Today: {attendance.length} Check-ins
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white px-4 py-3 rounded-xl shadow">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search member..."
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Member List */}
      <div className="bg-white rounded-2xl shadow divide-y">

        {paginatedMembers.map((member) => {
          const isCheckedIn = checkedInSet.has(member._id.toString());

          return (
            <div
              key={member._id}
              className="flex justify-between items-center p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.phone}</p>
              </div>

              {isCheckedIn ? (
                <span className="text-green-600 text-sm font-medium">
                  ✅ Checked In
                </span>
              ) : (
                <button
                  onClick={() => handleCheckIn(member._id)}
                  disabled={loadingId === member._id}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
                >
                  {loadingId === member._id ? "..." : "Check In"}
                </button>
              )}
            </div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="text-center p-6 text-gray-500">
            No members found
          </div>
        )}
      </div>

      {/* 🔢 Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">

          <button
            onClick={() => goToPage(currentPage - 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next
          </button>

        </div>
      )}

      {/* Today's Attendance */}
      <div className="bg-white rounded-2xl shadow">

        <div className="p-4 border-b">
          <h3 className="font-medium">Today's Check-ins</h3>
        </div>

        <div className="divide-y">
          {attendance.map((a) => {
            const member = memberMap[a.memberId];

            return (
              <div key={a._id} className="p-4 flex justify-between">
                <span>{member?.name || "Unknown"}</span>
                <span className="text-sm text-gray-500">
                  {new Date(a.date).toLocaleTimeString()}
                </span>
              </div>
            );
          })}

          {attendance.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No check-ins today
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;