# CourseRank Backend

Backend API para o sistema CourseRank - Sistema de Avaliação de Cursos Online.

## 🚀 Funcionalidades

- **Autenticação JWT**: Registro, login e controle de acesso
- **CRUD de Cursos**: Criar, listar, editar e excluir cursos
- **Sistema de Avaliações**: Avaliar cursos com notas e comentários
- **Listas Pessoais**: Gerenciar lista de cursos favoritos
- **Sistema de Cupons**: Criar e validar cupons de desconto
- **Controle de Permissões**: Proteção de rotas baseada em roles

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn

## 🛠️ Instalação

```bash
cd backend
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto backend:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=sua_chave_secreta_jwt_muito_segura_aqui_123456789
JWT_EXPIRE=24h
```

## 🚀 Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor estará rodando em `http://localhost:3001`

## 📚 API Endpoints

### Autenticação (`/api/auth`)
- `POST /register` - Registrar usuário
- `POST /login` - Login
- `GET /me` - Obter dados do usuário atual
- `PUT /profile` - Atualizar perfil
- `POST /change-password` - Alterar senha

### Cursos (`/api/courses`)
- `GET /` - Listar cursos (público)
- `GET /:id` - Obter curso específico (público)
- `POST /` - Criar curso (autenticado)
- `PUT /:id` - Atualizar curso (dono ou admin)
- `DELETE /:id` - Excluir curso (dono ou admin)
- `GET /platforms/list` - Listar plataformas (público)
- `GET /user/:userId` - Cursos de um usuário (público)

### Avaliações (`/api/ratings`)
- `GET /` - Listar avaliações (público)
- `GET /:id` - Obter avaliação específica (público)
- `POST /` - Criar avaliação (autenticado)
- `PUT /:id` - Atualizar avaliação (dono ou admin)
- `DELETE /:id` - Excluir avaliação (dono ou admin)
- `GET /course/:courseId` - Avaliações de um curso (público)
- `GET /user/:userId` - Avaliações de um usuário (público)

### Listas de Usuário (`/api/lists`)
- `GET /my` - Obter minha lista (autenticado)
- `POST /add` - Adicionar curso à lista (autenticado)
- `DELETE /remove/:courseId` - Remover curso da lista (autenticado)
- `GET /:userId` - Lista de outro usuário (público)

### Cupons (`/api/coupons`)
- `GET /my` - Obter meus cupons (autenticado)
- `POST /` - Criar cupom (autenticado)
- `GET /validate/:code` - Validar cupom (público)
- `POST /use/:code` - Usar cupom (autenticado)
- `DELETE /:id` - Excluir cupom (dono ou admin)

### Usuários (`/api/users`)
- `GET /` - Listar usuários (admin apenas)
- `GET /:id` - Obter usuário específico (público)

### Health Check
- `GET /api/health` - Status da API

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu_token_jwt>
```

## 🏗️ Estrutura do Projeto

```
backend/
├── data/
│   └── mockData.js          # Dados mockados em memória
├── middleware/
│   └── auth.js              # Middlewares de autenticação
├── routes/
│   ├── auth.js              # Rotas de autenticação
│   ├── courses.js           # Rotas de cursos
│   ├── ratings.js           # Rotas de avaliações
│   ├── userLists.js         # Rotas de listas
│   ├── coupons.js           # Rotas de cupons
│   └── users.js             # Rotas de usuários
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências do projeto
├── server.js                # Servidor principal
└── README.md               # Documentação
```

## 🗃️ Modelo de Dados

### Usuário
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string (hash)",
  "role": "user|admin",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

### Curso
```json
{
  "id": "string",
  "title": "string",
  "platform": "string",
  "url": "string",
  "price": "number",
  "description": "string",
  "imageUrl": "string",
  "rating": "number",
  "totalRatings": "number",
  "createdBy": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

### Avaliação
```json
{
  "id": "string",
  "courseId": "string",
  "userId": "string",
  "rating": "number (1-5)",
  "review": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT com expiração configurável
- Validação de entrada com express-validator
- Headers de segurança com helmet
- CORS configurado
- Controle de acesso baseado em roles

## 📈 Próximos Passos

1. **MongoDB**: Substituir dados em memória por MongoDB
2. **Passport.js**: Implementar estratégias de autenticação
3. **Upload de Imagens**: Sistema de upload para imagens de cursos
4. **Cache**: Implementar cache Redis
5. **Testes**: Adicionar testes unitários e de integração
6. **Docker**: Containerização da aplicação

## 🤝 Desenvolvimento

Para substituir o json-server pelo backend:

1. Inicie o backend: `npm run dev`
2. No frontend, altere as URLs da API de `http://localhost:3001/courses` para `http://localhost:3001/api/courses`
3. Adicione headers de autenticação nas requisições protegidas

## 📝 Logs

O servidor usa Morgan para logging de requisições HTTP. Em desenvolvimento, todos os logs são exibidos no console.

## 🐛 Tratamento de Erros

- Middleware global de tratamento de erros
- Validação de entrada em todas as rotas
- Respostas de erro padronizadas
- Logs detalhados para debugging
