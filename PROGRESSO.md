# PROGRESSO — Qual a Boa

> Arquivo de controle do projeto. Deve ser lido no início de cada sessão e atualizado ao final de cada etapa.
> Última atualização: 2026-10-18

---

## Status atual

- **Fase:** Etapa 2 em andamento. Sub-etapa **2a (navegação)** implementada e testada no iPhone em 2026-10-18, **ainda sem commit**.
- **Ao retomar:** 1) praticar o ciclo do Git com o [guia](docs/guia-git.md) fazendo o commit da 2a (`feat(mobile): adiciona navegação com abas e tela de local`); 2) seguir para a 2b (tipos, dados mock, regras e Jest).
- **Sub-etapas da Etapa 2:** 2a navegação (abas JS `expo-router/js-tabs` + Stack + `venue/[id]`) ✅ · 2b tipos, mocks, lógica pura (`lib/`), services e Jest ⏳ · 2c feed com FlatList e VenueCard ⏳ · 2d tela do local e perfil ⏳
- **Pasta do projeto:** `Documentos\Qual a Boa`
- **Repositório:** https://github.com/BrenoFMoreira/qual-a-boa (público, branch `main`)
- **Ambiente do usuário:** Windows 11 (usa o Prompt de Comando/cmd); Node.js v24.21.0; Git 2.56.0; VS Code; iPhone com Expo Go (SDK 57) e login na conta Expo; terminal do VS Code (PowerShell)

---

## Stack (✅ aprovada em 2026-09-30 — opção A)

| Camada | Escolha | Por quê |
|---|---|---|
| App mobile | **React Native + Expo**, com **TypeScript** | Gera app nativo para Android e iOS com um só código; testa no celular pelo app Expo Go, sem instalar Android Studio/Xcode; TypeScript avisa erros antes de rodar |
| Backend | **Supabase** (API gerada automaticamente + funções no banco) | Login, API e banco prontos; ainda assim aprendemos HTTP, SQL e segurança de verdade |
| Banco de dados | **PostgreSQL** (dentro do Supabase) | Banco relacional padrão de mercado; SQL é conhecimento que vale para qualquer empresa |
| Segurança dos dados | **RLS** (Row Level Security) do Postgres | Regras de "quem pode ler/escrever o quê" ficam no próprio banco |
| Testes | **Jest** + **React Native Testing Library** (app); testes SQL para as funções do banco | Ferramentas padrão do ecossistema |
| Versionamento | **Git** + **GitHub** | Portfólio e histórico do projeto |

Alternativas consideradas: Flutter + Firebase; Kotlin/Swift nativos + backend próprio (Node.js + Express + PostgreSQL). Ver justificativa na conversa de planejamento.

---

## MVP (Produto Mínimo Viável)

**Dentro do MVP:**
1. Cadastro e login com e-mail e senha; perfil com nome de usuário.
2. Lista de locais (bares/baladas) de uma cidade, cadastrados por nós (seed).
3. Feed "Qual a boa agora": locais ordenados por quantidade de posts ativos.
4. Post "tá rolando" num local: nível de animação (1–3) + comentário curto opcional.
5. Posts expiram automaticamente depois de 2 horas.
6. Check-in com geolocalização: o post só vale se o usuário estiver a até 100 m do local. Localização lida **só no momento do post**, nunca em segundo plano, e as coordenadas **não são salvas**.
7. Gamificação: pontos por check-in, níveis, streak semanal, títulos desbloqueáveis ("rei da noite", "rainha baladeira", "inimigo do fim") e **títulos secretos (easter eggs)**.
8. Tela de perfil com pontos, nível, streak e título escolhido.
9. **Mapa** com os locais e indicação de quais estão "rolando" (adicionado pelo usuário em 2026-09-30; solução gratuita).

**Fora do MVP (futuro):** fotos nos posts, seguir amigos, comentários, notificações push, atualização em tempo real, usuários cadastrando locais, estabelecimentos pagando para postar, publicação nas lojas.

### Regras de negócio (✅ decididas em 2026-09-30)
- [x] Duração do post: **2 horas**.
- [x] Raio do check-in: **100 metros**.
- [x] Streak: **semanal** (semanas seguidas com pelo menos 1 check-in válido).
- [x] Anti-spam: **no máximo 2 posts por local a cada 2 horas, por usuário**.
- [x] Cidade dos locais de exemplo: **Belo Horizonte (MG)**.
- [x] Títulos: o usuário **escolhe** qual exibir entre os que já desbloqueou. Além dos títulos por nível, haverá **títulos secretos (easter eggs)** desbloqueados por ações específicas. A lista de easter eggs será definida pelo usuário antes da Etapa 9.

### Decisão técnica: mapa gratuito
- Biblioteca: `react-native-maps`. Funciona no Expo Go durante o desenvolvimento, sem custo.
- Para um app instalável próprio, há duas opções gratuitas: Google Maps SDK (uso em apps mobile sem cobrança, mas exige conta no Google Cloud com cartão cadastrado) ou MapLibre + mapas do OpenStreetMap (sem cartão, mas com configuração mais complexa). A escolha fica para a Etapa 10.

---

## Etapas do MVP

| # | Etapa | Conceitos principais | Agentes/ferramentas | Status |
|---|---|---|---|---|
| 0 | Preparação do ambiente (Node, Git, VS Code, Expo Go, conta GitHub, repositório) | terminal, Git, dependências | — | ✅ Concluída (2026-10-02) |
| 1 | Criar o app Expo e rodar no celular; estrutura de pastas | projeto JS/TS, arquivos, componentes | Plan, revisão | ✅ Concluída (2026-10-18) |
| 2 | Navegação e telas com dados falsos (Feed, Local, Perfil) | componentes, props, estado, listas | Plan, testes, revisão | 🔄 Em andamento (2a feita) |
| 3 | Banco de dados: projeto Supabase, tabela de locais, seed | banco relacional, tabelas, SQL, migrações, RLS | Plan, segurança, revisão | ⏳ Pendente |
| 4 | Conectar o app ao banco: listar locais reais | API, HTTP, requisição, async/await, variáveis de ambiente | Plan, testes, revisão | ⏳ Pendente |
| 5 | Cadastro, login e perfil | autenticação, sessão, tokens, RLS por usuário | Plan, segurança, testes, revisão | ⏳ Pendente |
| 6 | Postar "tá rolando" + expiração + feed ranqueado | relacionamentos (chave estrangeira), datas, consultas com filtro | Plan, segurança, testes, revisão | ⏳ Pendente |
| 7 | Check-in com geolocalização (validação no servidor) | permissões, cálculo de distância, função no banco, privacidade | Plan, segurança, testes, revisão | ⏳ Pendente |
| 8 | Gamificação I: pontos e níveis | regras de negócio no servidor, triggers | Plan, testes, revisão | ⏳ Pendente |
| 9 | Gamificação II: streak, títulos e tela de perfil | lógica com datas, desbloqueios | Plan, testes, revisão | ⏳ Pendente |
| 10 | Mapa com os locais e quais estão "rolando" | bibliotecas nativas, coordenadas, marcadores | Plan, revisão | ⏳ Pendente |
| 11 | Polimento para portfólio: loading/erros, visual, README com prints e GIF | UX, documentação | revisão | ⏳ Pendente |

---

## Registro

### Etapas concluídas
- **Etapa 0 — Preparação do ambiente (2026-10-02):** ferramentas verificadas; Git configurado (nome e e-mail); repositório criado com `git init -b main`; arquivos `.gitignore`, `README.md`, `CLAUDE.md` e `PROGRESSO.md` criados; primeiro commit (`cf4f704`) enviado ao GitHub.
- **Etapa 1 — App Expo rodando no iPhone (2026-10-18):** projeto criado em `mobile/` com `create-expo-app` (template `default@sdk-57`, sem git aninhado, `--no-agents-md`); exemplo removido com `reset-project`; `app.json` com nome "Qual a Boa", slug `qual-a-boa` e scheme `qualaboa`; tela inicial (`src/app/index.tsx`) e layout com `Stack` sem cabeçalho (`src/app/_layout.tsx`).

### Funcionalidades implementadas
- Tela de boas-vindas "Qual a Boa 🍻" (fundo roxo, título e subtítulo), rodando no iPhone via Expo Go.

### Testes realizados e resultados
- Etapa 0: `node --version` → v24.21.0 ✅; `git --version` → 2.56.0 ✅; `git push -u origin main` concluído e repositório conferido no navegador (4 arquivos e README renderizado) ✅.
- Etapa 1: app aberto no iPhone pelo Expo Go ✅; Fast Refresh testado com edição feita pelo usuário ✅; `npx tsc --noEmit` sem erros ✅; `npx expo-doctor@latest` 21/21 checks ✅; `/code-review` (nível low) sem apontamentos ✅. Testes automatizados (Jest) ficaram para a Etapa 2, de propósito.

### Conceitos já aprendidos
- **Etapa 0:** terminal e comandos (`cd`, aspas em caminhos com espaço); Git (repositório, `git init`, `git status`, `git add`, `git commit`, Conventional Commits); `.gitignore` e por que segredos não vão para o Git; GitHub (remote, `origin`, `git remote add/set-url/-v`, `git push -u`, diferença entre push e pull); ler mensagens de erro; diferença entre warning e error (avisos LF/CRLF são inofensivos).
- **Etapa 1:** npx; create-expo-app e templates; SDK e compatibilidade com o Expo Go; dependências (`package.json`, `package-lock.json`, `node_modules`); por que não rodar `npm audit fix --force`; scripts do npm (`npm run`); Metro e Fast Refresh; reload (`r`) e `--clear`; estrutura de um componente (import, função, return com JSX, StyleSheet); `View`, `Text`, `StatusBar`; cores hexadecimais; expo-router (arquivo = tela) e `Stack`; diferença entre menu do editor e comando do terminal; `tsc --noEmit` e `expo-doctor`.

### Problemas conhecidos / observações
- Os agentes do ECC (planejamento, revisão, testes, segurança) **não foram encontrados** nesta sessão. Substitutos disponíveis: agente `Plan` (planejamento), `/code-review` (revisão), `/security-review` (segurança); testes serão escritos diretamente.
- Limitação conhecida (MVP): a localização vem do celular e pode ser falsificada por apps de GPS falso. Aceitável para portfólio; registrar no README.
- Erros resolvidos na Etapa 0 (para referência): remote cadastrado com o link de exemplo (`SEU-USUARIO`), corrigido com `git remote set-url`; `Repository not found` porque o repositório ainda não tinha sido criado no site.
- Erros resolvidos na Etapa 1: celular não atualizava após salvar → reload (`r`); erros `[runtime not ready]` (ExpoAsset/ExponentConstants/"main" not registered) após um reload → temporários, resolvidos com `npx expo start --clear`.
- ⚠️ Atualização futura: quando o Expo Go da App Store passar para o SDK 58, o projeto (SDK 57) deixará de abrir no iPhone. Correção: `npx expo install expo@^58.0.0 --fix` e `npx expo-doctor@latest` (ler as mudanças do SDK 58 antes).
- Imagens de exemplo do template (react-logo, tabIcons, tutorial-web etc.) continuam em `mobile/assets/`; serão substituídas pela identidade visual na Etapa 11.
- Lição: não rodar `npm audit fix --force` em projeto Expo (troca versões compatíveis à força).
- Etapa 2a: `npx tsc --noEmit` pegou um link com rota tipada no formato errado (`href="/venue/v1"`); corrigido para `href={{ pathname: "/venue/[id]", params: { id: "v1" } }}`. Lição: funcionar no celular ≠ estar correto.
- Etapa 2a: `npx expo start` rodado na raiz deu `ConfigError ... package.json does not exist` (e ofereceu baixar o Expo 58). Comandos `npx expo`/`npm` rodam dentro de `mobile/`; comandos `git`, na raiz.
- Ponto de atenção do aprendizado: o usuário tem dificuldade com os comandos `git add`, `commit` e `push` (o `status` está tranquilo). Foi criado o `docs/guia-git.md`; praticar no início das próximas sessões.
