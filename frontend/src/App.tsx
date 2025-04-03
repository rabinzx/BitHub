import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Header from './components/Header';
import InputComponent from './components/InputComponent';

function App() {
  const [count, setCount] = useState(0)
  const [nonce, setNonce] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [firstName, setFirstName] = useState("John" as string | number);

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
    <div className="flex flex-col min-h-screen max-w-[1000px] drop-shadow-md" >
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 top-0 w-full flex justify-between items-center">
        <h2 className="text-lg font-bold">BitHub</h2>
        <button aria-hidden="true"
          onClick={sidebarOpenHandler}
        >
          Toggle Sidebar
        </button>
      </header>

      {/* Layout Wrapper */}
      <div className="flex flex-[1_0_auto]" >
        {/* Sidebar */}
        {isSidebarOpen &&
          <aside
            className={`bg-gray-800 text-white w-64 p-4 fixed md:relative transition-all ${isSidebarOpen ? "left-0" : "-left-64"
              } md:left-0`}
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
        }

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Welcome to My Landing Page</h2>
          <p className="text-gray-700">
            This is a fully responsive landing page with a top header, left sidebar, and sticky footer.This is a fully responsive landing page with a top header, left sidebar, and sticky footer.This is a fully responsive landing page with a top header, left sidebar, and sticky footer.This is a fully responsive landing page with a top header, left sidebar, and sticky footer.This is a fully responsive landing page with a top header, left sidebar, and sticky footer.This is a fully responsive landing page with a top header, left sidebar, and sticky footer.
          </p>

          <div className=''>
            {/* Input Component */}
            <InputComponent inputType="text" inputValue={firstName} onChange={(_firstName) => setFirstName(_firstName)} />
            {firstName}
          </div>

        </main>

        {/* Routes for different components */}
        <Routes>
          <Route path="/header" element={<Header />} />
        </Routes>
      </div>
      {/* Footer */}
      <footer className="flex-shrink-0 bg-blue-600 text-white text-center p-3 ">
        © 2025 BitHub. All rights reserved.
      </footer>
    </div>
  )
}

export default App
