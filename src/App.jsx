import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import ReactDOM from 'react-dom/client';
import SignUp from "./pages/SignUp";
import Navbar from "./Features/Navbar.jsx";
import WelcomePart from "./Features/WelcomePart.jsx";
import ReviewSection from "./Features/ReviewSection.jsx";

//Re-formatted page and component imports
import MonthlySpending from "./pages/Dashboard.jsx";
import Reviews from "./pages/Reviews.jsx";
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
          <ReviewSection/>
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
