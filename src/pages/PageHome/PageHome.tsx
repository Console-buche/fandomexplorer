import { SceneGrid } from '@/components/Scene';
import { OffscreenCanvasPreloaded } from '@/components/Scene/OffscreenCanvas/OffscreenCanvasPreloaded';
import { Search } from '@/components/Search/Search';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { Suspense } from 'react';
import { PageHomeLayout } from './PageHomeLayout';
import { pageHomeLoader } from './style.css';

const Navigate = () => {
  const updateActiveStatus = useStoreFandoms(
    (state) => state.rickAndMorty.updateActiveStatus
  );
  const activeStatus = useStoreFandoms(
    (state) => state.rickAndMorty.activeStatus
  );

  return (
    <div
      style={{
        display: 'flex',
        gap: 20,
        zIndex: 10,
        height: 100,
        background: 'white',
      }}
    >
      {activeStatus}
      <a href="#alive" onClick={() => updateActiveStatus('Alive')}>
        Alive
      </a>
      <a href="#dead" onClick={() => updateActiveStatus('Dead')}>
        Dead
      </a>
      <a href="#unknown" onClick={() => updateActiveStatus('unknown')}>
        Unknown
      </a>
    </div>
  );
};

export const PageHome = () => {
  return (
    <Suspense fallback={<div className={pageHomeLoader}>fetching...</div>}>
      <Navigate />
      <Search />
      {/* Use offScreenCanvasByStatus if you want to load the images on demand */}
      {/* <OffscreenCanvasByStatus /> */}
      <OffscreenCanvasPreloaded status="Alive" size={4096} />
      <OffscreenCanvasPreloaded status="Dead" size={4096} />
      <OffscreenCanvasPreloaded status="unknown" size={4096} />
      <PageHomeLayout cards={<SceneGrid />} />
    </Suspense>
  );
};
