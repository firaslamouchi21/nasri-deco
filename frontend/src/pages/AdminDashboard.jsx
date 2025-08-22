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
  DollarSign,
  Image
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import DashboardStats from '../components/DashboardStats';
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
  fetchMessages,
  fetchMaterialUsageData
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
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialForm, setMaterialForm] = useState({ 
    name: '', 
    category: '', 
    quantity: '', 
    unit: '', 
    unit_price: '', 
    supplier: '' 
  });
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    type: 'material'
  });
  const [revenueForm, setRevenueForm] = useState({
    description: '',
    amount: ''
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
  const [materialUsageData, setMaterialUsageData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: '',
    description: '',
    before_img: null,
    after_img: null
  });

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
    
    console.log('Starting to fetch dashboard data...');
    
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
        financialHistoryData,
        materialUsageData,
        galleryData
      ] = await Promise.allSettled([
        fetchOrders(),
        fetchMaterials(token),
        fetchUsers(token),
        fetchMessages(token),
        fetchFinancialSummary(token),
        fetchFinancialRisk(token),
        fetchLowStock(token),
        fetchFinancialHistory(token),
        fetchMaterialUsageData(token),
        fetchGallery()
      ]);

      // Handle successful responses with detailed logging
      if (ordersData.status === 'fulfilled') {
        console.log('Orders loaded:', ordersData.value.length);
        setOrders(ordersData.value);
      } else {
        console.error('Orders fetch failed:', ordersData.reason);
        setApiErrors(prev => ({ ...prev, orders: ordersData.reason }));
      }
      
      if (materialsData.status === 'fulfilled') {
        console.log('Materials loaded:', materialsData.value.length);
        setMaterials(materialsData.value);
      } else {
        console.error('Materials fetch failed:', materialsData.reason);
        setApiErrors(prev => ({ ...prev, materials: materialsData.reason }));
      }
      
      if (usersData.status === 'fulfilled') {
        console.log('Users loaded:', usersData.value.length);
        setUsers(usersData.value);
      } else {
        console.error('Users fetch failed:', usersData.reason);
        setApiErrors(prev => ({ ...prev, users: usersData.reason }));
      }
      
      if (messagesData.status === 'fulfilled') {
        console.log('Messages loaded:', messagesData.value.length);
        setMessages(messagesData.value);
      } else {
        console.error('Messages fetch failed:', messagesData.reason);
        setApiErrors(prev => ({ ...prev, messages: messagesData.reason }));
      }
      
      if (financialSummaryData.status === 'fulfilled') {
        console.log('Financial summary loaded:', financialSummaryData.value);
        console.log('Financial summary types:', {
          total_revenue: typeof financialSummaryData.value.total_revenue,
          total_expenses: typeof financialSummaryData.value.total_expenses,
          balance: typeof financialSummaryData.value.balance
        });
        setFinancialSummary(financialSummaryData.value);
      } else {
        console.error('Financial summary fetch failed:', financialSummaryData.reason);
        setApiErrors(prev => ({ ...prev, financialSummary: financialSummaryData.reason }));
      }
      
      if (financialRiskData.status === 'fulfilled') {
        console.log('Financial risk loaded:', financialRiskData.value);
        setFinancialRisk(financialRiskData.value);
      } else {
        console.error('Financial risk fetch failed:', financialRiskData.reason);
        setApiErrors(prev => ({ ...prev, financialRisk: financialRiskData.reason }));
      }
      
      if (lowStockData.status === 'fulfilled') {
        console.log('Low stock loaded:', lowStockData.value.length);
        setLowStock(lowStockData.value);
      } else {
        console.error('Low stock fetch failed:', lowStockData.reason);
        setApiErrors(prev => ({ ...prev, lowStock: lowStockData.reason }));
      }
      
      if (financialHistoryData.status === 'fulfilled') {
        console.log('Financial history loaded:', financialHistoryData.value);
        setFinancialHistory(financialHistoryData.value);
      } else {
        console.error('Financial history fetch failed:', financialHistoryData.reason);
        setApiErrors(prev => ({ ...prev, financialHistory: financialHistoryData.reason }));
      }

      if (materialUsageData.status === 'fulfilled') {
        console.log('Material usage data loaded:', materialUsageData.value.length);
        setMaterialUsageData(materialUsageData.value);
      } else {
        console.error('Material usage data fetch failed:', materialUsageData.reason);
        setApiErrors(prev => ({ ...prev, materialUsageData: materialUsageData.reason }));
      }

      if (galleryData.status === 'fulfilled') {
        console.log('Gallery loaded:', galleryData.value.length);
        setGallery(galleryData.value);
      } else {
        console.error('Gallery fetch failed:', galleryData.reason);
        setApiErrors(prev => ({ ...prev, gallery: galleryData.reason }));
      }

      // Show success message if all data loaded successfully
      const allSuccessful = [
        ordersData, materialsData, usersData, messagesData,
        financialSummaryData, financialRiskData, lowStockData, financialHistoryData, materialUsageData, galleryData
      ].every(result => result.status === 'fulfilled');
      
      if (allSuccessful) {
        console.log('All dashboard data loaded successfully');
      } else {
        console.warn('Some data failed to load, check errors above');
      }

    } catch (error) {
      console.error('Error in fetchData:', error);
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

  // Material CRUD functions
  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialForm({ name: '', category: '', quantity: '', unit: '', unit_price: '', supplier: '' });
    setShowMaterialModal(true);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setMaterialForm({
      name: material.name || '',
      category: material.category || '',
      quantity: material.stock_quantity || material.quantity || '',
      unit: material.unit || '',
      unit_price: material.unit_price || '',
      supplier: material.supplier || ''
    });
    setShowMaterialModal(true);
  };

  const handleDeleteMaterial = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce matériau ?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMaterials(materials.filter(m => m.id !== id));
        toast({
          title: "Matériau supprimé",
          description: "Le matériau a été supprimé avec succès.",
        });
      } else {
        throw new Error('Failed to delete material');
      }
    } catch (err) {
      console.error('Error deleting material:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du matériau.",
        variant: "destructive",
      });
    }
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingMaterial 
        ? `http://localhost:5000/api/admin/materials/${editingMaterial.id}`
        : 'http://localhost:5000/api/admin/materials';
      
      const method = editingMaterial ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(materialForm)
      });

      if (response.ok) {
        setShowMaterialModal(false);
        fetchData(); // Refresh data
        toast({
          title: editingMaterial ? "Matériau modifié" : "Matériau ajouté",
          description: editingMaterial ? "Le matériau a été modifié avec succès." : "Le matériau a été ajouté avec succès.",
        });
      } else {
        throw new Error('Failed to save material');
      }
    } catch (err) {
      console.error('Error saving material:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde du matériau.",
        variant: "destructive",
      });
    }
  };

  // Gallery CRUD functions
  const handleAddGalleryItem = () => {
    setEditingGalleryItem(null);
    setGalleryForm({ title: '', category: '', description: '', before_img: null, after_img: null });
    setShowGalleryModal(true);
  };

  const handleEditGalleryItem = (item) => {
    setEditingGalleryItem(item);
    setGalleryForm({
      title: item.title || '',
      category: item.category || '',
      description: item.description || '',
      before_img: null,
      after_img: null
    });
    setShowGalleryModal(true);
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément de galerie ?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/gallery/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setGallery(gallery.filter(item => item.id !== id));
        toast({
          title: "Élément supprimé",
          description: "L'élément de galerie a été supprimé avec succès.",
        });
      } else {
        throw new Error('Failed to delete gallery item');
      }
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'élément de galerie.",
        variant: "destructive",
      });
    }
  };

  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', galleryForm.title);
      formData.append('category', galleryForm.category);
      formData.append('description', galleryForm.description || '');
      
      // For new items, both images are required
      if (!editingGalleryItem) {
        if (!galleryForm.before_img || !galleryForm.after_img) {
          toast({
            title: "Erreur",
            description: "Les images avant et après sont requises pour un nouvel élément.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Append images if they exist
      if (galleryForm.before_img) {
        formData.append('before', galleryForm.before_img);
      }
      if (galleryForm.after_img) {
        formData.append('after', galleryForm.after_img);
      }

      const url = editingGalleryItem 
        ? `http://localhost:5000/api/gallery/admin/${editingGalleryItem.id}`
        : 'http://localhost:5000/api/gallery/admin';
      
      const method = editingGalleryItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setShowGalleryModal(false);
        fetchData(); // Refresh data
        toast({
          title: editingGalleryItem ? "Élément modifié" : "Élément ajouté",
          description: editingGalleryItem ? "L'élément de galerie a été modifié avec succès." : "L'élément de galerie a été ajouté avec succès.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save gallery item');
      }
    } catch (err) {
      console.error('Error saving gallery item:', err);
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la sauvegarde de l'élément de galerie.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setGalleryForm(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  // Expense and Revenue functions
  const handleAddExpense = () => {
    setExpenseForm({ description: '', amount: '', type: 'material' });
    setShowExpenseModal(true);
  };

  const handleAddRevenue = () => {
    setRevenueForm({ description: '', amount: '' });
    setShowRevenueModal(true);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseForm)
      });

      if (response.ok) {
        setShowExpenseModal(false);
        fetchData(); // Refresh data
        toast({
          title: "Dépense ajoutée",
          description: "La dépense a été ajoutée avec succès.",
        });
      } else {
        throw new Error('Failed to save expense');
      }
    } catch (err) {
      console.error('Error saving expense:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la dépense.",
        variant: "destructive",
      });
    }
  };

  const handleSaveRevenue = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/revenues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(revenueForm)
      });

      if (response.ok) {
        setShowRevenueModal(false);
        fetchData(); // Refresh data
        toast({
          title: "Revenu ajouté",
          description: "Le revenu a été ajouté avec succès.",
        });
      } else {
        throw new Error('Failed to save revenue');
      }
    } catch (err) {
      console.error('Error saving revenue:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde du revenu.",
        variant: "destructive",
      });
    }
  };

  // Chart data preparation
  const prepareLowStockChartData = () => {
    const lowStockMaterials = materials.filter(m => m.stock_quantity <= 10);
    
    return {
      labels: lowStockMaterials.map(m => m.name),
      datasets: [
        {
          label: 'Stock actuel',
          data: lowStockMaterials.map(m => m.stock_quantity),
          backgroundColor: lowStockMaterials.map(m => 
            m.stock_quantity <= 5 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)'
          ),
          borderColor: lowStockMaterials.map(m => 
            m.stock_quantity <= 5 ? 'rgba(239, 68, 68, 1)' : 'rgba(245, 158, 11, 1)'
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareMonthlyFinancialChartData = () => {
    // Generate last 6 months data
    const months = [];
    const expensesData = [];
    const revenuesData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }));
      
      // Mock data - in real app, this would come from financial history
      expensesData.push(Math.floor(Math.random() * 1000) + 500);
      revenuesData.push(Math.floor(Math.random() * 1500) + 800);
    }
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Dépenses (DT)',
          data: expensesData,
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Revenus (DT)',
          data: revenuesData,
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  const prepareMaterialCostChartData = () => {
    const materialsWithCost = materialUsageData
      .filter(m => Number(m.used_this_month) > 0)
      .map(m => ({
        name: m.name,
        cost: (Number(m.unit_price) || 0) * Math.abs(Number(m.used_this_month) || 0)
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 8);
    
    return {
      labels: materialsWithCost.map(m => m.name),
      datasets: [
        {
          data: materialsWithCost.map(m => m.cost),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(147, 51, 234, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

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
      value: `${(Number(financialSummary.balance) || 0).toFixed(2)} DT`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenus totaux',
      value: `${(Number(financialSummary.total_revenue) || 0).toFixed(2)} DT`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Dépenses totales',
      value: `${(Number(financialSummary.total_expenses) || 0).toFixed(2)} DT`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
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
    { id: 'analytics', name: 'Statistiques', icon: DollarSign },
    { id: 'orders', name: 'Commandes', icon: Package },
    { id: 'materials', name: 'Matériaux', icon: FileText },
    { id: 'gallery', name: 'Galerie', icon: Image },
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

                {/* Additional Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Revenus ce mois</p>
                        <p className="text-xl font-bold text-green-600">
                          {(Number(financialSummary.total_revenue) || 0).toFixed(2)} DT
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Dépenses ce mois</p>
                        <p className="text-xl font-bold text-red-600">
                          {(Number(financialSummary.total_expenses) || 0).toFixed(2)} DT
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Matériaux en stock</p>
                        <p className="text-xl font-bold text-blue-600">
                          {materials.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Utilisés ce mois</p>
                        <p className="text-xl font-bold text-purple-600">
                          {materialUsageData.filter(m => Number(m.used_this_month) > 0).length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Alertes stock</p>
                        <p className="text-xl font-bold text-orange-600">
                          {lowStock.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

            {/* Financial Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Résumé Financier
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={handleAddRevenue} className="flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      Revenu
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleAddExpense} className="flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      Dépense
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Revenus du mois</span>
                      <span className="font-semibold text-green-600">
                        {(Number(financialSummary.total_revenue) || 0).toFixed(2)} DT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Dépenses du mois</span>
                      <span className="font-semibold text-red-600">
                        {(Number(financialSummary.total_expenses) || 0).toFixed(2)} DT
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Solde actuel</span>
                        <span className={`font-bold text-lg ${(Number(financialSummary.balance) || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(Number(financialSummary.balance) || 0).toFixed(2)} DT
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Aperçu des Commandes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total commandes</span>
                      <span className="font-semibold text-blue-600">{orders.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">En attente</span>
                      <span className="font-semibold text-amber-600">
                        {orders.filter(o => o.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Livrées</span>
                      <span className="font-semibold text-green-600">
                        {orders.filter(o => o.status === 'delivered').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Low Stock Warning Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Alertes Stock Faible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar
                      data={prepareLowStockChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Matériaux avec stock ≤ 10',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Quantité en stock'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Financial Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Évolution Financière (6 mois)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line
                      data={prepareMonthlyFinancialChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Revenus vs Dépenses mensuels (DT)',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return value + ' DT';
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Material Cost Chart */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Coût Total des Matériaux Utilisés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Doughnut
                      data={prepareMaterialCostChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                          title: {
                            display: true,
                            text: 'Répartition des coûts (30 derniers jours)',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return context.label + ': ' + context.parsed.toFixed(2) + ' DT';
                              }
                            }
                          }
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Material Usage Summary */}
            {materialUsageData.length > 0 && (
              <div className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Utilisation des Matériaux (30 derniers jours)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-foreground">Matériau</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Stock actuel</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Utilisé ce mois</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Coût total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {materialUsageData.slice(0, 5).map((material) => (
                            <tr key={material.id} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{material.name}</td>
                              <td className="py-3 px-4">
                                <span className={material.stock_quantity <= LOW_STOCK_THRESHOLD ? 'text-destructive font-bold' : 'text-green-600'}>
                                  {material.stock_quantity || 0}
                                </span>
                              </td>
                              <td className="py-3 px-4">{Math.abs(Number(material.used_this_month) || 0)}</td>
                              <td className="py-3 px-4 font-medium">
                                {((Number(material.unit_price) || 0) * Math.abs(Number(material.used_this_month) || 0)).toFixed(2)} DT
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Error Alerts */}
            {Object.keys(apiErrors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 font-medium">Erreurs de chargement des données</p>
                </div>
                <div className="space-y-2">
                  {Object.entries(apiErrors).map(([key, error]) => (
                    <div key={key} className="text-sm text-red-700">
                      <strong>{key}:</strong> {error?.message || error?.toString() || 'Erreur inconnue'}
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={fetchData} 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                >
                  Réessayer
                </Button>
              </div>
            )}

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
                {/* Analytics Tab */}
                {tab === 'analytics' && (
                  <DashboardStats token={token} />
                )}

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
                      <Button onClick={handleAddMaterial} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Ajouter un matériau
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-foreground">Nom</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Catégorie</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Prix unitaire</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Stock actuel</th>
                            <th className="text-left py-4 px-4 font-medium text-foreground">Unité</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Fournisseur</th>
                            <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {materials.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                Aucun matériau trouvé
                              </td>
                            </tr>
                          ) : (
                            materials.map((material) => (
                              <tr key={material.id} className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4 font-medium">{material.name}</td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">{material.category || '-'}</td>
                                <td className="py-3 px-4 font-medium">{(Number(material.unit_price) || 0).toFixed(2)} DT</td>
                                <td className="py-3 px-4">
                                  <span className={`font-medium ${material.stock_quantity <= LOW_STOCK_THRESHOLD ? 'text-destructive' : 'text-green-600'}`}>
                                    {material.stock_quantity || 0}
                                  </span>
                                  {material.stock_quantity <= LOW_STOCK_THRESHOLD && (
                                    <span className="ml-2 text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                                      Faible
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">{material.unit || '-'}</td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">{material.supplier || '-'}</td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      title="Modifier"
                                      onClick={() => handleEditMaterial(material)}
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-destructive" 
                                      title="Supprimer"
                                      onClick={() => handleDeleteMaterial(material.id)}
                                    >
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

                {/* Gallery Tab */}
                {tab === 'gallery' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-primary">Gestion de la Galerie</h2>
                      <Button onClick={handleAddGalleryItem} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Ajouter un élément
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gallery.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">Aucun élément de galerie trouvé</p>
                      ) : (
                        gallery.map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-lg font-semibold text-foreground mb-2">
                                {item.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.description || 'Aucune description'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Catégorie: {item.category || 'Non catégorisé'}
                              </p>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground mb-1">Avant</p>
                                  {item.before_img ? (
                                    (item.before_type === 'video') ? (
                                      <video 
                                        src={item.before_url || `http://localhost:5000/uploads/${item.before_img}`}
                                        className="w-full h-24 object-cover rounded-md"
                                        controls
                                      />
                                    ) : (
                                      <img 
                                        src={item.before_url || `http://localhost:5000/uploads/${item.before_img}`} 
                                        alt="Before" 
                                        className="w-full h-24 object-cover rounded-md"
                                        onError={(e) => {
                                          e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop';
                                          e.target.alt = 'Image non disponible';
                                        }}
                                      />
                                    )
                                  ) : (
                                    <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
                                      <span className="text-xs text-muted-foreground">Aucun média</span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground mb-1">Après</p>
                                  {item.after_img ? (
                                    (item.after_type === 'video') ? (
                                      <video 
                                        src={item.after_url || `http://localhost:5000/uploads/${item.after_img}`}
                                        className="w-full h-24 object-cover rounded-md"
                                        controls
                                      />
                                    ) : (
                                      <img 
                                        src={item.after_url || `http://localhost:5000/uploads/${item.after_img}`} 
                                        alt="After" 
                                        className="w-full h-24 object-cover rounded-md"
                                        onError={(e) => {
                                          e.target.src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=150&fit=crop';
                                          e.target.alt = 'Image non disponible';
                                        }}
                                      />
                                    )
                                  ) : (
                                    <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
                                      <span className="text-xs text-muted-foreground">Aucun média</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditGalleryItem(item)}
                                  className="flex-1"
                                >
                                  <Edit3 className="w-4 h-4 mr-1" />
                                  Modifier
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-destructive flex-1" 
                                  onClick={() => handleDeleteGalleryItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Supprimer
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
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

      {/* Material Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingMaterial ? 'Modifier le matériau' : 'Ajouter un matériau'}
            </h3>
            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={materialForm.name}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={materialForm.category}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={materialForm.quantity}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, quantity: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unité</Label>
                <Input
                  id="unit"
                  value={materialForm.unit}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, unit: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit_price">Prix unitaire (DT)</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  value={materialForm.unit_price}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, unit_price: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="supplier">Fournisseur</Label>
                <Input
                  id="supplier"
                  value={materialForm.supplier}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, supplier: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowMaterialModal(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingMaterial ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter une dépense</h3>
            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <Label htmlFor="expense-description">Description</Label>
                <Input
                  id="expense-description"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="expense-amount">Montant (DT)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="expense-type">Type</Label>
                <select
                  id="expense-type"
                  value={expenseForm.type}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="material">Matériaux</option>
                  <option value="service">Services</option>
                  <option value="misc">Divers</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)}>
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revenue Modal */}
      {showRevenueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter un revenu</h3>
            <form onSubmit={handleSaveRevenue} className="space-y-4">
              <div>
                <Label htmlFor="revenue-description">Description</Label>
                <Input
                  id="revenue-description"
                  value={revenueForm.description}
                  onChange={(e) => setRevenueForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="revenue-amount">Montant (DT)</Label>
                <Input
                  id="revenue-amount"
                  type="number"
                  step="0.01"
                  value={revenueForm.amount}
                  onChange={(e) => setRevenueForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowRevenueModal(false)}>
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingGalleryItem ? 'Modifier l\'élément de galerie' : 'Ajouter un élément de galerie'}
            </h3>
            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <Label htmlFor="gallery-title">Titre *</Label>
                <Input
                  id="gallery-title"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Titre du projet"
                />
              </div>
              <div>
                <Label htmlFor="gallery-category">Catégorie *</Label>
                <select
                  id="gallery-category"
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="plafonds">Plafonds</option>
                  <option value="corniches">Corniches</option>
                  <option value="colonnes">Colonnes</option>
                  <option value="murs">Murs</option>
                  <option value="autres">Autres</option>
                </select>
              </div>
              <div>
                <Label htmlFor="gallery-description">Description</Label>
                <textarea
                  id="gallery-description"
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-md bg-background"
                  rows={3}
                  placeholder="Description du projet..."
                />
              </div>
              <div>
                <Label htmlFor="gallery-before-img">
                  Média avant (image ou vidéo) {!editingGalleryItem ? '*' : ''}
                </Label>
                <Input
                  id="gallery-before-img"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'before_img')}
                  accept="image/*,video/*"
                  required={!editingGalleryItem}
                />
                {editingGalleryItem && editingGalleryItem.before_img && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Fichier actuel: {editingGalleryItem.before_img}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="gallery-after-img">
                  Média après (image ou vidéo) {!editingGalleryItem ? '*' : ''}
                </Label>
                <Input
                  id="gallery-after-img"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'after_img')}
                  accept="image/*,video/*"
                  required={!editingGalleryItem}
                />
                {editingGalleryItem && editingGalleryItem.after_img && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Fichier actuel: {editingGalleryItem.after_img}
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setShowGalleryModal(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingGalleryItem ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 