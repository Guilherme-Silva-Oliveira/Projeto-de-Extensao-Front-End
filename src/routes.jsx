import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import CadastroMaterial from "./pages/CadastroMaterial";
import DashboardControleAlmoxarifado from "./pages/DashboardControleAlmoxarifado";
import SolicitarMaterial from "./pages/SolicitarMaterial";
import CadastroProfessor from "./pages/CadastroProfessor";
import CadastroCategoria from "./pages/CadastroCategoria";
import CadastroFornecedor from "./pages/CadastroFornecedor";
import GerenciarDevolucoes from "./pages/GerenciarDevolucoes";
import CadastroMotivo from "./pages/CadastroMotivo";

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
  {
<<<<<<< HEAD
    path: "/cadastro-professor",
    element: <CadastroProfessor />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/cadastro-categoria",
    element: <CadastroCategoria />,
=======
    path: "/cadastro-fornecedor",
    element: <CadastroFornecedor />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/gerenciar-devolucoes",
    element: <GerenciarDevolucoes />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/cadastro-motivo",
    element: <CadastroMotivo />,
>>>>>>> 6afbe33c8b47c67096e12d3c10fcf2e49d93f341
    errorElement: <div>erro</div>,
  },
]);

export default routes;