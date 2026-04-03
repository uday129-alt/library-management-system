import React, { useState, useEffect } from 'react';
import { getAllBooks, addBook, updateBook, deleteBook } from '../api';

const EMPTY_FORM = {
  title: '', author: '', category: '', isbn: '',
  totalCopies: '', publishedYear: '', description: ''
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null); // null = add mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await getAllBooks();
      setBooks(res.data);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditBook(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditBook(book);
    setForm({
      title: book.title, author: book.author, category: book.category,
      isbn: book.isbn, totalCopies: book.totalCopies,
      publishedYear: book.publishedYear || '', description: book.description || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, totalCopies: parseInt(form.totalCopies), publishedYear: form.publishedYear ? parseInt(form.publishedYear) : null };
      if (editBook) {
        await updateBook(editBook.id, payload);
      } else {
        await addBook(payload);
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete this book.');
    }
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Books</h1>
          <p className="page-subtitle">{books.length} total books in catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="form-control" placeholder="Filter books…"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {loading ? <div className="loading">Loading…</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Author</th><th>Category</th>
                <th>ISBN</th><th>Total</th><th>Available</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(book => (
                <tr key={book.id}>
                  <td><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td><span className="badge badge-amber">{book.category}</span></td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{book.isbn}</td>
                  <td>{book.totalCopies}</td>
                  <td>
                    <span className={book.availableCopies > 0 ? 'available-yes' : 'available-no'}>
                      {book.availableCopies}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(book)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.id, book.title)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editBook ? 'Edit Book' : 'Add New Book'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Author *</label>
                  <input className="form-control" name="author" value={form.author} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input className="form-control" name="category" value={form.category} onChange={handleChange} required placeholder="e.g. Fiction, Technology" />
                </div>
                <div className="form-group">
                  <label>ISBN *</label>
                  <input className="form-control" name="isbn" value={form.isbn} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Copies *</label>
                  <input className="form-control" type="number" name="totalCopies" value={form.totalCopies} onChange={handleChange} required min="1" />
                </div>
                <div className="form-group">
                  <label>Published Year</label>
                  <input className="form-control" type="number" name="publishedYear" value={form.publishedYear} onChange={handleChange} placeholder="e.g. 2023" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
              </div>
              {error && (
                <div style={{ color: 'var(--red)', fontSize: '0.85rem', marginBottom: '0.75rem',
                  background: 'rgba(240,100,100,0.1)', padding: '0.6rem', borderRadius: '6px' }}>
                  {error}
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
