import { Link, useLocation } from "react-router-dom"; 
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut, 
  X, 
  Menu, 
  Clock,
} from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const pathname = location.pathname;
  
  const navigation = [
    { name: "Dashboard", href: "/provider", icon: LayoutDashboard },
    { name: "Appointments", href: "/provider/appointments", icon: Calendar },
    { name: "Services", href: "/provider/services", icon: Wrench },
    { name: "Clients", href: "/provider/clients", icon: Users },
    { name: "Schedule", href: "/provider/schedule", icon: Clock },
    { name: "Payments", href: "/provider/payments", icon: CreditCard },
    { name: "Settings", href: "/provider/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* Sidebar for desktop and mobile */}
      <div 
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-gradient-to-b from-blue-600 to-blue-800 shadow-lg transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:static md:z-0`}
        style={{
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          borderRadius: "0 24px 24px 0",
        }}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-6 bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center mr-3">
              <span className="text-blue-700 font-bold text-lg">P</span>
            </div>
            <h2 className="text-white text-xl font-bold">Provider Panel</h2>
          </div>
          <button
            className="text-white md:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="mt-6 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 mb-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-700 shadow-md transform scale-105"
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
                style={{
                  transform: isActive ? "translateY(-2px)" : "",
                  boxShadow: isActive ? "0 10px 15px rgba(0, 0, 0, 0.1)" : ""
                }}
              >
                <item.icon
                  className={`mr-3 ${isActive ? "text-blue-700" : "text-white"}`}
                  size={20}
                />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout button at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button className="flex w-full items-center px-4 py-3 text-white bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-200">
            <LogOut className="mr-3" size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg md:hidden"
        onClick={() => setOpen(!open)}
      >
        <Menu size={24} />
      </button>
    </>
  );
}