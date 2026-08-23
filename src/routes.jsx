import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import CadastroMaterial from "./pages/CadastroMaterial";
import DashboardControleAlmoxarifado from "./pages/DashboardControleAlmoxarifado";
import SolicitarMaterial from "./pages/SolicitarMaterial";
import CadastroProfessor from "./pages/CadastroProfessor";
import CadastroCategoria from "./pages/CadastroCategoria";
import CadastroFornecedor from "./pages/CadastroFornecedor";
import GerenciarDevolucoes from "./pages/GerenciarDevolucoes";
import GerenciarMovimentacoes from "./pages/GerenciarMovimentacoes";
import CadastroMotivo from "./pages/CadastroMotivo";
import Menu from "./pages/Menu";
import GerenciarAlmoxarifado from "./pages/GerenciarAlmoxarifado";
import GerenciarSolicitacoes from "./pages/GerenciarSolicitacoes";
import CadastroAlmoxarifado from "./pages/CadastroAlmoxarifado";
import CadastroTipoFornecedor from "./pages/CadastroTipoFornecedor";
import GerenciarAlmoxarifes from "./pages/GerenciarAlmoxarifes";
import CadastroAlmoxarife from "./pages/CadastroAlmoxarife";



const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/menu",
    element: <Menu />,
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
    path: "/cadastro-professor",
    element: <CadastroProfessor />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/cadastro-categoria",
    element: <CadastroCategoria />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/cadastro-almoxarifado",
    element: <CadastroAlmoxarifado />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/cadastro-fornecedor",
    element: <CadastroFornecedor />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/gerenciar-movimentacoes",
    element: <GerenciarMovimentacoes />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/cadastro-motivo",
    element: <CadastroMotivo />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/gerenciar-devolucoes",
    element: <GerenciarDevolucoes />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/gerenciar-solicitacoes",
    element: <GerenciarSolicitacoes />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/gerenciar-almoxarifado",
    element: <GerenciarAlmoxarifado />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/gerenciar-tipofornecedor",
    element: <CadastroTipoFornecedor />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/gerenciar-almoxarifes",
    element: <GerenciarAlmoxarifes />,
    errorElement: <div>erro</div>,
  },
  {
    path: "/cadastro-almoxarife",
    element: <CadastroAlmoxarife />,
    errorElement: <div>erro</div>,
  },
]);

export default routes;
