import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import CadastroMaterial from "./pages/cadastrar/CadastroMaterial";
import DashboardControleAlmoxarifado from "./pages/DashboardControleAlmoxarifado";
import SolicitarMaterial from "./pages/SolicitarMaterial";
import CadastroProfessor from "./pages/cadastrar/CadastroProfessor";
import CadastroCategoria from "./pages/cadastrar/CadastroCategoria";
import CadastroFornecedor from "./pages/cadastrar/CadastroFornecedor";
import GerenciarDevolucoes from "./pages/gerenciar/GerenciarDevolucoes";
import GerenciarMovimentacoes from "./pages/gerenciar/GerenciarMovimentacoes";
import CadastroMotivo from "./pages/cadastrar/CadastroMotivo";
import Menu from "./pages/Menu";
import GerenciarAlmoxarifado from "./pages/gerenciar/GerenciarAlmoxarifado";
import GerenciarSolicitacoes from "./pages/gerenciar/GerenciarSolicitacoes";
import CadastroAlmoxarifado from "./pages/cadastrar/CadastroAlmoxarifado";
import CadastroTipoFornecedor from "./pages/cadastrar/CadastroTipoFornecedor";
import GerenciarAlmoxarifes from "./pages/gerenciar/GerenciarAlmoxarifes";
import GerenciarSolicitacoesReprovadas from "./pages/gerenciar/GerenciarSolicitacoesReprovadas";
import CadastroAlmoxarife from "./pages/cadastrar/CadastroAlmoxarife";

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
  {
    path: "/gerenciar-solicitacoes-reprovadas",
    element: <GerenciarSolicitacoesReprovadas />,
    errorElement: <div>erro</div>,
  },
]);

export default routes;
