
import { useCallback, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { Product, ProductSearchResponse } from '../types/Product';
import debounce from 'lodash/debounce';

const API_URL = 'https://fakestoreapi.com/products';

interface UseProductSearchProps {
  debounceMs?: number;
  limit?: number;
}

export function useProductSearch({ debounceMs = 300, limit = 15 }: UseProductSearchProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a memoized fetch function that cancels previous requests
  const fetchProducts = useCallback(async (searchValue: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    const config: AxiosRequestConfig = {
      signal: abortControllerRef.current.signal,
      params: {
        limit
      }
    };

    try {
      const response = await axios.get<Product[]>(API_URL, config);

      // Filter products based on search term
      const filteredProducts = searchValue
        ? response.data.filter(product =>
          product.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          product.category.toLowerCase().includes(searchValue.toLowerCase())
        )
        : response.data;

      return filteredProducts;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        throw error;
      }
      return [];
    }
  }, [limit]);

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim() || value === '') {
        refetch();
      }
    }, debounceMs),
    [debounceMs]
  );

  // Use TanStack Query for data fetching with caching
  const {
    data: suggestions = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: () => fetchProducts(searchTerm),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setSelectedProduct(null)
    setSearchTerm(value);
    setActiveSuggestionIndex(-1);
    setIsDropdownOpen(true);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Handle suggestion selection
  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.title);
    setIsDropdownOpen(false);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsDropdownOpen(true);
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : 0
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          handleSelectProduct(suggestions[activeSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsDropdownOpen(false);
        break;
      case 'Tab':
        setIsDropdownOpen(false);
        break;
      default:
        break;
    }
  }, [activeSuggestionIndex, suggestions, isDropdownOpen, handleSelectProduct]);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    isLoading,
    isError,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    handleInputChange,
    handleSelectProduct,
    handleKeyDown,
    selectedProduct,
    setSelectedProduct,
    isDropdownOpen,
    setIsDropdownOpen,
    handleClickOutside
  };
}
