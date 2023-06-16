import { SceneGrid } from '@/components/Scene';
import { OffscreenCanvasByStatus } from '@/components/Scene/OffscreenCanvas/OffscreenCanvasByStatus';
import { SearchTest } from '@/components/SearchTest/SearchTest';
import { Suspense } from 'react';
import { PageHomeLayout } from './PageHomeLayout';
import { pageHomeLoader } from './style.css';

export const PageHome = () => {
  return (
    <Suspense fallback={<div className={pageHomeLoader}>fetching...</div>}>
      <OffscreenCanvasByStatus />

      <SearchTest />
      <PageHomeLayout cards={<SceneGrid />} />
    </Suspense>
  );
};
