// src/components/PostDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fondo from "../assets/Juego.jpeg";
import "../style/PostCompleto.css";
import { FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/64/64572.png";

const PostCompleto = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [cargando, setCargando] = useState(true);

  const currentUrl = `${window.location.origin}/post/${id}`;
  const mensaje = encodeURIComponent(
    `Encontré este post que te puede interesar: ${currentUrl}`
  );
  useEffect(() => {
    const enlaces = document.querySelectorAll('.post-content a');
  
    enlaces.forEach((a) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('http')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`https://sentidos-front-lkxh.vercel.app/api/posts/${id}`);
        const data = await res.json();
        setPost(data);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener el post:", error);
        setCargando(false);
      }
    };

    fetchPost();
  }, [id]);

  if (cargando) return <p>Cargando post...</p>;
  if (!post) return <p>No se encontró el post.</p>;

  return (
    <div className="post-detalle">
      <h2 className="post-completo-title">{post.titulo}</h2>

      <div className="post-header">
        <img
          src={post.avatar || DEFAULT_AVATAR}
          alt="avatar"
          className="avatar"
        />
        <div>
          <p
            style={{
              color: "#000",
              fontSize: "0.9rem",
              display: "inline",
              fontStyle: "italic",
              fontWeight: "bold",
            }}
          >
            Por: {post.autor}
          </p>
          <div>
            <p>
              <b>Fecha:</b> {new Date(post.fecha).toLocaleDateString()}{" "}
              &nbsp;&nbsp;&nbsp;
              <b>Categoría:</b> {post.categoria}
            </p>
          </div>
        </div>
      </div>

      {post.portada && (
        <img src={post.portada} alt="portada" className="preview-portada" />
      )}
      <p>
        <i>{post.epigrafe}</i>
      </p>
  
  <div className="imagen-fija-1200" dangerouslySetInnerHTML={{ __html: post.contenido }} />
        
      {/* <div className="imagenes-epigrafes">
        {post.imagenes &&
          post.imagenes.map((url, i) => (
            <div key={i} className="image-block">
              <img
                className="imagen-fija-1200"
                src={url}
                alt={`img-${i}`}
                style={{ width: "300px", height: "300px", objectFit: "cover" }}
              />
              <p className="epigrafe-text">{post.epigrafes?.[i]}</p>
            </div>
          ))}
      </div> */}

      <div className="share-section">
        <h3>Compartir en redes:</h3>
        <div className="share-buttons">
          <a
            href={`https://api.whatsapp.com/send?text=${mensaje}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn whatsapp"
          >
            <FaWhatsapp size={30} />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              currentUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn facebook"
          >
            <FaFacebook size={30} />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn instagram"
            title="Copiá el link y compartilo en tus historias"
          >
            <FaInstagram size={30} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PostCompleto;
