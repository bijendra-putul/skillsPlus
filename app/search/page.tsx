import { Suspense } from 'react';
import SearchContent from './search-content';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}