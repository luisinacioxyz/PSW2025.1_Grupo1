// =======================
// 🧠 Inicialização de variáveis
// =======================

const courses = JSON.parse(localStorage.getItem('courses')) || [];

const user = localStorage.getItem("user");

const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

const course = courses.find(c => c.id === courseId);

// =======================
// 💡 FUNÇÕES
// =======================

// Personalização das informações do curso

if (course) {
    document.getElementById('course-image').src = course.img;
    document.getElementById('course-tag').textContent = course.categoryName;
} else {
    console.error('Curso não encontrado');
}

document.getElementById('course-name').textContent = course.name;

// Formulário de avaliação

function setRating(stars) {
    document.getElementById('rating').value = stars;

    const buttons = document.querySelectorAll('#stars button');
    buttons.forEach((button, index) => {
        button.classList.toggle('text-yellow-400', index < stars);
        button.classList.toggle('text-gray-400', index >= stars);
    });
}

function handleSubmit(event) {
    event.preventDefault(); // Sempre prevenir o envio automático

    const rating = parseInt(document.getElementById('rating').value);
    const review = document.getElementById('review').value.trim();

    if (rating === 0 || review === "") {
        alert("Por favor, forneça uma avaliação e um comentário.");
        return;
    }

    const courseRatings = JSON.parse(localStorage.getItem('courseRatings')) || [];
    const existingRating = courseRatings.some(
        rating => rating.courseId === courseId && rating.userId === user.id 
    );

    if (existingRating) {
        alert("Você já avaliou este curso.");
        window.location.href = `course.html?id=${courseId}`;
        return;
    }

    const courseTrackings = JSON.parse(localStorage.getItem('courseTrackings')) || [];
    const isTracked = courseTrackings.some(
        tracking => tracking.courseId === courseId && tracking.userId === user.id 
    );

    if (!isTracked) {
        courseTrackings.push({
            id: (courseTrackings.length + 1).toString(),
            userId: user.id,
            courseId: courseId
        });
        localStorage.setItem('courseTrackings', JSON.stringify(courseTrackings));
    }

    courseRatings.push({
        id: (courseRatings.length + 1).toString(),
        rating: rating,
        comment: review,
        courseId: courseId,
        userId: user.id,
        userName: user.name,
    });
    localStorage.setItem('courseRatings', JSON.stringify(courseRatings));

    alert("Avaliação enviada com sucesso!");
    window.location.href = `course.html?id=${courseId}`;
}


