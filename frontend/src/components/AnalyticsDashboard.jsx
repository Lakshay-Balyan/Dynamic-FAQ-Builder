// src/components/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const AnalyticsWidget = ({ title, data, keyField, valueField }) => (
  <div className="analytics-widget">
    <h3>{title}</h3>
    <ul className="analytics-list">
      {data.length > 0 ? (
        data.map((item, index) => (
          <li key={index} className="analytics-list-item">
            <span>{item[keyField]}</span>
            <span className="count">{item[valueField]}</span>
          </li>
        ))
      ) : (
        <p>No data to display.</p>
      )}
    </ul>
  </div>
);

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiClient.get('/analytics/dashboard');
        setAnalytics(res.data);
      } catch (_) { // eslint-disable-line no-unused-vars
        setError('Failed to fetch analytics data.');
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Analytics Dashboard</h2>
      <div className="analytics-grid">
        {/* Implements FAQ-F-040 */}
        <AnalyticsWidget
          title="Top 10 Viewed FAQs"
          data={analytics?.topViews || []}
          keyField="question"
          valueField="view_count"
        />

        {/* Implements FAQ-F-042 */}
        <AnalyticsWidget
          title="Top 10 Search Terms"
          data={analytics?.topSearches || []}
          keyField="search_term"
          valueField="frequency"
        />

        {/* Implements FAQ-F-043 */}
        <AnalyticsWidget
          title="Top 10 Zero-Result Searches"
          data={analytics?.zeroResults || []}
          keyField="search_term"
          valueField="frequency"
        />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;