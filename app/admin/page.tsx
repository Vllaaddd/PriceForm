'use client';
import { AdminDashboard } from '@/components/admin-dashboard';
import { InputField } from '@/components/input-field';
import { useState } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === '12345') {
      setIsAuthenticated(true);
    } else {
      alert('Access denied');
      console.log(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    }
  };

  if (!isAuthenticated) {
    return (
        <div className='min-h-screen flex items-start justify-center bg-gray-200 p-4'>
            <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 max-w-sm mx-auto mt-10">
                <h2 className="text-lg font-semibold">Admin login</h2>
                <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autocomplete={'on'} />
                <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full cursor-pointer">Login</button>
            </form>
        </div>
    );
  }

  return <AdminDashboard />;
}
