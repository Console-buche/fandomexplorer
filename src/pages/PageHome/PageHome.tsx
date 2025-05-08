import { SceneGrid } from '@/components/Scene';
import { OffscreenCanvasPreloaded } from '@/components/Scene/OffscreenCanvas/OffscreenCanvasPreloaded';
import { ScrollOverlay } from '@/components/ScrollOverlay/ScrollOverlay';
import { Search } from '@/components/Search/Search';
import useScrollDirection from '@/hooks/useScroll';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { Suspense } from 'react';
import { PageHomeLayout } from './PageHomeLayout';
import { pageHomeLoader } from './style.css';

export const PageHome = () => {
  const { hasScrolled } = useScrollDirection();

  const hasStarted = useStoreFandoms((state) => state.rickAndMorty.hasStarted);

  return (
    <Suspense fallback={<div className={pageHomeLoader}>LOADING...</div>}>
      <Search />
      <OffscreenCanvasPreloaded status="Alive" size={4096} />
      <OffscreenCanvasPreloaded status="Dead" size={4096} />
      <OffscreenCanvasPreloaded status="unknown" size={4096} />
      <PageHomeLayout cards={<SceneGrid />} />
      {!hasScrolled.current && hasStarted && <ScrollOverlay />}
    </Suspense>
  );
};
