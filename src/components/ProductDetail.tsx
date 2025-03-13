
import { useState, memo } from 'react';
import { Product } from '../types/Product';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = memo(({ product }: ProductDetailProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="product-card animate-scale-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 flex items-center justify-center bg-secondary/40">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-muted">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
              </div>
            )}
            <img 
              src={product.image} 
              alt={product.title}
              className={`product-image w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
        
        <div className="p-6 flex flex-col">
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground mb-2">
              {product.category}
            </span>
          </div>
          
          <h2 className="text-xl font-medium mb-2">{product.title}</h2>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.round(product.rating.rate) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {product.description}
          </p>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductDetail.displayName = 'ProductDetail';

export default ProductDetail;
