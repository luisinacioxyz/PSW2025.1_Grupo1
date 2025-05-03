// =======================
// 🎯 EVENTOS
// =======================

document.getElementById('course-search').addEventListener('input', () => {
    courseFilter.filterCourses();
});

document.getElementById('category-filter').addEventListener('change', (event) => {
    changeFontWeight(event.target); // Passa o elemento select para a função changeFontWeight
    courseFilter.filterCourses();
});

document.getElementById('platform-filter').addEventListener('change', (event) => {
    changeFontWeight(event.target); // Passa o elemento select para a função changeFontWeight
    courseFilter.filterCourses();
});

document.getElementById('rating-min').addEventListener('input', () => {
    changeRatingFilterFontWeight(); 
    courseFilter.filterCourses(); 
});

document.getElementById('rating-max').addEventListener('input', () => {
    changeRatingFilterFontWeight(); 
    courseFilter.filterCourses(); 
});

// =======================
// 🧠 Inicialização de variáveis
// =======================

function saveDataToLocalStorage() {
    const categories = [
        { id: "123", name: "Programação" },
        { id: "1234", name: "Design" },
        { id: "12345", name: "Marketing" },
        { id: "123456", name: "Negócios" },
        { id: "789", name: "Produtividade" },
        { id: "321", name: "Data Science" },
        { id: "654", name: "Gestão de Projetos" }
    ];
    
    const platforms = [
        { id: "123", name: "Udemy" },
        { id: "1234", name: "DevMedia" },
        { id: "12345", name: "Alura" },
        { id: "123456", name: "Hashtag Treinamentos" },
        { id: "5566", name: "Coursera" },
        { id: "9988", name: "DataCamp" },
        { id: "7788", name: "Rocketseat" },
        { id: "4422", name: "edX" }
    ];
    
    const courses = [
        {
            id: "123",
            name: "CSS",
            img: "img/css.png",
            platformName: "Hashtag Treinamentos",
            platformId: "123456", 
            avgRating: 5.0,
            ratingsCount: 250,
            categoryName: "Programação",
            categoryId: "123",
            link: "https://hashtagtreinamentos.com/curso-css"
        },
        {
            id: "1234",
            name: "Inteligência Artificial",
            img: "img/inteligencia_artificial.jpg",
            platformName: "DevMedia",
            platformId: "1234", 
            avgRating: 3.6,
            ratingsCount: 340,
            categoryName: "Programação",
            categoryId: "123",
            link: "https://devmedia.com/curso-inteligencia-artificial"
        },
        {
            id: "1250",
            name: "Introdução ao JavaScript",
            img: "img/javascript.jpg",
            platformName: "Alura",
            platformId: "12345",  
            avgRating: 4.7,
            ratingsCount: 500,
            categoryName: "Programação",
            categoryId: "123",
            link: "https://alura.com.br/curso-introducao-javascript"
        },
        {
            id: "1251",
            name: "UX Design para Iniciantes",
            img: "img/ux_design.jpg",
            platformName: "Coursera",
            platformId: "5566",  
            avgRating: 4.3,
            ratingsCount: 150,
            categoryName: "Design",
            categoryId: "1234",
            link: "https://coursera.org/curso-ux-design-iniciantes"
        },
        {
            id: "1252",
            name: "Excel Completo",
            img: "img/excel.jpg",
            platformName: "Hashtag Treinamentos",
            platformId: "123456", 
            avgRating: 4.9,
            ratingsCount: 700,
            categoryName: "Produtividade",
            categoryId: "789",
            link: "https://hashtagtreinamentos.com/curso-excel-completo"
        },
        {
            id: "1253",
            name: "Python para Análise de Dados",
            img: "img/python_dados.jpg",
            platformName: "DataCamp",
            platformId: "9988", 
            avgRating: 4.8,
            ratingsCount: 850,
            categoryName: "Data Science",
            categoryId: "321",
            link: "https://datacamp.com/curso-python-analise-dados"
        },
        {
            id: "1254",
            name: "Figma do Zero",
            img: "img/figma.jpg",
            platformName: "Udemy",
            platformId: "123",  
            avgRating: 4.5,
            ratingsCount: 200,
            categoryName: "Design",
            categoryId: "1234",
            link: "https://udemy.com/curso-figma-do-zero"
        },
        {
            id: "1255",
            name: "React.js Avançado",
            img: "img/react.jpg",
            platformName: "Rocketseat",
            platformId: "7788", 
            avgRating: 4.6,
            ratingsCount: 600,
            categoryName: "Programação",
            categoryId: "123",
            link: "https://rocketseat.com.br/curso-react-avancado"
        },
        {
            id: "1256",
            name: "Gestão de Projetos Ágeis",
            img: "img/agile.jpg",
            platformName: "Coursera",
            platformId: "5566",
            avgRating: 4.2,
            ratingsCount: 180,
            categoryName: "Gestão",
            categoryId: "654",
            link: "https://coursera.org/curso-gestao-agil"
        },
        {
            id: "1257",
            name: "Introdução ao Machine Learning",
            img: "img/ml.jpg",
            platformName: "edX",
            platformId: "4422",  
            avgRating: 4.4,
            ratingsCount: 300,
            categoryName: "Data Science",
            categoryId: "321",
            link: "https://edx.org/curso-introducao-machine-learning"
        }
    ];    

    const courseTrackings = [
        { id: "1", userId: "123", courseId: "1257" },
        { id: "2", userId: "123", courseId: "1256" },
        { id: "3", userId: "123", courseId: "1255" },
        { id: "4", userId: "123", courseId: "1254" }
    ];
    
    localStorage.setItem("user", "123");

    localStorage.setItem("courseTrackings", JSON.stringify(courseTrackings));

    localStorage.setItem("courses", JSON.stringify(courses));

    localStorage.setItem("categories", JSON.stringify(categories));

    localStorage.setItem("platforms", JSON.stringify(platforms));
}

saveDataToLocalStorage();

function loadDataFromLocalStorage() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const platforms = JSON.parse(localStorage.getItem('platforms')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    return { categories, platforms, courses };
}

const { categories, platforms, courses } = loadDataFromLocalStorage();

// =======================
// 💡 FUNÇÕES
// =======================

// Criando filtro de categoria

const categoryFilter = document.getElementById("category-filter");
const defaultCategory = document.createElement("option");
defaultCategory.textContent = "Categoria"; 
defaultCategory.selected = true;
categoryFilter.appendChild(defaultCategory);

categories.forEach(category => { 
    const option = document.createElement("option");
    option.setAttribute("data-id", category.id);
    option.textContent = category.name;
    categoryFilter.appendChild(option);
});

// Criando filtro de plataforma

const platformFilter = document.getElementById("platform-filter");
const defaultPlatform = document.createElement("option");
defaultPlatform.textContent = "Plataforma"; 
defaultPlatform.selected = true;
platformFilter.appendChild(defaultPlatform);

platforms.forEach(plataform => { 
    const option = document.createElement("option");
    option.setAttribute("data-id", plataform.id);
    option.textContent = plataform.name;
    platformFilter.appendChild(option);
});

// Alteração de formatação dos filtros

function changeFontWeight(element) {
    const selectedOption = element.selectedOptions[0]; 
    
    if (selectedOption && selectedOption.dataset.id) {
        element.classList.remove('font-normal');
        element.classList.add('font-bold');
    } else {
        element.classList.remove('font-bold');
        element.classList.add('font-normal');
    }
}

function changeRatingFilterFontWeight() {
    const container = document.getElementById('rating-filter');
    const minRating = document.getElementById('rating-min');
    const maxRating = document.getElementById('rating-max');
    const title = document.getElementById('rating-title');
    
    if (Number(minRating.value) > 1 || Number(maxRating.value) < 5) {
        title.classList.remove('font-normal');
        title.classList.add('font-bold');
    } else {
        title.classList.remove('font-bold');
        title.classList.add('font-normal');
    }
}

// Renderização dos cursos

function renderCourses(courseList) {
    const container = document.getElementById('courses-container');
    container.innerHTML = ''; 

    const userId = localStorage.getItem("user");
    const courseTrackings = JSON.parse(localStorage.getItem("courseTrackings")) || [];

    courseList.forEach(course => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-lg shadow-md w-72";

        // Checando se o usuário tem aquele curso na lista
        const isTracked = courseTrackings.some(
            tracking => tracking.userId === userId && tracking.courseId === course.id
        );

        card.innerHTML = `
            <div class="mb-4 relative">
                <img src="${course.img}" class="w-full h-40 object-cover rounded-md">

                ${isTracked ? `
                    <div class="p-1.5 absolute top-2 right-2 bg-white rounded-full">
                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                ` : `
                    <button onclick="openAddCourseModal(${course.id})" class="plus-button p-1.5 absolute top-2 right-2 bg-white rounded-full hover:bg-gray-50 transition-colors">
                        <svg class="w-5 h-5 text-gray-400 hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                    </button>  
                `}
            </div>

            <h3 class="font-bold text-xl text-gray-600 truncate">${course.name}</h3>
            <p class="text-sm text-gray-600 truncate">${course.platformName}</p>

            <div class="gap-1 flex items-center">
                <span class="font-bold text-sm text-gray-600">${course.avgRating}</span>
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            </div>

            <div class="flex justify-end">
                <a href="course.html?id=${course.id}" class="text-sm font-medium text-blue-600 hover:text-blue-800">Ver mais →</a>
            </div>
        `;

        container.appendChild(card);
    });
}

renderCourses(courses);

// Filtragem dos cursos com base nos filtros e campo de busca

function getFilteredCourses() {
    const categoryId = categoryFilter.selectedOptions[0]?.dataset.id || null;
    const platformId = platformFilter.selectedOptions[0]?.dataset.id || null;
    const minRating = parseFloat(document.getElementById('rating-min').value) || 1;
    const maxRating = parseFloat(document.getElementById('rating-max').value) || 5;

    if (minRating > maxRating) {
        console.warn("minRating maior que maxRating");
        return [];
    }

    const filtered = courses.filter(course => {
        const pass = 
            (!categoryId || course.categoryId === categoryId) &&
            (!platformId || course.platformId === platformId) &&
            (course.avgRating >= minRating) &&
            (course.avgRating <= maxRating);

        return pass;
    });

    return filtered;
}

const courseFilter = {    
    timer: null,
  
    filterCourses() {
        clearTimeout(this.timer); // Se o usuário continua digitando, não queremos rodar a busca ainda. Cancela o timer com esse ID, ou seja, impede que a função dentro do setTimeout() rode.
        
        // A função setTimeout() retorna um número — esse número é o ID do timer
        this.timer = setTimeout(() => {   // Marcando para rodar uma função daqui a 300 milissegundos
            const input = document.getElementById('course-search');
            const term = input.value.trim().toLowerCase(); 

            if (!term) {
                renderCourses(getFilteredCourses());  
                return;
            }

            const results = getFilteredCourses().filter(course => 
                course.name.trim().toLowerCase().includes(term)
            );

            renderCourses(results);  
        }, 300);
    }    
};

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
        courseFilter.filterCourses(); 
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







