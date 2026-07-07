'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ExternalLink, Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { useSavedProductsStore } from '@/lib/store';
import { userAPI } from '@/lib/api';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore();
  const { savedProducts, addSavedProduct, removeSavedProduct } = useSavedProductsStore();

  const isSaved = savedProducts?.some((p) => p._id === product._id);
  const discountedPrice = product.price * (1 - product.discount / 100);

  const handleSaveProduct = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save products');
      return;
    }

    try {
      if (isSaved) {
        await userAPI.removeSavedProduct(product._id);
        removeSavedProduct(product._id);
        toast.success('Product removed from saved list');
      } else {
        await userAPI.saveProduct(product._id);
        addSavedProduct(product);
        toast.success('Product saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleAffiliateClick = () => {
    window.open(`/api/products/click/${product._id}`, '_blank');
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          {product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">
          <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
            {product.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">${discountedPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          className="flex-1"
          onClick={handleAffiliateClick}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Official Website
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleSaveProduct}
          className={isSaved ? 'text-red-500' : ''}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </CardFooter>
    </Card>
  );
}