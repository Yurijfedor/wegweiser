import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HomePage, ProcedurePage } from "../pages";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verfahren/:procedureId" element={<ProcedurePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
