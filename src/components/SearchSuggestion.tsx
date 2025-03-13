
import { memo } from 'react';
import { Product } from '../types/Product';
import { cn } from '@/lib/utils';

interface SearchSuggestionProps {
  product: Product;
  isActive: boolean;
  onSelect: (product: Product) => void;
  index: number;
}

const SearchSuggestion = memo(({ 
  product, 
  isActive, 
  onSelect,
  index
}: SearchSuggestionProps) => {
  return (
    <div 
      className={cn(
        "suggestion-item animate-slide-in",
        isActive && "suggestion-item-active"
      )}
      style={{ animationDelay: `${index * 20}ms` }}
      onClick={() => onSelect(product)}
    >
      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium truncate max-w-xs">
          {product.title}
        </span>
        <span className="text-xs text-muted-foreground">
          {product.category}
        </span>
      </div>
    </div>
  );
});

SearchSuggestion.displayName = 'SearchSuggestion';

export default SearchSuggestion;
