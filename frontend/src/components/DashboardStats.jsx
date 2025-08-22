import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import {
  fetchDashboardSummary,
  fetchTopUsedMaterials,
  fetchRevenueEvolution,
  fetchExpensesBySupplier,
  fetchUsageByCategory,
  fetchMonthlyMaterialCosts,
  fetchProjectStatusOverview,
  fetchTopClients,
  fetchLowStockAlerts,
} from "../services/api";

// Charts
import TopUsedMaterialsChart from "./charts/TopUsedMaterialsChart";
import RevenueEvolutionChart from "./charts/RevenueEvolutionChart";
import ExpensesBySupplierChart from "./charts/ExpensesBySupplierChart";
import UsageByCategoryChart from "./charts/UsageByCategoryChart";
import MonthlyMaterialCostsChart from "./charts/MonthlyMaterialCostsChart";

// Icons
import {
  Package,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

// Helper function to safely format currency values
const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value) || 0;
  return num.toFixed(2) + ' DT';
};

const DashboardStats = ({ token }) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    dashboardSummary: {},
    topUsedMaterials: [],
    revenueEvolution: [],
    expensesBySupplier: [],
    usageByCategory: [],
    monthlyMaterialCosts: [],
    projectStatus: [],
    topClients: [],
    lowStockAlerts: [],
  });

  useEffect(() => {
    if (token) loadAnalytics();
  }, [token]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        fetchDashboardSummary(token),
        fetchTopUsedMaterials(token, 8),
        fetchRevenueEvolution(token, 12),
        fetchExpensesBySupplier(token),
        fetchUsageByCategory(token),
        fetchMonthlyMaterialCosts(token, 12),
        fetchProjectStatusOverview(token),
        fetchTopClients(token, 5),
        fetchLowStockAlerts(token),
      ]);

      const keys = [
        "dashboardSummary",
        "topUsedMaterials",
        "revenueEvolution",
        "expensesBySupplier",
        "usageByCategory",
        "monthlyMaterialCosts",
        "projectStatus",
        "topClients",
        "lowStockAlerts",
      ];

      const newData = {};
      results.forEach((res, idx) => {
        newData[keys[idx]] = res.status === "fulfilled" ? res.value : [];
      });

      setData(newData);
    } catch (err) {
      console.error("Error loading analytics:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      title: "Matériaux",
      value: data.dashboardSummary.materials_count || 0,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Commandes",
      value: data.dashboardSummary.orders_count || 0,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Messages",
      value: data.dashboardSummary.messages_count || 0,
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "Stock Faible",
      value: data.dashboardSummary.low_stock_count || 0,
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Revenus ce mois",
      value: formatCurrency(data.dashboardSummary.revenue_this_month),
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Dépenses ce mois",
      value: formatCurrency(data.dashboardSummary.expenses_this_month),
      icon: TrendingDown,
      color: "text-red-600",
    },
    {
      title: "Profit ce mois",
      value: formatCurrency(data.dashboardSummary.profit_this_month),
      icon: DollarSign,
      color:
        (Number(data.dashboardSummary.profit_this_month) || 0) >= 0
          ? "text-green-600"
          : "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [...Array(7)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          : summaryCards.map((card, i) => (
              <Card key={i}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                  <card.icon className={`h-8 w-8 ${card.color}`} />
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Charts */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopUsedMaterialsChart data={data.topUsedMaterials} />
          <RevenueEvolutionChart data={data.revenueEvolution} />
          <ExpensesBySupplierChart data={data.expensesBySupplier} />
          <UsageByCategoryChart data={data.usageByCategory} />
          <MonthlyMaterialCostsChart data={data.monthlyMaterialCosts} />
        </div>
      )}

      {/* Project Status */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle>Statut des Projets</CardTitle>
          </CardHeader>
          <CardContent>
            {data.projectStatus.length > 0 ? (
              <div className="space-y-4">
                {data.projectStatus.map((status, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between"
                  >
                    <span className="capitalize">{status.status}</span>
                    <span className="font-bold">{status.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Aucune donnée disponible
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Clients & Low Stock */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Meilleurs Clients</CardTitle>
            </CardHeader>
            <CardContent>
              {data.topClients.length > 0 ? (
                <div className="space-y-4">
                  {data.topClients.map((client, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{client.client_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {client.order_count} commandes
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dernière:{" "}
                          {new Date(
                            client.last_order_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun client trouvé</p>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alertes Stock Faible
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.lowStockAlerts.length > 0 ? (
                <div className="space-y-4">
                  {data.lowStockAlerts.slice(0, 5).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.supplier}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.alert_level === "critical"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.current_stock} {item.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Tous les stocks sont suffisants
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;