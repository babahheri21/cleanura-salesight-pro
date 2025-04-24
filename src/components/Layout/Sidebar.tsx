
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  BarChart, 
  FileText, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

const Sidebar = () => {
  const { currentUser, logout } = useData();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      path: "/dashboard",
      roles: ["admin", "user", "guest"],
    },
    {
      icon: <Package size={20} />,
      label: "Products",
      path: "/products",
      roles: ["admin", "user"],
    },
    {
      icon: <Users size={20} />,
      label: "Customers",
      path: "/customers",
      roles: ["admin", "user"],
    },
    {
      icon: <ShoppingCart size={20} />,
      label: "Sales",
      path: "/sales",
      roles: ["admin", "user"],
    },
    {
      icon: <CreditCard size={20} />,
      label: "Expenses",
      path: "/expenses",
      roles: ["admin", "user"],
    },
    {
      icon: <BarChart size={20} />,
      label: "Reports",
      path: "/reports",
      roles: ["admin", "user", "guest"],
    },
    {
      icon: <FileText size={20} />,
      label: "Balance Sheet",
      path: "/balance-sheet",
      roles: ["admin"],
    },
    {
      icon: <FileText size={20} />,
      label: "Profit/Loss",
      path: "/profit-loss",
      roles: ["admin"],
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/settings",
      roles: ["admin"],
    },
  ];

  return (
    <div
      className={`bg-white border-r border-gray-200 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col transition-width duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <span className="font-bold text-xl text-cleanura-700">Cleanura</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map(
            (item) =>
              (currentUser &&
                item.roles.includes(currentUser.role)) && (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 ${
                      collapsed ? "justify-center" : "justify-start"
                    } rounded-md transition-colors ${
                      isActive
                        ? "bg-cleanura-50 text-cleanura-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              )
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className={`flex items-center px-3 py-2.5 ${
            collapsed ? "justify-center" : "justify-start"
          } rounded-md text-gray-600 hover:bg-gray-100 w-full transition-colors`}
        >
          <LogOut size={20} />
          {!collapsed && (
            <span className="ml-3 text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
