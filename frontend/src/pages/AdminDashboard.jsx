import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Package, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  LogOut,
  Eye,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { 
  adminLogin, 
  fetchOrders, 
  fetchGallery, 
  fetchFinancialSummary, 
  fetchFinancialRisk, 
  fetchLowStock, 
  fetchFinancialHistory, 
  fetchMaterials,
  fetchUsers,
  fetchMessages
} from '../services/api';

const ORDER_STATUSES = ['pending', 'confirmed', 'delivered'];
const LOW_STOCK_THRESHOLD = 10;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [tab, setTab] = useState('dashboard');
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialForm, setMaterialForm] = useState({ 
    name: '', 
    category: '', 
    quantity: '', 
    unit: '', 
    unit_price: '', 
    supplier: '' 
  });
  const [financialSummary, setFinancialSummary] = useState({ 
    total_expenses: 0, 
    total_revenue: 0, 
    balance: 0 
  });
  const [financialRisk, setFinancialRisk] = useState({ risk: false });
  const [lowStock, setLowStock] = useState([]);
  const [financialHistory, setFinancialHistory] = useState({ expenses: [], revenues: [] });
  const [materialUsage, setMaterialUsage] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await adminLogin(login.email, login.password);
      setToken(response.token);
      localStorage.setItem('adminToken', response.token);
      
      toast({
        title: "Connexion réussie !",
        description: "Redirection vers le tableau de bord...",
      });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Identifiants invalides');
      toast({
        title: "Erreur de connexion",
        description: err.response?.data?.message || "Identifiants invalides",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
    setUsers([]);
    setMessages([]);
    setUploads([]);
    setOrders([]);
    setMaterials([]);
    navigate('/');
    
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  const fetchData = async () => {
    setLoading(true);
    setApiErrors({});
    
    try {
      // Fetch all data in parallel
      const [
        ordersData,
        materialsData,
        usersData,
        messagesData,
        financialSummaryData,
        financialRiskData,
        lowStockData,
        financialHistoryData
      ] = await Promise.allSettled([
        fetchOrders(),
        fetchMaterials(token),
        fetchUsers(token),
        fetchMessages(token),
        fetchFinancialSummary(token),
        fetchFinancialRisk(token),
        fetchLowStock(token),
        fetchFinancialHistory(token)
      ]);

      // Handle successful responses
      if (ordersData.status === 'fulfilled') {
        setOrders(ordersData.value);
      }
      
      if (materialsData.status === 'fulfilled') {
        setMaterials(materialsData.value);
      }
      
      if (usersData.status === 'fulfilled') {
        setUsers(usersData.value);
      }
      
      if (messagesData.status === 'fulfilled') {
        setMessages(messagesData.value);
      }
      
      if (financialSummaryData.status === 'fulfilled') {
        setFinancialSummary(financialSummaryData.value);
      }
      
      if (financialRiskData.status === 'fulfilled') {
        setFinancialRisk(financialRiskData.value);
      }
      
      if (lowStockData.status === 'fulfilled') {
        setLowStock(lowStockData.value);
      }
      
      if (financialHistoryData.status === 'fulfilled') {
        setFinancialHistory(financialHistoryData.value);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleStatusChange = async (id, status) => {
    try {
      // Update order status in backend
      const response = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setOrders(orders => orders.map((o) => o.id === id ? { ...o, status } : o));
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la commande a été modifié avec succès.",
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut.",
        variant: "destructive",
      });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary mb-2">Administration</CardTitle>
            <p className="text-muted-foreground">Accédez au tableau de bord administrateur</p>
          </CardHeader>
          
          <CardContent>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={login.email}
                    onChange={e => setLogin(l => ({ ...l, email: e.target.value }))}
                    placeholder="admin@nasrideco.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={login.password}
                    onChange={e => setLogin(l => ({ ...l, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
              
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Solde actuel',
      value: `${financialSummary.balance?.toFixed(2) || '0.00'} €`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Commandes',
      value: orders.length.toString(),
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Messages',
      value: messages.length.toString(),
      icon: MessageSquare,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Stock faible',
      value: lowStock.length.toString(),
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    }
  ];

  const tabs = [
    { id: 'dashboard', name: 'Tableau de bord', icon: TrendingUp },
    { id: 'orders', name: 'Commandes', icon: Package },
    { id: 'materials', name: 'Matériaux', icon: FileText },
    { id: 'users', name: 'Utilisateurs', icon: Users },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">Administration</h1>
              <p className="text-muted-foreground">Tableau de bord Nasri Déco</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {tab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {stat.title}
                        </p>
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Alerts */}
            {financialRisk.risk && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <p className="text-amber-800">
                    ⚠️ Ratio de dépenses élevé ce mois-ci. Vérifiez les coûts de matériaux ou de services.
                  </p>
                </div>
              </div>
            )}

            {lowStock.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">
                    ⛔ Certains matériaux sont faibles en stock : {lowStock.map((m) => m.name).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tabItem) => (
            <Button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              variant={tab === tabItem.id ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <tabItem.icon className="w-4 h-4" />
              {tabItem.name}
            </Button>
          ))}
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : (
              <>
                {/* Orders Tab */}
                {tab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-semibold text-primary mb-6">Gestion des Commandes</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-foreground">Client</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Email</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Téléphone</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Statut</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                Aucune commande trouvée
                              </td>
                            </tr>
                          ) : (
                            orders.map((order) => (
                              <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4">{order.name}</td>
                                <td className="py-3 px-4 text-primary">{order.email}</td>
                                <td className="py-3 px-4">{order.phone || '-'}</td>
                                <td className="py-3 px-4">
                                  <select
                                    className="px-3 py-1 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-ring"
                                    value={order.status || 'pending'}
                                    onChange={e => handleStatusChange(order.id, e.target.value)}
                                  >
                                    {ORDER_STATUSES.map(s => (
                                      <option key={s} value={s}>
                                        {s === 'pending' ? 'En attente' : s === 'confirmed' ? 'Confirmé' : 'Livré'}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Materials Tab */}
                {tab === 'materials' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-primary">Gestion des Matériaux</h2>
                      <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Ajouter un matériau
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-foreground">Nom</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Prix</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Stock</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {materials.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center py-8 text-muted-foreground">
                                Aucun matériau trouvé
                              </td>
                            </tr>
                          ) : (
                            materials.map((material) => (
                              <tr key={material.id} className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4 font-medium">{material.name}</td>
                                <td className="py-3 px-4">{material.price}€</td>
                                <td className="py-3 px-4">
                                  <span className={material.stock_quantity <= LOW_STOCK_THRESHOLD ? 'text-destructive font-bold' : ''}>
                                    {material.stock_quantity}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                      <Edit3 className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-destructive">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {tab === 'users' && (
                  <div>
                    <h2 className="text-xl font-semibold text-primary mb-6">Utilisateurs</h2>
                    <div className="space-y-4">
                      {users.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">Aucun utilisateur trouvé</p>
                      ) : (
                        users.map((user) => (
                          <div key={user.id || user.email} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{user.email || user.username}</p>
                                <p className="text-sm text-muted-foreground">Utilisateur</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Messages Tab */}
                {tab === 'messages' && (
                  <div>
                    <h2 className="text-xl font-semibold text-primary mb-6">Messages des Clients</h2>
                    <div className="space-y-6">
                      {messages.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">Aucun message trouvé</p>
                      ) : (
                        messages.map((message) => (
                          <div key={message.id} className="p-6 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold text-foreground">{message.name}</h3>
                                <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                                  {message.email}
                                </a>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(message.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-foreground whitespace-pre-line">{message.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 