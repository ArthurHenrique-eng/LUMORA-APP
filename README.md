<h1 align="center"> Lumora - Inteligência Financeira com IA </h1>

<div align="center">
<h7> Copyright (c) 2026 Arthur </h7>

<h10 align="center"> Plataforma de gestão financeira inteligente com análise de dados e previsões baseadas em IA </h10>
<p>

![Status](https://img.shields.io/badge/status-active-success.svg)
![Flask](https://img.shields.io/badge/flask-2.0%2B-lightgrey)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Maintenance](https://img.shields.io/badge/maintained%3F-yes-green.svg)

</p>

<p align="center">
  <a href="https://github.com/ArthurHenrique-eng?tab=repositories">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  </a>
  <a href="https://github.com/ArthurHenrique-eng?tab=repositories">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  </a>
  <a href="https://github.com/ArthurHenrique-eng?tab=repositories">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  </a>
  <a href="https://github.com/ArthurHenrique-eng?tab=repositories">
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  </a>
  <a href="https://github.com/ArthurHenrique-eng?tab=repositories">
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" />
  </a>
</p>
</div>

---
<div align="center">
<h3 align="center"> Navegação Rápida </h3>
<p>

[![Sobre](https://img.shields.io/badge/Sobre-495057?style=for-the-badge)](#sobre)
[![Arquitetura](https://img.shields.io/badge/Arquitetura-495057?style=for-the-badge)](#arquitetura)
[![Instalação](https://img.shields.io/badge/Instalação-495057?style=for-the-badge)](#instalação-e-setup)

[![Como Usar](https://img.shields.io/badge/Como_Usar-495057?style=for-the-badge)](#como-usar)
[![Estrutura](https://img.shields.io/badge/Estrutura-495057?style=for-the-badge)](#estrutura-do-projeto)
[![API](https://img.shields.io/badge/API-495057?style=for-the-badge)](#api-endpoints)
[![Diagramas](https://img.shields.io/badge/Diagramas-495057?style=for-the-badge)](#diagramas)

[![Contato](https://img.shields.io/badge/Contato-495057?style=for-the-badge)](#contato)
[![FAQ](https://img.shields.io/badge/FAQ-495057?style=for-the-badge)](#faq)
[![Suporte](https://img.shields.io/badge/Suporte-495057?style=for-the-badge)](#suporte)

[![Licença](https://img.shields.io/badge/Licença-495057?style=for-the-badge)](#licenca)
</p>
</div>

---
<div align="center">
<h3 id="sobre"> Sobre o projeto </h3>
</div>

**LUMORA APP** é uma aplicação web moderna de gestão financeira que utiliza inteligência artificial para fornecer insights inteligentes e previsões de crescimento financeiro. A plataforma permite que usuários:

- ✅ Gerenciem contas com autenticação segura
- ✅ Acessem dashboards financeiros em tempo real
- ✅ Recebam insights inteligentes baseados em IA
- ✅ Visualizem relatórios detalhados e análises
- ✅ Automatizem tarefas financeiras repetitivas
- ✅ Estabeleçam e acompanhem metas financeiras
---

<div align="center">
<h3 id="arquitetura"> Arquitetura do projeto </h3>

```mermaid
classDiagram
    direction TB

    note for HTMLPages "Camada Cliente"
    note for FlaskAPI "Camada de API (Flask)"
    note for UsuariosLumoraAPP "Camada de Dados (SQLite · LUMORA_APP.db)"

    class HTMLPages {
        <<page>>
        +index.html
        +login.html
        +home.html
        +analytics.html
    }

    class JavaScriptES6 {
        <<module>>
        +login.js
        +cadastro.js
        +home.js
        +analytics.js
    }

    class CSSEstilos {
        <<stylesheet>>
        +login.css
        +cadastro.css
        +analytics.css
    }

    class FlaskAPI {
        <<controller>>
        +GET_login()
        +POST_login()
        +GET_cadastro()
        +POST_registrar()
        +GET_home()
        +GET_api_usuarios()
        +GET_api_usuario_id()
        +PUT_api_usuario_id()
        +PATCH_api_usuario_id()
        +DELETE_api_usuario_id()
        +GET_api_analytics()
    }

    class AnalyticsService {
        <<service>>
        +analisar()
        +prever()
    }

    class DatabaseService {
        <<service>>
        +executarQuery()
        +conectar()
    }

    class UsuariosLumoraAPP {
        <<entity>>
        +id
        +nome
        +email
        +senha_hash
    }

    class Transacoes {
        <<entity>>
        +id
        +valor
        +tipo
        +data
    }

    class Metas {
        <<entity>>
        +id
        +objetivo
        +valor_alvo
        +progresso
    }

    class Relatorios {
        <<entity>>
        +id
        +dados_agregados
        +periodo
    }

    HTMLPages --> JavaScriptES6 : usa
    HTMLPages --> CSSEstilos : usa
    HTMLPages ..> FlaskAPI : HTTP/HTTPS
    FlaskAPI --> AnalyticsService : usa
    FlaskAPI --> DatabaseService : usa
    DatabaseService ..> UsuariosLumoraAPP : SQL
    DatabaseService ..> Transacoes : SQL
    DatabaseService ..> Metas : SQL
    DatabaseService ..> Relatorios : SQL
```
---
<h3> Fluxo de autenticação </h3>

```mermaid
flowchart TD

    subgraph CADASTRO["① CADASTRO"]
        C1([Usuário preenche formulário])
        C2[JavaScript valida e-mail e senha]
        C3[POST /registrar]
        C4{Flask verifica:\nE-mail já existe?\nCampos válidos?}
        C5[(INSERT UsuariosLumoraAPP)]
        C6([Redireciona para /login\n✓ Conta criada com sucesso!])
        C7([Exibe erro ao usuário])

        C1 --> C2 --> C3 --> C4
        C4 -->|Válido| C5 --> C6
        C4 -->|Inválido| C7
    end

    subgraph LOGIN["② LOGIN"]
        L1([Usuário preenche e-mail e senha])
        L2[JavaScript valida campos]
        L3[POST /login]
        L4[(SELECT * WHERE Email=? AND Senha=?)]
        L5([/home])
        L6([/login?erro=...])

        L1 --> L2 --> L3 --> L4
        L4 -->|SUCESSO| L5
        L4 -->|ERRO| L6
    end

```
---
<h3> Modelo de Dados </h3>
</div>

```sql
-- Tabela de Usuários
CREATE TABLE UsuariosLumoraAPP (
    IDUsuariosLumora INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    Email TEXT NOT NULL UNIQUE,
    Senha TEXT NOT NULL,
    DataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exemplo de dados
┌────┬──────────────────┬──────────────┬───────────────────┐
│ ID │ Email            │ Senha        │ DataCriacao       │
├────┼──────────────────┼──────────────┼───────────────────┤
│ 1  │ joao@email.com   │ senha123456  │ 2026-06-01 10:30 │
│ 2  │ maria@email.com  │ senha789012  │ 2026-06-02 14:45 │
└────┴──────────────────┴──────────────┴───────────────────┘
```

---
<div align="center">
<h3 id="instalação-e-setup"> Instalação e Setup </h3> 
</div>

<h3> Pré requisitos para rodar </h3>

```bash
- Python 3.8 ou superior
- Git instalado
- Terminal/Prompt de comando
- Editor de código (VSCode recomendado)
```

<h3> Passo 1: Clonar o Repositório </h3>

```bash
git clone https://github.com/seu-usuario/LUMORA-APP.git
cd LUMORA-APP
```

<h3> Passo 2: Criar e Ativar Ambiente Virtual </h3>

**No Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**No macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

<h3> Passo 3: Instalar Dependências </h3>

```bash
pip install -r requirements.txt
```

<h3> Passo 4: Inicializar Banco de Dados </h3>

```bash
cd python
python init_db.py
cd ..
```

Você verá a mensagem: `Banco de dados inicializado com sucesso!`

<h3> Passo 5: Iniciar Servidor Flask </h3>

```bash
cd python
python app.py
```

A aplicação estará disponível em:
```
http://localhost:5000 (ambiente virtual do seu computador)
```

---

<div align="center">
<h3 id="como-usar"> Como Utilizar </h3> 
</div>

```bash
#### 1. **Acessar a Página Inicial**
- Você verá a página de boas-vindas com informações sobre a LUMORA

#### 2. **Criar Uma Conta**
- Clique em "Criar conta" ou acesse `/cadastro`
- Preencha os campos:
  - Email (ex: usuario@email.com)
  - Senha (mínimo 6 caracteres)
  - Confirmar senha
- Clique em "Criar conta"
- Será redirecionado para login com mensagem de sucesso

#### 3. **Fazer Login**
- Acesse `/login`
- Preencha email e senha da conta criada
- Clique em "Entrar"
- Será redirecionado para `/home` (Dashboard)

#### 4. **Explorar o Dashboard**
- Na página home, você terá acesso a:
  - Resumo financeiro
  - Gráficos e análises
  - Relatórios
  - Metas e automações

#### 5. **Acessar Analytics**
- Clique em "Analytics" no menu
- Visualize KPIs e previsões de crescimento
- Gere e envie relatórios por email
```
---

<div align="center">
<h3 id="estrutura-do-projeto"> Estrutura do Projeto </h3> 
</div>

![Estrutura do Projeto](/md/img/estrutura_Lumora_app.png)

---
<div align="center">
<h3 id="api-endpoints"> API Endpoints </h3> 
</div>

### Endpoints de Renderização (GET)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Página inicial |
| GET | `/index.html` | Página inicial (alternativa) |
| GET | `/login` | Formulário de login |
| GET | `/login.html` | Formulário de login (alternativa) |
| GET | `/cadastro` | Formulário de cadastro |
| GET | `/cadastro.html` | Formulário de cadastro (alternativa) |
| GET | `/home` | Dashboard do usuário |
| GET | `/usuario` | Dashboard (alternativa) |
| GET | `/analytics` | Página de analytics |
| GET | `/recuperar-senha.html` | Recuperação de senha |

### Endpoints de Autenticação (POST)

#### Login
```
POST /login
Content-Type: application/x-www-form-urlencoded

email=usuario@email.com
password=senha123456

Resposta bem-sucedida: 302 Redirect → /home
Resposta com erro: 302 Redirect → /login?erro=mensagem
```

#### Registrar
```
POST /registrar
Content-Type: application/x-www-form-urlencoded

email=novo@email.com
password=senha123456

Resposta bem-sucedida: 302 Redirect → /login?sucesso=mensagem
Resposta com erro: 302 Redirect → /cadastro?erro=mensagem
```

### Endpoints de Usuários (RESTful API)

#### Listar Todos os Usuários
```
GET /api/usuarios

Resposta (200 OK):
[
  {
    "id": 1,
    "email": "usuario@email.com"
  },
  {
    "id": 2,
    "email": "outro@email.com"
  }
]
```

#### Buscar Usuário por ID
```
GET /api/usuarios/<id>

Resposta (200 OK):
{
  "id": 1,
  "email": "usuario@email.com"
}

Resposta (404 Not Found):
{
  "erro": "Usuario nao encontrado"
}
```

#### Atualizar Usuário (PUT - Completo)
```
PUT /api/usuarios/<id>
Content-Type: application/json

{
  "email": "novo@email.com",
  "password": "novaSenha123456"
}

Resposta (200 OK):
{
  "mensagem": "Usuario atualizado com PUT"
}
```

#### Atualizar Usuário (PATCH - Parcial)
```
PATCH /api/usuarios/<id>
Content-Type: application/json

{
  "email": "novo@email.com"
}

Resposta (200 OK):
{
  "mensagem": "Usuario atualizado com PATCH"
}
```

#### Deletar Usuário
```
DELETE /api/usuarios/<id>

Resposta (200 OK):
{
  "mensagem": "Usuario removido com sucesso"
}
```

### Endpoints de Analytics

#### Dashboard KPIs
```
GET /api/analytics/dashboard?usuario_id=1&periodo=30

Resposta (200 OK):
{
  "sucesso": true,
  "kpis": {...},
  "previsao": {...},
  "top_receitas": [],
  "top_despesas": []
}
```

#### Gerar Relatório
```
GET /api/analytics/relatorio?usuario_id=1&periodo=30

Resposta (200 OK):
{
  "sucesso": true,
  "relatorio": {...}
}
```

#### Enviar Relatório por Email
```
POST /api/analytics/enviar-relatorio
Content-Type: application/json

{
  "usuario_id": 1,
  "email": "usuario@email.com",
  "periodo": 30,
  "agendar": false
}

Resposta (200 OK):
{
  "sucesso": true,
  "mensagem": "Relatório enviado com sucesso!"
}
```

---
<div align="center">
<h3 id="diagramas"> Diagramas </h3> 


<h3> Fluxo de Requisição HTTP </h3>
</div>

```mermaid
flowchart TD

    A["Cliente<br>(Browser)"]
    B["Flask"]
    C["HTML + CSS + JS"]
    D["JavaScript Valida"]
    E["Flask - Rota POST"]
    F["/home"]
    G["/login?erro=..."]

    A -->|"1. GET /login"| B
    B -->|"2. render_template('login.html')"| C
    C -->|"3. Usuário interage com formulário"| D
    D -->|"4. POST /login (se válido)"| E

    E -->|"Valida dados"| H["Validação"]
    H -->|"Query BD"| I["Banco de Dados"]

    I --> J{"Credenciais<br>válidas?"}

    J -->|"Sim"| F
    J -->|"Não"| G
```
---
<div align="center">
<h3> Ciclo de Vida de Uma Requisição </h3> 
</div>

```mermaid
flowchart TD

    A["Requisição HTTP"]
    B["Flask Recebe Request"]
    C["Identifica Rota"]
    D["Executa Função da Rota"]
    E["Acessa Banco de Dados"]
    F["Processa Dados"]
    G["Retorna Resposta"]
    H["Cliente Recebe"]

    A --> B
    B -->|"Request Object"| C
    C -->|"Método + Path Matching"| D
    D -->|"Função Decorada"| E
    E -->|"SQLite Connection"| F
    F -->|"Validação + Lógica de Negócio"| G
    G -->|"Redirect / JSON / HTML"| H
```
---

<div align="center">
<h3 id="faq"> FAQ </h3> 
</div>

```markdown
## FAQ

### O LUMORA APP está em produção?
Não. Atualmente o projeto encontra-se em fase de desenvolvimento e aprimoramento contínuo.

### Quais tecnologias foram utilizadas?
O sistema foi desenvolvido utilizando HTML, CSS, JavaScript, Python (Flask) e SQLite.

### É necessário instalar dependências para executar o projeto?
Sim. Todas as dependências estão listadas no arquivo `requirements.txt`.

### O projeto utiliza banco de dados?
Sim. O LUMORA APP utiliza SQLite para armazenamento dos dados.

### Como executar o projeto localmente?
Siga as instruções disponíveis na seção deste documento. Clique no botão abaixo para ser redirecionado.
```

[![Instalação](https://img.shields.io/badge/Instalação-495057?style=for-the-badge)](#instalação-e-setup)

```markdown
### O sistema possui autenticação de usuários?
Sim. O projeto conta com funcionalidades de cadastro, login e recuperação de senha.

### O projeto possui API?
Sim. Os endpoints disponíveis estão documentados na seção "API Endpoints".

### Como posso contribuir com o projeto?
Consulte a seção "Contribuindo" para obter orientações sobre melhorias, correções e novas funcionalidades.

### O sistema utiliza Inteligência Artificial?
Sim. O módulo de Analytics foi projetado para fornecer insights financeiros inteligentes e previsões baseadas nos dados do usuário.

### Onde posso relatar bugs ou sugerir melhorias?
Abra uma issue no repositório ou entre em contato através dos canais informados na seção "Suporte".
```
` ! PROJETO NÃO ESTÁ 100% CONCLUIDO ! `


---

<div align="center">
<h3 id="suporte"> Suporte </h3> 
</div>

### Reportar Bugs

1. Verifique se o bug já não foi reportado
2. Descreva o comportamento esperado e atual
3. Forneça passos para reproduzir
4. Anexe capturas de tela se relevante

**Issues:** [GitHub Issues](https://github.com/ArthurHenrique-eng/LUMORA-APP)

### Solicitar Features

- Use a label `enhancement`
- Descreva o caso de uso
- Explique o benefício

---

<div align="center">
<h3 id="contato"> Contato </h3> 
</div>

<p align="center">
  <a href="https://www.linkedin.com/in/arthur-barbosa-38564b371/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://github.com/ArthurHenrique-eng">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="mailto:arthurhpb7@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
</p>

---

<div align="center">
<h3 id="licenca">  </h3> 
</div>

![Licença do Projeto](/md/img/licenca_MIT_lumora.png)


---
