# PROGRESSO — Qual a Boa

> Arquivo de controle do projeto. Deve ser lido no início de cada sessão e atualizado ao final de cada etapa.
> Última atualização: 2026-09-30

---

## Status atual

- **Fase:** Planejamento concluído (stack, MVP e regras de negócio aprovados em 2026-09-30)
- **Em andamento:** Etapa 0 — Preparação do ambiente (arquivos criados; faltam verificação das ferramentas, `git init`, primeiro commit e envio ao GitHub)
- **Pasta do projeto:** `Documentos\Qual a Boa`
- **Ambiente do usuário:** Windows 11; Node.js, Git e VS Code já instalados (versões ainda não verificadas); conta no GitHub; iPhone com Expo Go instalado

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
| 0 | Preparação do ambiente (Node, Git, VS Code, Expo Go, conta GitHub, repositório) | terminal, Git, dependências | — | ⏳ Pendente |
| 1 | Criar o app Expo e rodar no celular; estrutura de pastas | projeto JS/TS, arquivos, componentes | Plan, revisão | ⏳ Pendente |
| 2 | Navegação e telas com dados falsos (Feed, Local, Perfil) | componentes, props, estado, listas | Plan, testes, revisão | ⏳ Pendente |
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
- Nenhuma ainda.

### Funcionalidades implementadas
- Nenhuma ainda.

### Testes realizados e resultados
- Nenhum ainda.

### Conceitos já aprendidos
- Nenhum registrado ainda.

### Problemas conhecidos / observações
- Os agentes do ECC (planejamento, revisão, testes, segurança) **não foram encontrados** nesta sessão. Substitutos disponíveis: agente `Plan` (planejamento), `/code-review` (revisão), `/security-review` (segurança); testes serão escritos diretamente.
- O projeto ainda está numa pasta temporária da sessão; precisa ser movido para uma pasta definitiva antes da Etapa 0.
- Limitação conhecida (MVP): a localização vem do celular e pode ser falsificada por apps de GPS falso. Aceitável para portfólio; registrar no README.
