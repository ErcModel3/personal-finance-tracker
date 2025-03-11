import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import ReactDOM from 'react-dom/client';
import SignUp from "./pages/SignUp";
import WelcomePart from "./Features/WelcomePart.jsx";

//Re-formatted page and component imports
import MonthlySpending from "./pages/Dashboard.jsx";
import Reviews from "./pages/Reviews.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// Imports all graphics
import imgUrl from './assets/Graph_Photos.png'


function Home() {
  return (
    <>
      <p className="read-the-docs">
      </p>
      <div>
          <Navbar/>
          <WelcomePart/>
          <MonthlySpending/>
          <img src={imgUrl} alt="X"/>
          <Reviews/>
          <Footer/>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
