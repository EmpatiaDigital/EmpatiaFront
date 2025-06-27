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

  // const currentUrl = `${window.location.origin}/post/${id}`;
  // const mensaje = post
  // ? encodeURIComponent(`"${post.titulo}" – Leé este post en Empatía Digital: ${currentUrl}`)
  // : "";
const currentUrl = `https://empatia-back.vercel.app/preview/post/${id}`; // este va para preview

const mensaje = post
  ? encodeURIComponent(
      `*${post.titulo}*\n${post.epigrafe || ''}\n\n<head>
        <meta charset="UTF-8" />
        <title>${post.titulo}</title>
        <meta name="description" content="${post.epigrafe || ''}" />
        <meta property="og:title" content="${post.titulo}" />
        <meta property="og:description" content="${post.epigrafe || ''}" />
        <meta property="og:image" content="${post.portada}" />
        <meta property="og:url" content="${frontendUrl}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${post.titulo}" />
        <meta name="twitter:description" content="${post.epigrafe || ''}" />
        <meta name="twitter:image" content="${post.portada}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          .card { border: 1px solid #ccc; padding: 2rem; border-radius: 12px; max-width: 600px; margin: auto; }
          .card img { max-width: 100%; border-radius: 8px; }
          .card h1 { font-size: 1.5rem; margin-top: 1rem; }
          .card p { font-size: 1rem; color: #444; }
          .card a { display: inline-block; margin-top: 1rem; text-decoration: none; color: white; background: #0077cc; padding: 0.5rem 1rem; border-radius: 6px; }
        </style>
      </head>`
    )
  : "";

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
        const res = await fetch(`https://empatia-back.vercel.app/api/posts/${id}`);
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
         <div
        style={{
          borderLeft: "30px solid #42a5f5",
          backgroundColor: " #194542", 
          justifyContent: "center", // Centra horizontalmente el contenido
          alignItems: "center", // Centra verticalmente
          borderRadius: "6px",
          padding: "0.75rem 1rem",
          marginBottom: "0.5rem",
          fontSize: "1.5rem",
          fontWeight: "500",
          display: "flex",
        }}
      >
        <a
          style={{
            borderBottom: "2px solid white", // Línea inferior blanca
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            marginBottom: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: "500",
            display: "flex",
            textDecoration: "none", // Sin subrayado clásico
            color: "white", // Color de texto blanco
            backgroundColor: "transparent", // Fondo transparente
            cursor: "pointer", // Cursor tipo manito
          }}
          href={`https://www.empatiadigital.com.ar/descargas`}
        >
          Descarga la guía PDF GRATIS
        </a>
      </div>
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
