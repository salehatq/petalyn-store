import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const addItem = () => {
    add(product);
    toast.success(`${product.title} added to cart`);
  };

  return <article className="product-card">
    <div className="product-image">
      <img src={product.image} alt={product.title} loading="lazy" />
      <button onClick={addItem} aria-label={`Add ${product.title} to cart`}><FiPlus /></button>
    </div>
    <div className="product-meta">
      <div><h3>{product.title}</h3><p>{product.des}</p></div>
      <strong>₹{Number(product.price).toLocaleString('en-IN')}</strong>
    </div>
  </article>;
}
