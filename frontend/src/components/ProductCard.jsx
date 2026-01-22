import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  return (
    <Link
      to={`/products/${product.id}`}
      className="
        bg-slate-900/80 backdrop-blur-xl
        border border-white/30
        rounded-xl overflow-hidden
        shadow-lg
        hover:scale-[1.03]
        hover:shadow-xl
        transition-all duration-300
        block
      "
    >
      {/* Image */}
      <div className="relative">
        <img
          src={`${BASEURL}${product.image}`}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
      </div>

      {/* Text */}
      <div className="p-4">
        <h2 className="text-white font-semibold text-lg truncate">
          {product.name}
        </h2>

        <p className="text-white font-bold text-base mt-1">
          ₹{product.price}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
