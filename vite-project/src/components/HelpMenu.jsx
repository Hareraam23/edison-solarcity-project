import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./HelpMenu.css";

// Edit these questions and answers to match your business
const FAQS = [
  {
    q: "How much can I save with solar panels?",
    a: "Savings depend on your electricity use, roof space and sunlight. Contact us for a personalized estimate.",
  },
  {
    q: "How does installation work?",
    a: "Our team surveys your roof, designs the system and schedules the installation with you.",
  },
  {
    q: "Can a battery power my home during an outage?",
    a: "A battery can keep selected appliances running during a grid outage, depending on the system size.",
  },
  {
    q: "How do I monitor my solar system?",
    a: "Use the Edison app to see your solar production, battery charge and home usage in real time.",
  },
  {
    q: "How do I place an order?",
    a: "Click Order Now on the home page, or contact us and our team will guide you.",
  },
];

export default function HelpMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Esc closes the page, and the page behind stops scrolling while it is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  // Close, then scroll down to the footer Contact section
  const goToContact = () => {
    close();
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const q = query.trim().toLowerCase();
  const results = q
    ? FAQS.filter((f) => (f.q + " " + f.a).toLowerCase().includes(q))
    : [];

  return (
    <>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen(true)}
        aria-label="Help and support"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.5" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div className="help-page" role="dialog" aria-modal="true" aria-labelledby="help-title">
            <button className="help-close" onClick={close} aria-label="Close">
              &times;
            </button>

            <div className="help-inner">
              <h1 id="help-title">Edison Support</h1>

              <label className="help-search">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M16.5 16.5L21 21" />
                </svg>
                <input
                  type="text"
                  placeholder="Search Support"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </label>

              {q && (
                <div className="help-results">
                  {results.length > 0 ? (
                    results.map((f) => (
                      <article key={f.q}>
                        <h3>{f.q}</h3>
                        <p>{f.a}</p>
                      </article>
                    ))
                  ) : (
                    <p className="help-empty">
                      No results found. Try another word, or contact us below.
                    </p>
                  )}
                </div>
              )}

              <section className="help-personal">
                <h2>Get Personalized Support</h2>
                <p>
                  Discover how to get the help you need. Our team offers
                  personalized support for your solar panels, battery and
                  installation. Contact us and we will get back to you.
                </p>
                <button type="button" className="help-contact" onClick={goToContact}>
                  Contact Us
                </button>
              </section>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}