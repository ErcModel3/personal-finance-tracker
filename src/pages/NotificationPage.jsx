import NotificationList from "../Features/NotificationsComponents/NotificationList.jsx";
import NotificationHeader from "../Features/NotificationsComponents/NotificationHeader.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function NotificationPage () {
    return (
        <div>
            <Navbar/>
            <NotificationHeader/>
            <NotificationList/>
            <Footer/>
        </div>
    )
}

export default NotificationPage;