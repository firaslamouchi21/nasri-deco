export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Commandes</h3>
          {/* TODO: List orders */}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Galerie</h3>
          {/* TODO: Upload to gallery */}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Messages Contact</h3>
          {/* TODO: List contact messages */}
        </div>
      </div>
    </div>
  );
} 