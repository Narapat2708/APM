"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  FaCalendarAlt, 
  FaUser, 
  FaCog, 
  FaChartBar, 
  FaBell, 
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // ตรวจสอบหน้าจอเป็น mobile หรือไม่
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // เมนู sidebar ภาษาไทย
  const SIDEBAR_MENU = [
    { 
      id: 1, 
      name: "แดชบอร์ด", 
      icon: <FaChartBar />, 
      path: "/dashboard", 
      active: pathname === "/dashboard" 
    },
    { 
      id: 2, 
      name: "การนัดหมาย", 
      icon: <FaCalendarAlt />, 
      path: "/appointment", 
      active: pathname === "/appointment" 
    },
    { 
      id: 3, 
      name: "ลูกค้า", 
      icon: <FaUser />, 
      path: "/customers", 
      active: pathname === "/customers" 
    },
    { 
      id: 4, 
      name: "การแจ้งเตือน", 
      icon: <FaBell />, 
      path: "/notifications", 
      active: pathname === "/notifications" 
    },
    { 
      id: 5, 
      name: "การตั้งค่า", 
      icon: <FaCog />, 
      path: "/settings", 
      active: pathname === "/settings" 
    },
    { 
      id: 6, 
      name: "ช่วยเหลือ", 
      icon: <FaQuestionCircle />, 
      path: "/help", 
      active: pathname === "/help" 
    },
  ]

  const handleMenuItemClick = (path) => {
    router.push(path)
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    // Logout logic here
    router.push("/login")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile Menu Button (แสดงเฉพาะบนมือถือ) */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-purple-600 text-white shadow-lg"
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'sticky'} 
        top-0 left-0 h-screen z-40
        transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="w-full h-full bg-[#1A1A1A] text-white flex flex-col font-noto-thai">
          
          {/* Logo / Header */}
          <div className={`p-4 border-b border-gray-800 ${isCollapsed ? 'px-3' : 'px-6'}`}>
            <div className="flex items-center justify-between">
              <div 
                className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''} transition-all`}
                onClick={() => router.push("/")}
              >
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <FaCalendarAlt className="text-white text-lg" />
                </div>
                
                {!isCollapsed && (
                  <div className="overflow-hidden transition-all duration-300">
                    <h1 className="text-xl font-bold truncate">การนัดหมาย</h1>
                    <p className="text-xs text-gray-400 truncate">ระบบจัดการนัดหมาย</p>
                  </div>
                )}
              </div>
              
              {/* Collapse Button (แสดงเฉพาะบน desktop) */}
              {!isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="hidden lg:flex p-1 hover:bg-gray-800 rounded"
                  title={isCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
                >
                  {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-2 lg:p-3 overflow-y-auto">
            <ul className="space-y-1">
              {SIDEBAR_MENU.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuItemClick(item.path)}
                    className={`
                      flex items-center w-full px-3 py-3 rounded-lg transition-all
                      hover:bg-gray-800 hover:text-white
                      ${item.active 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-gray-300'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.name : ""}
                  >
                    <span className="text-lg min-w-[24px] flex justify-center">
                      {item.icon}
                    </span>
                    
                    {!isCollapsed && (
                      <span className="font-medium ml-3 text-left flex-1 truncate">
                        {item.name}
                      </span>
                    )}
                    
                    {item.active && !isCollapsed && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* User Profile */}
          <div className={`border-t border-gray-800 ${isCollapsed ? 'p-2' : 'p-4'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">AD</span>
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold text-sm truncate">ผู้ดูแลระบบ</h3>
                  <p className="text-xs text-gray-400 truncate">แอดมิน</p>
                </div>
              )}
            </div>
            
            {/* Logout Button */}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full mt-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">ออกจากระบบ</span>
              </button>
            )}
            
            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden w-full mt-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all text-center"
              >
                ปิดเมนู
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Padding สำหรับ Mobile */}
      {isMobile && (
        <div className="lg:hidden h-16"></div>
      )}
    </>
  )
}