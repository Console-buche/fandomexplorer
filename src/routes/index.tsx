import { Route, Routes, Navigate } from 'react-router-dom';
import { PageHome, } from '@/pages/PageHome/PageHome';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageHome />} />
      <Route path="/about" element={<PageHome />} />
      <Route path="/contact" element={<PageHome />} />
      <Route path="*" element={<PageHome />} />
      {/* <Route */}
      {/*   path="*" */}
      {/*   element={ */}
      {/*     <span */}
      {/*       style={{ */}
      {/*         color: 'white', */}
      {/*         height: '100vh', */}
      {/*         width: '100vw', */}
      {/*         display: 'flex', */}
      {/*         justifyContent: 'center', */}
      {/*         alignItems: 'center', */}
      {/*         fontSize: '10rem', */}
      {/*       }} */}
      {/*     > */}
      {/*       NOT FOUND 404 */}
      {/*     </span> */}
      {/*   } */}
      {/* /> */}
    </Routes>
  );
};
