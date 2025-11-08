// src/components/TodaysSummary.jsx

import React from 'react';

const TodaysSummary = ({ tasks }) => {
    // 1. TÍNH TOÁN (Logic quan trọng)
    const calculateSummary = () => {
        const summary = {
            Total: tasks.length,
            Complete: 0,
            Late: 0,
            InProgress: 0
        };

        tasks.forEach(task => {
            if (task.status === 'Complete') {
                summary.Complete += 1;
            } else if (task.status === 'Late') {
                summary.Late += 1;
            } else if (task.status === 'In Progress') {
                summary.InProgress += 1;
            }
        });
        return summary;
    };

    const summaryData = calculateSummary();

    return (
        <div className="summary-content">
            <h2 className="summary-title-large">Today</h2>
            
            <div className="summary-details">
                <div className="summary-row total-row">
                    <span>Total :</span>
                    <span className="total-value">{summaryData.Total}</span>
                </div>
                <div className="summary-row complete-row">
                    <span>Complete :</span>
                    <span className="complete-value">{summaryData.Complete}</span>
                </div>
                <div className="summary-row late-row">
                    <span>Late :</span>
                    <span className="late-value">{summaryData.Late}</span>
                </div>
                <div className="summary-row progress-row">
                    <span>In Progress :</span>
                    <span className="progress-value">{summaryData.InProgress}</span>
                </div>
            </div>
        </div>
    );
};

export default TodaysSummary;