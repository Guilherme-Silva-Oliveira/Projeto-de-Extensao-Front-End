import Card from "./components/Card";


function App() {


  // const nome = "Marina"
  // const status = "Ativo"
  // const idadade = 30

  // importando o componente de card

  const usuarios = [

    {
      nome: "Marina",
      status: true,
      idade: 30
    },
    {
      nome: "Gerson",
      status: true,
      idade: 46
    },
    {
      nome: "Zé",
      status: false,
      idade: 10
    }


  ]


  return (  
    <div>
    
      <h1>Usuários</h1>
      {/* tudo que estiver dentro das chaves é interpretado como código JavaScript */}

    {/* forma "hardcore" de passar as coisas */}
    {/* no caso de true ou false, a validação, ao ver que há algum elemento dentro das chaves, ja entende como true */}
    <Card nome={"Fernando"} status={"Ativo"} idade={15}/>
      {
        usuarios.map((usuarios) => {
          return <Card 
          
            nome={usuarios.nome}
            status={usuarios.status}
            idade={usuarios.idade}
          
          />
        })
      }
    </div>
  );
}

export default App;
