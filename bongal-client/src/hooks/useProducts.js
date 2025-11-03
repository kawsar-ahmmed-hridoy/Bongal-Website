import { useQuery } from 'react-query';
import { productService } from '../services/productService';

export const useProducts = (filters = {}) => {
  return useQuery(['products', filters], () => productService.getAllProducts(filters), {
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id) => {
  return useQuery(['product', id], () => productService.getProductById(id), {
    enabled: !!id,
  });
};

export const useFeaturedProducts = () => {
  return useQuery('featured-products', () => 
    productService.getAllProducts({ limit: 6, isFeatured: true })
  );
};

export const useProductsByCategory = (category) => {
  return useQuery(['products', category], () => 
    productService.getAllProducts({ category })
  );
};

export default useProducts;