import { useEffect, useRef, useState } from "react";
import "./App.css";
import ContactForm from "./components/ContactForm";
import LoginPage from "./components/LoginPage"; // NEW

const links = [
  "Solar Panels",
  "Battery",
  "Installation",
  "Savings",
  "Projects",
  "About",
  "Contact",
];

const benefits = [
  {
    title: "Monthly Bill Savings",
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="28" />
        <text
          x="32"
          y="43"
          textAnchor="middle"
          fontSize="30"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
        >
          $
        </text>
      </svg>
    ),
    text: (
      <>
        Using solar energy to power your home can help protect you from rising
        electricity costs. Explore leasing options for the most affordable way
        to go solar.
      </>
    ),
  },
  {
    title: "Tax Incentives",
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 4h36a2 2 0 0 1 2 2v54L32 46 12 60V6a2 2 0 0 1 2-2z" />
        <path
          d="M32 18l3.5 7.2 7.9 1.1-5.7 5.5 1.4 7.8L32 36l-7.1 3.6 1.4-7.8-5.7-5.5 7.9-1.1z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
    text: (
      <>
        You can qualify for{" "}
        <a href="#incentives">national and local incentives</a> to help cut
        your solar panel installation costs.
      </>
    ),
  },
  {
    title: "Sustainable Energy",
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 4v8M12 12l5 5M52 12l-5 5M6 28h8M50 28h8" />
        <path d="M20 28a12 12 0 0 1 24 0" />
        <path d="M6 60l6-24h40l6 24z" />
        <path d="M9 48h46M20 36l-3 24M32 36v24M44 36l3 24" />
      </svg>
    ),
    text: (
      <>
        Power your home with emissions-free renewable energy directly from the
        sun.
      </>
    ),
  },
];

/* ---------- APP SHOWCASE BUILDING BLOCKS ---------- */

const House = () => (
  <svg className="ph-house" viewBox="0 0 200 140" aria-hidden="true">
    <polygon points="20,60 100,95 100,130 20,95" fill="#15161a" />
    <polygon points="100,95 190,50 190,85 100,130" fill="#1d1f25" />
    <polygon points="20,60 110,20 190,50 100,95" fill="#2b2e3a" />
    <path
      d="M46 72L136 30M73 83L163 40M42.5 50L122.5 84M65 40L145 72.5M87.5 30L167.5 61"
      stroke="#4b5068"
      strokeWidth="1"
      fill="none"
    />
    <rect x="92" y="104" width="7" height="18" rx="1.5" fill="#e9ecef" />
  </svg>
);

const Phone = ({ cls, children }) => (
  <div className={`ph ${cls}`}>
    <div className="ph-island" />
    <div className="ph-status">
      <span>9:41</span>
      <span className="ph-batt" />
    </div>
    {children}
  </div>
);

const Row = ({ title, sub }) => (
  <div className="ph-row">
    <i />
    <div>
      <b>{title}</b>
      {sub && <small>{sub}</small>}
    </div>
  </div>
);

const CIRC = 263.9;
const donut = [
  ["#f2c230", 42, 0],
  ["#2ecc71", 54, 42],
  ["#8b8f98", 4, 96],
];
const meters = [
  ["Solar", 2, "#f2c230"],
  ["Powerwall", 98, "#2ecc71"],
  ["Grid", 0, "#8b8f98"],
];
const bars = [
  60, 80, 70, 75, 30, 95, 25, 55, 20, 40, 85, 50, 60, 78, 90, 100, 65, 80, 35,
  25, 70, 90, 55, 85, 95, 100, 45, 60, 75, 88,
];

/* ---------- EDISON LOGO (sun + lightning bolt) ---------- */
const Logo = () => (
  <svg viewBox="0 0 190 48" role="img" aria-label="Edison Solution Lab">
    <g stroke="#f5b301" strokeWidth="2.4" strokeLinecap="round">
      <path d="M24 3v5M24 40v5M3 24h5M40 24h5M9.2 9.2l3.5 3.5M35.3 35.3l3.5 3.5M9.2 38.8l3.5-3.5M35.3 12.7l3.5-3.5" />
    </g>
    <circle cx="24" cy="24" r="12" fill="#f5b301" />
    <path d="M26.5 14l-8 12h5l-2 9 9-13h-5z" fill="#171a20" />
    <text
      x="52"
      y="25"
      fill="currentColor"
      fontFamily="inherit"
      fontSize="22"
      fontWeight="700"
      letterSpacing="4"
    >
      EDISON
    </text>
    <text
      x="52"
      y="39"
      fill="currentColor"
      fontFamily="inherit"
      fontSize="9"
      fontWeight="500"
      letterSpacing="3.4"
      opacity="0.8"
    >
      SOLUTION LAB
    </text>
  </svg>
);

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
);

export default function App() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [showLogin, setShowLogin] = useState(false); // NEW

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  // React does not always apply the "muted" attribute, which blocks autoplay.
  // Set it manually and start playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => setPlaying(false));
  }, []);

  return (
    <>
      <header className="nav">
        <a href="#" className="logo" aria-label="Edison Solution Lab home">
          <Logo />
        </a>

        <ul className="menu">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`}>{l}</a>
            </li>
          ))}
        </ul>

        <div className="icons">
          <Icon>
            <circle cx="12" cy="12" r="10" />
            <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.5" />
          </Icon>
          <Icon>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" />
          </Icon>
          {/* NEW: the user icon is now a button that opens the login popup */}
          <button
            type="button"
            className="icon-btn"
            onClick={() => setShowLogin(true)}
            aria-label="Sign in"
          >
            <Icon>
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3.5" />
              <path d="M5.5 19c1.5-3 4-4 6.5-4s5 1 6.5 4" />
            </Icon>
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="roof" />

        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div className="hero-content">
          <h1>Edison Solar Solutions</h1>
          <p>Save on Energy, Power Your Home</p>

          <div className="buttons">
            <button className="btn btn-blue">Order Now</button>
            <a href="#consultation" className="btn btn-white">
              Schedule a Consultation
            </a>
          </div>
        </div>

        <button
          className="play"
          onClick={toggleVideo}
          aria-label={playing ? "Pause video" : "Play video"}
        >
          <svg viewBox="0 0 24 24">
            {playing ? (
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            ) : (
              <path d="M6 4l14 8-14 8z" />
            )}
          </svg>
        </button>
      </section>

      <section className="savings" id="savings">
        <div className="container">
          <h2>Save on Electricity Bills</h2>
          <p className="lead">
            Generate your own clean energy from the sun with Edison Solar
            Panels. Add battery storage to keep your energy ready for use
            anytime you need it. Flexible financing, incentives and low monthly
            lease options can help you get the best price for your solar
            system. By installing solar panels, you can also reduce your
            reliance on traditional energy sources.
          </p>

          <div className="cards">
            {benefits.map((b) => (
              <article className="card" key={b.title}>
                <div className="card-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section" id="app">
        <div className="container">
          <div
            className="app-stage"
            role="img"
            aria-label="Edison app screens showing home energy, outage backup and monthly impact"
          >
            <Phone cls="ph-a">
              <div className="ph-title">
                <b>My Home</b> <span>&#8964;</span>
              </div>
              <div className="ph-green">Charging</div>
              <div className="ph-metrics">
                <div>
                  <b>0.8 kW</b>
                  <small>MODEL 3</small>
                </div>
                <div>
                  <b>6.5 kW</b>
                  <small>SOLAR</small>
                </div>
              </div>
              <House />
              <div className="ph-metric-low">
                <b>4.9 kW &middot; 89%</b>
                <small>BATTERY</small>
              </div>
              <div className="ph-list">
                <Row title="Energy" sub="28.8 kWh Generated Today" />
                <Row title="Impact" sub="46% Self-Powered Today" />
                <Row title="Virtual Power Plant" />
                <Row title="Settings" />
                <Row title="Go Off-Grid" />
                <Row title="Support" />
              </div>
            </Phone>

            <Phone cls="ph-b">
              <div className="ph-title">
                <b>My Home</b>
              </div>
              <div className="ph-charge">
                <u /> <span>97%</span>
              </div>
              <div className="ph-amber">
                Grid Outage: ~9 backup hours remaining
              </div>
              <div className="ph-metrics">
                <div>
                  <b>5.4 kW</b>
                  <small>SOLAR</small>
                </div>
              </div>
              <House />
              <div className="ph-metric-low">
                <b>4.7 kW &middot; 97%</b>
                <small>BATTERY</small>
              </div>
              <div className="ph-list">
                <Row title="Energy" sub="70.9 kWh Generated Today" />
                <Row title="Impact" sub="98% Self-Powered Today" />
                <Row title="Go Off-Grid" />
                <Row title="Settings" />
              </div>
            </Phone>

            <Phone cls="ph-c">
              <div className="ph-nav">
                <span>&#8249;</span>
                <b>Impact</b>
                <em>Month</em>
              </div>
              <p className="ph-date">April 2024</p>

              <div className="ph-card">
                <b className="ph-h">Self-Powered</b>
                <div className="ph-split">
                  <ul className="ph-legend">
                    <li style={{ "--c": "#f2c230" }}>
                      <b>42%</b> Solar
                    </li>
                    <li style={{ "--c": "#2ecc71" }}>
                      <b>54%</b> Battery
                    </li>
                    <li style={{ "--c": "#8b8f98" }}>
                      <b>4%</b> Grid
                    </li>
                  </ul>
                  <svg
                    className="ph-donut"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    {donut.map(([c, p, s]) => (
                      <circle
                        key={c}
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={c}
                        strokeWidth="8"
                        strokeDasharray={`${(CIRC * p) / 100} ${CIRC}`}
                        strokeDashoffset={-(CIRC * s) / 100}
                        transform="rotate(-90 50 50)"
                      />
                    ))}
                    <text
                      x="50"
                      y="58"
                      textAnchor="middle"
                      fontSize="26"
                      fill="#fff"
                    >
                      96%
                    </text>
                  </svg>
                </div>
              </div>

              <div className="ph-card">
                <b className="ph-h">Time-of-Use</b>
                <div className="ph-tabs">
                  <span className="on">
                    Peak<small>227.0 kWh</small>
                  </span>
                  <span>
                    Partial Peak<small>94.7 kWh</small>
                  </span>
                  <span>
                    Off-Peak<small>78.5 kWh</small>
                  </span>
                </div>
                {meters.map(([n, v, c]) => (
                  <div className="ph-meter" key={n}>
                    <div>
                      <span>{n}</span>
                      <span>{v}%</span>
                    </div>
                    <div className="ph-track">
                      <u style={{ width: `${v}%`, background: c }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="ph-card">
                <b className="ph-h">Solar Value</b>
                <div className="ph-chart">
                  {bars.map((h, i) => (
                    <u key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </Phone>
          </div>

          <h2 className="app-heading">Manage Everything in the Edison App</h2>
          <p className="lead">
            Monitor your solar production, battery charge and home usage in real
            time. Get outage alerts, see your monthly savings and control your
            system from anywhere.
          </p>
        </div>
      </section>

      <ContactForm />

      <footer className="footer" id="contact">
        <div className="container footer-grid">
          <div>
            <a
              href="#"
              className="logo footer-logo"
              aria-label="Edison Solution Lab home"
            >
              <Logo />
            </a>
            <p className="footer-tag">
              Clean solar energy for homes and businesses across Sri Lanka.
            </p>
          </div>

          <div>
            <h4>Contact</h4>
            <address>
              Nuwan Perera
              <br />
              No. 42/3, Galle Road
              <br />
              Colombo 03, 00300
              <br />
              Sri Lanka
            </address>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              {links
                .filter((l) => l !== "Contact")
                .map((l) => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`}>{l}</a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          &copy; {new Date().getFullYear()} Edison Solution Lab. All rights
          reserved.
        </div>
      </footer>

      {/* NEW: login popup */}
      {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
    </>
  );
}