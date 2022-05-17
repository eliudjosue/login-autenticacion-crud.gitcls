import React from "react";
import { db } from '../firebase'
import moment from "moment";
import 'moment/locale/es'

function App(props) {
  const [tareas, setTareas] = React.useState([])
  const [tarea, setTarea] = React.useState('')
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [ Id, setId] = React.useState('')
  const [ultimo, setUltimo] = React.useState(null)
  const [desactivar, setDesactivar] = React.useState(false)

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
       
        setDesactivar(true)
        const data = await db.collection(props.user.uid)
        .limit(2)
        .orderBy('fecha')
        .get()
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() })) 
  
     
        setUltimo(data.docs[data.docs.length - 1])
        // console.log(arrayData)
        setTareas(arrayData);

        const query = await db.collection(props.user.uid)
        .limit(2)
        .orderBy('fecha')
        .startAfter(data.docs[data.docs.length - 1])
        .get()
        if(query.empty){
          console.log('No hay mas documentos')
          setDesactivar(true)
        }else{
          setDesactivar(false)
        }
      } catch (error) {
        console.log(error)
      }

    }

    obtenerDatos();
  
  }, [props.user.uid]);

  const agregar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('esta vacio')
      return
    }
   
    const nuevaTarea = {
      name : tarea,
      fecha : Date.now()
    }

    const data = await db.collection(props.user.uid).add(nuevaTarea)
    setTarea('')
    setTareas([
      ...tareas, {...nuevaTarea, id: data.id}
    ])
    console.log(tarea)
  }

  const eliminar = async (id) => {
    try {
      
      await db.collection(props.user.uid).doc(id).delete()

      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)

    } catch (error) {
      console.log(error)
    }
  }

  const  activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)

  }

  const editar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('vacio')
      return
    }

      try {
       
        await db.collection(props.user.uid).doc(Id).update({
          name: tarea
        })

        const arrayEditado = tareas.map(item =>(
          item.id === Id ? {id : item.id, fecha: item.fecha, name: tarea} : item
        ))
        setTareas(arrayEditado)
        setModoEdicion(false)
        setTarea('')
        setId('')
      } catch (error) {
        console.log(error)
      }
  }

  const siguiente = async () =>{
    console.log('siguiente')
    try {
      const data = await db.collection(props.user.uid)
      .limit(2)
      .orderBy('fecha')
      .startAfter(ultimo)
      .get()
      const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() })) 
      setTareas([
        ...tareas,
        ...arrayData
      ])
      setUltimo(data.docs[data.docs.length - 1])

      const query = await db.collection(props.user.uid)
      .limit(2)
      .orderBy('fecha')
      .startAfter(data.docs[data.docs.length - 1])
      .get()
      if(query.empty){
        console.log('No hay mas documentos')
        setDesactivar(true)
      }else{
        setDesactivar(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {
              tareas.map(item => (
                <li className= "list-group mt-2" key={item.id}>
                  {moment(item.fecha).format('lll')}

                  <div className="list-group-item">
                  {item.name} 
                  <div className="list-item">
                    <button 
                      className="btn btn-danger btn-sm float-end m-2"
                      onClick={()=> eliminar(item.id)}
                      >Eliminar</button>
                      <button 
                      className="btn btn-warning btn-sm float-end m-2"
                      onClick={() => activarEdicion(item) }>Editar
                    </button>
                  </div>
                    
                  </div>
                  
                </li> 
              ))
              
            }
          </ul>
          <button 
          className="btn btn-info btn-block mt-2 mx-auto col-12 btn-sm"
          onClick={() => siguiente()}
          disabled={desactivar}>
            Siguiente...
          </button>
        </div>

        <div className="col-md-6">
          <h3>
            {
              modoEdicion ? 'Editar Tarea' : 'Formulario'
            }
          </h3>
            <form onSubmit={modoEdicion ? editar : agregar}>
              <input 
              type="text"
              placeholder="Ingrese Tarea"
              className="form-control mb-2"
              onChange={e => setTarea(e.target.value)}
              value={tarea} />

              <button 
              className={
                modoEdicion ? 'btn btn-warning mx-auto col-12' : 'btn btn-dark mx-auto col-12'
              }
              type="submit">
                {
                  modoEdicion ? 'Editar' : 'Agregar'
                }
              </button>

            </form>
        </div>
      </div>
    </div>
  );
}

export default App;
