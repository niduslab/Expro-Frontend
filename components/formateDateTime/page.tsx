import { Calendar, Clock } from "lucide-react";
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date: formattedDate, time: formattedTime };
};
interface FormateDateTimeProps {
  datetime: string;
  type?: "date" | "time"; // Optional: "date" to show date, "time" to show time only
  icon?: "calendar" | "clock"; // Optional: show icon
}

const FormateDateTime: React.FC<FormateDateTimeProps> = ({
  datetime,
  type = "date",
  icon,
}) => {
  const { date, time } = formatDateTime(datetime);

  return (
    <div className="inline-flex items-center gap-2 text-[#344054]">
      {icon === "calendar" && <Calendar size={16} className="text-[#667085]" />}
      {icon === "clock" && <Clock size={16} className="text-[#667085]" />}
      {type === "date" ? date : time}
    </div>
  );
};

export default FormateDateTime;
