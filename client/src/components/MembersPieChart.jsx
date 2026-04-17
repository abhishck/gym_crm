import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#facc15"];

const MembersPieChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm h-[300px]">
      <h2 className="text-lg font-semibold mb-4">Members Overview</h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MembersPieChart;