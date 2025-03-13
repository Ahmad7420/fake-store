
import { useRef, useEffect, forwardRef, useCallback } from 'react';
import { useProductSearch } from '@/hooks/useProductSearch';
import SearchSuggestion from './SearchSuggestion';
import ProductDetail from './ProductDetail';
import { cn } from '@/lib/utils';
import { Search, LoaderCircle, X } from 'lucide-react';

export interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Search for products...', className }, ref) => {
    const {
      searchTerm,
      suggestions,
      isLoading,
      isError,
      activeSuggestionIndex,
      setActiveSuggestionIndex,
      handleInputChange,
      handleSelectProduct,
      handleKeyDown,
      selectedProduct,
      isDropdownOpen,
      setIsDropdownOpen,
      handleClickOutside,
      setSelectedProduct
    } = useProductSearch();
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const activeItemRef = useRef<HTMLDivElement>(null);
    
    // Handle outside clicks to close dropdown
    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          handleClickOutside();
        }
      };
      
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }, [handleClickOutside]);
    
    // Scroll active item into view
    useEffect(() => {
      if (isDropdownOpen && activeItemRef.current && dropdownRef.current) {
        const dropdown = dropdownRef.current;
        const activeItem = activeItemRef.current;
        
        const dropdownRect = dropdown.getBoundingClientRect();
        const activeItemRect = activeItem.getBoundingClientRect();
        
        // Check if active item is outside of visible dropdown area
        const isAbove = activeItemRect.top < dropdownRect.top;
        const isBelow = activeItemRect.bottom > dropdownRect.bottom;
        
        if (isAbove) {
          dropdown.scrollTop += activeItemRect.top - dropdownRect.top;
        } else if (isBelow) {
          dropdown.scrollTop += activeItemRect.bottom - dropdownRect.bottom;
        }
      }
    }, [activeSuggestionIndex, isDropdownOpen]);
    
    // Clear search
    const handleClearSearch = useCallback(() => {
      handleInputChange('');
      setSelectedProduct(null)
      setIsDropdownOpen(false);
    }, [handleInputChange, setIsDropdownOpen]);
    
    // Handle mouse enter
    const handleMouseEnter = useCallback((index: number) => {
      setActiveSuggestionIndex(index);
    }, [setActiveSuggestionIndex]);
    
    return (
      <div ref={containerRef} className="px-4 md:px-0 w-full max-w-2xl mx-auto flex flex-col items-center">
        <div className="search-container">
          <div className={cn("search-input", className)}>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={ref}
                type="text"
                className="search-input-field"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                onKeyDown={handleKeyDown}
              />
              {isLoading && (
                <LoaderCircle className="h-4 w-4 text-muted-foreground animate-spin" />
              )}
              {searchTerm && !isLoading && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className={cn(
                "search-dropdown animate-scale-in",
                !suggestions.length && !isLoading && "py-10"
              )}
            >
              {isError ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-destructive">Failed to load suggestions. Please try again.</p>
                </div>
              ) : isLoading ? (
                <div className="px-4 py-6 flex justify-center">
                  <LoaderCircle className="h-5 w-5 text-muted-foreground animate-spin" />
                </div>
              ) : suggestions.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  {searchTerm ? (
                    <p className="text-muted-foreground">No results found</p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground font-medium">Popular Searches</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['Electronics', 'Jewelry', "Men's Clothing", "Women's Clothing"].map((category) => (
                          <button
                            key={category}
                            className="px-3 py-1 text-sm bg-secondary rounded-full hover:bg-secondary/70"
                            onClick={() => handleInputChange(category)}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                suggestions.map((product, index) => {
                  const isActive = index === activeSuggestionIndex;
                  return (
                    <div
                      key={product.id}
                      ref={isActive ? activeItemRef : null}
                      onMouseEnter={() => handleMouseEnter(index)}
                    >
                      <SearchSuggestion
                        product={product}
                        isActive={isActive}
                        onSelect={handleSelectProduct}
                        index={index}
                      />
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
        
        {selectedProduct && <ProductDetail product={selectedProduct} />}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
