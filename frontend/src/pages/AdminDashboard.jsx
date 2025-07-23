import { useState, useEffect } from 'react';
import api from '../services/api';
import { fetchFinancialSummary, fetchFinancialRisk, fetchLowStock, fetchFinancialHistory, fetchMaterialUsageProjection } from '../services/api';

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
  const [financialSummary, setFinancialSummary] = useState({ total_expenses: 0, total_revenue: 0, balance: 0 });
  const [financialRisk, setFinancialRisk] = useState({ risk: false });
  const [lowStock, setLowStock] = useState([]);
  const [financialHistory, setFinancialHistory] = useState({ expenses: [], revenues: [] });
  const [materialUsage, setMaterialUsage] = useState({});

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
    if (token) {
      fetchData();
      fetchFinancialSummary(token).then(setFinancialSummary).catch(() => {});
      fetchFinancialRisk(token).then(setFinancialRisk).catch(() => {});
      fetchLowStock(token).then(setLowStock).catch(() => {});
      fetchFinancialHistory(token).then(setFinancialHistory).catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    if (tab === 'materials' && materials.length > 0 && token) {
      Promise.all(
        materials.map(mat =>
          fetchMaterialUsageProjection(token, mat.id).then(data => [mat.id, data]).catch(() => [mat.id, null])
        )
      ).then(results => {
        const usageMap = {};
        results.forEach(([id, data]) => { usageMap[id] = data; });
        setMaterialUsage(usageMap);
      });
    }
  }, [tab, materials, token]);

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
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-gray-500 text-sm mb-1">Solde actuel</div>
          <div className="text-2xl font-bold text-green-600">{financialSummary.balance.toFixed(2)} €</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-gray-500 text-sm mb-1">Dépenses</div>
          <div className="text-2xl font-bold text-red-600">{financialSummary.total_expenses.toFixed(2)} €</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-gray-500 text-sm mb-1">Revenus</div>
          <div className="text-2xl font-bold text-blue-600">{financialSummary.total_revenue.toFixed(2)} €</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="text-gray-500 text-sm mb-1">Matériaux faibles</div>
          <div className="text-2xl font-bold text-orange-500">{lowStock.length}</div>
        </div>
      </div>
      {/* Graph: Expenses vs Revenues */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary">Dépenses vs Revenus (12 derniers mois)</h3>
        <FinancialHistoryChart expenses={financialHistory.expenses} revenues={financialHistory.revenues} />
      </div>
      {/* Alerts */}
      {financialRisk.risk && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
          ⚠️ Ratio de dépenses élevé ce mois-ci. Vérifiez les coûts de matériaux ou de services.
        </div>
      )}
      {lowStock.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded">
          ⛔ Certains matériaux sont faibles en stock : {lowStock.map(m => m.name).join(', ')}. Pensez à réapprovisionner.
        </div>
      )}
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
                    <th className="px-3 py-2 border">Semaines restantes</th>
                    <th className="px-3 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-4">Aucun matériel</td></tr>
                  ) : materials.map(mat => {
                    const usage = materialUsage[mat.id];
                    const weeksLeft = usage?.weeks_left;
                    return (
                      <tr key={mat.id} className={mat.quantity <= LOW_STOCK_THRESHOLD ? 'bg-red-100' : ''}>
                        <td className="border px-3 py-2">{mat.name}</td>
                        <td className="border px-3 py-2">{mat.category}</td>
                        <td className="border px-3 py-2 font-bold">{mat.quantity}</td>
                        <td className="border px-3 py-2">{mat.unit}</td>
                        <td className="border px-3 py-2">{mat.unit_price} €</td>
                        <td className="border px-3 py-2">{mat.supplier}</td>
                        <td className="border px-3 py-2">{(mat.quantity * mat.unit_price).toFixed(2)} €</td>
                        <td className="border px-3 py-2">
                          {weeksLeft === null || weeksLeft === undefined ? (
                            <span className="text-gray-400">-</span>
                          ) : weeksLeft < 2 ? (
                            <span className="text-red-600 font-bold">{weeksLeft.toFixed(1)} ⚠️</span>
                          ) : (
                            <span>{weeksLeft.toFixed(1)}</span>
                          )}
                        </td>
                        <td className="border px-3 py-2 flex gap-2">
                          <button onClick={() => openEditMaterial(mat)} className="px-2 py-1 bg-blue-500 text-white rounded">Éditer</button>
                          <button onClick={() => handleDeleteMaterial(mat.id)} className="px-2 py-1 bg-red-500 text-white rounded">Supprimer</button>
                        </td>
                      </tr>
                    );
                  })}
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
            <div className="flex flex-col items-center w-full">
              <h3 className="text-xl font-semibold mb-4 text-primary">Messages</h3>
              {messages.length === 0 ? (
                <div>Aucun message</div>
              ) : (
                <div className="flex flex-col items-center w-full gap-6">
                  {messages.map(m => (
                    <div
                      key={m.id}
                      className="message-card w-4/5 max-w-2xl bg-white p-4 rounded-lg shadow mb-4 border border-gray-200"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                    >
                      <h3 className="font-bold text-lg mb-1">{m.full_name}</h3>
                      <p className="mb-1">
                        <a href={`mailto:${m.email}`} className="text-blue-600 hover:underline">{m.email}</a>
                      </p>
                      <p className="date text-xs text-gray-500 mb-2">Envoyé le : {new Date(m.created_at).toLocaleDateString()} {new Date(m.created_at).toLocaleTimeString()}</p>
                      <p className="content text-gray-800 whitespace-pre-line">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
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

function FinancialHistoryChart({ expenses, revenues }) {
  // Merge months
  const months = Array.from(new Set([
    ...expenses.map(e => e.month),
    ...revenues.map(r => r.month)
  ])).sort();
  const data = months.map(month => ({
    month,
    expenses: expenses.find(e => e.month === month)?.total || 0,
    revenues: revenues.find(r => r.month === month)?.total || 0,
  }));
  // SVG chart dimensions
  const width = 600, height = 200, padding = 40;
  const maxY = Math.max(...data.map(d => Math.max(d.expenses, d.revenues)), 1000);
  // Scales
  const xStep = (width - 2 * padding) / (months.length - 1 || 1);
  const yScale = v => height - padding - (v / maxY) * (height - 2 * padding);
  // Polyline points
  const expensesPoints = data.map((d, i) => `${padding + i * xStep},${yScale(d.expenses)}`).join(' ');
  const revenuesPoints = data.map((d, i) => `${padding + i * xStep},${yScale(d.revenues)}`).join(' ');
  return (
    <svg width={width} height={height} className="w-full h-48">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#888" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#888" />
      {/* Expenses line */}
      <polyline fill="none" stroke="#ef4444" strokeWidth="3" points={expensesPoints} />
      {/* Revenues line */}
      <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={revenuesPoints} />
      {/* Dots and labels */}
      {data.map((d, i) => (
        <>
          <circle key={`e${i}`} cx={padding + i * xStep} cy={yScale(d.expenses)} r={4} fill="#ef4444" />
          <circle key={`r${i}`} cx={padding + i * xStep} cy={yScale(d.revenues)} r={4} fill="#3b82f6" />
          <text key={`t${i}`} x={padding + i * xStep} y={height - padding + 15} fontSize="10" textAnchor="middle">{d.month.slice(2)}</text>
        </>
      ))}
      {/* Y axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <text key={f} x={padding - 10} y={yScale(maxY * f)} fontSize="10" textAnchor="end">{Math.round(maxY * f)}</text>
      ))}
    </svg>
  );
} 