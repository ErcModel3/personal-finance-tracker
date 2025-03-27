import React from "react";
import { Link } from 'react-router-dom';
import styles from "../Styles.module.css";

function Footer() {
    return (
        <footer className={styles.footer}>
            <nav className={styles.footerLinks}>
                <Link to="/contact" className={styles.footerLink}>Contact Us</Link>
                <Link to="/policy" className={styles.footerLink}>Privacy Policy</Link>
                <Link to="/terms" className={styles.footerLink}>Terms & Conditions</Link>
            </nav>
        </footer>
    );
}

export default Footer;