import { Users } from "lucide-react";

const Card = ({ title, value }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value}</h2>
      </div>

      <Users className="text-gray-400" />
    </div>
  );
};

export default Card;