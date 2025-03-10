import React from "react";
import styles from "./StylesCheatsheet.module.css";

function Footer() {
    return (
        <footer className={styles.footer}>
            <nav className={styles.footerLinks}>
                <button className={styles.footerLink}>Contact Us</button>
                <button className={styles.footerLink}>Privacy Policy</button>
                <button className={styles.footerLink}>Terms & Conditions</button>
            </nav>
        </footer>
    );
}

export default Footer;
