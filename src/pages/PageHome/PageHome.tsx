import { SceneGrid } from '@/components/Scene';
import { OffscreenCanvasByStatus } from '@/components/Scene/OffscreenCanvas/OffscreenCanvasByStatus';
import { Suspense } from 'react';
import { PageHomeLayout } from './PageHomeLayout';
import { pageHomeLoader } from './style.css';
import { Search } from '@/components/Search/Search';
import { useStoreFandoms } from '@/stores/storeFandoms';

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
      <OffscreenCanvasByStatus />
      <PageHomeLayout cards={<SceneGrid />} />
    </Suspense>
  );
};
