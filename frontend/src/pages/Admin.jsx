import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, NavLink } from 'react-router-dom';
import { api } from '../api';
import {
  FiGrid,
  FiPackage,
  FiLogOut,
  FiPlus,
  FiTrash2,
  FiEdit3,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

function Guard() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    api
      .get('/me')
      .then(() => setReady(true))
      .catch(() => nav('/login', { replace: true }));
  }, [nav]);
  if (!ready)
    return <div className="admin-loading">Checking your session…</div>;
  return <OutletLayout />;
}

function OutletLayout() {
  const nav = useNavigate();
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      /* session may already be expired */
    }
    nav('/login', { replace: true });
  };
  return (
    <div className="admin-shell">
      <aside>
        <Link to="/" className="admin-brand">
          Petalyn
        </Link>
        <nav>
          <NavLink end to="/admin">
            <FiGrid /> Overview
          </NavLink>
          <NavLink to="/admin/products">
            <FiPackage /> Products
          </NavLink>
        </nav>
        <button onClick={logout}>
          <FiLogOut /> Sign out
        </button>
      </aside>
      <section className="admin-main">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="products" element={<AdminProducts />} />
        </Routes>
      </section>
    </div>
  );
}

function Overview() {
  const [data, setData] = useState({ products: 0, orders: 0 });
  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/orders')])
      .then(([p, o]) =>
        setData({
          products: p.data.products.length,
          orders: o.data.orders.length,
        }),
      )
      .catch(() => toast.error('Could not load dashboard data'));
  }, []);
  return (
    <div className="admin-content">
      <div className="admin-top">
        <div>
          <p className="eyebrow">DASHBOARD</p>
          <h1>Good morning.</h1>
        </div>
      </div>
      <div className="stats">
        <div>
          <span>Products</span>
          <b>{data.products}</b>
        </div>
        <div>
          <span>Orders</span>
          <b>{data.orders}</b>
        </div>
        <div>
          <span>Status</span>
          <b className="online">Live</b>
        </div>
      </div>
      <div className="admin-welcome">
        <p className="eyebrow">QUICK ACTION</p>
        <h2>Keep the collection fresh.</h2>
        <p>
          Add new flowers or update an existing arrangement from the product
          manager.
        </p>
        <Link className="btn primary" to="/admin/products">
          <FiPlus /> Manage products
        </Link>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    des: '',
    price: '',
    image: null,
  });
  const [saving, setSaving] = useState(false);
  const load = () =>
    api
      .get('/products')
      .then((r) => setProducts(r.data.products))
      .catch(() => toast.error('Could not load products'));
  useEffect(() => {
    load();
  }, []);
  const reset = () => {
    setEditing(null);
    setForm({ title: '', des: '', price: '', image: null });
  };
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!editing && !form.image) {
        toast.error('Choose a product image');
        return;
      }
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('des', form.des);
      fd.append('price', form.price);
      if (form.image) fd.append('image', form.image);
      if (editing) await api.put(`/products/${editing._id}`, fd);
      else await api.post('/products', fd);
      toast.success(editing ? 'Product updated' : 'Product added');
      reset();
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };
  const del = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      await load();
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };
  const edit = (p) => {
    setEditing(p);
    setForm({ title: p.title, des: p.des, price: p.price, image: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="admin-content">
      <div className="admin-top">
        <div>
          <p className="eyebrow">CATALOG</p>
          <h1>{editing ? 'Edit product' : 'Products'}</h1>
        </div>
      </div>
      <form className="product-form" onSubmit={save}>
        <input
          required
          maxLength={120}
          placeholder="Product name"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          required
          maxLength={500}
          placeholder="Description"
          value={form.des}
          onChange={(e) => setForm({ ...form, des: e.target.value })}
        />
        <input
          required
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files?.[0] || null })
          }
        />
        <div>
          <button className="btn primary" disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Update product' : 'Add product'}
          </button>
          {editing && (
            <button type="button" className="btn ghost" onClick={reset}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="admin-table">
        {products.map((p) => (
          <div className="admin-row" key={p._id}>
            <img src={p.image} alt="" />
            <div>
              <b>{p.title}</b>
              <span>{p.des}</span>
            </div>
            <strong>₹{Number(p.price).toLocaleString('en-IN')}</strong>
            <button onClick={() => edit(p)} aria-label={`Edit ${p.title}`}>
              <FiEdit3 />
            </button>
            <button onClick={() => del(p._id)} aria-label={`Delete ${p.title}`}>
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  return <Guard />;
}
