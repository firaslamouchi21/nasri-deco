import { useEffect, useState } from 'react';
import { fetchOrders } from '../services/api';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders()
      .then(data => setOrders(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-6">Liste des Demandes</h2>
      {orders.length === 0 ? (
        <div>Aucune demande trouvée.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Nom</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Téléphone</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="border px-2 py-1">{order.name}</td>
                <td className="border px-2 py-1">{order.email}</td>
                <td className="border px-2 py-1">{order.phone}</td>
                <td className="border px-2 py-1">{order.work_type}</td>
                <td className="border px-2 py-1">{order.description}</td>
                <td className="border px-2 py-1">{order.created_at?.slice(0,10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 