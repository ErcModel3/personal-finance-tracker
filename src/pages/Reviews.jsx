import React from "react";
import styles from "./Styles.module.css";

function StarRating() {
    return (
        <svg
            width="59"
            height="10"
            viewBox="0 0 59 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {[...Array(5)].map((_, i) => (
                <path
                    key={i}
                    d={`M${5.086 + i * 12} 
                    0.38C${5.27 + i * 12} 
                    0.0013 ${5.80 + i * 12} 
                    0.0013 ${5.98 + i * 12} 
                    0.37L${7.18 + i * 12} 
                    2.80C${7.25 + i * 12} 
                    2.95 ${7.39 + i * 12} 
                    3.050 ${7.55 + i * 12} 
                    3.080L${10.23 + i * 12} 
                    3.46C${10.65 + i * 12} 
                    3.52 ${10.81 + i * 12} 
                    4.030 ${10.52 + i * 12} 
                    4.32L${8.58 + i * 12} 
                    6.21C${8.45 + i * 12} 
                    6.32 ${8.40 + i * 12} 
                    6.45 ${8.43 + i * 12} 
                    6.65L${8.89 + i * 12} 
                    9.32C${8.96 + i * 12} 
                    9.73 ${8.53 + i * 12} 
                    10.04 ${8.16 + i * 12} 
                    9.85L${5.77 + i * 12} 
                    8.60C${5.62 + i * 12} 
                    8.51 ${5.44 + i * 12} 
                    8.51 ${5.30 + i * 12} 
                    8.59L${2.90 + i * 12} 
                    9.85C${2.54 + i * 12} 
                    10.04 ${2.11 + i * 12} 
                    9.73 ${2.17 + i * 12} 
                    9.32L${2.63 + i * 12} 
                    6.65C${2.66 + i * 12} 
                    6.49 ${2.61 + i * 12} 
                    6.32 ${2.49 + i * 12} 
                    6.21L${0.55 + i * 12} 
                    4.32C${0.25 + i * 12} 
                    4.028 ${0.42 + i * 12} 
                    3.52 ${0.83 + i * 12} 
                    3.46L${3.51 + i * 12} 
                    3.071C${3.67 + i * 12} 
                    3.052 ${3.81 + i * 12} 
                    2.95 ${3.89 + i * 12} 
                    2.81L${5.08+ i * 12} 
                    `}
                    fill="#FFC700"
                />
            ))}
        </svg>
    );
}

function ReviewCard({ name, text }) {
    return (
        <article className={styles.reviewCard}>
            <header className={styles.reviewHeader}>
                <div className={styles.reviewerAvatar} />
                <h3 className={styles.reviewerName}>{name}</h3>
                <StarRating />
            </header>
            <p className={styles.reviewText}>{text}</p>
        </article>
    );
}

function Reviews() {
    const reviews = [
        { name: "Alice Smith", text: "Great product, excellent service" },
        { name: "Bob Johnson", text: "Highly recommend this company" },
        { name: "Eva Brown", text: "Very satisfied with my purchase" },
    ];

    return (
        <section className={styles.reviewsSection}>
            <header className={styles.reviewsHeader}>
                <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
                <p className={styles.reviewsDescription}>
                    Feedback from our valued customers
                </p>
                <button className={styles.primaryButton}>View All Reviews</button>
            </header>
            <div className={styles.reviewsGrid}>
                {reviews.map((review, index) => (
                    <ReviewCard key={index} {...review} />
                ))}
            </div>
        </section>
    );
}

export default Reviews;
