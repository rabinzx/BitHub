import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Header from './components/Header'

function App() {
  const [count, setCount] = useState(0)
  const [nonce, setNonce] = useState("");

  useEffect(() => {
    fetch("/api/sayhello")
      .then((res) => console.log("API Response:", res))
      .catch((err) => console.error("API Error:", err));
  }, []);

  useEffect(() => {
    fetch("/api/nonce")
      .then((res) => res.json())
      .then((data) => setNonce(data.nonce));
  }, []);

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
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Routes>
        <Route path="/header" element={<Header />} />
      </Routes>
    </>
  )
}

export default App
