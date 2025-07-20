import { useState, useEffect } from 'react';
import api from '../services/api';

const ORDER_STATUSES = ['pending', 'confirmed', 'delivered'];
const LOW_STOCK_THRESHOLD = 10;

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [apiErrors, setApiErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('orders');
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialForm, setMaterialForm] = useState({ name: '', category: '', quantity: '', unit: '', unit_price: '', supplier: '' });

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
    setApiErrors({});
    const headers = { Authorization: `Bearer ${token}` };
    const results = await Promise.allSettled([
      api.get('/admin/users', { headers }),
      api.get('/admin/messages', { headers }),
      api.get('/admin/uploads', { headers }),
      api.get('/admin/orders', { headers }),
      api.get('/admin/materials', { headers })
    ]);
    const [usersRes, messagesRes, uploadsRes, ordersRes, materialsRes] = results;
    if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);
    else setApiErrors(e => ({ ...e, users: usersRes.reason?.response?.data?.error || usersRes.reason?.message || 'Erreur inconnue' }));
    if (messagesRes.status === 'fulfilled') setMessages(messagesRes.value.data);
    else setApiErrors(e => ({ ...e, messages: messagesRes.reason?.response?.data?.error || messagesRes.reason?.message || 'Erreur inconnue' }));
    if (uploadsRes.status === 'fulfilled') setUploads(uploadsRes.value.data);
    else setApiErrors(e => ({ ...e, uploads: uploadsRes.reason?.response?.data?.error || uploadsRes.reason?.message || 'Erreur inconnue' }));
    if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data);
    else setApiErrors(e => ({ ...e, orders: ordersRes.reason?.response?.data?.error || ordersRes.reason?.message || 'Erreur inconnue' }));
    if (materialsRes.status === 'fulfilled') setMaterials(materialsRes.value.data);
    else setApiErrors(e => ({ ...e, materials: materialsRes.reason?.response?.data?.error || materialsRes.reason?.message || 'Erreur inconnue' }));
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
    setOrders([]);
    setMaterials([]);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await api.patch(`/admin/orders/${id}`, { status }, { headers });
      setOrders(orders => orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  // --- Materials CRUD ---
  const openAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialForm({ name: '', category: '', quantity: '', unit: '', unit_price: '', supplier: '' });
    setShowMaterialModal(true);
  };
  const openEditMaterial = (mat) => {
    setEditingMaterial(mat);
    setMaterialForm({ ...mat });
    setShowMaterialModal(true);
  };
  const closeMaterialModal = () => {
    setShowMaterialModal(false);
    setEditingMaterial(null);
    setMaterialForm({ name: '', category: '', quantity: '', unit: '', unit_price: '', supplier: '' });
  };
  const handleMaterialFormChange = e => {
    const { name, value } = e.target;
    setMaterialForm(f => ({ ...f, [name]: value }));
  };
  const handleMaterialSubmit = async e => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (editingMaterial) {
        await api.patch(`/admin/materials/${editingMaterial.id}`, materialForm, { headers });
      } else {
        await api.post('/admin/materials', materialForm, { headers });
      }
      closeMaterialModal();
      fetchData();
    } catch (err) {
      alert('Erreur lors de la sauvegarde du matériel.');
    }
  };
  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Supprimer ce matériel ?')) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await api.delete(`/admin/materials/${id}`, { headers });
      fetchData();
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
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
      <div className="mb-6 flex gap-4 flex-wrap">
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Commandes</button>
        <button onClick={() => setTab('materials')} className={`px-4 py-2 rounded ${tab === 'materials' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Matériaux</button>
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Utilisateurs</button>
        <button onClick={() => setTab('messages')} className={`px-4 py-2 rounded ${tab === 'messages' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Messages</button>
        <button onClick={() => setTab('uploads')} className={`px-4 py-2 rounded ${tab === 'uploads' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Fichiers</button>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          {Object.keys(apiErrors).length > 0 && (
            <div className="mb-4 text-red-600">
              <b>Erreur(s) lors du chargement des données :</b>
              <ul className="list-disc ml-6">
                {Object.entries(apiErrors).map(([key, val]) => (
                  <li key={key}><b>{key}:</b> {val}</li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'orders' && (
            <div className="overflow-x-auto mb-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Commandes</h3>
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                  <tr>
                    <th className="px-3 py-2 border">Client</th>
                    <th className="px-3 py-2 border">Email</th>
                    <th className="px-3 py-2 border">Articles/Services</th>
                    <th className="px-3 py-2 border">Total</th>
                    <th className="px-3 py-2 border">Statut</th>
                    <th className="px-3 py-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-4">Aucune commande</td></tr>
                  ) : orders.map(order => (
                    <tr key={order.id}>
                      <td className="border px-3 py-2">{order.customer_name || order.name}</td>
                      <td className="border px-3 py-2">{order.customer_email || order.email}</td>
                      <td className="border px-3 py-2 whitespace-pre-line">{order.items || order.details}</td>
                      <td className="border px-3 py-2">{order.total_price || '-'}</td>
                      <td className="border px-3 py-2">
                        <select
                          className="border rounded px-2 py-1"
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                        >
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="border px-3 py-2">{order.created_at ? new Date(order.created_at).toLocaleString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === 'materials' && (
            <div className="overflow-x-auto mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-primary">Matériaux</h3>
                <button onClick={openAddMaterial} className="px-4 py-2 bg-primary text-white rounded shadow">Ajouter</button>
              </div>
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                  <tr>
                    <th className="px-3 py-2 border">Nom</th>
                    <th className="px-3 py-2 border">Catégorie</th>
                    <th className="px-3 py-2 border">Quantité</th>
                    <th className="px-3 py-2 border">Unité</th>
                    <th className="px-3 py-2 border">Prix Unitaire</th>
                    <th className="px-3 py-2 border">Fournisseur</th>
                    <th className="px-3 py-2 border">Valeur Totale</th>
                    <th className="px-3 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-4">Aucun matériel</td></tr>
                  ) : materials.map(mat => (
                    <tr key={mat.id} className={mat.quantity <= LOW_STOCK_THRESHOLD ? 'bg-red-100' : ''}>
                      <td className="border px-3 py-2">{mat.name}</td>
                      <td className="border px-3 py-2">{mat.category}</td>
                      <td className="border px-3 py-2 font-bold">{mat.quantity}</td>
                      <td className="border px-3 py-2">{mat.unit}</td>
                      <td className="border px-3 py-2">{mat.unit_price} €</td>
                      <td className="border px-3 py-2">{mat.supplier}</td>
                      <td className="border px-3 py-2">{(mat.quantity * mat.unit_price).toFixed(2)} €</td>
                      <td className="border px-3 py-2 flex gap-2">
                        <button onClick={() => openEditMaterial(mat)} className="px-2 py-1 bg-blue-500 text-white rounded">Éditer</button>
                        <button onClick={() => handleDeleteMaterial(mat.id)} className="px-2 py-1 bg-red-500 text-white rounded">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-sm text-red-600 mt-2">
                {materials.some(mat => mat.quantity <= LOW_STOCK_THRESHOLD) && 'Attention: Certains matériaux sont en stock faible !'}
              </div>
              {/* Material Modal */}
              {showMaterialModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                    <button onClick={closeMaterialModal} className="absolute top-2 right-2 text-gray-400 hover:text-black">&times;</button>
                    <h3 className="text-xl font-bold mb-4">{editingMaterial ? 'Éditer' : 'Ajouter'} Matériel</h3>
                    <form className="space-y-4" onSubmit={handleMaterialSubmit}>
                      <input name="name" value={materialForm.name} onChange={handleMaterialFormChange} className="w-full border rounded px-3 py-2" placeholder="Nom" required />
                      <input name="category" value={materialForm.category} onChange={handleMaterialFormChange} className="w-full border rounded px-3 py-2" placeholder="Catégorie" />
                      <input name="quantity" type="number" value={materialForm.quantity} onChange={handleMaterialFormChange} className="w-full border rounded px-3 py-2" placeholder="Quantité" required />
                      <input name="unit" value={materialForm.unit} onChange={handleMaterialFormChange} className="w-full border rounded px-3 py-2" placeholder="Unité (kg, pièces, etc.)" required />
                      <input name="unit_price" type="number" step="0.01" value={materialForm.unit_price} onChange={handleMaterialFormChange} className="w-full border rounded px-3 py-2" placeholder="Prix unitaire (€)" required />
                      <input name="supplier" value={materialForm.supplier} onChange={handleMaterialFormChange} className="w-full border rounded px-3 py-2" placeholder="Fournisseur" />
                      <button className="px-6 py-2 bg-primary text-white rounded w-full">{editingMaterial ? 'Enregistrer' : 'Ajouter'}</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === 'users' && (
            <div className="bg-white rounded-xl shadow p-4 overflow-auto">
              <h3 className="text-xl font-semibold mb-2 text-primary">Utilisateurs</h3>
              <ul className="text-sm space-y-1 max-h-64 overflow-y-auto">
                {users.length === 0 ? <li>Aucun utilisateur</li> : users.map(u => (
                  <li key={u.id || u.email}>{u.email || u.username}</li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'messages' && (
            <div className="bg-white rounded-xl shadow p-4 overflow-auto">
              <h3 className="text-xl font-semibold mb-2 text-primary">Messages</h3>
              <ul className="text-sm space-y-1 max-h-64 overflow-y-auto">
                {messages.length === 0 ? <li>Aucun message</li> : messages.map(m => (
                  <li key={m.id}><b>{m.sender}:</b> {m.message} <span className="text-gray-400 text-xs">({new Date(m.created_at).toLocaleString()})</span></li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'uploads' && (
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
          )}
        </>
      )}
    </div>
  );
} 