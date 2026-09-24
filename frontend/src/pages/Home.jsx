import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiTruck, FiHeart, FiStar } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api.get('/products').then(r => setProducts(r.data.products.slice(0, 4))).catch(() => setProducts([])); }, []);

  return <main>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">FLOWERS, BUT MAKE IT PERSONAL</p><h1>Small moments.<br /><em>Beautifully</em> bloomed.</h1><p className="hero-sub">Handpicked flowers and joyful arrangements made to turn an ordinary day into a little celebration.</p><div className="hero-actions"><Link className="btn primary" to="/products">Shop the collection <FiArrowUpRight /></Link><Link className="text-link" to="/about">Our story</Link></div><div className="trust"><span><FiStar /> Thoughtful by design</span><span>Fresh arrangements, always</span></div></div><div className="hero-art"><img src="/Images/2.jpg" alt="Pink lily bouquet" /><div className="hero-note"><b>Fresh today</b><span>Delivered with care</span></div></div></section>
    <section className="promise container"><div><FiTruck /><span><b>Careful delivery</b><small>Prepared with attention</small></span></div><div><FiHeart /><span><b>Made with feeling</b><small>Thoughtful, every time</small></span></div><div><FiStar /><span><b>Freshness first</b><small>Quality you can see</small></span></div></section>
    <section className="section container"><div className="section-head"><div><p className="eyebrow">THE COLLECTION</p><h2>Flowers for every feeling</h2></div><Link className="text-link" to="/products">View all <FiArrowUpRight /></Link></div><div className="product-grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div></section>
    <section className="story-band"><div className="container story-grid"><img src="/Images/3.jpg" alt="Rose flower" loading="lazy" /><div><p className="eyebrow">A LITTLE MORE HUMAN</p><h2>Flowers should feel like a note from someone who cares.</h2><p>We keep the process simple: beautiful stems, careful hands, and arrangements that never feel like an afterthought.</p><Link className="btn dark" to="/about">Meet Petalyn <FiArrowUpRight /></Link></div></div></section>
  </main>;
}
