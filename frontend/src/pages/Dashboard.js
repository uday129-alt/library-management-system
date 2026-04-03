import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllBooks, getAllTransactions, getUserTransactions, getOverdueTransactions } from '../api';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ books: 0, available: 0, issued: 0, overdue: 0, myBorrows: 0, myFines: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const booksRes = await getAllBooks();
      const books = booksRes.data;
      const totalBooks = books.length;
      const availableBooks = books.filter(b => b.availableCopies > 0).length;

      if (isAdmin()) {
        const txRes = await getAllTransactions();
        const overdueRes = await getOverdueTransactions();
        const allTx = txRes.data;
        const issued = allTx.filter(t => t.status === 'ISSUED').length;
        setStats({ books: totalBooks, available: availableBooks, issued, overdue: overdueRes.data.length });
        setRecentTransactions(allTx.slice(-5).reverse());
      } else {
        const txRes = await getUserTransactions(user.id);
        const myTx = txRes.data;
        const myBorrows = myTx.filter(t => t.status === 'ISSUED').length;
        const myFines = myTx.reduce((sum, t) => sum + (t.fine || 0), 0);
        setStats({ books: totalBooks, available: availableBooks, myBorrows, myFines: myFines.toFixed(2) });
        setRecentTransactions(myTx.slice(-5).reverse());
      }
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = { ISSUED: 'badge-blue', RETURNED: 'badge-green', OVERDUE: 'badge-red' };
    return <span className={`badge ${map[status] || 'badge-blue'}`}>{status}</span>;
  };

  if (loading) return <div className="loading">Loading dashboard…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <span className="label">Total Books</span>
          <span className="value" style={{ color: 'var(--accent)' }}>{stats.books}</span>
          <span className="sub">in the library</span>
        </div>
        <div className="stat-card">
          <span className="label">Available</span>
          <span className="value" style={{ color: 'var(--green)' }}>{stats.available}</span>
          <span className="sub">books ready to borrow</span>
        </div>
        {isAdmin() ? (
          <>
            <div className="stat-card">
              <span className="label">Currently Issued</span>
              <span className="value" style={{ color: 'var(--blue)' }}>{stats.issued}</span>
              <span className="sub">active borrows</span>
            </div>
            <div className="stat-card">
              <span className="label">Overdue</span>
              <span className="value" style={{ color: 'var(--red)' }}>{stats.overdue}</span>
              <span className="sub">books past due date</span>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <span className="label">My Borrows</span>
              <span className="value" style={{ color: 'var(--blue)' }}>{stats.myBorrows}</span>
              <span className="sub">currently active</span>
            </div>
            <div className="stat-card">
              <span className="label">Total Fines</span>
              <span className="value" style={{ color: stats.myFines > 0 ? 'var(--red)' : 'var(--green)' }}>
                ₹{stats.myFines}
              </span>
              <span className="sub">accumulated</span>
            </div>
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.25rem', fontSize: '1.2rem' }}>
          {isAdmin() ? 'Recent Transactions' : 'My Recent Activity'}
        </h2>
        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No transactions yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  {isAdmin() && <th>Member</th>}
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Fine</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.bookTitle}</strong><br /><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{t.bookAuthor}</span></td>
                    {isAdmin() && <td>{t.userName}</td>}
                    <td>{t.issueDate}</td>
                    <td>{t.dueDate}</td>
                    <td>{statusBadge(t.status)}</td>
                    <td>{t.fine > 0 ? <span className="fine-amount">₹{t.fine}</span> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}