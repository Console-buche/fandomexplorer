import { ReactNode } from 'react';
import { pageCardContainer, pageLayoutStyle } from './style.css';

type PageHomeLayout = {
  cards: ReactNode;
  activeElement?: ReactNode;
};

export const PageHomeLayout = ({ activeElement, cards }: PageHomeLayout) => {
  return (
    <div className={pageLayoutStyle}>
      <div className={pageCardContainer}>
        {activeElement && <div style={{ flex: 0.5 }}>{activeElement}</div>}
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexWrap: 'wrap',
            height: '100%',
          }}
        >
          {cards}
        </div>
      </div>
    </div>
  );
};
