import { useState } from "react";
import { useEffect } from "react";
import { firebase } from "./firebase";

function App() {

  const [listaTareas, setListaTareas] = useState([])
  const [tarea, setTarea] = useState('')
  const [id, setId] = useState('')
  const [modoEditar, setModoEditar] = useState(false)

  useEffect(() => {
    const obtenerDatos = async () => {
      const db = firebase.firestore()
      try {
        const data = await db.collection('tareas').get()
        // Aquí se hace un MERGE de objetos, primero con la prop id y luego toda la data.
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setListaTareas(arrayData)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos()
  }, [])

  const agregar = async(e) => {
    e.preventDefault()
    if(!tarea.trim()) {
      return
    }
    const db = firebase.firestore()
    try {
      const nueva_tarea = { name: tarea, fecha_creacion: Date.now() }
      // operación de guardado
      const { id } = await db.collection('tareas').add(nueva_tarea)
      // cambiar el estado
      setListaTareas([
        ...listaTareas, { id: id, ...nueva_tarea }
      ])
      setTarea('')
    } catch (error) {
      console.log(error)
    }
  }

  const eliminar = async (id) => {
    const db = firebase.firestore()
    try {
      await db.collection('tareas').doc(id).delete()
      // Obtener de vuelta los datos de la BD
      // También puedes eliminar directo con filter del state listaTareas
      const data = await db.collection('tareas').get()
      const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setListaTareas(arrayData)
    } catch (error) {
      console.log(error)
    }
  }

  const editarForm = ({ id, name }) => {
    setModoEditar(true)
    setTarea(name)
    setId(id)
  }

  const editar = async (e) => {
    e.preventDefault()
    if(!tarea.trim()) {
      return
    }
    const db = firebase.firestore()
    try {
      const tarea_editada = { name: tarea, fecha_modificacion: Date.now() }
      const tarea_ref = db.collection('tareas').doc(id)
      tarea_ref.update(tarea_editada)
      //forma dura de editar desde solamente la tabla
      //const array_editado = listaTareas.map(item => item.id === id ? ({ id: item.id, name: tarea, fecha_creacion: item.fecha_creacion, fecha_modificacion: Date.now() }) : item)
      //setListaTareas(array_editado)
      // volver a llamar a la api
      const data = await db.collection('tareas').get()
      const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setListaTareas(arrayData)
      setId('')
      setTarea('')
      setModoEditar(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Lista de tareas */}
        <div className="col-md-6 col-sm-12">
          <div className="card">
            <div className="card-header">Lista de tareas</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    listaTareas ? listaTareas.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{item.id}</th>
                        <td>{item.name}</td>
                        <td>
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-primary btn-sm" onClick={ () => editarForm(item) }>Editar</button>
                            <button className="btn btn-secondary btn-sm" onClick={ () => eliminar(item.id) }>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    )) : ''
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Formulario de tareas */}
        <div className="col-md-6 col-sm-12">
          <form onSubmit={ modoEditar ? editar : agregar }>
            <div className="card">
              <div className="card-header">Formulario</div>
              <div className="card-body">
                  <input type="text" className="form-control" placeholder="Escriba una tarea" onChange={ e => setTarea(e.target.value) } value={ tarea }/>
              </div>
              <div className="card-footer d-grid">
                <button className="btn btn-primary" type="submit">{ modoEditar ? 'Editar' : 'Guardar'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
