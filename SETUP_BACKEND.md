# 🚀 Configuração do Backend CourseRank

## Passos para Configurar o Backend

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já foi criado com configurações padrão. Você pode modificar se necessário:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=sua_chave_secreta_jwt_muito_segura_aqui_123456789
JWT_EXPIRE=24h
```

### 3. Iniciar o Servidor

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Ou produção
npm start
```

O servidor estará rodando em `http://localhost:3001`

### 4. Testar a API

Acesse `http://localhost:3001/api/health` para verificar se a API está funcionando.

## 🔄 Migração do json-server

### Substituir URLs no Frontend

Você precisará atualizar as URLs das APIs no frontend de:
- `http://localhost:3001/courses` → `http://localhost:3001/api/courses`
- `http://localhost:3001/ratings` → `http://localhost:3001/api/ratings`
- etc.

### Principais Mudanças na API:

1. **Autenticação obrigatória** para criar/editar/excluir
2. **Headers de autorização** necessários: `Authorization: Bearer <token>`
3. **Novos endpoints** de autenticação: `/api/auth/login`, `/api/auth/register`
4. **Estrutura de resposta** padronizada com mensagens de erro/sucesso

## 🔐 Autenticação

### Registro de Usuário
```bash
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Usar Token nas Requisições
```javascript
// Headers para requisições autenticadas
{
  "Authorization": "Bearer <seu_token_jwt>",
  "Content-Type": "application/json"
}
```

## 📊 Endpoints Principais

### Cursos
- `GET /api/courses` - Listar cursos (público)
- `POST /api/courses` - Criar curso (autenticado)
- `PUT /api/courses/:id` - Editar curso (dono ou admin)
- `DELETE /api/courses/:id` - Excluir curso (dono ou admin)

### Avaliações
- `GET /api/ratings/course/:courseId` - Avaliações de um curso
- `POST /api/ratings` - Criar avaliação (autenticado)
- `DELETE /api/ratings/:id` - Excluir avaliação (dono ou admin)

### Lista Pessoal
- `GET /api/lists/my` - Minha lista (autenticado)
- `POST /api/lists/add` - Adicionar curso (autenticado)
- `DELETE /api/lists/remove/:courseId` - Remover curso (autenticado)

## 🛠️ Funcionalidades Implementadas

✅ **Sistema de Autenticação JWT completo**
✅ **CRUD de Cursos com controle de permissões**
✅ **Sistema de Avaliações**
✅ **Listas Pessoais de Cursos**
✅ **Sistema de Cupons**
✅ **Controle de Acesso (usuário vs admin)**
✅ **Validação de dados**
✅ **Tratamento de erros**
✅ **CORS configurado**
✅ **Segurança com helmet**

## 🔧 Próximas Etapas

1. **Atualizar Frontend**: Adaptar as chamadas da API
2. **Implementar Login/Registro**: Criar telas no frontend
3. **Gerenciar Tokens**: Armazenar e enviar tokens JWT
4. **Proteger Rotas**: Esconder/proteger funcionalidades baseadas em auth

## 📝 Estrutura de Dados

Os dados estão sendo armazenados em memória (variáveis JavaScript) no arquivo `backend/data/mockData.js`. Isso será substituído por MongoDB posteriormente.

## 🚨 Importante

- O backend substitui completamente o json-server
- Mantenha o json-server desligado quando usar o novo backend
- Todas as operações de escrita (CREATE, UPDATE, DELETE) agora exigem autenticação
- As URLs mudaram de `/courses` para `/api/courses`
