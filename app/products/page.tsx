import { Suspense } from 'react';
import ProductsContent from './products-content';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}