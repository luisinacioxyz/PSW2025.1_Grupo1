// Dados mockados em memória (substituir por MongoDB depois)

let courses = [
  {
    "id": "1",
    "title": "Construa o nicho e identifique o problema - A facilidade do marketing orgânico",
    "platform": "Alura",
    "url": "https://www.alura.com.br/curso-marketing-organico",
    "price": 49.99,
    "description": "Aprenda a identificar nichos de mercado e criar estratégias eficientes de marketing orgânico para crescimento sustentável.",
    "imageUrl": "https://img.freepik.com/vetores-gratis/ilustracao-do-conceito-de-marketing_114360-3903.jpg?ga=GA1.1.2083810456.1747016003&semt=ais_hybrid&w=740",
    "rating": 4.7,
    "totalRatings": 245,
    "createdAt": new Date().toISOString()
  },
  {
    "id": "2",
    "title": "A arte de educar - Construa o copywrite que o seu cliente não sabia que precisava ler",
    "platform": "Domestika",
    "url": "https://www.domestika.org/copywriting-arte",
    "price": 39.99,
    "description": "Domine a arte do copywriting educacional e aprenda a criar textos persuasivos que conectam e convertem.",
    "imageUrl": "https://img.freepik.com/vetores-gratis/ilustracoes-ilustradas-de-clipart-promocional-de-marketing_52683-74351.jpg?ga=GA1.1.2083810456.1747016003&semt=ais_hybrid&w=740",
    "rating": 4.8,
    "totalRatings": 189,
    "createdAt": new Date().toISOString()
  }
];

let ratings = [
  {
    "id": "1",
    "courseId": "1",
    "userId": "user1",
    "rating": 5,
    "review": "Excelente curso para entender marketing orgânico! Metodologia clara e resultados práticos.",
    "createdAt": "2024-03-15T10:00:00Z"
  },
  {
    "id": "2",
    "courseId": "2",
    "userId": "user2",
    "rating": 5,
    "review": "Transformou completamente minha forma de escrever copy. Resultados impressionantes!",
    "createdAt": "2024-03-16T15:30:00Z"
  }
];

let users = [
  {
    "id": "user1",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    "role": "user",
    "createdAt": "2024-03-15T10:00:00Z"
  },
  {
    "id": "user2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    "role": "user",
    "createdAt": "2024-03-16T15:30:00Z"
  }
];

let userLists = [
  {
    "id": "4e65",
    "userId": "user1",
    "courseIds": [],
    "createdAt": "2025-05-11T06:24:49.409Z"
  }
];

let coupons = [
  {
    "id": "1",
    "userId": "user1",
    "courseId": "1",
    "code": "PYTHON20",
    "discount": 20,
    "expiresAt": "2024-12-31T23:59:59Z",
    "createdAt": new Date().toISOString()
  }
];

// Funções auxiliares para gerar IDs únicos
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function generateUserId() {
  return `user_${Date.now()}`;
}

module.exports = {
  courses,
  ratings,
  users,
  userLists,
  coupons,
  generateId,
  generateUserId
};
