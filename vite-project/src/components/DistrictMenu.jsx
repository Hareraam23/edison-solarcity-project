import { useEffect, useRef, useState } from "react";
import "./DistrictMenu.css";

// The 25 districts of Sri Lanka
const DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

export default function DistrictMenu({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    try {
      return localStorage.getItem("district") || "";
    } catch {
      return "";
    }
  });
  const boxRef = useRef(null);

  // Close the menu when clicking outside or pressing Esc
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const choose = (district) => {
    setSelected(district);
    setOpen(false);
    try {
      localStorage.setItem("district", district);
    } catch {
      /* ignore */
    }
    if (onSelect) onSelect(district);
  };

  return (
    <div className="district" ref={boxRef}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen(!open)}
        aria-label="Choose your district"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" />
        </svg>
        {selected && <span className="district-label">{selected}</span>}
      </button>

      {open && (
        <div className="district-menu" role="listbox" aria-label="Sri Lanka districts">
          <p className="district-title">Select your district</p>
          <ul>
            {DISTRICTS.map((d) => (
              <li key={d}>
                <button
                  type="button"
                  role="option"
                  aria-selected={d === selected}
                  className={d === selected ? "active" : ""}
                  onClick={() => choose(d)}
                >
                  {d}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}