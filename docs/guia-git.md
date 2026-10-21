# Guia rápido do Git: o ciclo de salvar e enviar

> Cola pessoal para consultar sempre que for fazer um commit.

## A ideia em uma frase

Mandar seu trabalho para o GitHub é como **mandar uma encomenda pelos Correios**:

| Passo | Correios | Git |
|---|---|---|
| 1 | Olhar o que tem na mesa | `git status` |
| 2 | Colocar as coisas na caixa | `git add .` |
| 3 | Fechar a caixa e escrever a etiqueta | `git commit -m "..."` |
| 4 | Levar a caixa até os Correios | `git push` |

## Os 4 comandos (são SEMPRE os mesmos)

Rode **na pasta raiz** do projeto (`...\Qual a Boa>`), **um de cada vez**:

```
git status
git add .
git commit -m "tipo: o que eu fiz"
git push
```

A única coisa que muda de um commit para outro é **o texto entre aspas** do terceiro comando.

## Como escrever o comando 3, a etiqueta

```
git commit -m "tipo: o que eu fiz"
│    │      │  └────────┬────────┘
│    │      │      a mensagem, SEMPRE entre aspas
│    │      └─ -m = "a mensagem vem a seguir"
│    └─ commit = "fechar a caixa"
└─ git = o programa
```

**Os tipos mais usados:**

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feat` | criei algo novo no app | `feat(mobile): adiciona tela de perfil` |
| `fix` | consertei um erro | `fix(mobile): corrige link do local` |
| `docs` | mexi só em documentação | `docs: atualiza o PROGRESSO` |
| `test` | mexi só em testes | `test(mobile): adiciona testes do ranking` |

O `(mobile)` diz **em que parte do projeto** foi a mudança. É opcional, mas ajuda.

## O que cada resposta significa

| Você viu... | Significa | O que fazer |
|---|---|---|
| Arquivos em **vermelho** no status | mudanças que ainda não estão na caixa | `git add .` |
| Arquivos em **verde** no status | já estão na caixa, prontos | `git commit -m "..."` |
| `nothing to commit, working tree clean` | não há nada novo | nada, está tudo salvo ✅ |
| `Your branch is ahead of 'origin/main'` | a caixa está fechada mas ainda não foi enviada | `git push` |
| `Everything up-to-date` no push | não havia caixa nova para enviar | faça o commit antes |
| `fatal: not a git repository` | você está na pasta errada | `cd "C:\Users\bf98m\Documents\Qual a Boa"` |
| `pathspec '...' did not match` no commit | faltaram as aspas na mensagem | coloque a mensagem inteira entre aspas |

## Erros comuns

- `git.add` ou `gitadd` → falta o **espaço**: `git add`
- `git add` sem nada → falta o **ponto**: `git add .`
- `git commit -m docs: texto` → faltam as **aspas**: `git commit -m "docs: texto"`
- `git pull` para enviar → enviar é **push** (empurrar); pull (puxar) é para trazer do GitHub
