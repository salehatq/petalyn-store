import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Cart() {
  const { cart, total, update, remove, clear } = useCart();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const place = async () => {
    if (!address.trim()) return toast.error('Please enter a delivery address');
    setLoading(true);
    try { await api.post('/orders', { cart, address }); clear(); toast.success('Order placed successfully'); nav('/'); }
    catch (e) { toast.error(e.response?.data?.message || 'Could not place order'); }
    finally { setLoading(false); }
  };

  return <main className="page"><div className="container"><Link className="back" to="/products"><FiArrowLeft /> Continue shopping</Link><div className="cart-layout"><section><div className="page-title-row"><div><p className="eyebrow">YOUR BAG</p><h1>Ready when you are.</h1></div><span>{cart.length} {cart.length === 1 ? 'item' : 'items'}</span></div>{!cart.length ? <div className="empty cart-empty"><h2>Your cart is waiting for something beautiful.</h2><Link className="btn primary" to="/products">Browse flowers</Link></div> : cart.map(i => <div className="cart-row" key={i._id}><img src={i.image} alt={i.title} /><div className="cart-info"><h3>{i.title}</h3><p>{i.des}</p><div className="qty"><button onClick={() => update(i._id, i.quantity - 1)} aria-label={`Decrease ${i.title} quantity`}><FiMinus /></button><span>{i.quantity}</span><button onClick={() => update(i._id, i.quantity + 1)} aria-label={`Increase ${i.title} quantity`}><FiPlus /></button></div></div><strong>₹{(Number(i.price) * i.quantity).toLocaleString('en-IN')}</strong><button className="icon-btn" onClick={() => remove(i._id)} aria-label={`Remove ${i.title}`}><FiTrash2 /></button></div>)}</section>{cart.length > 0 && <aside className="summary"><p className="eyebrow">CHECKOUT</p><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><b>₹{total.toLocaleString('en-IN')}</b></div><div className="summary-line"><span>Delivery</span><b>Free</b></div><hr /><div className="summary-total"><span>Total</span><b>₹{total.toLocaleString('en-IN')}</b></div><label>Delivery address<textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, area, city, PIN" rows="4" maxLength={500} /></label><button className="btn primary full" disabled={loading} onClick={place}>{loading ? 'Placing order...' : 'Place order'}</button></aside>}</div></div></main>;
}
