# Instruções para o Claude Code — projeto Qual a Boa

## Contexto
- Projeto de portfólio e de aprendizado. O usuário é iniciante em programação: explique conceitos novos de forma simples, sem simplificar a qualidade do código.
- Toda a comunicação é em português do Brasil.
- Stack: React Native + Expo (TypeScript) na pasta `mobile/`; Supabase (PostgreSQL + Auth + RLS) na pasta `supabase/`.
- Ambiente: Windows 11 (PowerShell) e um iPhone com Expo Go para testes.

## Ao iniciar uma sessão
1. O usuário trabalha em **dois computadores** (casa e trabalho), e o histórico de conversas do Claude Code não passa de um para o outro. O contexto vive nos arquivos do repositório. Antes de qualquer coisa, peça ao usuário para rodar `git pull` na raiz do projeto (ou rode, com a permissão dele) e confira com `git status` se não há trabalho pendente.
2. Leia o `PROGRESSO.md`.
3. Se a etapa atual tiver um plano salvo em `docs/` (por exemplo, `docs/plano-etapa-2.md`), leia-o antes de planejar de novo.
4. Retome da etapa indicada, sem repetir etapas concluídas e sem presumir testes que não estejam registrados.

## Ao encerrar uma sessão
- Atualize o `PROGRESSO.md` com o ponto exato onde paramos e o próximo passo.
- Garanta que tudo esteja em commit e com `git push`, para o outro computador receber o trabalho.
- Planos gerados por agentes (`Plan`) que ainda serão usados devem ser salvos em `docs/`. Os resultados dos agentes ficam numa pasta local do Claude Code e não vão para o outro computador.

## Sobre o aprendizado do usuário
- Prefere **rodar os comandos ele mesmo** para praticar. Ofereça rodar daqui quando o comando for longo, só de leitura, ou quando ele estiver cansado.
- O Git é o ponto de atenção: `git status` está tranquilo; `add`, `commit -m "..."` e `push` ainda geram dúvidas. A cola está em `docs/guia-git.md`. Incentive-o a fazer os commits das etapas, com a cola do lado.
- Comandos `git` rodam na raiz do projeto; comandos `npx` e `npm`, dentro de `mobile/`. Lembre isso quando ele estiver na pasta errada.
- Usa o terminal do VS Code (PowerShell) e às vezes o cmd.
- Responde bem a analogias (Correios para o Git, prédio e salas para as rotas) e a tabelas do tipo "você viu X → significa Y → faça Z".

## Metodologia de cada etapa (obrigatória)
- **A. O que vamos fazer:** funcionalidade, problema que resolve, lugar na arquitetura, conceitos e ferramentas.
- **B. Como funciona:** a lógica antes do código, com analogias e diagramas em texto.
- **C. Implementação:** para cada arquivo, explicar a finalidade, a pasta, a responsabilidade, o funcionamento e as conexões. Nada de alterações silenciosas.
- **D. Teste prático:** comandos exatos, resultado esperado, como verificar e como corrigir erros. Incluir testes automatizados quando possível.
- **E. Fixação:** resumo, conceitos, fluxo completo, um exercício e uma pergunta de revisão.
- Não avançar de etapa sem a autorização do usuário.

## Regras
- Antes de rodar qualquer comando no terminal, explique o que ele faz e pergunte se o usuário quer que você rode ou se ele mesmo vai rodar.
- Diferencie decisão de arquitetura, regra de negócio e escolha de implementação.
- Nunca afirme que algo foi executado ou testado sem ter feito isso de verdade.
- Ao final de cada etapa aprovada: atualizar o `PROGRESSO.md` e fazer um commit, explicando a mensagem.
- Agentes: `Plan` para planejar as etapas com código; `/code-review` para revisar; `/security-review` nas etapas de login, banco de dados e localização. Diga sempre qual está usando e por quê.
- Segredos (chaves do Supabase etc.) só em `.env`, que nunca vai para o Git.
- Dependências: o `npx expo install` grava pacotes do SDK sempre em `dependencies`. Para ferramentas de desenvolvimento, mova-as para `devDependencies` (e rode `npm install`) ou use `npm install --save-dev` em pacotes fora do SDK. Nunca rode `npm audit fix --force`.

## Regras de negócio aprovadas
- O post expira em 2 horas.
- O check-in só vale num raio de 100 m. A localização é lida só no momento do post e as coordenadas nunca são salvas.
- Máximo de 2 posts por local a cada 2 horas, por usuário.
- Streak semanal.
- O usuário escolhe o título exibido entre os desbloqueados, e existem títulos secretos (easter eggs).
- Os locais de exemplo são de Belo Horizonte.
