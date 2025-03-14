import { Link, useLocation } from "react-router-dom";
import { FaBars, FaUserMd, FaTicketAlt, FaSignInAlt, FaHome } from "react-icons/fa";
import { MdDashboard, MdViewCarousel } from "react-icons/md";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <MdDashboard /> },
    { path: "/doctors", name: "Doctors", icon: <FaUserMd /> },
    { path: "/tokens", name: "Token Booking", icon: <FaTicketAlt /> },
    { path: "/token-panel", name: "Token Panel", icon: <MdViewCarousel /> },
    { path: "/login", name: "Login", icon: <FaSignInAlt /> },
  ];

  return (
    <div className="flex h-screen">
      <div
        className={`bg-gray-900 h-full min-h-screen text-white flex flex-col shadow-xl transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b border-gray-700">
          <FaBars 
            className="text-2xl cursor-pointer hover:text-blue-400 transition-colors" 
            onClick={() => setIsOpen(!isOpen)} 
          />
          {isOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-6 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-4 my-2 rounded-lg transition-all ${
                  location.pathname === item.path 
                    ? "bg-blue-600 shadow-md" 
                    : "hover:bg-gray-800 hover:translate-x-1"
                }`}
              >
                <span className={`text-xl ${location.pathname === item.path ? "text-white" : "text-gray-300"}`}>
                  {item.icon}
                </span>
                {isOpen && (
                  <span className={`ml-4 font-medium ${location.pathname === item.path ? "text-white" : "text-gray-300"}`}>
                    {item.name}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-all"
          >
            <span className="text-xl text-gray-300">
              <FaHome />
            </span>
            {isOpen && <span className="ml-4 font-medium text-gray-300">Home</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;