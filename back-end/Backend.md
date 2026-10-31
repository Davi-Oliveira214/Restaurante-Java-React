# Backend — API REST

API REST da aplicação de gestão de restaurante. O backend está em `back-end`, usa Java 25 e Spring Boot 4.1.0 e persiste os dados em PostgreSQL com Spring Data JPA/Hibernate.

## Arquitetura

O código está organizado pelo fluxo `controller → service → repository → entity`:

- `controller/`: expõe os endpoints HTTP e converte requests/responses.
- `services/`: concentra autenticação, validações e regras de negócio.
- `repository/`: interfaces Spring Data JPA e consultas SQL nativas de agendamento.
- `entity/`: entidades JPA `UsuarioEntity`, `PratoEntity`, `MesaEntity` e `AgendamentoEntity`.
- `records/request/`: records usados como entrada da API.
- `records/response/`: records usados nas respostas.
- `config/security/`: CORS, configuração stateless do Spring Security, filtro Bearer e JWT.
- `exceptions/` e `infra/`: exceções de domínio e tratamento global.

Fluxo de uma requisição protegida:

```text
HTTP + Authorization: Bearer <token>
        ↓
SecurityFilter → TokenProvider → UsuarioRepository
        ↓
Controller → Service → Repository/JPA → PostgreSQL
```

## Configuração

`src/main/resources/application.properties` define:

| Propriedade/variável | Valor padrão | Descrição |
| --- | --- | --- |
| `spring.datasource.url` / `DB_URL` | `jdbc:postgresql://localhost:5432/bd_restaurante` | Conexão JDBC |
| `spring.datasource.username` / `DB_USER` | `postgres` | Usuário do banco |
| `spring.datasource.password` / `DB_PASSWORD` | `senha` | Senha do banco |
| `app.cors.allowed-origins` / `CORS` | sem padrão | Origens aceitas pelo CORS |
| `app.jwt.key` / `JWT_KEY` | sem padrão | Chave HMAC do JWT |
| `app.expire.token` / `EXPIRE_TOKEN` | `120` | Expiração em minutos |
| `spring.jpa.hibernate.ddl-auto` | `update` | Atualização do schema |

O CORS permite `GET`, `POST`, `PUT`, `DELETE`, `PATCH` e `OPTIONS`, os headers `Authorization`, `Cache-Control` e `Content-Type`, e credenciais.

## Autenticação e autorização

`POST /api/auth/register` cria um usuário. O serviço verifica e-mail duplicado, exige senha com pelo menos cinco caracteres, letras maiúsculas, minúsculas e caracteres não brancos, confirma `repeat_password` e salva a senha com BCrypt. O usuário criado recebe a role `USER`.

`POST /api/auth/login` autentica por e-mail e senha através do `AuthenticationManager` e retorna `{ "token": "..." }`. O `TokenProvider` gera JWT com issuer igual a `restaurante`, subject igual ao e-mail e expiração configurável. O `SecurityFilter` lê o header `Authorization`, remove o prefixo `Bearer `, valida o token e carrega o usuário pelo e-mail.

Após cinco tentativas inválidas, o usuário é bloqueado por 16 minutos. O administrador recebe as authorities `ROLE_ADM` e `ROLE_USER`; os demais recebem `ROLE_USER`.

As regras do `SecurityConfig` são:

- `/api/auth/**`: público.
- `/api/usuario/**` e `/api/agendamento/**`: autenticado.
- `/api/adm/agendamento`: role `ADM`.
- `GET /api/mesa` e `GET /api/pratos`: públicos.
- Demais requisições: role `ADM`.

## Entidades e relacionamentos

### `UsuarioEntity`

Tabela `usuario`. Possui `id`, `nome`, `email` único, senha, contagem de tentativas, tempo de bloqueio, indicador de conta desbloqueada, role e data de criação. Mantém uma coleção de agendamentos.

### `PratoEntity`

Tabela `pratos`. Possui `id`, `nome`, `descricao`, `preco` e `criado_em`. O nome é consultado para impedir o cadastro de um prato duplicado.

### `MesaEntity`

Tabela `mesa`. Possui `id`, `codigo_mesa` único e `criado_em`. O código é usado pela interface para identificar a mesa.

### `AgendamentoEntity`

Tabela `agendamentos`. Possui data/hora, duração em minutos, mesa, usuário e status. O status é um `StatusAgendamento` e aparece nas respostas como texto. O agendamento começa como `AGUARDANDO`.

Os records de resposta usam, entre outros campos, `agendamentoId`, `userId`, `data`, `duracao`, `mesa` e `status`. Mesas usam `id`, `codigo_mesa` e `criado_em`; pratos usam `id`, `nome`, `descricao`, `preco` e `criado_em`.

## Endpoints

Todas as rotas abaixo incluem o prefixo `/api`.

### Autenticação

| Método | Rota | Acesso | Entrada/saída |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Público | Recebe `nome`, `email`, `password` e `repeat_password`; responde `201` sem corpo em caso de sucesso. |
| `POST` | `/auth/login` | Público | Recebe `email` e `password`; responde com `LoginResponse` contendo `token`. |

### Usuário autenticado

| Método | Rota | Acesso | Comportamento |
| --- | --- | --- | --- |
| `GET` | `/usuario` | Autenticado | Retorna nome, e-mail, role e data de criação do usuário do token. |
| `PUT` | `/usuario` | Autenticado | Atualiza nome e/ou e-mail quando os valores recebidos não são nulos ou vazios. |
| `DELETE` | `/usuario` | Autenticado | Remove o usuário autenticado. |

### Pratos

| Método | Rota | Acesso | Entrada/saída |
| --- | --- | --- | --- |
| `GET` | `/pratos` | Público | Lista os pratos; se não houver pratos, o service lança `PratoException`. |
| `GET` | `/pratos/{id}` | Role `ADM` pela regra geral | Retorna um prato. |
| `POST` | `/pratos` | Role `ADM` pela regra geral | Recebe `nome`, `descricao` e `preco`; impede nome já existente. |
| `PUT` | `/pratos/{id}` | Role `ADM` pela regra geral | Recebe um `PratoRecord` por `@RequestParam` e atualiza nome, descrição e preço. |
| `DELETE` | `/pratos/{id}` | Role `ADM` pela regra geral | Exclui e retorna o prato. |

A anotação `@RequestParam` no `PUT` é parte da implementação atual; ela não deve ser documentada como um JSON no corpo sem alteração do código.

### Mesas

| Método | Rota | Acesso | Entrada/saída |
| --- | --- | --- | --- |
| `GET` | `/mesa` | Público | Lista mesas com `id`, `codigo_mesa` e `criado_em`. |
| `POST` | `/mesa` | Role `ADM` pela regra geral | Recebe `codigo_mesa`; impede código duplicado. |
| `PUT` | `/mesa/{id}` | Role `ADM` pela regra geral | Atualiza o código da mesa. |
| `DELETE` | `/mesa/{id}` | Role `ADM` pela regra geral | Não permite excluir mesa que possua agendamentos. |

### Agendamentos do usuário

| Método | Rota | Acesso | Entrada/saída |
| --- | --- | --- | --- |
| `POST` | `/agendamento` | Autenticado | Recebe `data`, `duracao` e `mesa` como id; associa o agendamento ao usuário do token. Retorna `201`. |
| `GET` | `/agendamento/meus_agendamentos` | Autenticado | Lista os agendamentos do usuário autenticado. |
| `GET` | `/agendamento/{id}` | Autenticado | Consulta um agendamento somente se ele pertencer ao usuário autenticado. |
| `PUT` | `/agendamento/{id}` | Autenticado | Atualiza opcionalmente data, duração e mesa do próprio agendamento. |
| `PATCH` | `/agendamento/cancelar/{id}` | Autenticado | Marca o próprio agendamento como `CANCELADO`. |
| `GET` | `/agendamento/data/{numero_mesa}` | Autenticado | Recebe `data` como query parameter ISO e consulta agendamentos do usuário naquela mesa e data. |
| `GET` | `/agendamento/horarios/{mesa_id}` | Autenticado | Recebe `data` e `duracao`; calcula horários disponíveis entre 08:00 e 22:00. |

No cadastro de agendamento, o service verifica se a mesa existe e se há conflito. A duração usada na verificação inclui 15 minutos de intervalo. Agendamentos cancelados não entram na verificação de conflito. Na edição, a propriedade do agendamento também é verificada e o próprio id é excluído da consulta de conflito.

### Administração de agendamentos

O controller `AdmAgendamentoController` possui `@RequestMapping("/api/adm/agendamento")` e `@PreAuthorize("hasRole('ADM')")`:

| Método | Rota | Comportamento |
| --- | --- | --- |
| `GET` | `/adm/agendamento` | Lista todos os agendamentos. |
| `PATCH` | `/adm/agendamento/cancelar/{agendamentoId}` | Cancela agendamento futuro. |
| `PATCH` | `/adm/agendamento/confirmar/{agendamentoId}` | Confirma agendamento em `AGUARDANDO`. |
| `GET` | `/adm/agendamento/buscar/{agendamentoId}` | Busca agendamento por id. |

O cancelamento e a confirmação administrativas recusam agendamentos passados. A confirmação exige status `AGUARDANDO`.

## Regras de agendamento

- O agendamento é associado ao usuário autenticado, não a um usuário recebido no corpo.
- Uma mesa inexistente gera erro.
- Conflitos consideram a duração do agendamento mais 15 minutos.
- Agendamentos com status `CANCELADO` são ignorados na consulta de conflito.
- A consulta de horários considera a janela de 08:00 a 22:00 e retorna pares `inicio`/`fim`.
- O usuário só pode consultar, editar ou cancelar seus próprios agendamentos.
- O service administrativo pode confirmar ou cancelar agendamentos.

## Tratamento de erros

`GlobalException` trata `RestauranteException` e produz um corpo `BodyException` com `error`, `message` e `status`. Exceções não tratadas são convertidas em resposta HTTP 500. As classes específicas incluem `UsuarioException`, `PratoException`, `MesaException`, `AgendamentoException` e exceções relacionadas ao token.

## Execução

Com PostgreSQL disponível e as variáveis configuradas:

```bash
cd back-end
bash mvnw spring-boot:run
```

O `pom.xml` declara Java 25, starters de Web MVC, JPA, Validation e Security, o driver PostgreSQL, DevTools e `java-jwt`.
