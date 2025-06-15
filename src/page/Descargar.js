import React, { useState, useEffect } from "react";
import portadaGuia from "../assets/familiaEMPATIA.jpg";
import portadaLibro from "../assets/portadaLibro.jpg";
import guiaPDF from "../assets/Guía Empatía Digital.pdf";
import avatar from "../assets/avatar.jpg";
import Swal from "sweetalert2";
import "../style/Descargar.css";
import { useAuth } from "../context/AuthContext";

const AUTOR_AVATAR =
  avatar || "https://cdn-icons-png.flaticon.com/512/147/147144.png";

const destacados = [
  {
    type: "pdf",
    title: "Guía de Empatía Digital para Familias",
    file: guiaPDF,
    portada: portadaGuia,
    name: "Guía Empatía Digital.pdf",
    esFijo: true,
  },
  {
    type: "libro",
    title: "Empatía Digital: Crianza en Tiempos de Pantalla",
    file: "https://tulinkdelibro.com",
    portada: portadaLibro,
    name: "Libro Empatía Digital",
    esFijo: true,
  },
];

export default function Descargar() {
  const { user } = useAuth();
  const [materialDB, setMaterialDB] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [pagina, setPagina] = useState(1);
  const porPagina = 2;

  const cargarMateriales = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/descarga");
      const data = await res.json();
      setMaterialDB(data);
    } catch {
      Swal.fire("Error", "No se pudo cargar contenido", "error");
    }
  };

  useEffect(() => {
    cargarMateriales();
  }, []);

  const itemsCombinados = [...destacados, ...materialDB];

  const filtrados =
    tipoFiltro === "todos"
      ? itemsCombinados
      : itemsCombinados.filter((item) => item.type === tipoFiltro);

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const visibles = filtrados.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  const handleFileUpload = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      const nuevo = {
        title: archivo.name,
        filename: archivo.name,
        type: archivo.name.toLowerCase().includes("libro") ? "libro" : "pdf",
        portada:
          "https://picsum.photos/300/200?random=" + Math.floor(Math.random() * 1000),
        fileData: base64,
      };

      // ¿Es uno de los dos destacados?
      const esDestacado = destacados.find((d) => d.name === archivo.name);
      if (esDestacado) {
        Swal.fire("Reemplazo local", "Se reemplazó un material destacado.", "info");
        destacados[destacados.findIndex((d) => d.name === archivo.name)] = {
          ...destacados.find((d) => d.name === archivo.name),
          ...nuevo,
          file: `data:application/pdf;base64,${base64}`,
        };
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/descarga", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevo),
        });
        const data = await res.json();
        if (res.ok) {
          setMaterialDB((prev) => [data, ...prev]);
          Swal.fire("Subido", "Archivo subido correctamente", "success");
        } else {
          throw new Error(data.error || "Error desconocido");
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    };

    reader.readAsDataURL(archivo);
  };

  const eliminarItem = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/descarga/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMaterialDB((prev) => prev.filter((item) => item._id !== id));
        Swal.fire("Eliminado", "Archivo eliminado", "success");
      }
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  return (
    <section className="compras-section">
      <h2 className="titulo-principal">Material Recomendado</h2>

      <div className="filtro-container">
        <label>Mostrar:</label>
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="libro">Libros</option>
          <option value="pdf">PDFs</option>
        </select>
      </div>

      {user?.role === "superadmin" && (
        <div className="upload-container">
          <label htmlFor="upload-input" className="btn-ver-mas">
            Subir nuevo PDF o Libro
          </label>
          <input
            id="upload-input"
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </div>
      )}

      <div className="lista-posts-container">
        {visibles.map((item, index) => {
          const isPDF = item.type === "pdf";
          const esLocal = item.esFijo;

          const archivoBase64 = item.fileData
            ? `data:application/pdf;base64,${item.fileData}`
            : item.file;

          return (
            <div
              key={item._id || index}
              className="post-card"
              style={{
                backgroundImage: `url(${item.portada || portadaGuia})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="post-content-overlay">
                <h3 className="titulo-guia">
                  {item.type === "libro"
                    ? "Comprá el Libro"
                    : "Descargá el PDF"}
                </h3>
                <p className="autor">{item.title}</p>
                {item.type === "libro" ? (
                  <button
                    className="btn-ver-mas"
                    onClick={() => window.open(archivoBase64, "_blank")}
                  >
                    Comprar Libro
                  </button>
                ) : (
                  <a href={archivoBase64} download={item.filename || item.name}>
                    <button className="btn-ver-mas">Descargar</button>
                  </a>
                )}

                {user?.role === "superadmin" && !esLocal && (
                  <button
                    className="btn-ver-mas btn-borrar"
                    style={{ backgroundColor: "#ff5252", marginTop: "0.5rem" }}
                    onClick={() => eliminarItem(item._id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="paginacion-container">
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
          {"<"}
        </button>
        <span className="contador-materiales">
          Viendo: {visibles.length > 0 ? (pagina - 1) * porPagina + 1 : 0}–
          {Math.min(pagina * porPagina, filtrados.length)} de{" "}
          {filtrados.length}{" "}
          {tipoFiltro === "todos"
            ? "materiales"
            : tipoFiltro === "libro"
            ? "libros"
            : "PDFs"}
        </span>
        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
        >
          {">"}
        </button>
      </div>

      <div className="descripcion-autor">
        <img
          src={AUTOR_AVATAR}
          alt="Autor"
          className="avatar-autor"
          style={{ width: 80, borderRadius: "50%" }}
        />
        <div className="tarjeta-autor">
          <p>
            Creado por <b>Gabriel Reynoso</b>, acompañando a las familias en los
            desafíos que trae la tecnología. Comparte herramientas desde su
            experiencia como acompañante terapéutico para convivir mejor con
            pantallas, redes e inteligencia artificial.
          </p>
          <a href="/registrar" className="link-suscripcion">
            Suscribite para recibir novedades, posts y más.
          </a>
        </div>
      </div>
    </section>
  );
}
