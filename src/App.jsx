import { useState, useEffect } from "react";
import Header from "./components/Header";
import Filtros from "./components/Filtros";
import ListadoGastos from "./components/ListadoGastos";
import iconoGasto from "./img/nuevo-gasto.svg";
import Modal from "./components/Modal";
import { generarId } from "./helpers";
import iconoNuevoGasto from './img/nuevo-gasto.svg'

function App() {
  const [gastos, setGastos] = useState(
    localStorage.getItem('gasto') ? JSON.parse(localStorage.getItem('gasto')) : []
  );

  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  );
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);

  const [ modal, setModal ] = useState(false);
  const [ animarModal, setAnimarModal ] = useState(false);

  const [gastoEditar, setGastoEditar] = useState({})

  const [filtro, setFiltro] = useState('')
  const [filtrados, setFiltrados] = useState([])

  useEffect(() => {
    if ( Object.keys(gastoEditar).length > 0 ) {
      setModal(true);

      setTimeout(() => {
        setAnimarModal(true)
      }, 400)
    }
  }, [ gastoEditar ])

  useEffect(() => {
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto]);

  useEffect(() => {
    localStorage.setItem('gasto', JSON.stringify(gastos) ?? []);
  }, [gastos])

  useEffect(() => {
    if ( filtro ) {
      // Filtrando Gastos por Categoria 
      const gastosFiltrados = gastos.filter( gasto => gasto.categoria === filtro);
      setFiltrados(gastosFiltrados);
    }
  }, [filtro])

  useEffect(() => {
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0;

    if ( presupuestoLS > 0 ) {
      setIsValidPresupuesto(true)
    }
  }, [])


  const handleNuevoGasto = () => {
    setModal(true);
    setGastoEditar({});

    setTimeout(() => {
      setAnimarModal(true)
    }, 400)
  }

  const guardarGasto = gasto => {
    if ( gasto.id ) {
      // Actualizar
      const gastosActaualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState )
      setGastos(gastosActaualizados);
      setGastoEditar({})
    } else {
      // Nuevo Gasto
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([...gastos, gasto])
    }

    setAnimarModal(false);
    setTimeout(() => {
      setModal(false);
    }, 700);
  }

  const eliminarGasto = id => {
    const gastosActaualizados = gastos.filter( gasto => gasto.id !== id)
    setGastos(gastosActaualizados);
  }

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />
      
      {isValidPresupuesto && (
        <>
        <main>
        <Filtros
          filtro={filtro}
          setFiltro={setFiltro}
        />
        <ListadoGastos
          gastos={gastos}
          setGastoEditar={setGastoEditar}
          eliminarGasto={eliminarGasto}
          filtro={filtro}
          filtrados={filtrados}
        />
        </main>
        <div className="nuevo-gasto">
          <img 
            src={iconoGasto} 
            alt="Icono gasto"
            onClick={handleNuevoGasto}
           />
        </div>
        </>
      )}

      {modal && <Modal
                  setModal={setModal}
                  animarModal={animarModal}
                  setAnimarModal={setAnimarModal}
                  guardarGasto={guardarGasto}
                  gastoEditar={gastoEditar}
                  setGastoEditar={setGastoEditar}
                />}

    </div>
  );
}

export default App;
