// src/components/Layout.jsx
import { useState } from 'react';
import MainNavbar from './MainNavbar'; // new top navbar with hamburger
import Navbar from './Navbar';         // existing navbar you want to keep
import Sidebar from './Sidebar';

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* New MainNavbar at the very top */}
      <div className="p-10 h-[100px] z-10">
        <h2 className='text-9xl'>hello</h2>
        <MainNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Rest of layout: sidebar + current navbar + main content */}
      <div className="flex flex-1 overflow-hidden ">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="h-full">
            <Sidebar />
          </div>
        )}

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden ps-5 pt-5">
          <div>
            <Navbar />
          </div>
          <main className="flex-1 overflow-y-auto ">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
