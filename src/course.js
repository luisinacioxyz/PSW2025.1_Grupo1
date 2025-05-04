// =======================
// 🧠 Inicialização de variáveis
// =======================

function saveDataToLocalStorage() {
    const courseRatings = [
        {
            id: "r1",
            rating: 5,
            comment: "Conteúdo muito bem estruturado, aprendi bastante sobre machine learning!",
            courseId: "1257",
            userName: "Carol",
            userId: "123"
        },
        {
            id: "r2",
            rating: 4,
            comment: "Faltaram exemplos práticos, mas o conteúdo é bom.",
            courseId: "1256",
            userName: "Ana Souza",
            userId: "u1"
        },
        {
            id: "r3",
            rating: 5,
            comment: "Desafios excelentes, ótimo para quem quer praticar lógica!",
            courseId: "1255",
            userName: "Carlos Lima",
            userId: "u2"
        },
        {
            id: "r4",
            rating: 3,
            comment: "Esperava mais interatividade nas aulas.",
            courseId: "1254",
            userName: "Carol",
            userId: "123" 
        },
        {
            id: "r5",
            rating: 5,
            comment: "Curso completo e bem explicado!",
            courseId: "1253",
            userName: "Marcos Pereira",
            userId: "u4"
        },
        {
            id: "r6",
            rating: 4,
            comment: "Didática excelente, voltarei para outros cursos.",
            courseId: "1252",
            userName: "Marcos Pereira",
            userId: "u4"
        },
        {
            id: "r7",
            rating: 2,
            comment: "Muito básico para quem já tem experiência.",
            courseId: "1250",
            userName: "Ricardo Matos",
            userId: "u6"
        }
    ];

    localStorage.setItem("courseRatings", JSON.stringify(courseRatings));
}

saveDataToLocalStorage();

function loadDataFromLocalStorage() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const courseRatings = JSON.parse(localStorage.getItem('courseRatings')) || [];
    const user = JSON.parse(localStorage.getItem('user')) || [];

    return { courses, courseRatings, user };
}

const { courses, courseRatings, user } = loadDataFromLocalStorage();

const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

const course = courses.find(c => c.id === courseId);

const filteredRatings = courseRatings.filter(rating => rating.courseId === courseId);

// =======================
// 💡 FUNÇÕES
// =======================

// Personalização da imagem

if (course) {
    document.getElementById('course-image').src = course.img;
    document.getElementById('course-tag').textContent = course.categoryName;
} else {
    console.error('Curso não encontrado');
}

// Ícone de + ou check

function renderTrackingButton() {
    const listInteraction = document.getElementById('list-interaction');

    const courseTrackings = JSON.parse(localStorage.getItem("courseTrackings")) || [];

    const isTracked = courseTrackings.some(
        tracking => tracking.userId === user.id && tracking.courseId === courseId 
    );

    listInteraction.innerHTML = isTracked ? 
        `
            <div class="p-1.5 absolute top-2 right-2 bg-white rounded-full">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
        ` : `
            <button onclick="openAddCourseModal(${courseId})" class="plus-button p-1.5 absolute top-2 right-2 bg-white rounded-full hover:bg-gray-50 transition-colors">
                <svg class="w-5 h-5 text-gray-400 hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
            </button>  
        `;
}

renderTrackingButton();

// Modais para adicionar curso à lista

function openAddCourseModal(courseId) {
    const modal = document.getElementById('add-list-modal');
    modal.classList.remove('hidden');

    const confirmButton = document.getElementById('confirm-btn');
    const cancelButton = document.getElementById('cancel-btn');

    confirmButton.onclick = function () {
        const courseTrackings = JSON.parse(localStorage.getItem("courseTrackings")) || [];

        const newTracking = {
            id: String(courseTrackings.length + 1),
            userId: user.id,
            courseId: String(courseId)
        };
    
        courseTrackings.push(newTracking);
        localStorage.setItem("courseTrackings", JSON.stringify(courseTrackings));

        closeModal();
        showToast();
        renderTrackingButton();
    };

    cancelButton.onclick = closeModal;
}

function closeModal() {
    document.getElementById('add-list-modal').classList.add('hidden');
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000); 
}

// Personalização de informações do curso

document.getElementById('course-name').textContent = course.name;

document.getElementById('course-plataform').textContent = course.platformName;

document.getElementById('avg-rating').textContent = course.avgRating.toFixed(1);

document.getElementById('ratings-count').textContent = `(${course.ratingsCount} avaliações)`;

document.getElementById('course-link').href = course.link;

// Campo de avaliação

function renderRatingButton() {
    const ratingField = document.getElementById('rating-field');

    const courseRatings = JSON.parse(localStorage.getItem("courseRatings")) || [];

    const isRated = courseRatings.some(
        rating => rating.userId === user.id && rating.courseId === courseId 
    );

    if (isRated) {
        ratingField.removeAttribute('href');
        ratingField.innerHTML = 'Avaliado';
        ratingField.className = 'px-4 py-2 w-fit bg-green-600 font-medium text-lg text-white rounded-lg shadow-sm cursor-default';
    } else {
        ratingField.href = `evaluate_course.html?id=${courseId}`;
        ratingField.innerHTML = 'Avaliar';
        ratingField.className = 'px-4 py-2 w-fit bg-blue-600 font-medium text-lg text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all hover:shadow';
    }
}

renderRatingButton();

// Avaliações individualizadas

const reviewsContainer = document.getElementById("reviews-container");

filteredRatings.forEach(rating => {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("p-4", "gap-1", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow-sm", "lg:w-1/2");

    const reviewHeader = document.createElement("div");
    reviewHeader.classList.add("flex", "items-center", "gap-1");
    
    const userName = document.createElement("h3");
    userName.classList.add("text-lg", "text-gray-600", "truncate");
    userName.textContent = rating.userName; 

    const userRating = document.createElement("span");
    userRating.classList.add("font-bold", "text-sm", "text-gray-600", "pl-2");
    userRating.textContent = rating.rating; 

    const starIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    starIcon.setAttribute("class", "w-4 h-4 text-yellow-400");
    starIcon.setAttribute("fill", "currentColor");
    starIcon.setAttribute("viewBox", "0 0 20 20");

    const starPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    starPath.setAttribute("d", "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z");

    starIcon.appendChild(starPath);
    reviewHeader.appendChild(userName);
    reviewHeader.appendChild(userRating);
    reviewHeader.appendChild(starIcon);

    const reviewComment = document.createElement("p");
    reviewComment.classList.add("text-sm", "text-gray-600", "italic");
    reviewComment.textContent = `"${rating.comment}"`; 

    reviewDiv.appendChild(reviewHeader);
    reviewDiv.appendChild(reviewComment);
    reviewsContainer.appendChild(reviewDiv);
});