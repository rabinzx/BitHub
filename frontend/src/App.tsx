import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import './App.css'
import ThemeSelect from './components/ThemeSelect';
import SideBar from './components/SideBar';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo } from './store/authSlice';
import { RootState } from './store/store';
import axiosInstance from './api/axiosInstance';

function App() {
  const [nonce, setNonce] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const sidebarRef = useRef<HTMLElement | null>(null);

  const sidebarOpenHandler = () => {
    setIsSidebarOpen((prev) => !prev);
  }

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

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node | null;
      if (sidebarRef.current && !sidebarRef.current.contains(target)) {
        setIsSidebarOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  const logOffHandler = () => {
    dispatch(clearUserInfo());
    axiosInstance.post('/auth/logoff').then(r => {
      navigate('/'); // Redirect to login page
    });
  }

  return (
    <div className="flex flex-col min-h-screen drop-shadow-md" >
      {/* Header */}
      <header className="header-footer p-4 top-0 w-full flex justify-between items-center">
        <h2 className="text-lg font-bold">BitHub</h2>
        {userInfo &&
          <div className='flex gap-2'>
            <ThemeSelect />
            <button
              onClick={sidebarOpenHandler}
            >
              Menu
            </button>
            <button
              onClick={logOffHandler}
            >
              Log Off
            </button>
          </div>
        }
      </header>

      {/* Layout Wrapper */}
      <div className="flex flex-1" >
        <SideBar isSidebarOpen={isSidebarOpen} ref={sidebarRef} />
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
