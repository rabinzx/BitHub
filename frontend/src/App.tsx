import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Outlet } from "react-router-dom";
import './App.css'
import MainCanvas from './pages/MainCanvas';
import SidePage from './pages/SidePage';
import ThemeSelect from './components/ThemeSelect';
import SideBar from './components/SideBar';

function App() {
  const [count, setCount] = useState(0)
  const [nonce, setNonce] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  const sidebarOpenHandler = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  // useEffect(() => {
  //   fetch("/api/sayhello")
  //     .then((res) => console.log("API Response:", res))
  //     .catch((err) => console.error("API Error:", err));
  // }, []);

  // useEffect(() => {
  //   fetch("/api/nonce")
  //     .then((res) => res.json())
  //     .then((data) => setNonce(data.nonce));
  // }, []);

  useEffect(() => {
    if (nonce) {
      console.log("Nonce:", nonce);
      // const analytics = Analytics({
      //   trackingId: "UA-XXXXXXX-X",
      //   nonce: nonce,  // Pass the nonce here
      // });

      //analytics.page();
    }
  }, [nonce]);

  return (
    <div className="flex flex-col min-h-screen drop-shadow-md" >
      {/* Header */}
      <header className="header-footer p-4 top-0 w-full flex justify-between items-center">
        <h2 className="text-lg font-bold">BitHub</h2>
        <div className='flex gap-2'>
          <ThemeSelect />
          <button aria-hidden="true"
            onClick={sidebarOpenHandler}
          >
            Menu
          </button>
        </div>
      </header>

      {/* Layout Wrapper */}
      <div className="flex flex-1" >
        <SideBar isSidebarOpen={isSidebarOpen} />
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-250 p-6 -ml-[250px] ${isSidebarOpen && "md:ml-0"}`}>
          {/* Route outlet */}
          <Outlet />
        </main>
      </div>
      {/* Footer */}
      <footer className="flex-shrink-0 header-footer text-center p-3 ">
        © 2025 BitHub. All rights reserved.
      </footer>
    </div>
  )
}

export default App
