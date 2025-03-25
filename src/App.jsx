import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUp from "./pages/SignUp";

import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard.jsx";
import Wrapper from "./pages/Wrapper.jsx";

//Re-formatted page and component imports
import MonthlySpending from "./pages/WelcomePage.jsx";
import Reviews from "./pages/Reviews.jsx";
import Welcome from "./pages/Welcome.jsx";

import Data from "./finances/DataAnalysis.jsx";
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
                <Welcome/>
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
                <Route path="/signin" element={<SignIn />}/>
                <Route path="/data" element={<Data/>}/>
                <Route path="/dashboard" element={
                    <Wrapper>
                        <Dashboard />
                    </Wrapper>
                } />
                {/* Add more routes here */}
            </Routes>
        </BrowserRouter>
    )
}

export default App;