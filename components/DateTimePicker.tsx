"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

interface DateTimePickerProps {
  value: string | Date | null;
  onChange: (newValue: string | null) => void;
}

export const DateTimePicker = ({ value, onChange }: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!value) {
      setSelectedDate(null);
      return;
    }
    const d = value instanceof Date ? value : new Date(value);
    setSelectedDate(isNaN(d.getTime()) ? null : d);
  }, [value]);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange(date ? date.toISOString() : null);
  };

  return (
    <div className="relative w-full mt-1">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        showTimeSelect
        timeIntervals={15}
        dateFormat="dd MMM yyyy, HH:mm"
        placeholderText="Select date and time"
        className="w-full border border-gray-200 rounded-lg text-sm pl-9 pr-3 py-3 bg-white text-gray-800 cursor-pointer outline-none focus:ring-1 focus:ring-green-400 placeholder:text-gray-400"
        popperPlacement="bottom-start"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
      <Calendar
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
};
