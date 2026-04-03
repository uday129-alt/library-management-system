import React, { useState, useEffect } from 'react';
import { getUserTransactions, returnBook } from '../api';
import { useAuth } from '../context/AuthContext';

export default function MyTransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchTransactions(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getUserTransactions(user.id);
      // Sort: active first, then by date desc
      const sorted = res.data.sort((a, b) => {
        if (a.status === 'ISSUED' && b.status !== 'ISSUED') return -1;
        if (b.status === 'ISSUED' && a.status !== 'ISSUED') return 1;
        return new Date(b.issueDate) - new Date(a.issueDate);
      });
      setTransactions(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (transactionId) => {
    setReturning(transactionId);
    setMessage(null);
    try {
      const res = await returnBook(transactionId);
      const fine = res.data.fine;
      setMessage({
        type: fine > 0 ? 'warning' : 'success',
        text: fine > 0
          ? `📚 Book returned. Late return fine: ₹${fine}`
          : '✅ Book returned successfully. No fine!'
      });
      fetchTransactions();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not return book.' });
    } finally {
      setReturning(null);
    }
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date() ;

  const statusBadge = (t) => {
    if (t.status === 'RETURNED') return <span className="badge badge-green">RETURNED</span>;
    if (isOverdue(t.dueDate)) return <span className="badge badge-red">OVERDUE</span>;
    return <span className="badge badge-blue">ISSUED</span>;
  };

  const activeCount = transactions.filter(t => t.status === 'ISSUED').length;
  const totalFines = transactions.reduce((s, t) => s + (t.fine || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Borrowed Books</h1>
          <p className="page-subtitle">{activeCount} active borrow{activeCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <span className="label">Currently Borrowed</span>
          <span className="value" style={{ color: 'var(--blue)' }}>{activeCount}</span>
        </div>
        <div className="stat-card">
          <span className="label">Total Books Borrowed</span>
          <span className="value">{transactions.length}</span>
        </div>
        <div className="stat-card">
          <span className="label">Total Fines Paid</span>
          <span className="value" style={{ color: totalFines > 0 ? 'var(--red)' : 'var(--green)' }}>
            ₹{totalFines.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          background: message.type === 'success' ? 'rgba(61,214,140,0.1)' : message.type === 'warning' ? 'rgba(232,160,69,0.1)' : 'rgba(240,100,100,0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(61,214,140,0.3)' : message.type === 'warning' ? 'rgba(232,160,69,0.3)' : 'rgba(240,100,100,0.3)'}`,
          color: message.type === 'success' ? 'var(--green)' : message.type === 'warning' ? 'var(--accent)' : 'var(--red)',
          padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem'
        }}>
          {message.text}
        </div>
      )}

      {loading ? <div className="loading">Loading transactions…</div> :
       transactions.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <p>You haven't borrowed any books yet.</p>
          <a href="/books" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Browse Books
          </a>
        </div>
       ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Issued</th>
                <th>Due Date</th>
                <th>Returned</th>
                <th>Status</th>
                <th>Fine</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.bookTitle}</strong><br />
                    <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{t.bookAuthor}</span>
                  </td>
                  <td>{t.issueDate}</td>
                  <td style={{ color: isOverdue(t.dueDate) && t.status === 'ISSUED' ? 'var(--red)' : 'inherit' }}>
                    {t.dueDate}
                    {isOverdue(t.dueDate) && t.status === 'ISSUED' && (
                      <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--red)' }}>PAST DUE</span>
                    )}
                  </td>
                  <td>{t.returnDate || '—'}</td>
                  <td>{statusBadge(t)}</td>
                  <td>{t.fine > 0 ? <span className="fine-amount">₹{t.fine}</span> : '—'}</td>
                  <td>
                    {t.status === 'ISSUED' && (
                      <button
                        className="btn btn-success btn-sm"
                        disabled={returning === t.id}
                        onClick={() => handleReturn(t.id)}
                      >
                        {returning === t.id ? '…' : '↩️ Return'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       )}
    </div>
  );
}