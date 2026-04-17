export const groupRevenueByMonth = (payments = []) => {
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );

  const revenueMap = Array(12).fill(0);

  payments.forEach((p) => {
    const date = new Date(p.date || p.createdAt);
    const monthIndex = date.getMonth();

    revenueMap[monthIndex] += p.amount || 0;
  });

  return months.map((month, i) => ({
    month,
    revenue: revenueMap[i],
  }));
};