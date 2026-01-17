"use client";

import { useState } from "react";
import {
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  termsAccepted: boolean;
}

const Form = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    country: "India",
    state: "",
    city: "",
    termsAccepted: false,
  });

  const [countryId, setCountryId] = useState<number>(101); // India
  const [stateId, setStateId] = useState<number>(0);

  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    
    // Only allow 10 digits for phone number
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setFormValues((prev) => ({
        ...prev,
        [name]: phoneValue,
      }));
      return;
    }
    
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setVerified(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();

      if (data.success) {
        setVerified(true);
        setMessage("Your request has been submitted successfully!");
        setFormValues({
          name: "",
          email: "",
          phone: "",
          country: "India",
          state: "",
          city: "",
          termsAccepted: false,
        });
        setStateId(0);
      } else {
        setMessage(data.message || "Failed to submit request.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="form-section" className="bg-color5 p-4 sm:p-6 lg:p-8">
      <div className="bg-color2 py-6 sm:py-8 max-w-5xl mx-auto rounded-lg sm:rounded-xl shadow-md">
        <h2 className="text-center text-color3 text-xl sm:text-2xl lg:text-3xl font-bold px-4">
          Franchise Opportunity
        </h2>

        {message && (
          <p
            className={`text-center mt-3 sm:mt-4 font-semibold text-sm sm:text-base ${
              verified ? "text-green-600" : "text-blue-600"
            }`}
          >
            {message}
          </p>
        )}

        {!verified && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-6 py-6 sm:py-8"
          >
            {/* Name */}
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Full Name*"
              className="w-full py-3 px-4 border rounded-lg text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-color1"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Email ID*"
              className="w-full py-3 px-4 border rounded-lg text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-color1"
              required
            />

            {/* Phone with country code */}
            <div className="flex gap-2 lg:col-span-1">
              <div className="flex items-center px-3 sm:px-4 py-3 border rounded-lg bg-gray-50 text-sm sm:text-base font-semibold text-gray-700 whitespace-nowrap">
                +91
              </div>

              <input
                type="tel"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
                placeholder="10 Digit Number*"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
                className="flex-1 py-3 px-4 border rounded-lg text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-color1"
                required
              />
            </div>

            {/* State */}
            <StateSelect
              countryid={countryId}
              value={stateId || undefined}
              onChange={(e: any) => {
                setStateId(e.id);
                setFormValues((prev) => ({
                  ...prev,
                  state: e.name,
                  city: "",
                }));
              }}
              placeHolder="Select State*"
              containerClassName="w-full"
              inputClassName="py-3 px-4 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-color1"
            />

            {/* City */}
            <CitySelect
              countryid={countryId}
              stateid={stateId || 0}
              value={formValues.city}
              onChange={(e: any) =>
                setFormValues((prev) => ({
                  ...prev,
                  city: e.name,
                }))
              }
              placeHolder="Select City*"
              disabled={!stateId}
              containerClassName="w-full"
              inputClassName="py-3 px-4 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-color1 disabled:opacity-50"
            />

            {/* Terms */}
            <div className="flex items-start sm:items-center gap-3 lg:col-span-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formValues.termsAccepted}
                onChange={handleInputChange}
                className="w-5 h-5 mt-1 sm:mt-0 cursor-pointer flex-shrink-0"
                required
              />
              <label className="text-xs sm:text-sm text-gray-700 cursor-pointer select-none">
                Accept terms & conditions
              </label>
            </div>

            {/* Submit */}
            <div className="col-span-1 lg:col-span-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition active:scale-95 ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "bg-color1 text-color3 hover:bg-color9"
                }`}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        )}

        {verified && (
          <div className="flex flex-col items-center mt-6 sm:mt-8 px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl mb-3 sm:mb-4">
              ✓
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-green-700 text-center">
              Request Submitted Successfully!
            </h3>
            <p className="text-gray-600 mt-2 text-center text-sm sm:text-base px-2">
              Thank you for your interest. Our team will contact you soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;