import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase/firebase";
import { Table, Form, Pagination } from "react-bootstrap";
import { getAuth } from "firebase/auth";

function Asistentes() {
  const auth = getAuth();
  const usuarioAuthentication = auth.currentUser;
  const [asistentes, setAsistentes] = useState([]);
  const [profesores, setProfesor] = useState();
  const [profesoresCargados, setProfesoresCargados] = useState(false);
  const [asistentesBandera, setAsistentesBandera] = useState(false);
  const [valorSeleccionado, setValorSeleccionado] = useState("");
  const [resultados, setResultados] = useState([]);
  //Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages =
    resultados.length > 0
      ? Math.ceil(resultados.length / itemsPerPage)
      : Math.ceil(asistentes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems =
    resultados.length > 0
      ? resultados.slice(startIndex, endIndex)
      : asistentes.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleBusqueda = (event) => {
    const terminoBusqueda = event.target.value;
    buscarEnLista(terminoBusqueda);
  };
  function handleSelectChange(event) {
    setValorSeleccionado(event.target.value);
  }
  const buscarEnLista = (terminoBusqueda) => {
    const resultadosBusq = [];
    if (
      valorSeleccionado === "default" ||
      valorSeleccionado === "nombre" ||
      valorSeleccionado === "correo" ||
      valorSeleccionado === "asistencia" ||
      valorSeleccionado === "curso" ||
      valorSeleccionado === ""
    ) {
      for (let i = 0; i < asistentes.length; i++) {
        if (
          asistentes[i].nombre.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(asistentes[i]);
        }
      }
    }
    if (valorSeleccionado === "correo") {
      for (let i = 0; i < asistentes.length; i++) {
        if (
          asistentes[i].correo.toLowerCase() === terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(asistentes[i]);
        }
      }
    }
    if (valorSeleccionado === "asistencia") {
      for (let i = 0; i < asistentes.length; i++) {
        if (
          asistentes[i].tipoAsistencia.toLowerCase() ===
          terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(asistentes[i]);
        }
      }
    }
    if (valorSeleccionado === "curso") {
      for (let i = 0; i < asistentes.length; i++) {
        if (
          asistentes[i].cursoAsistir.toLowerCase() ===
          terminoBusqueda.toLowerCase()
        ) {
          resultadosBusq.push(asistentes[i]);
        }
      }
    }
    setResultados(resultadosBusq);
  };

  useEffect(() => {
    if (!asistentesBandera) {
      const cargarProfesores = async () => {
        const q = query(
          collection(db, "profesores"),
          where("email", "==", usuarioAuthentication.email)
        );
        const st = await getDocs(q);
        const profe = st.docs.map((prof) => ({
          ...prof.data(),
        }));
        setProfesor(profe);
        setProfesoresCargados(true);
      };
      cargarProfesores();
      console.log("Prueba")
    }
  });

  useEffect(() => {
    if (profesoresCargados) {
      const obtenerSolicitudes = async () => {
        const profesorEncontrado = profesores.find(
          (profesor) => profesor.email === usuarioAuthentication.email
        );

        const querySolicitudesCollection = query(
          collection(db, "solicitudes"),
          where("profesorAsistir", "==", profesorEncontrado.nombre),
          where("condicion", "==", "Aceptado")
        );
        const snapshot = await getDocs(querySolicitudesCollection);
        const listaAsistentes = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setAsistentes(listaAsistentes);
        setProfesoresCargados(false);
        setAsistentesBandera(true);
      };
      obtenerSolicitudes();
    }
  });

  return (
    <>
      <div className="container-lg ">
        <div className="containerToTitleAndSearch">
          <div className="col">
            <h1>Asistentes</h1>
          </div>

          <div className="row">
            <div className="col">
              <Form.Select
                aria-label="Default select example"
                onChange={handleSelectChange}
              >
                <option value="default">Filtros</option>
                <option value="nombre">Por Nombre</option>
                <option value="correo">Por Correo</option>
                <option value="asistencia">Por Asistencia</option>
                <option value="curso">Por Curso</option>
              </Form.Select>
            </div>
            <div className="col">
              <Form.Control
                type="search"
                placeholder="Buscar"
                className="me-2"
                aria-label="Search"
                onChange={handleBusqueda}
              />
            </div>
          </div>
        </div>

        <Table striped bordered hover>
          <thead className="table-dark table-bg-scale-50">
            <tr>
              <th>Carné</th>
              <th>Nombre completo</th>
              <th>Correo Electrónico</th>
              <th>Tipo de Asistencia</th>
              <th>Curso</th>
              <th>Horas</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((asistentes) => (
              <tr key={asistentes.id}>
                <td>{asistentes.carne}</td>
                <td>{asistentes.nombre}</td>
                <td>{asistentes.correo}</td>
                <td>{asistentes.tipoAsistencia}</td>
                <td>{asistentes.cursoAsistir}</td>
                <td>{asistentes.horasAsignadas}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination className="justify-content-center">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </div>
    </>
  );
}

export default Asistentes;
