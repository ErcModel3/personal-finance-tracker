import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import ReactDOM from 'react-dom/client';
// Imports for all of the pages and components
import SignUp from "./pages/SignUp";
import Navbar from "./Features/Navbar.jsx";
import Footer from "./Features/Footer.jsx";
import WelcomePart from "./Features/WelcomePart.jsx";
import MonthlySpending from "./Features/MonthlySpending.jsx";
import ReviewSection from "./Features/ReviewSection.jsx";
// Import of Photos
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
