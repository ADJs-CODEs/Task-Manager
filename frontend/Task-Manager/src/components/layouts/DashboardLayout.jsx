import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useTheme } from '../../context/ThemeContext';
import SideMenu from './SideMenu'
import Navbar from './Navbar'

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-[#0f172a]" : "bg-[#f8fafc]"}`}>
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className='flex'>
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className={`grow mx-5 ${isDarkMode ? "text-gray-800" : "text-gray-900"}`}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout