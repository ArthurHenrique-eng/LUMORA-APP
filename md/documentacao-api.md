# Documentação Completa da API - LUMORA APP

Documentação técnica completa de todos os endpoints da API LUMORA.

**Base URL**: `http://localhost:5000`  
**Versão da API**: 1.0.0  
**Autenticação**: Sessão (v1.0.0) / JWT (planejado para v1.1.0)

---

## 📋 Índice

- [Autenticação](#autenticação)
- [Endpoints de Renderização](#endpoints-de-renderização)
- [Endpoints de Autenticação](#endpoints-de-autenticação)
- [Endpoints de Usuários](#endpoints-de-usuários)
- [Endpoints de Analytics](#endpoints-de-analytics)
- [Códigos de Erro](#códigos-de-erro)
- [Rate Limiting](#rate-limiting)
- [Exemplos Práticos](#exemplos-práticos)

---

## 🔐 Autenticação

### v1.0.0

Atualmente, a aplicação usa cookies de sessão. Após fazer login, um cookie é armazenado automaticamente.

```javascript
// O navegador gerencia cookies automaticamente
// Não há necessidade de headers especiais
```

### Planejado (v1.1.0)

```http
Authorization: Bearer <token_jwt>
```

---

## 🖥️ Endpoints de Renderização

Estes endpoints retornam HTML (não JSON).

### GET /

**Descrição**: Página inicial da aplicação

```http
GET / HTTP/1.1
Host: localhost:5000
```

**Resposta**: 
- Status: 200 OK
- Content-Type: text/html
- Body: index.html renderizado

---

### GET /login

**Descrição**: Formulário de login

```http
GET /login HTTP/1.1
Host: localhost:5000
```

**Aliases**: `/login.html`

**Resposta**:
- Status: 200 OK
- Content-Type: text/html
- Body: login.html renderizado

---

### GET /cadastro

**Descrição**: Formulário de cadastro

```http
GET /cadastro HTTP/1.1
Host: localhost:5000
```

**Aliases**: `/cadastro.html`

**Resposta**:
- Status: 200 OK
- Content-Type: text/html
- Body: cadastro.html renderizado

---

### GET /home

**Descrição**: Dashboard principal do usuário (requer login)

```http
GET /home HTTP/1.1
Host: localhost:5000
Cookie: session=<sessão_do_usuário>
```

**Aliases**: `/usuario`

**Resposta**:
- Status: 200 OK
- Content-Type: text/html
- Body: home.html renderizado

**Erro**:
- Status: 302 Found (redireciona para /login se não autenticado)

---

### GET /analytics

**Descrição**: Página de analytics (requer login)

```http
GET /analytics HTTP/1.1
Host: localhost:5000
Cookie: session=<sessão_do_usuário>
```

**Resposta**:
- Status: 200 OK
- Content-Type: text/html
- Body: analytics.html renderizado

---

## 🔑 Endpoints de Autenticação

### POST /login

**Descrição**: Autentica um usuário

```http
POST /login HTTP/1.1
Host: localhost:5000
Content-Type: application/x-www-form-urlencoded

email=usuario@email.com&password=senha123456
```

**Parâmetros**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| email | string | ✅ | Email do usuário |
| password | string | ✅ | Senha do usuário |
| remember | boolean | ❌ | Lembrar deste dispositivo |

**Respostas de Sucesso**:
```http
HTTP/1.1 302 Found
Location: /home
Set-Cookie: session=<novo_token_sessão>
```

**Respostas de Erro**:
```http
HTTP/1.1 302 Found
Location: /login?erro=Email ou senha incorretos

HTTP/1.1 302 Found
Location: /login?erro=Preencha todos os campos
```

**Exemplo com cURL**:
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=teste@email.com" \
  -d "password=senha123456" \
  -L
```

---

### POST /registrar

**Descrição**: Cria uma nova conta

```http
POST /registrar HTTP/1.1
Host: localhost:5000
Content-Type: application/x-www-form-urlencoded

email=novo@email.com&password=senha123456&confirmarSenha=senha123456
```

**Parâmetros**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| email | string | ✅ | Email da nova conta |
| password | string | ✅ | Senha (mín 6 caracteres) |
| confirmarSenha | string | ✅ | Confirmação de senha |

**Respostas de Sucesso**:
```http
HTTP/1.1 302 Found
Location: /login?sucesso=Conta criada com sucesso! Faça login.
```

**Respostas de Erro**:
```http
HTTP/1.1 302 Found
Location: /cadastro?erro=Email já cadastrado

HTTP/1.1 302 Found
Location: /cadastro?erro=Preencha todos os campos
```

**Validações**:
- Email deve ser único
- Password mínimo 6 caracteres
- Ambos os campos obrigatórios
- Email deve ser formato válido

**Exemplo com cURL**:
```bash
curl -X POST http://localhost:5000/registrar \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=novo@email.com" \
  -d "password=senha123456" \
  -d "confirmarSenha=senha123456" \
  -L
```

---

## 👥 Endpoints de Usuários

### GET /api/usuarios

**Descrição**: Lista todos os usuários

```http
GET /api/usuarios HTTP/1.1
Host: localhost:5000
Accept: application/json
```

**Parâmetros**: Nenhum

**Resposta (200 OK)**:
```json
[
  {
    "id": 1,
    "email": "usuario1@email.com"
  },
  {
    "id": 2,
    "email": "usuario2@email.com"
  }
]
```

**Exemplo com cURL**:
```bash
curl http://localhost:5000/api/usuarios
```

---

### GET /api/usuarios/<id>

**Descrição**: Busca um usuário específico

```http
GET /api/usuarios/1 HTTP/1.1
Host: localhost:5000
Accept: application/json
```

**Parâmetros**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| id | integer | ✅ | ID do usuário (na URL) |

**Resposta (200 OK)**:
```json
{
  "id": 1,
  "email": "usuario@email.com"
}
```

**Resposta (404 Not Found)**:
```json
{
  "erro": "Usuario nao encontrado"
}
```

**Exemplo com cURL**:
```bash
curl http://localhost:5000/api/usuarios/1
```

---

### PUT /api/usuarios/<id>

**Descrição**: Atualiza completamente um usuário

```http
PUT /api/usuarios/1 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "email": "novo@email.com",
  "password": "novaSenha123456"
}
```

**Parâmetros**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| id | integer | ✅ | ID do usuário (na URL) |
| email | string | ✅ | Novo email |
| password | string | ✅ | Nova senha |

**Resposta (200 OK)**:
```json
{
  "mensagem": "Usuario atualizado com PUT"
}
```

**Respostas de Erro**:
```json
{
  "erro": "PUT requer email e senha"
}
```

```json
{
  "erro": "Usuario nao encontrado"
}
```

**Exemplo com cURL**:
```bash
curl -X PUT http://localhost:5000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@email.com",
    "password": "novaSenha123456"
  }'
```

---

### PATCH /api/usuarios/<id>

**Descrição**: Atualiza parcialmente um usuário

```http
PATCH /api/usuarios/1 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "email": "novo@email.com"
}
```

**Parâmetros**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| id | integer | ✅ | ID do usuário (na URL) |
| email | string | ❌ | Novo email |
| password | string | ❌ | Nova senha |

**Nota**: Pelo menos um campo deve ser fornecido

**Resposta (200 OK)**:
```json
{
  "mensagem": "Usuario atualizado com PATCH"
}
```

**Respostas de Erro**:
```json
{
  "erro": "Informe ao menos um campo para atualizar"
}
```

```json
{
  "erro": "Email invalido"
}
```

**Exemplo com cURL**:
```bash
# Atualizar apenas email
curl -X PATCH http://localhost:5000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"email": "novo@email.com"}'

# Atualizar apenas senha
curl -X PATCH http://localhost:5000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"password": "novaSenha123456"}'
```

---

### DELETE /api/usuarios/<id>

**Descrição**: Deleta um usuário

```http
DELETE /api/usuarios/1 HTTP/1.1
Host: localhost:5000
```

**Parâmetros**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| id | integer | ✅ | ID do usuário (na URL) |

**Resposta (200 OK)**:
```json
{
  "mensagem": "Usuario removido com sucesso"
}
```

**Resposta (404 Not Found)**:
```json
{
  "erro": "Usuario nao encontrado"
}
```

**Exemplo com cURL**:
```bash
curl -X DELETE http://localhost:5000/api/usuarios/1
```

---

## 📊 Endpoints de Analytics

### GET /api/analytics/dashboard

**Descrição**: Retorna KPIs do dashboard

```http
GET /api/analytics/dashboard?usuario_id=1&periodo=30 HTTP/1.1
Host: localhost:5000
Accept: application/json
```

**Parâmetros Query**:
| Nome | Tipo | Default | Descrição |
|------|------|---------|-----------|
| usuario_id | integer | 1 | ID do usuário |
| periodo | integer | 30 | Período em dias |

**Resposta (200 OK)**:
```json
{
  "sucesso": true,
  "kpis": {
    "receita_total": 5000.00,
    "despesa_total": 2500.00,
    "saldo": 2500.00,
    "crescimento": 15.5
  },
  "previsao": {
    "mes_proximo": 5500.00,
    "trend": "positiva"
  },
  "top_receitas": [],
  "top_despesas": []
}
```

**Resposta (500 Error)**:
```json
{
  "sucesso": false,
  "erro": "Mensagem de erro"
}
```

**Exemplo com cURL**:
```bash
curl "http://localhost:5000/api/analytics/dashboard?usuario_id=1&periodo=30"
```

---

### GET /api/analytics/relatorio

**Descrição**: Gera relatório detalhado

```http
GET /api/analytics/relatorio?usuario_id=1&periodo=30 HTTP/1.1
Host: localhost:5000
Accept: application/json
```

**Parâmetros Query**:
| Nome | Tipo | Default | Descrição |
|------|------|---------|-----------|
| usuario_id | integer | 1 | ID do usuário |
| periodo | integer | 30 | Período em dias |

**Resposta (200 OK)**:
```json
{
  "sucesso": true,
  "relatorio": {
    "periodo": "30 dias",
    "data_geracao": "2026-06-04T10:30:00",
    "usuario_id": 1,
    "resumo": {
      "receita_total": 5000.00,
      "despesa_total": 2500.00,
      "saldo": 2500.00
    },
    "detalhes": {}
  }
}
```

**Exemplo com cURL**:
```bash
curl "http://localhost:5000/api/analytics/relatorio?usuario_id=1&periodo=30"
```

---

### POST /api/analytics/enviar-relatorio

**Descrição**: Envia relatório por email

```http
POST /api/analytics/enviar-relatorio HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "usuario_id": 1,
  "email": "usuario@email.com",
  "periodo": 30,
  "agendar": false
}
```

**Parâmetros**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| usuario_id | integer | ✅ | ID do usuário |
| email | string | ✅ | Email para envio |
| periodo | integer | ❌ | Período em dias (default: 30) |
| agendar | boolean | ❌ | Agendar envio recorrente |

**Resposta (200 OK)**:
```json
{
  "sucesso": true,
  "mensagem": "Relatório enviado com sucesso!",
  "agendar": false
}
```

**Respostas de Erro**:
```json
{
  "sucesso": false,
  "mensagem": "E-mail é obrigatório"
}
```

```json
{
  "sucesso": false,
  "mensagem": "Usuário não encontrado"
}
```

**Exemplo com cURL**:
```bash
curl -X POST http://localhost:5000/api/analytics/enviar-relatorio \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "email": "usuario@email.com",
    "periodo": 30,
    "agendar": false
  }'
```

---

## ❌ Códigos de Erro

| Código | Significado | Causa Comum |
|--------|-----------|------------|
| 200 | OK | Requisição bem-sucedida |
| 302 | Found (Redirect) | Redirecionamento pós login/cadastro |
| 400 | Bad Request | Dados inválidos ou incompletos |
| 404 | Not Found | Recurso não existe |
| 500 | Internal Server Error | Erro no servidor |

### Exemplos de Erro

**Validação Falhou**:
```json
{
  "erro": "Preencha todos os campos"
}
```

**Recurso Não Encontrado**:
```json
{
  "erro": "Usuario nao encontrado"
}
```

**Erro Interno**:
```json
{
  "sucesso": false,
  "erro": "Erro ao processar requisição"
}
```

---

## 🚦 Rate Limiting

**Status Atual**: Não implementado (planejado para v1.1.0)

Quando implementado:
- Limite: 5 tentativas de login por minuto
- Limite: 100 requisições por hora por IP
- Headers de resposta:
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp do reset

---

## 💡 Exemplos Práticos

### Exemplo 1: Fluxo Completo de Cadastro

```bash
# 1. Criar nova conta
curl -X POST http://localhost:5000/registrar \
  -d "email=novo@email.com" \
  -d "password=senha123456" \
  -d "confirmarSenha=senha123456" \
  -L

# Resposta: Redireciona para /login?sucesso=...

# 2. Fazer login com a nova conta
curl -X POST http://localhost:5000/login \
  -d "email=novo@email.com" \
  -d "password=senha123456" \
  -L

# Resposta: Redireciona para /home (agora autenticado)
```

### Exemplo 2: Gerenciar Usuários

```bash
# 1. Listar todos os usuários
curl http://localhost:5000/api/usuarios

# 2. Buscar usuário específico
curl http://localhost:5000/api/usuarios/1

# 3. Atualizar completamente
curl -X PUT http://localhost:5000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"email": "novo@email.com", "password": "novaSenha123456"}'

# 4. Atualizar parcialmente
curl -X PATCH http://localhost:5000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"email": "atualizado@email.com"}'

# 5. Deletar usuário
curl -X DELETE http://localhost:5000/api/usuarios/1
```

### Exemplo 3: Gerar e Enviar Relatório

```bash
# 1. Obter dashboard
curl "http://localhost:5000/api/analytics/dashboard?usuario_id=1&periodo=30"

# 2. Gerar relatório
curl "http://localhost:5000/api/analytics/relatorio?usuario_id=1&periodo=30"

# 3. Enviar por email
curl -X POST http://localhost:5000/api/analytics/enviar-relatorio \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "email": "usuario@email.com",
    "periodo": 30
  }'
```

### Exemplo 4: Usando com JavaScript

```javascript
// Login
fetch('/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'email=usuario@email.com&password=senha123456',
  redirect: 'follow'
})
.then(response => response.text())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Listar usuários
fetch('/api/usuarios')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erro:', error));

// Atualizar usuário
fetch('/api/usuarios/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'novo@email.com'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

---

## 📚 Recursos Adicionais

- [README.md](README.md) - Visão geral do projeto
- [SECURITY.md](SECURITY.md) - Guia de segurança
- [CONTRIBUTING.md](CONTRIBUTING.md) - Como contribuir
- [Postman Collection](docs/postman-collection.json) - Importar no Postman

---

<div align="center">

**Última Atualização**: 04 de Junho de 2026  
**Versão da API**: 1.0.0

[⬆ Voltar ao topo](#documentação-completa-da-api---lumora-app)

</div>
