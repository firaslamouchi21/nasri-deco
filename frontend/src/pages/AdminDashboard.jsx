import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/admin/login', login);
      setToken(res.data.token);
      localStorage.setItem('adminToken', res.data.token);
    } catch (err) {
      setError('Identifiants invalides');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, messagesRes, uploadsRes] = await Promise.all([
        api.get('/admin/users', { headers }),
        api.get('/admin/messages', { headers }),
        api.get('/admin/uploads', { headers })
      ]);
      setUsers(usersRes.data);
      setMessages(messagesRes.data);
      setUploads(uploadsRes.data);
    } catch (err) {
      setError('Erreur lors du chargement des données.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
    setUsers([]);
    setMessages([]);
    setUploads([]);
  };

  if (!token) {
    return (
      <div className="max-w-sm mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-primary">Admin Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            type="email"
            value={login.email}
            onChange={e => setLogin(l => ({ ...l, email: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Mot de passe"
            type="password"
            value={login.password}
            onChange={e => setLogin(l => ({ ...l, password: e.target.value }))}
            required
          />
          <button className="px-6 py-2 bg-primary text-white rounded w-full">Se connecter</button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Admin Dashboard</h2>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Déconnexion</button>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Users */}
          <div className="bg-white rounded-xl shadow p-4 overflow-auto">
            <h3 className="text-xl font-semibold mb-2 text-primary">Utilisateurs</h3>
            <ul className="text-sm space-y-1 max-h-64 overflow-y-auto">
              {users.length === 0 ? <li>Aucun utilisateur</li> : users.map(u => (
                <li key={u.id || u.email}>{u.email || u.username}</li>
              ))}
            </ul>
          </div>
          {/* Messages */}
          <div className="bg-white rounded-xl shadow p-4 overflow-auto">
            <h3 className="text-xl font-semibold mb-2 text-primary">Messages</h3>
            <ul className="text-sm space-y-1 max-h-64 overflow-y-auto">
              {messages.length === 0 ? <li>Aucun message</li> : messages.map(m => (
                <li key={m.id}><b>{m.sender}:</b> {m.message} <span className="text-gray-400 text-xs">({new Date(m.created_at).toLocaleString()})</span></li>
              ))}
            </ul>
          </div>
          {/* Uploads */}
          <div className="bg-white rounded-xl shadow p-4 overflow-auto">
            <h3 className="text-xl font-semibold mb-2 text-primary">Fichiers Uploadés</h3>
            <ul className="text-sm space-y-1 max-h-64 overflow-y-auto">
              {uploads.length === 0 ? <li>Aucun fichier</li> : uploads.map(f => (
                <li key={f.filename}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{f.filename}</a>
                  <span className="text-gray-400 text-xs ml-2">({new Date(f.created_at).toLocaleString()})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 