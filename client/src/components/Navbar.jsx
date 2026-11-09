// import { Link } from "react-router-dom";
// import { Heart, Menu } from "lucide-react";
// // import { Link } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

// export default function Navbar() {
//     const { user, logout } = useAuth();
//   return (
//     <header className="sticky top-0 z-50 border-b border-[#e8e9df] bg-[#fafaf6]/95 backdrop-blur">
//       <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
//         <Link to="/" className="flex items-center gap-2">
//           <span className="rounded-xl bg-[#e5f0e5] p-2 text-[#347354]">
//             <Heart size={22} />
//           </span>
//           <span className="text-lg font-bold tracking-tight">
//             सहारा <span className="text-[#347354]">सेतु</span>
//           </span>
//         </Link>

//         <div className="hidden items-center gap-8 text-sm font-medium md:flex">
//           <Link to="/" className="hover:text-[#347354]">
//             होम
//           </Link>
//           <Link to="/eligibility" className="hover:text-[#347354]">
//             पात्रता खोजें
//           </Link>
//           <Link to="/eligibility-assistant">योजना सहायक</Link>
//           <a href="/#schemes" className="hover:text-[#347354]">
//             योजनाएँ
//           </a>
//           <a href="#help" className="hover:text-[#347354]">
//             सहायता
//           </a>
//         </div>

//         <Link
//           to="/eligibility"
//           className="hidden rounded-full bg-[#347354] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285b42] md:block"
//         >
//           अपनी योजना खोजें
//         </Link>

//         <Link to="/campaigns">Campaigns</Link>

//         {!user ? (
//           <div className="flex items-center gap-3">
//             <Link
//               to="/login"
//               className="text-emerald-800 font-semibold px-4 py-2"
//             >
//               Login
//             </Link>

//             <Link
//               to="/register"
//               className="bg-emerald-800 text-white rounded-lg px-4 py-2"
//             >
//               Register
//             </Link>
//           </div>
//         ) : (
//           <div className="flex items-center gap-3">
//             <Link
//               to="/donor/dashboard"
//               className="text-emerald-800 font-semibold"
//             >
//               Dashboard
//             </Link>

//             <button
//               onClick={logout}
//               className="border border-stone-300 rounded-lg px-4 py-2"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//         <button className="rounded-lg p-2 md:hidden" aria-label="Menu">
//           <Menu />
//         </button>
//       </nav>
//     </header>
//   );
// }


import { Link, NavLink, useLocation } from "react-router-dom";
import { Heart, Menu, X, Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "होम", end: true },
    // { to: "/#schemes", label: "योजनाएँ" },
    { to: "/eligibility", label: "पात्रता खोजें" },
    { to: "/campaigns", label: "अभियान" },
    // { to: "/#help", label: "सहायता" },
  ];

  const isActive = (to, end) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  const linkClass = (active) =>
    `relative whitespace-nowrap py-2 text-sm font-semibold transition-colors duration-200
    ${active ? "text-[#176344]" : "text-[#46574c] hover:text-[#176344]"}
    after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full
    after:bg-[#176344] after:transition-all after:duration-300
    ${active ? "after:w-full" : "after:w-0 hover:after:w-full"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce9df] bg-[#edf5ed]/95 shadow-sm backdrop-blur-lg">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-5 px-5 py-3 md:px-8">

        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="rounded-xl bg-[#176344] p-2.5 text-white shadow-md shadow-green-900/15">
            <Heart size={22} strokeWidth={2.3} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#244d38]">
            सहारा <span className="text-[#176344]">सेतु</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => linkClass(isActive)}
            >
              {link.label}
            </NavLink>
          ))}
          <a href="/#schemes" className="hover:text-[#347354]">
              योजनाएँ
            </a>
            <a href="#help" className="hover:text-[#347354]">
              सहायता
            </a>

          {/* Special AI assistant link */}
          <NavLink
            to="/eligibility-assistant"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-200
              ${
                isActive
                  ? "border-[#8b5cf6] bg-[#6d43b5] text-white shadow-md shadow-purple-900/20"
                  : "border-[#d9c8f5] bg-[#f1eaff] text-[#7042a5] hover:border-[#9b75d0] hover:bg-[#e8dcff]"
              }`
            }
          >
            <Sparkles size={16} />
            योजना सहायक
            <span className="rounded-full bg-white/30 px-1.5 py-0.5 text-[10px]">
              AI
            </span>
          </NavLink>
        </div>

        {/* Desktop authentication */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-bold text-[#176344] transition hover:bg-white/70"
              >
                लॉगिन
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-[#176344] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-green-900/15 transition hover:-translate-y-0.5 hover:bg-[#104d34]"
              >
                पंजीकरण करें
              </Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === "TRUST_ADMIN" ? "/admin/dashboard" : "/donor/dashboard"}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#176344] hover:bg-white/70"
              >
                <LayoutDashboard size={17} />
                {user.role === "TRUST_ADMIN" ? "एडमिन डैशबोर्ड" : "मेरा डैशबोर्ड"}
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-lg border border-[#cbdace] px-3 py-2 text-sm font-semibold text-[#46574c] hover:bg-white"
              >
                <LogOut size={16} />
                लॉगआउट
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl border border-[#cbdace] bg-white p-2 text-[#176344] md:hidden"
          aria-label={mobileOpen ? "मेन्यू बंद करें" : "मेन्यू खोलें"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#dce9df] bg-[#edf5ed] px-5 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-white text-[#176344] shadow-sm"
                      : "text-[#46574c] hover:bg-white/70"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              to="/eligibility-assistant"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#7042a5] px-4 py-3 text-sm font-bold text-white"
            >
              <Sparkles size={17} />
              योजना सहायक (AI)
            </NavLink>

            <div className="my-2 border-t border-[#dce9df]" />

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 font-semibold text-[#176344]"
                >
                  लॉगिन
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-[#176344] px-4 py-3 text-center font-bold text-white"
                >
                  पंजीकरण करें
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user.role === "TRUST_ADMIN" ? "/admin/dashboard" : "/donor/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 font-semibold text-[#176344]"
                >
                  मेरा डैशबोर्ड
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="rounded-lg px-4 py-3 text-left font-semibold text-red-700"
                >
                  लॉगआउट
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}