import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/login', { email, password }); toast.success('Welcome back'); nav('/admin'); }
    catch (error) { toast.error(error.response?.data?.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };
  return <main className="auth"><div className="auth-card"><div className="auth-art"><img src="/Images/4.jpg" alt="Moon flower" /><div><p className="eyebrow">PETALYN ADMIN</p><h1>Good flowers need good tending.</h1></div></div><form onSubmit={submit}><Link to="/" className="back">← Back to shop</Link><p className="eyebrow">SIGN IN</p><h2>Welcome back</h2><label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" placeholder="admin@example.com" /></label><label>Password<input type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" /></label><button className="btn primary full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button></form></div></main>;
}
