import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HomePage, ProcedurePage } from "../pages";
import ScrollToTop from "../components/common/ScrollToTop";

const AppRouter = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verfahren/:procedureId" element={<ProcedurePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
