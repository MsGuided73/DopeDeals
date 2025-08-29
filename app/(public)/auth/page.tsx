"use client";
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage(`Signed in as ${data.user?.email}`);
    setLoading(false);
  }

  async function signUp() {
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabaseBrowser.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage(`Check your email to confirm: ${data.user?.email}`);
    setLoading(false);
  }

  async function signOut() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabaseBrowser.auth.signOut();
    if (error) setMessage(error.message);
    else setMessage('Signed out');
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Auth</h1>

      <label className="block mb-2">Email</label>
      <input className="border p-2 w-full mb-4" value={email} onChange={e => setEmail(e.target.value)} />

      <label className="block mb-2">Password</label>
      <input type="password" className="border p-2 w-full mb-4" value={password} onChange={e => setPassword(e.target.value)} />

      <div className="flex gap-2 mb-4">
        <button onClick={signIn} disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded">Sign In</button>
        <button onClick={signUp} disabled={loading} className="px-3 py-2 bg-green-600 text-white rounded">Sign Up</button>
        <button onClick={signOut} disabled={loading} className="px-3 py-2 bg-gray-600 text-white rounded">Sign Out</button>
      </div>

      {message && <p className="text-sm text-gray-800">{message}</p>}
    </div>
  );
}

