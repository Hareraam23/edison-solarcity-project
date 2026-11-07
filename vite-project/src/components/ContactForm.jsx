import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/consultations";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      <h2>Schedule a Consultation</h2>

      <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <textarea name="message" placeholder="Tell us about your needs" value={form.message} onChange={handleChange} />

      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Schedule a Consultation"}
      </button>

      {status === "success" && <p>Thank you! We'll contact you soon.</p>}
      {status === "error" && <p>Something went wrong. Please try again.</p>}
    </form>
  );
}