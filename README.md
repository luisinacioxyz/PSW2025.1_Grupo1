# CourseRank - A Plataforma Definitiva de Avaliação de Cursos Online

![CourseRank Logo](https://via.placeholder.com/150) <!-- Placeholder for logo -->

**Compare, avalie e descubra os melhores cursos online antes de investir seu tempo e dinheiro.**

## Visão Geral

O **CourseRank** é uma plataforma web que permite aos usuários comparar, avaliar e descobrir cursos online de diversas plataformas (como Udemy, Coursera, Alura, Domestika, etc.), ajudando-os a escolher a melhor opção com base em experiências reais de outros usuários. A ideia é funcionar como um **TripAdvisor/LetterBox dos cursos online**, permitindo que usuários encontrem cursos de alta qualidade e evitem experiências ruins.

---

## Declaração de Propósito

### Nome do Sistema e Propósito
- **Nome**: CourseRank  
- **Propósito**: Permitir que usuários comparem e avaliem cursos online de diferentes plataformas, ajudando-os a tomar decisões informadas com base na qualidade e experiências de outros usuários.

### Business Case Simplificado
- **Contexto**: Durante a pandemia de COVID-19, o mercado de cursos online cresceu significativamente, mas muitos usuários enfrentaram dificuldades para encontrar cursos de qualidade a preços acessíveis. O CourseRank resolve esse problema ao centralizar informações de cursos e avaliações permitindo comparações econômicas e ajudando os usuários a economizar tempo.
- **Como Gera Valor**: O sistema facilita a integração de uma comunidade auto-gerenciada pelos usuários. Dessa forma, inserindo um usuário em um ecossistema que facilita a escolha do curso ideal com base nas informações fornecidas.

### Processo de Negócio Principal
O processo principal do CourseRank envolve os seguintes passos:
1. O usuário escolhe o curso que está realizando.
2. O usuário avalia o curso.
3. O usuário pesquisa por outros cursos que deseja.
4. O usuário visualiza as avaliações do curso.

### Casos de Uso
Os casos de uso do CourseRank são:
- **Manutenção de Cupons** (4 casos de uso - CRUD: Create, Read, Update, Delete): Gerenciar os cupons que o usuário tem acesso.
- **Manutenção de Cursos** (4 casos de uso - CRUD): Gerenciar os cursos (itens) que o usuário deseja adicionar.
- **Manutenção de Avaliação** (4 casos de uso - CRUD): Gerenciar informações sobre as avaliações de cursos.


### Entidades de Domínio
As entidades principais do CourseRank são:
- **Curso**: Representa os cursos online (ex.: "Curso de Python na Udemy").
- **Usuário**: Representa o usuário.
- **Avaliação**: Representa a avaliação de um curso em uma plataforma específica.
- **Plataforma**: Representa as plataformas de cursos (ex.: Udemy, Coursera).

---

## Protótipos de Tela


- [Protótipos](https://www.canva.com/design/DAGijdLY7Rc/zuSSZ70QoYbvX1scLp7ymA/view?utm_content=DAGijdLY7Rc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2772b77a80)


## Tech Stack

- Frontend:
  - React
  - Redux Toolkit for state management
  - React Router for navigation
  - Tailwind CSS for styling
- Backend (Simulated):
  - json-server

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd courserank
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

This will start both the React application (on port 3000) and the json-server (on port 3001).

## Development

- React app: [http://localhost:3000](http://localhost:3000)
- json-server: [http://localhost:3001](http://localhost:3001)

### Available Scripts

- `npm start` - Runs the React application
- `npm run server` - Runs the json-server
- `npm run dev` - Runs both the React application and json-server
- `npm test` - Runs the test suite
- `npm run build` - Builds the app for production

## Project Structure

```
courserank/
├── src/
│   ├── components/     # React components
│   ├── store/         # Redux store and slices
│   │   └── slices/    # Redux slices
│   ├── hooks/         # Custom hooks
│   ├── App.js        # Main App component
│   └── index.js      # Entry point
├── public/            # Static files
└── db.json           # json-server database
```


