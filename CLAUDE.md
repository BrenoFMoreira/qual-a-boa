# Instruções para o Claude Code — projeto Qual a Boa

## Contexto
- Projeto de portfólio e de aprendizado. O usuário é iniciante em programação: explique conceitos novos de forma simples, sem simplificar a qualidade do código.
- Toda a comunicação é em português do Brasil.
- Stack: React Native + Expo (TypeScript) na pasta `mobile/`; Supabase (PostgreSQL + Auth + RLS) na pasta `supabase/`.
- Ambiente: Windows 11 (PowerShell) e um iPhone com Expo Go para testes.

## Ao iniciar uma sessão
1. Leia o `PROGRESSO.md` antes de qualquer coisa.
2. Retome da etapa indicada ali, sem repetir etapas concluídas e sem presumir testes que não estejam registrados.

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

## Regras de negócio aprovadas
- O post expira em 2 horas.
- O check-in só vale num raio de 100 m. A localização é lida só no momento do post e as coordenadas nunca são salvas.
- Máximo de 2 posts por local a cada 2 horas, por usuário.
- Streak semanal.
- O usuário escolhe o título exibido entre os desbloqueados, e existem títulos secretos (easter eggs).
- Os locais de exemplo são de Belo Horizonte.
