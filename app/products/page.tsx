'use client';

import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
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
    </div>
  );
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const category = searchParams.get('category') || '';
        const params = new URLSearchParams();
        if (category) params.append('category', category);

        const response = await fetch(`${BASE_API_URL}/jobs?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          // If no database results, load from fallback localStorage
          const backup = localStorage.getItem('nearskill_synced_jobs');
          if (backup) setJobs(JSON.parse(backup));
        }
      } catch (err) {
        const backup = localStorage.getItem('nearskill_synced_jobs');
        if (backup) setJobs(JSON.parse(backup));
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [searchParams]);

  const formatSalary = (val?: number) => {
    if (!val) return '';
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  return (
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
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <div 
              key={job._id}
              onClick={() => router.push(`/?jobId=${job._id}`)}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md border border-slate-200 hover:border-indigo-200 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 border border-indigo-100">
                  {job.companyName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {job.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">{job.companyName}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="font-semibold text-indigo-600 flex items-center gap-1">
                      📍 {job.locationType} ({job.location})
                    </span>
                    <span>•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{job.jobType}</span>
                    {(job.salaryMin || job.salaryMax) && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          💰 {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)} / yr
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">
                View Spec
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-16 border border-dashed rounded-2xl bg-white">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-2" />
            <h3 className="font-semibold text-slate-700">No career listings active</h3>
            <p className="text-sm text-slate-400 mt-1">Check back later or try adjusting filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}