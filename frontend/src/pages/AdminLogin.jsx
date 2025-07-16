export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <input className="w-full border rounded px-3 py-2" placeholder="Nom d'utilisateur" />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Mot de passe" />
        <button className="w-full px-6 py-2 bg-primary text-white rounded">Se connecter</button>
      </form>
    </div>
  );
} 