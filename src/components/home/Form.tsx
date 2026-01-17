"use client";

import { useState } from "react";
import {
  CountrySelect,
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
    <div className="bg-color5 p-6 sm:p-8">
      <div className="bg-color2 py-8 max-w-5xl mx-auto rounded-xl shadow-md">
        <h2 className="text-center text-color3 text-2xl font-bold">
          Franchise Opportunity
        </h2>

        {message && (
          <p
            className={`text-center mt-4 font-semibold ${
              verified ? "text-green-600" : "text-blue-600"
            }`}
          >
            {message}
          </p>
        )}

        {!verified && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-8"
          >
            {/* Name */}
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Full Name*"
              className="py-3 px-4 border rounded-lg text-base sm:text-lg"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Email ID*"
              className="py-3 px-4 border rounded-lg text-base sm:text-lg"
              required
            />

            {/* Phone with country code */}
            <div className="flex gap-3">
              <CountrySelect
                value={countryId}
                onChange={(e: any) => {
                  setCountryId(e.id);
                  setFormValues((prev) => ({
                    ...prev,
                    country: e.name,
                  }));
                }}
                placeHolder="Code"
                containerClassName="w-32"
                inputClassName="py-3 px-3 border rounded-lg text-base"
              />

              <input
                type="tel"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
                placeholder="Mobile Number*"
                className="flex-1 py-3 px-4 border rounded-lg text-base sm:text-lg"
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
              inputClassName="py-3 px-4 border rounded-lg text-base sm:text-lg"
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
              inputClassName="py-3 px-4 border rounded-lg text-base sm:text-lg"
            />

            {/* Terms */}
            <div className="flex items-center gap-3 lg:col-span-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formValues.termsAccepted}
                onChange={handleInputChange}
                className="w-5 h-5"
                required
              />
              <span className="text-sm sm:text-base">
                Accept terms & conditions
              </span>
            </div>

            {/* Submit */}
            <div className="lg:col-span-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-10 py-3 rounded-lg text-lg font-semibold transition ${
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
          <div className="flex flex-col items-center mt-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold text-green-700">
              Request Submitted Successfully!
            </h3>
            <p className="text-gray-600 mt-2 text-center px-4">
              Thank you for your interest. Our team will contact you soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;