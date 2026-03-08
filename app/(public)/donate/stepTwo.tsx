export default function StepTwo({ form, setStep, handleChange }: any) {
  return (
    <div className="space-y-5">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
      />

      <input
        type="text"
        name="phone"
        placeholder="Mobile Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
      />

      <textarea
        name="message"
        placeholder="Message (optional)"
        value={form.message}
        onChange={handleChange}
        className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
      />

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-2 border rounded-lg text-slate-500"
        >
          Back
        </button>

        <button
          onClick={() => setStep(3)}
          className="px-6 py-2 bg-green-700 text-white rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
