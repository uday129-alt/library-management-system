import React, { useState, useEffect, useCallback } from 'react';
import { getAllBooks, searchBooks, issueBook } from '../api';
import { useAuth } from '../context/AuthContext';

export default function BooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(null);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = searchQuery
        ? await searchBooks(searchQuery)
        : await getAllBooks();
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(fetchBooks, 400);
    return () => clearTimeout(timer);
  }, [fetchBooks]);

  const handleIssue = async (bookId) => {
    setIssuing(bookId);
    setMessage(null);
    try {
      await issueBook(user.id, bookId);
      setMessage({ type: 'success', text: '✅ Book issued successfully! Due in 14 days.' });
      fetchBooks();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not issue book.' });
    } finally {
      setIssuing(null);
    }
  };

  const categories = [...new Set(books.map(b => b.category))].sort();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Library</h1>
          <p className="page-subtitle">{books.length} book{books.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="form-control"
            placeholder="Search by title, author, or category…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <button className="btn btn-secondary btn-sm" onClick={() => setSearchQuery('')}>
            Clear
          </button>
        )}
      </div>

      {/* Message Banner */}
      {message && (
        <div style={{
          background: message.type === 'success' ? 'rgba(61,214,140,0.1)' : 'rgba(240,100,100,0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(61,214,140,0.3)' : 'rgba(240,100,100,0.3)'}`,
          color: message.type === 'success' ? 'var(--green)' : 'var(--red)',
          padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem'
        }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading books…</div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <p>No books found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
        </div>
      ) : (
        <div className="card-grid">
          {books.map(book => (
            <div key={book.id} className="book-card">
              <span className="book-category">{book.category}</span>
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              {book.publishedYear && (
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{book.publishedYear}</p>
              )}
              {book.description && (
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {book.description.length > 100 ? book.description.slice(0, 100) + '…' : book.description}
                </p>
              )}
              <div className="book-copies" style={{ marginTop: '0.75rem' }}>
                {book.availableCopies > 0
                  ? <span className="available-yes">✓ {book.availableCopies} of {book.totalCopies} available</span>
                  : <span className="available-no">✗ All copies borrowed</span>}
              </div>
              <div className="book-actions">
                <button
                  className="btn btn-primary btn-sm"
                  disabled={book.availableCopies === 0 || issuing === book.id}
                  onClick={() => handleIssue(book.id)}
                >
                  {issuing === book.id ? 'Issuing…' : '📤 Borrow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
