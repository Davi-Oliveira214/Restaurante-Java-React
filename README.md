# Restaurante Java + React

[![Java](https://img.shields.io/badge/Java-25-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/technologies/javase/jdk25-archive-downloads.html)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=20232A)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-supported-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-n%C3%A3o%20especificada-lightgrey.svg)](#licença)

Aplicação full stack para apoiar a operação de um restaurante. O repositório é organizado como um monorepo simples, com uma API REST desenvolvida em Java e Spring Boot e uma interface web desenvolvida em React e Vite.

O backend já implementa cadastro e login de usuários, consulta de perfil, CRUD de pratos e agendamento de mesas com verificação de conflitos de horário. O frontend contém a estrutura visual inicial da página principal, com cabeçalho, banner e carrossel de pratos. Algumas integrações e ações da interface ainda estão em desenvolvimento; as limitações conhecidas estão descritas neste documento.

## Funcionalidades

### Backend

- Cadastro de usuários com e-mail único.
- Login por e-mail e senha.
- Consulta dos dados públicos de um usuário e de seus agendamentos.
- Criação, consulta, edição e exclusão de pratos.
- Criação, consulta, edição e cancelamento de agendamentos.
- Consulta de agendamentos por usuário, identificador, data e número da mesa.
- Verificação de conflito entre agendamentos da mesma mesa. O serviço considera a duração informada e acrescenta um intervalo de 15 minutos entre reservas.
- Verificação de propriedade antes de editar, consultar ou cancelar um agendamento individual.
- Persistência com Spring Data JPA e Hibernate em PostgreSQL.
- Tratamento global de exceções da API e configuração de CORS por variável de ambiente.

### Frontend

- Página inicial composta por cabeçalho, banner de boas-vindas e área de pratos.
- Menu visual com as opções de início, cadastro e login.
- Componentes reutilizáveis para cartões de prato, botões e carrossel.
- Estilização com CSS Modules e Tailwind CSS.
- Cliente HTTP baseado em Axios.

> **Escopo atual:** embora a API possua recursos de autenticação e agendamento, o frontend ainda não implementa as telas e fluxos completos de cadastro, login e reserva. Os botões “Detalhes” e “Agendar” são componentes visuais sem ação de negócio conectada.

## Tecnologias

| Camada | Tecnologias utilizadas |
| --- | --- |
| Backend | Java 25, Spring Boot 4.1.0, Spring MVC, Spring Data JPA, Hibernate, Bean Validation e Maven Wrapper |
| Frontend | React 19.2.8, React DOM, Vite 8.2.2, React Router, Axios e Tailwind CSS 4 |
| Banco de dados | PostgreSQL |
| Comunicação | API REST sobre HTTP e JSON |
| Estilo | CSS Modules e Tailwind CSS |

## Arquitetura e estrutura do projeto

O projeto usa duas aplicações independentes dentro do mesmo repositório. O frontend faz requisições HTTP para o backend, que delega as operações aos serviços e repositórios JPA antes de persistir os dados no PostgreSQL.

```text
.
├── back-end/
│   ├── pom.xml
│   ├── mvnw
│   └── src/main/
│       ├── java/com/davi/restaurante/
│       │   ├── config/          # Configuração de CORS
│       │   ├── controller/      # Endpoints REST
│       │   ├── entity/          # Entidades JPA
│       │   ├── exceptions/      # Exceções de domínio
│       │   ├── infra/           # Tratamento global de erros
│       │   ├── records/         # DTOs de entrada e saída
│       │   ├── repository/      # Repositórios Spring Data
│       │   └── services/        # Regras de negócio
│       └── resources/
│           └── application.properties
└── front-end/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── assets/              # Imagens e ícones
        ├── components/          # Componentes reutilizáveis
        ├── css/                 # CSS Modules
        ├── pages/               # Páginas
        └── services/            # Cliente HTTP
```

O fluxo principal pode ser resumido da seguinte forma:

```text
React/Vite → Axios → Spring MVC → Services → Spring Data JPA/Hibernate → PostgreSQL
```

## Pré-requisitos

Instale os seguintes componentes antes de executar o projeto:

- Git.
- JDK 25, porque o `pom.xml` define `<java.version>25</java.version>`.
- Node.js 22.22.0 ou superior. A versão do `react-router` declarada no projeto exige Node.js `>=22.22.0`.
- npm, distribuído com o Node.js.
- PostgreSQL acessível localmente ou por uma URL de conexão.

O Maven não precisa ser instalado separadamente: o backend inclui o Maven Wrapper em `back-end/mvnw` e `back-end/mvnw.cmd`.

## Configuração do banco de dados

Por padrão, o backend tenta usar a seguinte conexão:

```text
URL:      jdbc:postgresql://localhost:5432/bd_restaurante
Usuário:  postgres
Senha:    senha
```

Crie o banco de desenvolvimento ou ajuste as variáveis para refletir a configuração da sua máquina:

```bash
createdb -U postgres bd_restaurante
```

As propriedades de conexão podem ser sobrescritas pelas variáveis abaixo:

| Variável | Obrigatória | Valor padrão | Descrição |
| --- | --- | --- | --- |
| `DB_URL` | Não | `jdbc:postgresql://localhost:5432/bd_restaurante` | URL JDBC do PostgreSQL |
| `DB_USER` | Não | `postgres` | Usuário do banco |
| `DB_PASSWORD` | Não | `senha` | Senha do usuário |
| `CORS` | Sim para o frontend | sem valor padrão | Origem permitida para requisições CORS, por exemplo `http://localhost:5173` |

> **Atenção:** `spring.jpa.hibernate.ddl-auto=create-drop` está configurado no projeto. As tabelas são recriadas quando a aplicação inicia e removidas quando ela é encerrada. Esse comportamento é adequado apenas para desenvolvimento e pode apagar os dados existentes.

A entidade `MesaEntity` possui tabela e repositório, mas não existe endpoint REST para cadastrar mesas. Antes de testar agendamentos, insira mesas no banco depois que o schema for criado pela aplicação:

```sql
INSERT INTO mesa (numero_mesa) VALUES (1), (2), (3);
```

## Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/Davi-Oliveira214/Restaurante-Java-React.git
cd Restaurante-Java-React
```

### 2. Iniciar o backend

Abra um terminal na pasta `back-end`, configure o acesso ao banco e a origem do frontend:

```bash
cd back-end

export DB_URL='jdbc:postgresql://localhost:5432/bd_restaurante'
export DB_USER='postgres'
export DB_PASSWORD='sua-senha-do-postgres'
export CORS='http://localhost:5173'

# O comando com bash funciona mesmo se o arquivo mvnw não tiver permissão de execução.
bash mvnw spring-boot:run
```

Em Linux ou macOS, também é possível tornar o wrapper executável e usá-lo diretamente:

```bash
chmod +x mvnw
./mvnw spring-boot:run
```

No Windows, use o prompt de comando ou PowerShell:

```powershell
cd back-end
$env:DB_URL = "jdbc:postgresql://localhost:5432/bd_restaurante"
$env:DB_USER = "postgres"
$env:DB_PASSWORD = "sua-senha-do-postgres"
$env:CORS = "http://localhost:5173"
.\mvnw.cmd spring-boot:run
```

A API fica disponível, por padrão, em `http://localhost:8080`.

### 3. Instalar e iniciar o frontend

Em outro terminal, execute:

```bash
cd front-end
npm ci
npm run dev
```

O Vite disponibiliza a aplicação, por padrão, em `http://localhost:5173`.

Para gerar e validar a versão de produção:

```bash
npm run build
npm run preview
```

## Endpoints da API

A URL base da API é `http://localhost:8080/api`.

### Autenticação e usuários

| Método | Rota | Corpo ou parâmetros | Resultado |
| --- | --- | --- | --- |
| `POST` | `/auth/cadastro` | JSON com `nome`, `email` e `senha` | Cria o usuário e retorna `id`, `nome` e `email` |
| `POST` | `/auth/login` | JSON com `email` e `senha` | Valida as credenciais e retorna `id`, `nome` e `email` |
| `GET` | `/auth/{id}` | `id` do usuário na URL | Retorna o usuário e seus agendamentos |

Exemplo de cadastro:

```bash
curl -X POST http://localhost:8080/api/auth/cadastro \
  -H 'Content-Type: application/json' \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@example.com",
    "senha": "senha-de-desenvolvimento"
  }'
```

A resposta de cadastro e login não contém token JWT. O backend valida a senha usando SHA-256 e retorna apenas os dados básicos do usuário.

### Pratos

| Método | Rota | Corpo ou parâmetros | Resultado |
| --- | --- | --- | --- |
| `POST` | `/pratos` | JSON com `nome`, `descricao` e `preco` | Cria um prato |
| `GET` | `/pratos` | Nenhum | Lista os pratos |
| `GET` | `/pratos/{id}` | `id` do prato na URL | Retorna um prato |
| `PUT` | `/pratos/{id}` | Na implementação atual, `nome`, `descricao` e `preco` são recebidos como parâmetros da requisição | Atualiza um prato |
| `DELETE` | `/pratos/{id}` | `id` do prato na URL | Exclui e retorna o prato |

Exemplo de criação:

```bash
curl -X POST http://localhost:8080/api/pratos \
  -H 'Content-Type: application/json' \
  -d '{
    "nome": "Risoto de cogumelos",
    "descricao": "Risoto cremoso com cogumelos frescos",
    "preco": 42.90
  }'
```

A rota de edição está implementada com `@RequestParam` no controller. Portanto, o formato atualmente esperado é semelhante a:

```bash
curl -X PUT 'http://localhost:8080/api/pratos/1?nome=Risoto%20especial&descricao=Com%20parmesao&preco=49.90'
```

### Agendamentos

| Método | Rota | Corpo ou parâmetros | Resultado |
| --- | --- | --- | --- |
| `POST` | `/agendamento` | JSON com `userId`, `data`, `duracao` e `mesa.numero_mesa` | Cria um agendamento |
| `PUT` | `/agendamento/{id}` | Mesmo JSON usado na criação | Edita um agendamento do próprio usuário |
| `DELETE` | `/agendamento/{userId}/{id}` | Usuário e agendamento na URL | Cancela um agendamento do próprio usuário |
| `GET` | `/agendamento` | Nenhum | Lista todos os agendamentos |
| `GET` | `/agendamento/{userId}` | Usuário na URL | Lista os agendamentos do usuário |
| `GET` | `/agendamento/{userId}/{id}` | Usuário e agendamento na URL | Consulta um agendamento do próprio usuário |
| `GET` | `/agendamento/{userId}/data/{numero_mesa}?data=AAAA-MM-DD` | Usuário, número da mesa e data ISO | Filtra os agendamentos do usuário para uma mesa e data |

O campo `data` usa o formato ISO de data e hora aceito pelo `LocalDateTime`, por exemplo `2026-10-15T19:00:00`. O campo `duracao` representa a duração em minutos.

Exemplo de criação de agendamento:

```bash
curl -X POST http://localhost:8080/api/agendamento \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": 1,
    "data": "2026-10-15T19:00:00",
    "duracao": 90,
    "mesa": {
      "numero_mesa": 1
    }
  }'
```

Uma resposta de agendamento possui este formato geral:

```json
{
  "userId": 1,
  "agendamentoId": 10,
  "data": "2026-10-15T19:00:00",
  "duracao": 90,
  "mesa": {
    "id": 1,
    "numero_mesa": 1
  }
}
```

## Integração atual do frontend

O frontend usa Axios em `front-end/src/services/API.js`. Há uma divergência que deve ser corrigida antes de considerar o carrossel integrado ao backend:

- O backend expõe a listagem de pratos em `GET /api/pratos`.
- A função `getPratos()` atualmente faz uma requisição para `GET http://localhost:8080/api`.
- Não existe um endpoint `GET /api` no backend, portanto a chamada atual pode retornar `404`.

Uma forma de alinhar a implementação é manter a base da API e acrescentar o recurso na chamada:

```js
import axios from 'axios'

const URL_API = 'http://localhost:8080/api'

export async function getPratos() {
  const response = await axios.get(`${URL_API}/pratos`)
  return response.data
}
```

Nesse caso, o componente `Carrossel` também deve consumir diretamente o array retornado, em vez de acessar `res.data` novamente.

## Tratamento de erros

As exceções de domínio são tratadas por `GlobalException`, que retorna um corpo com status HTTP e mensagem. A estrutura geral é semelhante a:

```json
{
  "status": 404,
  "message": "Mensagem do erro"
}
```

Erros não tratados também são convertidos em resposta `500`. As mensagens e os códigos exatos dependem da exceção lançada pelo serviço e do estado dos dados no banco.

## Validação local

A instalação das dependências do frontend e o comando `npm run build` foram validados com sucesso neste ambiente. O Maven Wrapper foi reconhecido corretamente, mas o ambiente de validação utilizava Java 21, enquanto o projeto exige Java 25; por isso, a compilação do backend deve ser executada com JDK 25. A execução completa também depende de um PostgreSQL configurado e da variável `CORS` definida.

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch com uma finalidade específica, por exemplo `feat/fluxo-de-login` ou `fix/listagem-de-pratos`.
3. Implemente a alteração mantendo a separação entre controller, service, repository e records no backend.
4. Execute `npm run build` no frontend e `bash mvnw test` no backend usando JDK 25.
5. Atualize a documentação quando modificar endpoints, variáveis de ambiente ou comandos de execução.
6. Abra um pull request descrevendo o problema, a solução e os testes realizados.

## Licença

Não há um arquivo `LICENSE` nem uma licença declarada nos metadados do repositório. Até que uma licença seja adicionada pelos mantenedores, os direitos autorais permanecem reservados. Se o projeto for destinado a reutilização pública, escolha e adicione uma licença compatível com a intenção do autor.

## Referências

[1]: https://spring.io/projects/spring-boot "Spring Boot"
[2]: https://react.dev/ "React"
[3]: https://vite.dev/ "Vite"
[4]: https://www.postgresql.org/docs/ "PostgreSQL Documentation"
