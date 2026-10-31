# Restaurante Java + React

Aplicação web para gestão de restaurante, organizada como um repositório com duas aplicações: uma API REST em Java/Spring Boot e uma interface web em React/Vite. O backend oferece autenticação de usuários, gestão de pratos e mesas, criação e consulta de agendamentos e operações administrativas sobre agendamentos. O frontend apresenta a página inicial, autenticação e o fluxo de reservas do usuário.

## Tecnologias

- **Backend:** Java 25, Spring Boot 4.1.0, Spring MVC, Spring Data JPA, Hibernate, Spring Security, Bean Validation, JWT (`java-jwt`) e Maven.
- **Banco:** PostgreSQL.
- **Frontend:** React 19.2.8, React DOM, React Router 8.3.1, Axios e Vite 8.2.2.
- **Estilos e ícones:** Tailwind CSS 4.3.3 com plugin do Vite e `@tabler/icons-react`.

## Estrutura

```text
.
├── back-end/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/davi/restaurante/
│       │   ├── config/security/  # JWT e Spring Security
│       │   ├── controller/       # Controllers REST
│       │   ├── entity/           # Entidades JPA
│       │   ├── exceptions/       # Exceções da aplicação
│       │   ├── infra/            # Tratamento global de erros
│       │   ├── records/          # Requests e responses
│       │   ├── repository/       # Repositórios JPA
│       │   └── services/         # Regras de negócio
│       └── resources/application.properties
└── front-end/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/           # Componentes compartilhados
        ├── context/              # Contexto de autenticação
        ├── pages/                # Home, autenticação e agendamento
        ├── routers/              # Rotas React Router
        └── services/             # Instância Axios
```

## Pré-requisitos

- JDK 25, conforme definido em `back-end/pom.xml`.
- Node.js e npm compatíveis com as dependências do frontend.
- PostgreSQL acessível.
- Git.

O backend inclui o Maven Wrapper em `back-end/mvnw` e `back-end/mvnw.cmd`.

## Configuração

O backend lê as variáveis abaixo:

| Variável | Padrão | Uso |
| --- | --- | --- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/bd_restaurante` | URL JDBC do PostgreSQL |
| `DB_USER` | `postgres` | Usuário do banco |
| `DB_PASSWORD` | `senha` | Senha do banco |
| `CORS` | sem padrão | Origem permitida pelo CORS |
| `JWT_KEY` | sem padrão | Chave usada para assinar tokens JWT |
| `EXPIRE_TOKEN` | `120` | Expiração do token em minutos |

O JPA está configurado com `spring.jpa.hibernate.ddl-auto=update`, exibe o SQL e formata as consultas. A API usa a porta padrão `8080` quando nenhuma porta diferente é configurada.

O frontend usa `import.meta.env.VITE_API_URL` como base da instância Axios. Crie `front-end/.env.local`, por exemplo:

```bash
VITE_API_URL=http://localhost:8080/api
```

## Como executar

### Backend

```bash
cd back-end
export DB_URL='jdbc:postgresql://localhost:5432/bd_restaurante'
export DB_USER='postgres'
export DB_PASSWORD='sua-senha'
export CORS='http://localhost:5173'
export JWT_KEY='uma-chave-de-desenvolvimento'
export EXPIRE_TOKEN='120'
bash mvnw spring-boot:run
```

O uso de `bash mvnw` é indicado porque o arquivo `mvnw` versionado não possui permissão de execução. No Windows, use `mvnw.cmd` e defina as mesmas variáveis no PowerShell ou no Prompt de Comando.

### Frontend

Em outro terminal:

```bash
cd front-end
npm ci
npm run dev
```

O Vite normalmente disponibiliza a interface em `http://localhost:5173`. Para gerar e visualizar a versão de produção:

```bash
npm run build
npm run preview
```

## API e documentação complementar

A API usa o prefixo `/api`. As rotas de autenticação são públicas; operações de usuário e agendamento exigem autenticação Bearer; operações administrativas exigem a role `ADM`. As consultas de pratos e mesas são públicas nos métodos GET. A lista completa de controllers, entidades, regras e endpoints está em [`back-end/README.md`](back-end/README.md).

A estrutura do frontend, suas páginas, componentes, contexto de autenticação e chamadas Axios está descrita em [`front-end/README.md`](front-end/README.md).

## Observações do código atual

Esta documentação descreve somente o código existente. A aplicação depende de `VITE_API_URL`, `JWT_KEY` e `CORS` para funcionar conforme configurada.