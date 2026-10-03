# Qual a Boa 🍻

> Descubra em tempo real quais bares e baladas estão bombando agora.

**Status:** 🚧 em desenvolvimento (projeto de portfólio e aprendizado)

## O que é

O **Qual a Boa** responde à pergunta "qual a boa de hoje?". Quem está num bar ou balada avisa no app que o lugar "tá rolando", e quem está em casa vê quais lugares estão bons naquele momento.

- Os posts expiram automaticamente depois de 2 horas, então o feed mostra só o que está acontecendo agora.
- O check-in usa a localização **apenas no momento do post**, para confirmar que a pessoa está no local (raio de 100 m). O app nunca rastreia o usuário e não salva coordenadas.
- Gamificação: pontos, níveis, streak semanal e títulos desbloqueáveis, incluindo títulos secretos.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| App mobile | React Native + Expo (TypeScript) |
| Backend e banco de dados | Supabase (PostgreSQL, autenticação e Row Level Security) |
| Testes | Jest + React Native Testing Library |

## Estrutura do repositório

```
qual-a-boa/
├── mobile/      # app React Native (Expo)          — criado na Etapa 1
├── supabase/    # banco de dados: tabelas e regras  — criado na Etapa 3
├── PROGRESSO.md # diário de desenvolvimento
└── README.md    # este arquivo
```

## Como rodar

Instruções serão adicionadas na Etapa 1.

## Progresso

Veja o [PROGRESSO.md](PROGRESSO.md) para as etapas concluídas e as próximas.
