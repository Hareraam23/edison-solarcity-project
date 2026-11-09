import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/consultations";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setForm({ name: "", email: "", phone: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {status === "success" && <p>Thank you! We'll contact you soon.</p>}
      {status === "error" && <p>Something went wrong. Please try again.</p>}
    </form>
  );
}