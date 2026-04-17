import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  // 🔹 Handle empty data
  const hasData = data && data.some((d) => d.revenue > 0);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm h-[320px] flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Revenue</h2>

      {!hasData ? (
        // 🔸 Empty State (SaaS style)
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No revenue data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            {/* Y Axis */}
            <YAxis
              tickFormatter={(value) => `₹${value}`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              formatter={(value) => [`₹${value}`, "Revenue"]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;