import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DOBPicker = ({ value, onChange }: any) => {
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="relative mt-1">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) =>
          onChange(date ? date.toISOString().slice(0, 10) : null)
        }
        dateFormat="dd MMM yyyy"
        maxDate={new Date()}
        showYearDropdown
        showMonthDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        dropdownMode="select"
        placeholderText="Select date of birth"
        className="w-full border border-gray-200 rounded-lg text-sm pl-9 pr-3 py-1.5 bg-white text-gray-800 cursor-pointer outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-gray-400"
      />
      <Calendar
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
};
