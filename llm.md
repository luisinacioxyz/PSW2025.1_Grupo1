# Cursos.html

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CourseRank - Cursos</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="app-containeir">
        <header>
            <div class="header-content">
                 <img src="https://via.placeholder.com/120x40.png?text=CourseRank" alt="CourseRank Logo" class="logo"> </div>

            <nav class="desktop-nav">
                <a href="cursos.html" class="active">Cursos</a>
                <a href="#categorias">Categorias</a>
                <a href="#plataformas">Plataformas</a>
                <a href="minha_lista.html">Minha Lista</a>
                <a href="#perfil">Perfil</a>
            </nav>

             </header>
        <main>
            <div class="search-bar">
                <input type="search" placeholder="Pesquise por um curso...">
                <i class="fas fa-search search-icon"></i>
            </div>
            <div class="filter-buttons">
                <button>Categorias</button>
                <button>Avaliados</button>
                <button>Plataforma</button>
            </div>
            <div class="course-grid">
                <div class="course-card">
                    <img src="https://via.placeholder.com/100x60.png?text=Python" alt="Python Course">
                    <h3>Python</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                </div>
                <div class="course-card">
                    <img src="https://via.placeholder.com/100x60.png?text=CSS" alt="CSS Course">
                    <h3>CSS</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                </div>
                 <div class="course-card">
                    <img src="https://via.placeholder.com/100x60.png?text=IA" alt="AI Course">
                    <h3>Inteligência Artificial</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                </div>
                <div class="course-card">
                    <img src="https://via.placeholder.com/100x60.png?text=AWS" alt="AWS Course">
                    <h3>AWS</h3>
                     <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                </div>
                 </div>
        </main>
        <footer class="mobile-nav"> 
            <button><i class="fas fa-home"></i></button>
            <button><i class="fas fa-search"></i></button>
            <button class="active"><i class="fas fa-list"></i></button>
            <button><i class="fas fa-user"></i></button>
        </footer>
    </div>
</body>
</html>


# cursosespecificos.html

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CourseRank - Detalhes do Curso</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="app-containeir">
        <header>
            <div class="header-content">
                 <img src="https://via.placeholder.com/120x40.png?text=CourseRank" alt="CourseRank Logo" class="logo"> </div>

            <nav class="desktop-nav">
                <a href="cursos.html" class="active">Cursos</a>
                <a href="#categorias">Categorias</a>
                <a href="#plataformas">Plataformas</a>
                <a href="minha_lista.html">Minha Lista</a>
                <a href="#perfil">Perfil</a>
            </nav>

             </header>
        <main>
            <div class="course-detail-header">
                 <img src="https://via.placeholder.com/150x90.png?text=Python" alt="Python Course Banner">
                 <h2>Python Completo</h2>
                 <p class="platform">Plataforma: Alura</p>
                 <div class="rating-summary">
                    <span class="average-rating">3.0</span>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                    <span class="review-count">(125 avaliações)</span>
                 </div>
                 <button class="btn-secondary">Adicionar à Lista</button>
            </div>

            <section class="course-description">
                <h3>Descrição</h3>
                <p>Aprenda Python do básico ao avançado com projetos práticos. Ideal para iniciantes e programadores que desejam dominar a linguagem.</p>
            </section>

            <section class="course-reviews">
                <h3>Avaliações</h3>
                <div class="review">
                    <div class="review-header">
                        <span class="user-name">Ana Silva</span>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="far fa-star"></i>
                        </div>
                    </div>
                    <p>Ótimo curso, bem explicado e com bons exemplos. Recomendo!</p>
                </div>
                 <div class="review">
                    <div class="review-header">
                        <span class="user-name">Carlos Martins</span>
                         <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="far fa-star"></i>
                            <i class="far fa-star"></i>
                            <i class="far fa-star"></i>
                        </div>
                    </div>
                    <p>O conteúdo é bom, mas a didática poderia ser melhor em alguns pontos.</p>
                </div>
                </section>
        </main>
         <footer class="mobile-nav">
            <button><i class="fas fa-home"></i></button>
            <button><i class="fas fa-search"></i></button>
            <button><i class="fas fa-list"></i></button>
            <button><i class="fas fa-user"></i></button>
        </footer>
    </div>
</body>
</html>

# avaliarcurso.html

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CourseRank - Avaliar Curso</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="app-containeir">
        <header>
            <div class="header-content">
                 <img src="https://via.placeholder.com/120x40.png?text=CourseRank" alt="CourseRank Logo" class="logo"> </div>

            <nav class="desktop-nav">
                <a href="cursos.html" class="active">Cursos</a>
                <a href="#categorias">Categorias</a>
                <a href="#plataformas">Plataformas</a>
                <a href="minha_lista.html">Minha Lista</a>
                <a href="#perfil">Perfil</a>
            </nav>

             </header>
        <main>
             <div class="course-info-simple">
                 <h2>Python - Alura</h2>
                 <p>Plataforma: Alura</p>
             </div>

             <form class="rating-form">
                <label>Sua Avaliação:</label>
                <div class="rating-input">
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                </div>

                <label for="review-text">Comentário (opcional):</label>
                <textarea id="review-text" name="review-text" rows="6" placeholder="Escreva sua opinião sobre o curso..."></textarea>

                <button type="submit" class="btn-primary">Enviar Avaliação</button>
            </form>
        </main>
        <footer class="mobile-nav">
            <button><i class="fas fa-home"></i></button>
            <button><i class="fas fa-search"></i></button>
            <button class="active"><i class="fas fa-list"></i></button>
            <button><i class="fas fa-user"></i></button>
        </footer>
    </div>
</body>
</html>

# adicionarlista.html

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CourseRank - Adicionar Curso</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="mobile-screen">
        <header>
            <div class="header-content">
                 <img src="https://via.placeholder.com/120x40.png?text=CourseRank" alt="CourseRank Logo" class="logo"> </div>

            <nav class="desktop-nav">
                <a href="cursos.html" class="active">Cursos</a>
                <a href="#categorias">Categorias</a>
                <a href="#plataformas">Plataformas</a>
                <a href="minha_lista.html">Minha Lista</a>
                <a href="#perfil">Perfil</a>
            </nav>

             </header>
        <main>
             <div class="course-info-simple">
                 <img src="https://via.placeholder.com/100x60.png?text=Python" alt="Python Course">
                 <h2>Python - Alura</h2>
                 <p>Plataforma: Alura</p>
             </div>
             <form class="add-course-form">
                <label for="start-date">Data de Início:</label>
                <input type="date" id="start-date" name="start-date" required>

                <label for="end-date">Data de Término (opcional):</label>
                <input type="date" id="end-date" name="end-date">

                <button type="submit" class="btn-primary">Adicionar</button>
             </form>
        </main>
         <footer class="mobile-nav">
            <button><i class="fas fa-home"></i></button>
            <button><i class="fas fa-search"></i></button>
            <button class="active"><i class="fas fa-list"></i></button>
            <button><i class="fas fa-user"></i></button>
        </footer>
    </div>
</body>
</html>

# style.css

:root {
    --primary-color: #007bff; /* Example blue */
    --secondary-color: #6c757d; /* Example gray */
    --light-gray: #f8f9fa;
    --medium-gray: #e9ecef;
    --dark-gray: #343a40;
    --text-color: #212529;
    --star-color: #ffc107; /* Gold */
    --white: #ffffff;
    --border-radius: 8px;
    --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--medium-gray);
    color: var(--text-color);
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Align to top */
    min-height: 100vh;
    padding: 0px;
}

/* Mobile Screen Container */
.app-container {
    width: 100%; /* Mobile first - take full width */
    min-height: 100vh; /* Ensure it takes at least full viewport height */
    max-width: 420px; /* Max width for mobile view */
    margin: 0 auto; /* Center on larger viewports if needed */
    background-color: var(--white);
    /* Remove fixed height: height: 750px; */
    /* Keep border/shadow for mobile 'frame' effect if desired */
    border: 1px solid #ccc;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius); /* Keep radius */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative; /* Needed if footer is fixed */
}

/* Adjust Header for potential Logo and Desktop Nav */
header {
    background-color: var(--primary-color);
    color: var(--white);
    padding: 10px 15px; /* Adjusted padding */
    display: flex;
    align-items: center;
    justify-content: space-between; /* Space out content */
    min-height: 55px; /* Adjusted height */
    position: sticky; /* Make header sticky */
    top: 0;
    z-index: 10;
    width: 100%; /* Ensure header spans container width */
}

.header-content {
    display: flex;
    align-items: center;
    gap: 15px;
}
.header-content .logo {
    height: 30px; /* Adjust logo size */
    width: auto;
}
header h1 { /* If you still use h1 */
    font-size: 1.1rem; /* Adjust size */
    margin: 0;
}

/* Desktop Navigation - Hidden by default */
.desktop-nav {
    display: none; /* Hide on mobile */
    align-items: center;
    gap: 20px;
}
.desktop-nav a {
    color: var(--white);
    text-decoration: none;
    font-size: 0.95rem;
    padding: 5px 0;
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s ease;
}
.desktop-nav a:hover,
.desktop-nav a.active {
    border-bottom-color: var(--white);
    font-weight: 500;
}

/* Mobile Navigation (Footer) */
.mobile-nav {
    background-color: var(--white);
    border-top: 1px solid var(--medium-gray);
    display: flex; /* Display by default (mobile) */
    justify-content: space-around;
    padding: 8px 0; /* Adjusted padding */
    position: static; /* Stick to bottom */
    bottom: 0;
    width: 100vw; /* Ensure footer spans container width */
}
/* --- Rest of your existing base (mobile) styles --- */
/* Ensure elements like forms, cards use relative widths (like 100%) */
/* Update course grid for mobile if needed */
.course-grid {
    display: grid;
    /* Start with 1 column on very small screens, then 2 */
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 15px;
}

.course-card {
    /* Styles as before */
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Helps align content if heights vary */
}
.course-card .platform-tag {
    font-size: 0.8rem;
    color: var(--secondary-color);
    margin: 4px 0;
}
.course-card .rating span {
    font-size: 0.8rem;
    color: var(--secondary-color);
    margin-left: 5px;
}

/* Add helper class to hide elements only on mobile */
.desktop-only { display: none; }
.mobile-only { display: block; } /* Or flex, inline, etc. */


/* --- Media Query for Larger Screens (Tablets and Desktops) --- */
@media (min-width: 768px) {

    body {
        /* Remove forced centering for mobile screen */
        padding: 0; /* Reset body padding if needed */
        background-color: var(--light-gray); /* Body background for desktop */
    }

    .app-container {
        max-width: 1200px; /* Allow wider container */
        width: 100%;
        margin: 20px auto; /* Center container with margin */
        min-height: auto; /* Let content define height */
        /* Optional: Remove border/shadow for seamless look */
        border: none;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        border-radius: 10px; /* Slightly larger radius */
    }

    header {
        padding: 15px 30px; /* Increase header padding */
        border-top-left-radius: 10px; /* Match container radius */
        border-top-right-radius: 10px;
        position: relative; /* Can remove sticky if preferred on desktop */
    }

    .header-content .logo {
        height: 35px; /* Slightly larger logo */
    }

    /* Show Desktop Nav, Hide Mobile Footer Nav */
    .desktop-nav {
        display: flex; /* Show desktop nav */
    }
    .mobile-nav {
        display: none; /* Hide mobile footer nav */
    }
    .mobile-only { display: none; } /* Hide mobile-only elements */
    .desktop-only { display: block; } /* Show desktop-only elements */

    main {
        padding: 30px; /* Increase main content padding */
    }

    /* Adjust Grid Layout */
    .course-grid {
        /* Increase columns */
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 25px; /* Increase gap */
    }

    .course-card h3 {
        font-size: 1.05rem;
    }

     /* Center forms on larger screens */
    .add-course-form,
    .rating-form {
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        padding: 20px 0; /* Add some vertical padding */
    }

    /* Adjust Course Detail Layout (Example) */
    .course-detail-header {
         padding-bottom: 25px;
    }
    .course-detail-header img {
         max-width: 250px; /* Larger image */
    }
     .course-detail-header h2 {
        font-size: 1.8rem; /* Larger title */
    }
     /* Maybe arrange description/reviews side-by-side if complex */
     /* For simplicity, we keep single column flow here */
      section {
        margin-bottom: 30px;
    }
    section h3 {
        font-size: 1.3rem;
        margin-bottom: 15px;
    }

     /* Filter buttons might need adjusted spacing */
     .filter-buttons {
        gap: 15px;
        margin-bottom: 25px;
     }
      .filter-buttons button {
         padding: 10px 20px;
         font-size: 0.95rem;
     }

} /* End of Media Query */


/* Header */
header {
    background-color: var(--primary-color);
    color: var(--white);
    padding: 12px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Adjust as needed */
    position: relative; /* For absolute positioning inside */
    min-height: 50px;
}

header h1 {
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
    flex-grow: 1; /* Allow title to take space */
}

header .back-button, header .save-button {
    background: none;
    border: none;
    color: var(--white);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
}
/* Make back button take up start space */
header .back-button {
   position: absolute;
   left: 15px;
}
/* Make save button take up end space */
header .save-button {
   position: absolute;
   right: 15px;
}


/* Main Content Area */
main {
    flex-grow: 1; /* Take remaining vertical space */
    overflow-y: auto; /* Allow scrolling */
    padding: 20px;
    background-color: var(--light-gray);
}

/* Footer Navigation */
footer {
    background-color: var(--white);
    border-top: 1px solid var(--medium-gray);
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    min-height: 55px;
    width: 100vw;
    position: fixed;
    bottom: 0;
}

footer button {
    background: none;
    border: none;
    color: var(--secondary-color);
    font-size: 1.4rem;
    cursor: pointer;
    padding: 5px 10px;
    transition: color 0.2s ease;
}

footer button:hover,
footer button.active {
    color: var(--primary-color);
}

/* --- Specific Component Styles --- */

/* Search Bar */
.search-bar {
    position: relative;
    margin-bottom: 15px;
}
.search-bar input[type="search"] {
    width: 100%;
    padding: 10px 15px 10px 40px; /* Space for icon */
    border: 1px solid var(--medium-gray);
    border-radius: var(--border-radius);
    font-size: 1rem;
}
.search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--secondary-color);
}


/* Filter Buttons */
.filter-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap; /* Allow wrapping on small screens if needed */
}
.filter-buttons button {
    padding: 8px 15px;
    border: 1px solid var(--medium-gray);
    background-color: var(--white);
    color: var(--primary-color);
    border-radius: 20px; /* Pill shape */
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease, color 0.2s ease;
}
.filter-buttons button:hover {
    background-color: var(--primary-color);
    color: var(--white);
}

/* Course Grid & Cards */
.course-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Two columns */
    gap: 15px;
}

.course-card {
    background-color: var(--white);
    border-radius: var(--border-radius);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    padding: 10px;
    text-align: center;
    transition: transform 0.2s ease;
}
.course-card:hover {
    transform: translateY(-3px);
}

.course-card img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin-bottom: 8px;
    aspect-ratio: 16 / 9; /* Maintain aspect ratio */
    object-fit: cover; /* Cover the area */
}

.course-card h3 {
    font-size: 0.95rem;
    margin-bottom: 5px;
    font-weight: 600;
}

/* Rating Stars */
.rating {
    color: var(--star-color);
    font-size: 0.9rem;
}
.rating .far { /* Empty star color */
    color: #ccc;
}

/* Buttons */
.btn-primary, .btn-secondary {
    display: block; /* Make buttons block level */
    width: 100%;
    padding: 12px 15px;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
    margin-top: 15px; /* Spacing for buttons */
    transition: background-color 0.2s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: var(--white);
}
.btn-primary:hover {
    background-color: #0056b3; /* Darker blue on hover */
}

.btn-secondary {
    background-color: var(--light-gray);
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
}
.btn-secondary:hover {
    background-color: var(--medium-gray);
}


/* Add Course Form / Rating Form */
.add-course-form, .rating-form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px; /* Space between form elements */
}

.add-course-form label, .rating-form label {
    font-weight: 500;
    margin-bottom: -5px; /* Reduce space below label */
}

.add-course-form input[type="date"],
.rating-form textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--medium-gray);
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-family: inherit; /* Use body font */
}
.rating-form textarea {
    resize: vertical; /* Allow vertical resize only */
}

.rating-form .rating-input {
    font-size: 2rem; /* Larger stars for input */
    color: #ccc; /* Default empty star color */
    cursor: pointer;
}
.rating-form .rating-input i:hover {
    color: var(--star-color); /* Highlight on hover */
}
/* Add JS to handle filling stars on click */


/* Simple Course Info (Add/Rate screens) */
.course-info-simple {
    text-align: center;
    margin-bottom: 20px;
}
.course-info-simple img {
    max-width: 120px;
    border-radius: var(--border-radius);
    margin-bottom: 10px;
}
.course-info-simple h2 {
    font-size: 1.3rem;
    margin-bottom: 5px;
}
.course-info-simple p {
    color: var(--secondary-color);
    font-size: 0.9rem;
}

/* Course Detail Screen */
.course-detail-header {
    text-align: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--medium-gray);
}
.course-detail-header img {
    max-width: 200px;
    border-radius: var(--border-radius);
    margin-bottom: 15px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
.course-detail-header h2 {
    font-size: 1.5rem;
    margin-bottom: 5px;
}
.course-detail-header .platform {
    color: var(--secondary-color);
    margin-bottom: 10px;
}
.rating-summary {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
}
.rating-summary .average-rating {
    font-size: 1.2rem;
    font-weight: 600;
}
.rating-summary .review-count {
    font-size: 0.9rem;
    color: var(--secondary-color);
}

/* Course Sections (Description, Reviews) */
section {
    margin-bottom: 25px;
}
section h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--medium-gray);
}
section p {
    line-height: 1.6;
    font-size: 0.95rem;
}

/* Individual Review Styling */
.course-reviews .review {
    background-color: var(--white);
    padding: 15px;
    border-radius: var(--border-radius);
    margin-bottom: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}
.review-header .user-name {
    font-weight: 600;
    font-size: 0.9rem;
}
.review p {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #555;
}