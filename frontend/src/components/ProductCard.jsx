import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  return (
    <Link
      to={`/products/${product.id}`}
      className="
        bg-white
        rounded-2xl
        overflow-hidden
        border border-slate-200

        shadow-[0_6px_18px_rgba(15,23,42,0.08)]
        hover:shadow-[0_14px_30px_rgba(15,23,42,0.15)]
        hover:-translate-y-1

        transition-all duration-300 ease-out
        block
      "
    >
      {/* Image */}
      <div className="bg-slate-50">
        <img
          src={`${BASEURL}${product.image}`}
          alt={product.name}
          className="
            w-full h-56 object-cover
            mix-blend-multiply
          "
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h2 className="text-slate-900 font-semibold text-lg truncate">
          {product.name}
        </h2>

        <p className="text-sky-600 font-bold text-base">
          ₹{product.price}
        </p>

        {/* Delivery hint */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-medium">
            Fast Delivery
          </span>
          <span>Ekart Verified</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
