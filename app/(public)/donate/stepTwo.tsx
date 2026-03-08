export default function StepTwo({
  form,
  step,
  handleNext,
  setStep,
  handleChange,
  errors,
}: {
  form: any;
  setStep: any;
  handleChange: any;
  step: number;
  errors: any;
  handleNext: (currentStep: number) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="phone"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg text-gray-600 border-gray-200 p-3"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

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
          onClick={() => handleNext(step)}
          className="px-6 py-2 bg-green-700 text-white rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
