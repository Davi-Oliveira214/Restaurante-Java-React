# Frontend — React

Interface web do projeto, localizada em `front-end`. A aplicação usa React 19.2.8, React Router 8.3.1, Vite 8.2.2, Axios, Tailwind CSS 4.3.3, `@tabler/icons-react` e `@dev.icons/react`.

## Execução

Defina a URL base usada pelo Axios em `front-end/.env.local`:

```bash
VITE_API_URL=http://localhost:8080/api
```

Depois instale as dependências e inicie o Vite:

```bash
npm ci
npm run dev
```

Scripts existentes em `package.json`:

- `npm run dev`: inicia o servidor de desenvolvimento do Vite.
- `npm run build`: gera o build de produção.
- `npm run preview`: serve localmente o build gerado.

Não há script `start`, `test` ou `eject` declarado no `package.json` atual.

## Inicialização e rotas

`src/index.jsx` importa `index.css`, cria a raiz React em `#root`, envolve a aplicação com `React.StrictMode` e usa `RouterProvider` com o router de `src/routers/index.jsx`.

A árvore de rotas é:

| Rota | Componente | Descrição |
| --- | --- | --- |
| `/` | `HomePage` dentro de `App` | Página inicial. |
| `/auth` | `Auth` | Layout da autenticação. |
| `/auth/login` | `Login` | Formulário de login. |
| `/auth/cadastro` | `Cadastro` | Formulário de cadastro. |
| `/agendamento` | `Agendamento` | Lista e criação de reservas do usuário. |

`App` envolve as rotas filhas com `AuthProveider` e renderiza `Header` e `Outlet`.

## Organização de componentes

```text
src/
├── App.jsx
├── components/Header.jsx
├── context/AuthContext.jsx
├── data/apresentacao.js
├── pages/
│   ├── auth/
│   │   ├── index.jsx
│   │   └── components/FormsAuth.jsx
│   ├── home/
│   │   ├── HomePage.jsx
│   │   └── components/
│   │       ├── Banner.jsx
│   │       ├── Buttons.jsx
│   │       ├── Card.jsx
│   │       ├── CardDetalhes.jsx
│   │       ├── Carrossel.jsx
│   │       └── Hero.jsx
│   └── scheduling/
│       ├── index.jsx
│       └── cardAgendar/
│           ├── CardAgenda.jsx
│           └── components/
├── routers/index.jsx
├── services/API.js
└── index.css
```

## Gerenciamento de estado e autenticação

`AuthContext.jsx` cria `AuthContext` e o `AuthProveider`. O estado `auth` é inicializado a partir de `localStorage.getItem('@App:user_token')`; o provider expõe `auth` e `setAuth`.

O formulário `Login` chama `POST /auth/login` com `email` e `password`. Em caso de sucesso, salva o token em `@App:user_token`, atualiza o contexto e navega para `/`. O `Header` usa o valor de `auth` para alternar os itens de login/cadastro pelos itens de agenda e logout. O logout remove o token local e define `auth` como nulo.

O formulário `Cadastro` valida no cliente se `password` e `repeat_password` são iguais e chama `POST /auth/register` com `nome`, `email`, `password` e `repeat_password`. As mensagens de sucesso ou erro são exibidas no próprio formulário.

A autenticação não usa interceptor Axios: cada componente que chama uma rota protegida envia manualmente `Authorization: Bearer ${token}`.

## Serviço Axios

`src/services/API.js` cria uma instância Axios com:

- `baseURL: import.meta.env.VITE_API_URL`;
- timeout de 10 segundos;
- header padrão `Content-Type: application/json`.

Não há fallback no código para `VITE_API_URL`.

## Página inicial

`HomePage` renderiza `Hero` e uma grade de cards de apresentação carregados de `data/apresentacao.js`.

`Hero` combina:

- `Banner`, que usa `banner.png` e apresenta o texto de boas-vindas;
- `Carrossel`, que chama `GET /pratos` e cria cards duplicados para o efeito de rolagem contínua.

`Card` recebe nome, descrição, preço e data. Exibe a imagem `banner.png`, abre `CardDetalhes` em um portal ao clicar em “Detalhes” e mostra “Agendar”. `Agendar` envia usuários autenticados para `/agendamento` e usuários não autenticados para `/auth/login`.

As informações extras exibidas em `CardDetalhes` — como `~45 min`, `1 pessoa` e `820 kcal` — estão fixas no componente e por enquanto não vêm da API.

## Autenticação

`pages/auth/index.jsx` fornece o layout visual com `fundo_auth.png`, abas para login/cadastro e `Outlet`. `FormsAuth.jsx` contém:

- `Login`, com e-mail, senha, envio para a API e mensagem de erro;
- `Cadastro`, com nome, e-mail, senha, confirmação e mensagem de resultado;
- componentes internos para campos, botão, separador e mensagens.

## Agendamentos

`pages/scheduling/index.jsx` carrega os agendamentos do usuário com:

```text
GET /agendamento/meus_agendamentos
Authorization: Bearer <token>
```

Os resultados são renderizados por `CardSobreEvento`, que diferencia agendamentos anteriores e futuros, exibe status, data, horário e mesa e oferece editar/cancelar para reservas futuras não canceladas.

### Criação

`CardAgenda.jsx` controla o fluxo em etapas:

1. `Calendario`: data a partir do dia atual.
2. `TempoAgendamento`: 1h, 1h30, 2h, 2h30 ou 3h.
3. `Mesas`: lista de mesas obtida por `GET /mesa`.
4. `Horarios`: horários obtidos por `GET /agendamento/horarios/{id}?data={data}&duracao={duracao}`.
5. `CardAgendaFinal`: envia a reserva por `POST /agendamento` com `data`, `duracao` e o id da `mesa`.

A criação, edição e consulta de horários enviam o token manualmente no header Authorization. Após criação bem-sucedida, `CardAgendaFinal` exibe a confirmação e recarrega a página após a contagem regressiva implementada no componente.

### Edição e cancelamento

`CardEditar` envia `PUT /agendamento/{agendamentoId}` com data, duração e id da mesa. `CardCancelar` confirma a ação visualmente; `CardSobreEvento` envia `PATCH /agendamento/cancelar/{agendamentoId}` e atualiza o status mostrado.

## Estilos e assets

`index.css` importa Tailwind CSS, define cores e animações customizadas no bloco `@theme`, cria utilitários usados pelos componentes e estiliza o elemento `#root`. Os assets visuais estão em `src/assets/imgs/`, incluindo `banner.png` e `fundo_auth.png`. O plugin `@tailwindcss/vite` é configurado em `vite.config.js`.

## Integração com o backend

As chamadas usadas pelo frontend são:

| Componente | Método e rota |
| --- | --- |
| `FormsAuth.jsx` | `POST /auth/login`, `POST /auth/register` |
| `Carrossel.jsx` | `GET /pratos` |
| `Mesas.jsx` | `GET /mesa` |
| `Agendamento/index.jsx` | `GET /agendamento/meus_agendamentos` |
| `Horarios.jsx` | `GET /agendamento/horarios/{mesa_id}` com `data` e `duracao` |
| `CardAgendaFinal.jsx` | `POST /agendamento` |
| `CardEditar.jsx` | `PUT /agendamento/{agendamentoId}` |
| `CardSobreEvento.jsx` | `PATCH /agendamento/cancelar/{agendamentoId}` |

Atualmente frontend ainda não implementa telas administrativas para pratos, mesas ou confirmação/cancelamento administrativo de agendamentos, embora esses endpoints já existam no backend.

## Observações sobre o código atual

Esta documentação não adiciona funcionalidades ao projeto. O frontend depende da variável `VITE_API_URL`, sem ela, a instância Axios não possui a base configurada.
