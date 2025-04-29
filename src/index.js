// Salvar dados iniciais no localStorage

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
            categoryName: "Programação",
            categoryId: "123" 
        },
        {
            id: "1234",
            name: "Inteligência Artificial",
            img: "img/inteligencia_artificial.jpg",
            platformName: "DevMedia",
            platformId: "1234", 
            avgRating: 3.6,
            categoryName: "Programação",
            categoryId: "123"  
        },
        {
            id: "1250",
            name: "Introdução ao JavaScript",
            img: "img/javascript.jpg",
            platformName: "Alura",
            platformId: "12345",  
            avgRating: 4.7,
            categoryName: "Programação",
            categoryId: "123"  
        },
        {
            id: "1251",
            name: "UX Design para Iniciantes",
            img: "img/ux_design.jpg",
            platformName: "Coursera",
            platformId: "5566",  
            avgRating: 4.3,
            categoryName: "Design",
            categoryId: "1234" 
        },
        {
            id: "1252",
            name: "Excel Completo",
            img: "img/excel.jpg",
            platformName: "Hashtag Treinamentos",
            platformId: "123456", 
            avgRating: 4.9,
            categoryName: "Produtividade",
            categoryId: "789" 
        },
        {
            id: "1253",
            name: "Python para Análise de Dados",
            img: "img/python_dados.jpg",
            platformName: "DataCamp",
            platformId: "9988", 
            avgRating: 4.8,
            categoryName: "Data Science",
            categoryId: "321"
        },
        {
            id: "1254",
            name: "Figma do Zero",
            img: "img/figma.jpg",
            platformName: "Udemy",
            platformId: "123",  
            avgRating: 4.5,
            categoryName: "Design",
            categoryId: "1234"  
        },
        {
            id: "1255",
            name: "React.js Avançado",
            img: "img/react.jpg",
            platformName: "Rocketseat",
            platformId: "7788", 
            avgRating: 4.6,
            categoryName: "Programação",
            categoryId: "123"  
        },
        {
            id: "1256",
            name: "Gestão de Projetos Ágeis",
            img: "img/agile.jpg",
            platformName: "Coursera",
            platformId: "5566",
            avgRating: 4.2,
            categoryName: "Gestão",
            categoryId: "654"
        },
        {
            id: "1257",
            name: "Introdução ao Machine Learning",
            img: "img/ml.jpg",
            platformName: "edX",
            platformId: "4422",  
            avgRating: 4.4,
            categoryName: "Data Science",
            categoryId: "321"
        }
    ];

    const courseTrackings = [
        { id: "1", userId: "123", courseId: "1257" },
        { id: "2", userId: "123", courseId: "1256" },
        { id: "3", userId: "123", courseId: "1255" },
        { id: "4", userId: "123", courseId: "1254" }
    ];
    
    if (!localStorage.getItem("user")) {
        localStorage.setItem("user", "123");
    }

    if (!localStorage.getItem("courseTrackings")) {
        localStorage.setItem("courseTrackings", JSON.stringify(courseTrackings));
    }

    localStorage.setItem("courses", JSON.stringify(courses));

    localStorage.setItem("categories", JSON.stringify(categories));

    localStorage.setItem("platforms", JSON.stringify(platforms));
}

saveDataToLocalStorage();

// Recuperar dados do localStorage

function loadDataFromLocalStorage() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const platforms = JSON.parse(localStorage.getItem('platforms')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    return { categories, platforms, courses };
}

const { categories, platforms, courses } = loadDataFromLocalStorage();

// Filtro de categoria

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

// Filtro de plataforma

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
                    <button onclick="openModal(${course.id})" class="plus-button p-1.5 absolute top-2 right-2 bg-white rounded-full hover:bg-gray-50 transition-colors">
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

    console.log("categoryId:", categoryId);
    console.log("platformId:", platformId);
    console.log("minRating:", minRating);
    console.log("maxRating:", maxRating);

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

// TO-DO: Modal de confirmação de adição à lista

function addCourseTracking(courseId, userId) {
    const courseTrackings = JSON.parse(localStorage.getItem('courseTrackings')) || [];
    
    const newCourse = {
        id: String(courseTracking.length + 1),
        userId: userId,  
        courseId: courseId,
    };

    courseTrackings.push(newCourse);
    localStorage.setItem('courseTrackings', JSON.stringify(courseTrackings));
}

function openModal(course) {
    document.getElementById('add-list-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function confirmAdd() {
    if (selectedCourse) {
        // Exemplo de adicionar à lista (caso use isso futuramente)
        const lista = document.getElementById('lista-cursos');
        if (lista) {
            const item = document.createElement('li');
            item.textContent = selectedCourse;
            lista.appendChild(item);
        }

        closeModal();

        // Mostra o aviso fixo
        const toast = document.getElementById('toast');
        toast.classList.remove('hidden');

        // Esconde o aviso automaticamente após 2,5 segundos
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    }
}

function hideToastOnClick(e) {
    const toast = document.getElementById('toast');
    const toastBox = toast.querySelector('div');
    if (!toastBox.contains(e.target)) {
        toast.classList.add('hidden');
        window.location.href = 'index.html'; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const plusButtons = document.querySelectorAll('.plus-button');
    plusButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(btn.getAttribute('data-course-id'));
        });
    });

    document.getElementById('confirm-btn').addEventListener('click', confirmAdd);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
});