// =======================
// 🧠 Inicialização de variáveis
// =======================

function saveDataToLocalStorage() {
    const courseRatings = [
        {
            id: "r1",
            rating: 5,
            comment: "Excelente curso! Aprendi muito sobre CSS.",
            courseId: "123",
            userName: "Ana Souza"
        },
        {
            id: "r2",
            rating: 4,
            comment: "Muito bom, mas poderia ter mais exemplos práticos.",
            courseId: "1251",
            userName: "Carlos Lima"
        },
        {
            id: "r3",
            rating: 3,
            comment: "Esperava mais profundidade no conteúdo.",
            courseId: "1234",
            userName: "Juliana Castro"
        },
        {
            id: "r4",
            rating: 5,
            comment: "Simplesmente o melhor curso de Excel!",
            courseId: "1252",
            userName: "Marcos Pereira"
        },
        {
            id: "r5",
            rating: 4,
            comment: "Gostei muito da didática e dos desafios propostos.",
            courseId: "1255",
            userName: "Beatriz Fernandes"
        },
        {
            id: "r6",
            rating: 2,
            comment: "Achei o conteúdo muito básico para quem já conhece JavaScript.",
            courseId: "1250",
            userName: "Ricardo Matos"
        },
        {
            id: "r7",
            rating: 5,
            comment: "Excelente para quem está começando com Figma!",
            courseId: "1254",
            userName: "Lívia Gomes"
        },
        {
            id: "r8",
            rating: 4,
            comment: "Curso muito completo e bem explicado.",
            courseId: "1253", // Curso com duas avaliações
            userName: "Felipe Alves"
        },
        {
            id: "r9",
            rating: 5,
            comment: "O professor ensina de forma clara e objetiva. Muito bom!",
            courseId: "1253", // Segunda avaliação do mesmo curso
            userName: "Tatiane Rocha"
        },
        {
            id: "r10",
            rating: 3,
            comment: "Bom conteúdo, mas senti falta de atividades práticas.",
            courseId: "1256",
            userName: "Vanessa Dias"
        },
        {
            id: "r11",
            rating: 5,
            comment: "Explicações claras e ótimos exemplos de machine learning!",
            courseId: "1257",
            userName: "André Mendes"
        }
    ];

    localStorage.setItem("courseRatings", JSON.stringify(courseRatings));
}

saveDataToLocalStorage();

function loadDataFromLocalStorage() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    const courseRatings = JSON.parse(localStorage.getItem('courseRatings')) || [];

    return { courses, courseRatings };
}

const { courses, courseRatings } = loadDataFromLocalStorage();

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
    const userId = localStorage.getItem("user");

    const isTracked = courseTrackings.some(
        tracking => tracking.userId === userId && tracking.courseId === courseId 
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
        const userId = localStorage.getItem("user");

        const newTracking = {
            id: String(courseTrackings.length + 1),
            userId: userId,
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

document.getElementById('evaluate-link').href = `evaluate_course.html?id=${courseId}`;

document.getElementById('course-plataform').textContent = course.platformName;

document.getElementById('avg-rating').textContent = course.avgRating.toFixed(1);

document.getElementById('ratings-count').textContent = `(${course.ratingsCount} avaliações)`;

document.getElementById('course-link').href = course.link;

// Avaliações

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