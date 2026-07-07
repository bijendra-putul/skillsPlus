'use client';

import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '@/lib/api';
import { Category } from '@/lib/types';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">All Categories</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))
          : categories?.categories.map((category: Category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="flex flex-col items-center p-6 border rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-4xl mb-3">{category.icon}</span>
                <span className="text-sm font-medium text-center">
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {category.productCount} products
                </span>
              </Link>
            ))}
      </div>
    </div>
  );
}