import React, { useEffect, useState } from "react";
import "../style/ModalActividades.css";

const API_URL = "https://empatia-back.vercel.app/api/actividades";

function ModalActividades() {
  const [actividad, setActividad] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const modalDismissed = localStorage.getItem("actividadModalDismissed");

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const futuras = data.filter((act) => new Date(act.fecha) > new Date());
        if (futuras.length > 0) {
          const ultima = futuras[futuras.length - 1];
          setActividad(ultima);
          if (!modalDismissed) {
            setVisible(true);
          }
        }
      });
  }, []);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const cerrarModal = () => {
    setVisible(false);
    localStorage.setItem("actividadModalDismissed", "true");
  };

  if (!visible || !actividad) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-titulo">
          <h2>Veni a este evento</h2>
        </div>
        <button className="modal-close" onClick={cerrarModal}>
          ✕
        </button>

        <div className="title-content">
          <h2>{actividad.titulo}</h2>
          <h2>{actividad.hora} hs</h2>
        </div>
        <div className="modal-card-img">
          <img
            src={actividad.imagen || "https://via.placeholder.com/300x200"}
            alt={actividad.titulo}
          />
          <div className="modal-card-actions">
            <button
              className="btn-ver-mas"
              onClick={() => {
                cerrarModal();
                window.location.href = "http://localhost:3000/actividades";
              }}
            >
              Ver más
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalActividades;
