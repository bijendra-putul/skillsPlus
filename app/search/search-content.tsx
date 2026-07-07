
'use client';

import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);

  const { data: products, isLoading } = useQuery({
    queryKey: ['search', query, page],
    queryFn: () => productsAPI.getAll({ search: query, page }),
    enabled: !!query,
  });

  useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">
        Search Results for: <span className="text-primary">{query}</span>
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : products?.products.length ? (
        <>
          <p className="text-muted-foreground mb-6">
            Found {products.total} results
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.products.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {products.pages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: products.pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center py-12 text-muted-foreground">
          No products found for your search query.
        </p>
      )}
    </div>
  );
}