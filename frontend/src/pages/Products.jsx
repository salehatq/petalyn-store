import { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { FiSearch } from 'react-icons/fi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/products').then(r => setProducts(r.data.products)).catch(() => setProducts([])).finally(() => setLoading(false)); }, []);
  const filtered = products.filter(p => `${p.title} ${p.des}`.toLowerCase().includes(q.toLowerCase()));

  return <main className="page"><div className="container"><div className="page-intro"><p className="eyebrow">THE SHOP</p><h1>Pick something lovely.</h1><p>Simple arrangements, fresh blooms, and a little extra joy.</p></div><div className="search"><FiSearch /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search flowers..." aria-label="Search flowers" /></div>{loading ? <div className="empty">Loading the collection…</div> : <><div className="product-grid">{filtered.map(p => <ProductCard key={p._id} product={p} />)}</div>{!filtered.length && <div className="empty">No flowers found. Try another search.</div>}</>}</div></main>;
}
