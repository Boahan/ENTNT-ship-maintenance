import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ship, Anchor, BarChart2, Users, Wrench, PenTool as Tool, Calendar, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, checkPermission } = useAuth();
  
  const closeNav = () => {
    setIsOpen(false);
  };
  
  const navItems = [
    {
      name: 'Dashboard',
      icon: <BarChart2 className="w-5 h-5" />,
      href: '/dashboard',
      allowed: true
    },
    {
      name: 'Ships',
      icon: <Ship className="w-5 h-5" />,
      href: '/ships',
      allowed: checkPermission('ships', 'view')
    },
    {
      name: 'Components',
      icon: <Tool className="w-5 h-5" />,
      href: '/components',
      allowed: checkPermission('components', 'view')
    },
    {
      name: 'Maintenance Jobs',
      icon: <Wrench className="w-5 h-5" />,
      href: '/jobs',
      allowed: checkPermission('jobs', 'view')
    },
    {
      name: 'Calendar',
      icon: <Calendar className="w-5 h-5" />,
      href: '/calendar',
      allowed: checkPermission('jobs', 'view')
    },
    {
      name: 'Users',
      icon: <Users className="w-5 h-5" />,
      href: '/users',
      allowed: checkPermission('users', 'view')
    }
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-navy-900">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link to="/dashboard" className="flex items-center">
                  <Anchor className="h-8 w-8 text-teal-500" />
                  <span className="ml-2 text-xl font-semibold text-white">ENTNT Marine</span>
                </Link>
              </div>
              
              <div className="px-4 mt-6 mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {user?.role}
                </p>
                <p className="text-sm text-gray-300 mt-1">{user?.email}</p>
              </div>
              
              <nav className="mt-2 flex-1 px-2 space-y-1">
                {navItems.filter(item => item.allowed).map((item) => {
                  const isActive = location.pathname.startsWith(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-navy-800 text-white'
                          : 'text-gray-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <div className={`mr-3 ${isActive ? 'text-teal-500' : 'text-gray-400 group-hover:text-teal-500'}`}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex-shrink-0 flex border-t border-navy-800 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-300 group-hover:text-white">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={closeNav}
          ></div>
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-navy-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={closeNav}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <Link to="/dashboard" className="flex items-center" onClick={closeNav}>
                  <Anchor className="h-8 w-8 text-teal-500" />
                  <span className="ml-2 text-xl font-semibold text-white">ENTNT Marine</span>
                </Link>
              </div>
              
              <div className="px-4 mt-6 mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {user?.role}
                </p>
                <p className="text-sm text-gray-300 mt-1">{user?.email}</p>
              </div>
              
              <nav className="mt-5 px-2 space-y-1">
                {navItems.filter(item => item.allowed).map((item) => {
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? 'bg-navy-800 text-white'
                          : 'text-gray-300 hover:bg-navy-800 hover:text-white'
                      }`}
                      onClick={closeNav}
                    >
                      <div className={`mr-4 ${isActive ? 'text-teal-500' : 'text-gray-400 group-hover:text-teal-500'}`}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex-shrink-0 flex border-t border-navy-800 p-4">
              <div className="flex-shrink-0 group block">
                <div className="flex items-center">
                  <div>
                    <p className="text-base font-medium text-white">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-14"></div>
        </div>
      )}
    </>
  );
};

export default Sidebar;