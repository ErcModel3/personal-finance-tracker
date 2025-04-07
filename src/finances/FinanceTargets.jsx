import React, { useState } from 'react';
import './FinanceTargets.css';
import AuthenticatedNavbar from "../components/AuthenticatedNavbar.jsx";
import Footer from "../components/Footer.jsx";

const FinanceTargets = () => {
    const [targetName, setTargetName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('New target:', { targetName, targetAmount, targetDate });
        // To do: Add target creation logic here
        alert('Financial target created!');
        // Reset form
        setTargetName('');
        setTargetAmount('');
        setTargetDate('');
    };

    return (
        <div className="finance-targets-page">
            <AuthenticatedNavbar />

            <div className="content-section">
                <h2 className="section-title">Your Financial Targets</h2>
                <p className="section-description">Track your progress towards your financial goals</p>

                <div className="targets-grid">
                    <div className="target-card">
                        <h3>Savings Goals</h3>
                        <p className="target-amount">£5,000</p>
                        <p className="target-description">Building an emergency fund</p>
                        <div className="progress-container">
                            <div className="progress-bar" style={{width: '65%'}}></div>
                        </div>
                        <p className="progress-text">65%</p>
                    </div>

                    <div className="target-card">
                        <h3>Long-Term Goal</h3>
                        <p className="target-amount">£15,000</p>
                        <p className="target-description">Home down payment</p>
                        <div className="progress-container">
                            <div className="progress-bar" style={{width: '35%'}}></div>
                        </div>
                        <p className="progress-text">35%</p>
                    </div>

                    <div className="target-card">
                        <h3>Purchase Goal</h3>
                        <p className="target-amount">£1,200</p>
                        <p className="target-description">New laptop</p>
                        <div className="progress-container">
                            <div className="progress-bar" style={{width: '90%'}}></div>
                        </div>
                        <p className="progress-text">90%</p>
                    </div>
                </div>
            </div>

            <div className="content-section">
                <h2 className="section-title">Set New Financial Target</h2>
                <p className="section-description">Set your financial target, set your date, and we'll help you update it weekly.</p>

                <form className="new-target-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="targetName">Target Name</label>
                        <input
                            type="text"
                            id="targetName"
                            value={targetName}
                            onChange={(e) => setTargetName(e.target.value)}
                            placeholder="What are you saving for?"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="targetAmount">Amount (£)</label>
                            <input
                                type="number"
                                id="targetAmount"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="targetDate">Target Date</label>
                            <input
                                type="date"
                                id="targetDate"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="create-target-btn">Create Target</button>
                </form>
            </div>

            <div className="content-section">
                <h2 className="section-title">Monthly Contributions</h2>
                <p className="section-description">An overview of your monthly contributions towards your goals</p>

                <div className="contributions-grid">
                    <div className="contribution-card">
                        <p className="contribution-month">JAN</p>
                        <p className="contribution-amount">£600</p>
                    </div>

                    <div className="contribution-card">
                        <p className="contribution-month">FEB</p>
                        <p className="contribution-amount">£550</p>
                    </div>

                    <div className="contribution-card">
                        <p className="contribution-month">MAR</p>
                        <p className="contribution-amount">£650</p>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <div className="info-card">
                    <h3>Set a Goal</h3>
                    <p>Define clear savings targets</p>
                </div>

                <div className="info-card">
                    <h3>Track Progress</h3>
                    <p>Monitor your journey to success</p>
                </div>
            </div>

            <div className="content-section">
                <h2 className="section-title">Upcoming Deadlines</h2>
                <p className="section-description">Stay on track with your financial goals</p>

                <div className="deadline-card">
                    <div className="deadline-icon-custom"></div>
                    <div className="deadline-info">
                        <h3>Vacation Fund</h3>
                        <p>Target deadline: June 15, 2025</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FinanceTargets;