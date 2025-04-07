import NotificationList from "../Features/NotificationsComponents/NotificationList.jsx";
import NotificationHeader from "../Features/NotificationsComponents/NotificationHeader.jsx";
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";

function NotificationPage () {
    return (
        <div>
            <AuthenticatedNavbar/>
            <NotificationHeader/>
            <NotificationList/>
            <Footer/>
        </div>
    )
}

export default NotificationPage;