import { SceneGrid } from '@/components/Scene';
import { OffscreenCanvasPreloaded } from '@/components/Scene/OffscreenCanvas/OffscreenCanvasPreloaded';
import { Search } from '@/components/Search/Search';
import { Suspense } from 'react';
import { PageHomeLayout } from './PageHomeLayout';
import { pageHomeLoader } from './style.css';

export const PageHome = () => {
  return (
    <Suspense fallback={<div className={pageHomeLoader}>fetching...</div>}>
      <Search />
      <OffscreenCanvasPreloaded status="Alive" size={4096} />
      <OffscreenCanvasPreloaded status="Dead" size={4096} />
      <OffscreenCanvasPreloaded status="unknown" size={4096} />
      <PageHomeLayout cards={<SceneGrid />} />
    </Suspense>
  );
};
