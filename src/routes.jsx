import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import CadastroMaterial from "./pages/CadastroMaterial";
import DashboardControleAlmoxarifado from "./pages/DashboardControleAlmoxarifado";
import SolicitarMaterial from "./pages/SolicitarMaterial";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/dashboard",
    element: <DashboardControleAlmoxarifado />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/cadastro-material",
    element: <CadastroMaterial />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/solicitar-material",
    element: <SolicitarMaterial />,
    errorElement: <div>erro</div>,
  },
]);

export default routes;