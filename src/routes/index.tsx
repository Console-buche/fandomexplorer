import { Route, Routes } from 'react-router-dom';
import { PageHome } from '@/pages/PageHome/PageHome';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageHome />} />
    </Routes>
  );
};
