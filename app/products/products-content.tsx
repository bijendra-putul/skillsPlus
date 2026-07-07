'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(1);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', page, selectedCategory, searchQuery, sortBy],
    queryFn: () => productsAPI.getAll({
      page,
      category: selectedCategory,
      search: searchQuery,
      sort: sortBy,
    }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories?.categories.map((category: Category) => (
              <SelectItem key={category._id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-createdAt">Newest</SelectItem>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="-price">Price: High to Low</SelectItem>
            <SelectItem value="-rating">Top Rated</SelectItem>
            <SelectItem value="-clickCount">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productsLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))
          : products?.products.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>

      {/* Pagination */}
      {products && products.pages > 1 && (
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

      {/* Jobs Section */}
      <div className="container mx-auto py-12 max-w-5xl px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore Open Roles</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse through our active, high-salary tech and operations opportunities.
            </p>
          </div>
          <Button asChild>
            <Link href="/">
              Go to Interactive Board <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-center py-16 border border-dashed rounded-2xl bg-white">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-2" />
            <h3 className="font-semibold text-slate-700">No career listings active</h3>
            <p className="text-sm text-slate-400 mt-1">Check back later or try adjusting filters.</p>
          </div>
        </div>
      </div>
    </div>
  );
}