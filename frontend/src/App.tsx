import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Outlet, useNavigate } from "react-router-dom";
import './App.css'
import MainCanvas from './pages/MainCanvas';
import SidePage from './pages/SidePage';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo } from './store/authSlice';
import { RootState } from './store/store';

function App() {
  const [count, setCount] = useState(0)
  const [nonce, setNonce] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

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

  const logOffHandler = () => {
    dispatch(clearUserInfo());
    navigate('/'); // Redirect to login page
  }

  return (
    <div className="flex flex-col min-h-screen drop-shadow-md" >
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 top-0 w-full flex justify-between items-center">
        <h2 className="text-lg font-bold">BitHub</h2>
        {userInfo &&
          <div>
            <button className='mr-4!'
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
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 text-white relative z-50 w-[250px] flex-shrink-0 transform transition-transform duration-250 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <nav className="space-y-4">
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Home
            </a>
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              About
            </a>
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Services
            </a>
            <a href="#" className="block p-2 hover:bg-gray-700 rounded">
              Contact
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-250 p-6 bg-gray-100 -ml-[250px] ${isSidebarOpen && "md:ml-0"}`}>
          {/* Route outlet */}
          <Outlet />
        </main>
      </div>
      {/* Footer */}
      <footer className="flex-shrink-0 bg-blue-600 text-white text-center p-3 ">
        © 2025 BitHub. All rights reserved.
      </footer>
    </div>
  )
}

export default App
