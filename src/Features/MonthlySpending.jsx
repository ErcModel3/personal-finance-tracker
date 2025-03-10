import React from "react";
import styles from "./StylesCheatsheet.module.css";

function MetricCard({ label, amount }) {
    return (
        <article className={styles.metricCard}>
            <p className={styles.metricLabel}>{label}</p>
            <p className={styles.metricValue}>{amount}</p>
        </article>
    );
}

function MonthlySpending() {
    return (
        <section className={styles.metricsSection}>
            <header className={styles.metricsHeader}>
                <h2 className={styles.metricsTitle}>Monthly Spending Overview</h2>
                <p className={styles.metricsDescription}>
                    See how your expenses are distributed.
                </p>
            </header>
            <div className={styles.metricsCards}>
                <MetricCard label="Food" amount="$500" />
                <MetricCard label="Leisure" amount="$300" />
                <MetricCard label="Transport" amount="$200" />
            </div>
        </section>
    );
}

export default MonthlySpending;
