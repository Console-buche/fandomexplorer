import { SceneGrid } from '@/components/Scene';
import { OffscreenCanvasByStatus } from '@/components/Scene/OffscreenCanvas/OffscreenCanvasByStatus';
import { Suspense } from 'react';
import { PageHomeLayout } from './PageHomeLayout';
import { pageHomeLoader } from './style.css';
import { Search } from '@/components/Search/Search';

export const PageHome = () => {
  return (
    <Suspense fallback={<div className={pageHomeLoader}>fetching...</div>}>
      <Search />
      <OffscreenCanvasByStatus />

      <PageHomeLayout cards={<SceneGrid />} />
    </Suspense>
  );
};
