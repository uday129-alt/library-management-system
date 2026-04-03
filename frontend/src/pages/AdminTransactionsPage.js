import React, { useState, useEffect } from 'react';
import { getAllTransactions, returnBook } from '../api';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [returning, setReturning] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await getAllTransactions();
      setTransactions(res.data.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)));
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    setReturning(id);
    try {
      await returnBook(id);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not process return.');
    } finally {
      setReturning(null);
    }
  };

  const isOverdue = (t) => t.status === 'ISSUED' && new Date(t.dueDate) < new Date();

  const filtered = transactions.filter(t => {
    const matchFilter = filter === 'ALL' || t.status === filter || (filter === 'OVERDUE' && isOverdue(t));
    const matchSearch = !search ||
      t.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      t.userName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const statusBadge = (t) => {
    if (t.status === 'RETURNED') return <span className="badge badge-green">RETURNED</span>;
    if (isOverdue(t)) return <span className="badge badge-red">OVERDUE</span>;
    return <span className="badge badge-blue">ISSUED</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Transactions</h1>
          <p className="page-subtitle">{transactions.length} total records</p>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="form-control" placeholder="Search by book or member…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['ALL', 'ISSUED', 'RETURNED', 'OVERDUE'].map(f => (
          <button key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Loading…</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Book</th><th>Member</th>
                <th>Issued</th><th>Due</th><th>Returned</th>
                <th>Fine</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{t.id}</td>
                  <td>
                    <strong>{t.bookTitle}</strong>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted)' }}>{t.bookAuthor}</span>
                  </td>
                  <td>{t.userName}</td>
                  <td>{t.issueDate}</td>
                  <td style={{ color: isOverdue(t) ? 'var(--red)' : 'inherit' }}>{t.dueDate}</td>
                  <td>{t.returnDate || '—'}</td>
                  <td>{t.fine > 0 ? <span className="fine-amount">₹{t.fine}</span> : '—'}</td>
                  <td>{statusBadge(t)}</td>
                  <td>
                    {t.status === 'ISSUED' && (
                      <button className="btn btn-success btn-sm"
                        disabled={returning === t.id}
                        onClick={() => handleReturn(t.id)}>
                        {returning === t.id ? '…' : '↩️ Return'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
                  No transactions found.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
