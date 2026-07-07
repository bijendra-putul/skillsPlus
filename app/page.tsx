'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, categoriesAPI, blogsAPI } from '@/lib/api';
import { Product, Category, Blog } from '@/lib/types';

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsAPI.getFeatured(),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  const { data: featuredBlogs, isLoading: blogsLoading } = useQuery({
    queryKey: ['featured-blogs'],
    queryFn: () => blogsAPI.getFeatured(),
  });

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover the Best Products & Tools
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Find useful products, tools, software, courses, and AI tools with honest reviews and comparisons.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <Link href="/products">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/blog">Read Our Blog</Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))
            : categories?.categories.map((category: Category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="text-3xl mb-2">{category.icon}</span>
                  <span className="text-sm font-medium text-center">
                    {category.name}
                  </span>
                </Link>
              ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Button variant="ghost">
            <Link href="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))
            : featuredProducts?.products.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Blog Posts</h2>
          <Button variant="ghost">
            <Link href="/blog">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))
            : featuredBlogs?.blogs.map((blog: Blog) => (
                <article key={blog._id} className="border rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">
                      <Link href={`/blog/${blog.slug}`} className="hover:text-primary transition-colors">
                        {blog.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{blog.readTime} min read</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </section>
    </div>
  );
}