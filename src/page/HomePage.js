// HomePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/HomePage.css";
import fondo from "../assets/Portada1.jpg";
import ModalActividades from "../components/ModalActividades";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/64/64572.png";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://empatia-back.vercel.app/api/posts");
        const data = await res.json();
        setPosts(data);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener posts:", error);
        setCargando(false);
      }
    };

    fetchPosts();
  }, []);

  const postsToShow = posts.slice(0, 6);

  return (
    <>
      <ModalActividades />

      <div className="homepage">
        {/* HERO */}
        <header className="hero-home">
          <div className="overlay">
            <h1>Crianza Digital con Empatía</h1>
          </div>
        </header>

        {/* SECCIÓN DE POSTS */}
        <section className="posts-section">
          <div>
            <h2 className="titulo-principal">Publicaciones Recientes</h2>
          </div>
          {cargando ? (
            <p>Cargando posts...</p>
          ) : postsToShow.length === 0 ? (
            <p>No hay posts para mostrar.</p>
          ) : (
            <div className="lista-posts-container">
              {postsToShow.map((post) => {
                let categoria = "Sentidos";

                if (
                  Array.isArray(post.categoria) &&
                  post.categoria.length > 0
                ) {
                  const catPrimero = post.categoria[0];
                  if (
                    typeof catPrimero === "string" &&
                    catPrimero.trim() !== ""
                  ) {
                    categoria = catPrimero.trim();
                  }
                } else if (
                  typeof post.categoria === "string" &&
                  post.categoria.trim() !== ""
                ) {
                  categoria = post.categoria.trim();
                }

                // Defino fondo de la tarjeta: imagen portada o imagen estándar
                const backgroundImage = post.portada
                  ? `url(${post.portada})`
                  : `url(${fondo})`;

                return (
                  <div
                    key={post._id}
                    className="post-card"
                    style={{
                      backgroundImage: backgroundImage,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="post-content-overlay">
                        <img
                          src={post.avatar || DEFAULT_AVATAR}
                          alt="avatar"
                          className="avatar"
                        />
                        <div className="autor-div">
                          <h3>{post.titulo}</h3>
                          <h4 className="autor">Por: {post.autor}</h4>
                        </div>
                      <div>
                        <button
                          className="btn-ver-mas"
                          onClick={() => navigate(`/post/${post._id}`)}
                        >
                          Ver más
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
