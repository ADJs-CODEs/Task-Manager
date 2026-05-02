import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuSun, LuMoon } from 'react-icons/lu';
import SideMenu from './SideMenu';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center justify-between gap-5 backdrop-blur-md border-b py-3.5 px-7 sticky top-0 z-30 transition-colors duration-300
      ${isDarkMode
        ? "bg-[#1e293b]/90 border-white/6"
        : "bg-white/80 border-gray-200/60"
      }`}
      style={{ boxShadow: '0 1px 20px rgba(0,0,0,0.06)' }}>

      <div className="flex items-center gap-4">
        <button
          className={`block lg:hidden transition ${isDarkMode ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <h2 className={`text-[15px] font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Task Manager
          </h2>
        </div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all
          ${isDarkMode
            ? "bg-white/10 border-white/10 text-slate-300 hover:bg-white/15"
            : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
          }`}
      >
        {isDarkMode ? <LuSun className="text-sm text-yellow-400" /> : <LuMoon className="text-sm text-slate-500" />}
        {isDarkMode ? "Light" : "Dark"}
      </button>

      {openSideMenu && (
        <div className="fixed top-[57px] left-0 w-64 shadow-xl z-40">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  )
}

export default Navbar