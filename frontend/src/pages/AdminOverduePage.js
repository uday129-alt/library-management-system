import React, { useState, useEffect } from 'react';
import { getOverdueTransactions, returnBook } from '../api';

export default function AdminOverduePage() {
  const [overdues, setOverdues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getOverdueTransactions();
      setOverdues(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    setReturning(id);
    try {
      await returnBook(id);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Return failed.');
    } finally {
      setReturning(null);
    }
  };

  const daysOverdue = (dueDate) => {
    const diff = Math.floor((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const estimatedFine = (dueDate) => (daysOverdue(dueDate) * 5).toFixed(2);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">⚠️ Overdue Books</h1>
          <p className="page-subtitle">{overdues.length} book{overdues.length !== 1 ? 's' : ''} past due date</p>
        </div>
      </div>

      {loading ? <div className="loading">Loading…</div> :
       overdues.length === 0 ? (
        <div className="empty-state">
          <div className="icon">✅</div>
          <p>No overdue books. Great!</p>
        </div>
       ) : (
        <>
          <div style={{ background: 'rgba(240,100,100,0.08)', border: '1px solid rgba(240,100,100,0.2)',
            borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--red)' }}>
            ⚠️ Fine rate: ₹5.00 per day overdue. These members should return books as soon as possible.
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Book</th><th>Member</th><th>Due Date</th>
                  <th>Days Overdue</th><th>Est. Fine</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {overdues.map(t => (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.bookTitle}</strong>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted)' }}>{t.bookAuthor}</span>
                    </td>
                    <td>{t.userName}</td>
                    <td style={{ color: 'var(--red)' }}>{t.dueDate}</td>
                    <td>
                      <span className="badge badge-red">{daysOverdue(t.dueDate)} days</span>
                    </td>
                    <td><span className="fine-amount">₹{estimatedFine(t.dueDate)}</span></td>
                    <td>
                      <button className="btn btn-success btn-sm"
                        disabled={returning === t.id}
                        onClick={() => handleReturn(t.id)}>
                        {returning === t.id ? '…' : '↩️ Process Return'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
       )}
    </div>
  );
}
