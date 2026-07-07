'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Star, ExternalLink, Heart, ShoppingCart } from 'lucide-react';
import { productsAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/lib/store';
import { userAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { isAuthenticated } = useAuthStore();
  const { savedProducts, addSavedProduct, removeSavedProduct } = useAuthStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsAPI.getBySlug(slug),
  });

  const isSaved = savedProducts?.some((p) => p._id === product?.product._id);
  const discountedPrice = product?.product.price 
    ? product.product.price * (1 - (product.product.discount || 0) / 100) 
    : 0;

  const handleSaveProduct = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save products');
      return;
    }

    try {
      if (isSaved && product?.product._id) {
        await userAPI.removeSavedProduct(product.product._id);
        removeSavedProduct(product.product._id);
        toast.success('Product removed from saved list');
      } else if (product?.product) {
        await userAPI.saveProduct(product.product._id);
        addSavedProduct(product.product);
        toast.success('Product saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleAffiliateClick = () => {
    if (product?.product._id) {
      window.open(`/api/products/click/${product.product._id}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-96 w-full mb-6" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!product?.product) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.product.images && product.product.images.length > 0 ? (
            <div className="relative aspect-video">
              <Image
                src={product.product.images[0]}
                alt={product.product.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.product.title}</h1>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold">${discountedPrice.toFixed(2)}</span>
            {product.product.discount > 0 && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ${product.product.price.toFixed(2)}
                </span>
                <Badge variant="destructive">{product.product.discount}% OFF</Badge>
              </>
            )}
          </div>

          {product.product.couponCode && (
            <div className="mb-4 p-3 bg-accent rounded-lg">
              <span className="font-medium">Coupon Code: </span>
              <code className="bg-background px-2 py-1 rounded">{product.product.couponCode}</code>
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <Button className="flex-1" size="lg" onClick={handleAffiliateClick}>
              <ExternalLink className="h-5 w-5 mr-2" />
              Visit Official Website
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSaveProduct}
              className={isSaved ? 'text-red-500' : ''}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{product.product.description}</p>
          </div>
        </div>
      </div>

      {/* Features, Pros, Cons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {product.product.features && product.product.features.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <ul className="list-disc list-inside space-y-1">
              {product.product.features.map((feature, i) => (
                <li key={i} className="text-sm">{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {product.product.pros && product.product.pros.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-600">Pros</h3>
            <ul className="list-disc list-inside space-y-1">
              {product.product.pros.map((pro, i) => (
                <li key={i} className="text-sm">{pro}</li>
              ))}
            </ul>
          </div>
        )}

        {product.product.cons && product.product.cons.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-600">Cons</h3>
            <ul className="list-disc list-inside space-y-1">
              {product.product.cons.map((con, i) => (
                <li key={i} className="text-sm">{con}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* FAQs */}
      {product.product.faqs && product.product.faqs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {product.product.faqs.map((faq, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{faq.question}</h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}