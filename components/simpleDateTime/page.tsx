const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date: formattedDate, time: formattedTime };
};

interface SimpleDateTimeProps {
  datetime: string;
  type?: "date" | "time" | "both"; // more flexible
}

const SimpleDateTime: React.FC<SimpleDateTimeProps> = ({
  datetime,
  type = "date",
}) => {
  if (!datetime) return <span>-</span>;

  const { date, time } = formatDateTime(datetime);

  let value = date;
  if (type === "time") value = time;
  if (type === "both") value = `${date} • ${time}`;

  return <span className="text-sm text-gray-800 font-medium">{value}</span>;
};

export default SimpleDateTime;
