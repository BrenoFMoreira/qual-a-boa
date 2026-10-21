> **Sobre este arquivo:** plano da Etapa 2 gerado pelo agente `Plan` em 2026-10-18 e salvo no repositório em 2026-10-20 para ficar disponível em qualquer computador.
>
> **Situação em 2026-10-20:**
> - **2a (navegação):** ✅ concluída (commit `e2dfd84`). Diferença em relação ao plano: o link temporário usa `href={{ pathname: "/venue/[id]", params: { id: "v1" } }}`, porque `href="/venue/v1"` falhou no `tsc` (rotas tipadas).
> - **2b:** 🔄 só as dependências de teste foram instaladas (commit `3985099`). **Não rode os comandos de instalação da seção 4 de novo.** Próximo passo: configurar o Jest no `package.json` e criar os arquivos da seção 4.
> - **2c e 2d:** ⏳ pendentes.
> - A cor da dica (`highlight`) é `#10cf20`, escolhida pelo usuário. O texto da dica no feed (seção 5) ainda precisa ser confirmado com ele.

# Plano da Etapa 2: Navegação e telas com dados falsos (Qual a Boa)

Fiz só leitura, nenhum arquivo foi alterado. Tudo abaixo foi conferido no `mobile/node_modules`, no registro do npm (`npm view`), na API de versões da Expo (`api.expo.dev/v2/versions`) e na documentação (docs.expo.dev, docs do RNTL v14).

---

## 0. Descobertas que mudam o plano (confirmadas)

1. **`Tabs` de `expo-router` está deprecated nesta versão.** Em `node_modules/expo-router/build/exports.d.ts` (57.0.28) está escrito: `@deprecated Use import { Tabs } from 'expo-router/js-tabs' instead.` A página da documentação na web ainda mostra `import { Tabs } from 'expo-router'`. Vale o pacote instalado: use **`import { Tabs } from "expo-router/js-tabs"`**. Isso também é uma boa lição: o pacote instalado é a fonte da verdade.
2. **NativeTabs ainda é "unstable".** O caminho é `expo-router/unstable-native-tabs`, e a documentação não diz que é estável nem que é o recomendado. **Decisão: usar as abas JS (`expo-router/js-tabs`).** Funcionam no Expo Go, dá para controlar as cores (fundo roxo), usam `screenOptions` (o mesmo modelo mental do `Stack`) e trazem cabeçalho próprio, que já trata a área segura (notch).
3. **`@expo/vector-icons` NÃO está instalado.** A pasta não existe no node_modules, embora apareça no bundledNativeModules (^15.0.2). **`expo-symbols` já está nas dependências.** É o `SymbolView`, que usa SF Symbols no iOS e aceita `name={{ ios, android, web }}` (Material Symbols no Android). Conferi que os nomes existem nos tipos: `flame.fill`, `person.fill` (SF) e `local_fire_department`, `person` (Android). **Decisão: `SymbolView` de `expo-symbols`, sem instalar nada.**
4. **Versões que o `npx expo install` escolhe no SDK 57** (de `relatedPackages` da API da Expo): `jest ~29.7.0`, `@types/jest 29.5.14` e `jest-expo ~57.0.6` (bundledNativeModules). Então o comando da documentação funciona e instala o **Jest 29**. O Jest 30 só vale a partir do SDK 58.
5. **RNTL:** a versão mais nova é **14.1.0**. Ela exige o peer `test-renderer` 1.x e Node `^22.13 || >=24` (o usuário tem 24.21, ok). **Cuidado:** `test-renderer@1.3.x` depende de `react-reconciler ~0.34`, que exige `react ^19.3`. O projeto usa **React 19.2.3**, então a versão certa é **`test-renderer@~1.2.0`** (reconciler 0.33, peer react ^19.2). Se deixar o npm escolher sozinho, vem a 1.3.1 e dá conflito (ERESOLVE ou incompatibilidade).
6. **RNTL v14 é assíncrono:** `await render(...)` e `await fireEvent.press(...)`. Os matchers (`toBeOnTheScreen`) já vêm prontos, sem setup ("No setup needed").
7. A documentação da Expo manda: testes **fora de `src/app`** (por exemplo `mobile/__tests__/`), **não usar `react-test-renderer`** e, no Windows, escrever `"--"` entre aspas.
8. O `jest-expo@57.0.6` tem o peer `@react-native/jest-preset ^0.86.3`. O npm 7+ instala peers automaticamente. Se aparecer "Cannot find module '@react-native/jest-preset'", rode `npm install --save-dev "@react-native/jest-preset@~0.86.3"`.
9. **Diferença no arquivo real:** em `src/app/index.tsx` o `hint` está com **`#10cf20` (verde)**, não com `#a0a0a0`. O usuário trocou a cor. **Mantive `#10cf20`** como `colors.highlight` e usei `#a0a0a0` como `colors.muted` (texto secundário). **Confirme com o usuário.** O texto do hint ("Em breve: Os rolês mais quentes da região") deixa de ser "em breve" no 2c. Proponho "Os rolês mais quentes da região", mas **pergunte ao usuário** porque a frase é dele.
10. A API de versões já lista o **SDK 58**. Reforça o aviso do PROGRESSO sobre o Expo Go atualizar.
11. O `tsconfig.json` **não precisa mudar.** Sem um campo `"types"`, o TypeScript enxerga todos os `@types/*`, inclusive `@types/jest`. A documentação sugere `"types": ["jest"]`, mas isso *restringe* os tipos globais a só o jest. Se o `tsc` reclamar de `describe`, aí sim adicione.
12. `typedRoutes: true`: os tipos das rotas novas (`/venue/[id]`) só são gerados em `.expo/types` quando o `npx expo start` roda. Rode o start antes do `npx tsc --noEmit`.
13. `reactCompiler: true`: não use `new Date()` durante a renderização (é impuro e o compilador pode memorizar o valor). Por isso o "agora" é guardado no estado, no momento em que os dados carregam.

---

## 1. Arquitetura e estrutura de pastas

```
mobile/
├── __tests__/                    ← testes (Jest), nunca em src/app
│   ├── posts.test.ts
│   ├── ranking.test.ts
│   ├── format.test.ts
│   └── VenueCard.test.tsx
└── src/
    ├── app/                      ← SÓ telas/rotas (arquivo = rota)
    │   ├── _layout.tsx           ← Stack raiz (empilha venue por cima das abas)
    │   ├── (tabs)/               ← grupo: parênteses NÃO entram na URL
    │   │   ├── _layout.tsx       ← Tabs (Agora, Perfil)
    │   │   ├── index.tsx         ← "/"  feed  (movido do antigo src/app/index.tsx)
    │   │   └── perfil.tsx        ← "/perfil"
    │   └── venue/
    │       └── [id].tsx          ← "/venue/v1" (rota dinâmica)
    ├── components/               ← peças visuais reutilizáveis (recebem props)
    │   ├── VenueCard.tsx  VibeIndicator.tsx  EmptyState.tsx  PostItem.tsx
    ├── constants/                ← theme.ts (cores), rules.ts (regras), labels.ts (textos)
    ├── types/models.ts           ← formatos dos dados (Venue, Post, Profile, Title)
    ├── lib/                      ← lógica pura de negócio (sem React) → alvo dos testes
    │   ├── posts.ts  ranking.ts  format.ts
    ├── data/                     ← dados FALSOS (some na Etapa 4)
    │   ├── mock-venues.ts  mock-posts.ts  mock-profile.ts
    └── services/                 ← "porta de entrada" dos dados (async). Etapa 4 troca mock → Supabase aqui
        ├── mock-delay.ts  venues.ts  profile.ts
```

Diagrama de navegação:
```
Stack (raiz)
├── (tabs)  [sem cabeçalho do Stack]
│   ├── Agora (index)   ──toque no card──┐
│   └── Perfil                           │ router.push
└── venue/[id]  ◄────────────────────────┘ (tela empilhada com botão Voltar)
```

Fluxo de dados (é a troca que fica fácil depois):
```
Tela → services (async, Promise) → data/mock (hoje)  |  Supabase (Etapa 4)
Tela → lib (funções puras: filtra, ordena, calcula)  ← testado no Jest
Tela → components (props) → desenho
```

**Classificação** (o CLAUDE.md pede para diferenciar):
- *Decisão de arquitetura:* as camadas services/lib/data/components; o Stack raiz com as abas dentro de um grupo; os services já serem async.
- *Regra de negócio:* o post vale 2 h (`POST_DURATION_HOURS`); ranking por posts ativos, desempate pelo post mais recente e depois por nome.
- *Escolha de implementação:* abas JS em vez de NativeTabs; `SymbolView`; atraso falso de 400 ms; `comment: string | null`; datas como string ISO (o Supabase devolve `timestamptz` como string). Os campos ficam em camelCase no TS, e o mapeamento a partir do snake_case do banco acontece no service, na Etapa 4.

---

## 2. Sub-etapas (ordem pedagógica recomendada)

A ordem é **visual primeiro** (vitória rápida no iPhone), depois **lógica e testes**, depois a UI que usa essa lógica.

| Sub | Conteúdo | O que ver |
|---|---|---|
| **2a** | Navegação: `theme.ts`, Stack raiz, `(tabs)/_layout`, mover a home para `(tabs)/index`, placeholders de perfil e `venue/[id]` | Barra de abas embaixo (🔥 Agora / 👤 Perfil) com fundo roxo escuro. A aba Perfil troca de tela. O link "Abrir local de teste" empilha uma tela "Local" mostrando "id: v1", e "< Voltar" retorna. |
| **2b** | Tipos, constantes, mocks, `lib/` (posts, ranking, format), services, Jest e RNTL instalados, testes unitários | Nada muda no iPhone. No terminal, `npm test` mostra 3 suites verdes e `npx tsc --noEmit` sem erros. |
| **2c** | `VibeIndicator`, `VenueCard`, `EmptyState`, feed com FlatList, puxar para atualizar, teste do VenueCard | Lista ranqueada: "Lua Roxa Club" em 1º (4 posts, 🔥🔥🔥), depois "Boteco do Mineirinho" e "Sereno Bar" (empatados com 3, o Boteco vence porque o post mais recente é de 5 min atrás). No fim, "Esquina de Lourdes" e "Porão 31" aparecem como "Parado por enquanto". Puxando a lista para baixo, aparece o spinner. Depois de 10 min, o "Pé de Serra" (post de 110 min) cai para "Parado". É a expiração de 2 h ao vivo. |
| **2d** | `PostItem`, `venue/[id]` final, `perfil` final | Tocar num card abre o local com nome, endereço e posts ("@ana.bh · há 10 min · 🔥🔥🔥 Bombando"). O "Porão 31" mostra "😴 Nada rolando agora". O Perfil mostra pontos, nível, streak e títulos. Tocar em "Rei da noite" muda o título exibido. Os títulos secretos aparecem como "???". |

Comandos de verificação em cada sub-etapa (pasta `mobile`): `npx expo start` (se algo estranho acontecer, `npx expo start --clear`), `npx tsc --noEmit` e, a partir do 2b, `npm test`.

---

## 3. Sub-etapa 2a: navegação (✅ CONCLUÍDA, mantida só como referência)

### Comandos (PowerShell, dentro de `mobile`)
Parênteses e colchetes são especiais no PowerShell (`( )` é subexpressão, `[ ]` é curinga). Por isso use aspas, ou crie as pastas e arquivos pelo Explorer do VS Code, que é o mais fácil para iniciante.
```powershell
mkdir "src/app/(tabs)"
git mv "src/app/index.tsx" "src/app/(tabs)/index.tsx"
mkdir "src/app/venue"
mkdir "src/constants"
```
Crie `src/app/venue/[id].tsx` pelo VS Code. No PowerShell seria `New-Item -LiteralPath "src/app/venue/[id].tsx"`. O `git mv` mantém o histórico do arquivo. Não pode sobrar um `src/app/index.tsx` junto com `(tabs)/index.tsx`, porque os dois seriam a rota "/".

### `mobile/src/constants/theme.ts`
```ts
// Paleta de cores do app, num lugar só.
// Mudou aqui → muda em todas as telas.
export const colors = {
  background: "#1a1033", // fundo roxo escuro (identidade da Etapa 1)
  surface: "#2a1f4d", // cartões e barra de abas
  border: "#3d2f6b",
  text: "#ffffff",
  accent: "#c9b8ff", // lilás do subtítulo
  muted: "#a0a0a0", // textos secundários
  highlight: "#10cf20", // verde escolhido pelo usuário para o hint
} as const;
```

### `mobile/src/app/_layout.tsx` (final já no 2a)
```tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/constants/theme";

// Layout raiz: uma PILHA (Stack). As abas ficam no fundo da pilha
// e a tela de um local é "empilhada" por cima quando o usuário toca num card.
export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackTitle: "Voltar",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* As abas já têm cabeçalho próprio, então escondemos o do Stack */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="venue/[id]" options={{ title: "Local" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
```

### `mobile/src/app/(tabs)/_layout.tsx` (final já no 2a)
```tsx
import { Tabs } from "expo-router/js-tabs";
import { SymbolView } from "expo-symbols";

import { colors } from "@/constants/theme";

// Layout das abas. Cada <Tabs.Screen name="..."> aponta para um arquivo
// desta pasta: "index" → index.tsx, "perfil" → perfil.tsx.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Agora", // texto da aba
          headerTitle: "Qual a Boa 🍻", // texto do cabeçalho
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "person.fill", android: "person", web: "person" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

### `mobile/src/app/(tabs)/index.tsx` (TEMPORÁRIO no 2a; é a home movida, com um link de teste)
```tsx
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual a Boa 🍻</Text>
      <Text style={styles.subtitle}>Descubra onde a noite está rolando em BH</Text>
      <Text style={styles.hint}>Em breve: Os rolês mais quentes da região</Text>
      {/* Link temporário só para testar a navegação; sai no 2c */}
      <Link href="/venue/v1" style={styles.link}>
        Abrir local de teste →
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 36, fontWeight: "bold", color: colors.text },
  subtitle: { marginTop: 8, fontSize: 16, color: colors.accent, textAlign: "center" },
  hint: { marginTop: 16, fontSize: 14, color: colors.highlight, textAlign: "center" },
  link: { marginTop: 32, fontSize: 16, color: colors.accent, textDecorationLine: "underline" },
});
```
(O `StatusBar` saiu daqui e foi para o layout raiz, para valer em todas as telas. O fundo vem do `sceneStyle`.)

### `mobile/src/app/(tabs)/perfil.tsx` (TEMPORÁRIO no 2a)
```tsx
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil (em construção)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { color: colors.text, fontSize: 18 },
});
```

### `mobile/src/app/venue/[id].tsx` (TEMPORÁRIO no 2a)
```tsx
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

// [id] no nome do arquivo = parte variável da URL. /venue/v1 → id = "v1"
export default function VenueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>id: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { color: colors.text, fontSize: 18 },
});
```

Commit do 2a: `feat(mobile): adiciona navegação com abas e rota de local`

---

## 4. Sub-etapa 2b: tipos, mocks, lógica pura e Jest

### Instalação (PowerShell, dentro de `mobile`; as aspas em `"--"` são obrigatórias no Windows)
✅ **Já instalado em 2026-10-20. Não repetir.** Atenção: o `npx expo install ... "--" --dev` grava os pacotes do SDK em `dependencies` (o `--dev` está obsoleto no npm). Eles foram movidos à mão para `devDependencies`. A testing-library foi instalada com `npm install --save-dev @testing-library/react-native@^14.1.0 test-renderer@~1.2.0`.
Versões esperadas no `devDependencies`: `jest ~29.7.0`, `jest-expo ~57.0.6`, `@types/jest 29.5.14`, `@testing-library/react-native ^14.1.0`, `test-renderer ~1.2.0`. Confira com `npm ls jest test-renderer @testing-library/react-native`. Não rodar `npm audit fix --force`.

### `mobile/package.json`: adições (só `scripts` e o bloco `jest`; o `devDependencies` é preenchido pelos comandos)
```json
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "preset": "jest-expo",
    "moduleNameMapper": {
      "^@/assets/(.*)$": "<rootDir>/assets/$1",
      "^@/(.*)$": "<rootDir>/src/$1"
    }
  },
```
O `moduleNameMapper` ensina ao Jest os atalhos `@/...` do tsconfig. O do assets vem primeiro porque é mais específico. Usei `jest` (roda uma vez) em vez do `jest --watchAll` da documentação, que é mais claro para iniciante. O `test:watch` é opcional.

### `mobile/src/constants/rules.ts`
```ts
// Regras de negócio aprovadas (ver PROGRESSO.md). Mudar aqui muda o app todo.

/** Um post "tá rolando" vale por 2 horas. */
export const POST_DURATION_HOURS = 2;
export const POST_DURATION_MS = POST_DURATION_HOURS * 60 * 60 * 1000;
```

### `mobile/src/types/models.ts`
```ts
// "Formatos" dos dados do app. Na Etapa 3 viram tabelas no banco;
// os nomes aqui ficam em camelCase (padrão JS) e o service converte.

export type VenueCategory = "bar" | "balada" | "boteco";

export type Venue = {
  id: string;
  name: string;
  category: VenueCategory;
  neighborhood: string;
  address: string;
  latitude: number;
  longitude: number;
};

/** Nível de animação: 1 = de boa, 2 = animado, 3 = bombando. */
export type VibeLevel = 1 | 2 | 3;

export type Post = {
  id: string;
  venueId: string;
  userId: string;
  username: string;
  vibe: VibeLevel;
  comment: string | null; // opcional: null quando o usuário não escreve nada
  createdAt: string; // data ISO, ex.: "2026-10-18T23:00:00.000Z"
  expiresAt: string; // createdAt + 2h
};

export type Title = {
  id: string;
  name: string;
  description: string;
  secret: boolean; // easter egg: só aparece depois de desbloqueado
};

export type Profile = {
  id: string;
  username: string;
  points: number;
  level: number;
  streakWeeks: number;
  selectedTitleId: string | null;
  unlockedTitleIds: string[];
};
```

### `mobile/src/constants/labels.ts`
```ts
import type { VenueCategory, VibeLevel } from "@/types/models";

export const CATEGORY_LABELS: Record<VenueCategory, string> = {
  bar: "Bar",
  balada: "Balada",
  boteco: "Boteco",
};

export const VIBE_LABELS: Record<VibeLevel, string> = {
  1: "De boa",
  2: "Animado",
  3: "Bombando",
};
```

### `mobile/src/lib/posts.ts`
```ts
import { POST_DURATION_MS } from "@/constants/rules";
import type { Post, VibeLevel } from "@/types/models";

/** Calcula quando um post expira (regra: 2h depois de criado). */
export function getExpiresAt(createdAt: Date): Date {
  return new Date(createdAt.getTime() + POST_DURATION_MS);
}

/**
 * Um post está ativo enquanto "agora" for antes da expiração.
 * Recebe `now` como parâmetro (em vez de ler o relógio) para ser testável.
 */
export function isPostActive(post: Post, now: Date): boolean {
  return now.getTime() < new Date(post.expiresAt).getTime();
}

/** Só os posts ativos, do mais recente para o mais antigo. */
export function getActivePosts(posts: Post[], now: Date): Post[] {
  return posts
    .filter((post) => isPostActive(post, now))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Média da animação; null quando não há posts. */
export function averageVibe(posts: Post[]): number | null {
  if (posts.length === 0) return null;
  const total = posts.reduce((sum, post) => sum + post.vibe, 0);
  return total / posts.length;
}

/** Arredonda uma média (ex.: 2.6) para um nível inteiro de 1 a 3. */
export function toVibeLevel(average: number): VibeLevel {
  const rounded = Math.round(average);
  if (rounded <= 1) return 1;
  if (rounded >= 3) return 3;
  return 2;
}
```

### `mobile/src/lib/ranking.ts`
```ts
import { averageVibe, isPostActive } from "@/lib/posts";
import type { Post, Venue } from "@/types/models";

export type VenueRanking = {
  venue: Venue;
  activePostCount: number;
  averageVibe: number | null;
  lastPostAt: string | null;
};

/**
 * Ranking do feed "Qual a boa agora":
 * 1º mais posts ativos; 2º empate → post mais recente; 3º empate → nome (A-Z).
 * Locais sem posts ativos vão para o fim (aparecem como "parado").
 * Não altera os arrays recebidos (função pura).
 */
export function getVenueRanking(venues: Venue[], posts: Post[], now: Date): VenueRanking[] {
  const activePosts = posts.filter((post) => isPostActive(post, now));

  const ranking = venues.map((venue): VenueRanking => {
    const venuePosts = activePosts.filter((post) => post.venueId === venue.id);
    let lastPostAt: string | null = null;
    for (const post of venuePosts) {
      if (lastPostAt === null || toTime(post.createdAt) > toTime(lastPostAt)) {
        lastPostAt = post.createdAt;
      }
    }
    return {
      venue,
      activePostCount: venuePosts.length,
      averageVibe: averageVibe(venuePosts),
      lastPostAt,
    };
  });

  return ranking.sort((a, b) => {
    if (b.activePostCount !== a.activePostCount) return b.activePostCount - a.activePostCount;
    const lastA = a.lastPostAt === null ? 0 : toTime(a.lastPostAt);
    const lastB = b.lastPostAt === null ? 0 : toTime(b.lastPostAt);
    if (lastB !== lastA) return lastB - lastA;
    return a.venue.name.localeCompare(b.venue.name, "pt-BR");
  });
}

function toTime(isoDate: string): number {
  return new Date(isoDate).getTime();
}
```
(Usei o nome `getVenueRanking` em vez de `getActiveVenuesRanking` porque a função devolve também os locais parados, no fim da lista.)

### `mobile/src/lib/format.ts`
```ts
import { POST_DURATION_HOURS } from "@/constants/rules";

/** "agora", "há 15 min", "há 1h", "há 1h05". */
export function formatTimeAgo(isoDate: string, now: Date): string {
  const diffMinutes = Math.floor((now.getTime() - new Date(isoDate).getTime()) / 60_000);
  if (diffMinutes < 1) return "agora";
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return minutes === 0 ? `há ${hours}h` : `há ${hours}h${String(minutes).padStart(2, "0")}`;
}

/** "1 post nas últimas 2h", "3 posts nas últimas 2h" ou "Parado por enquanto". */
export function formatActivity(activePostCount: number): string {
  if (activePostCount === 0) return "Parado por enquanto";
  const word = activePostCount === 1 ? "post" : "posts";
  return `${activePostCount} ${word} nas últimas ${POST_DURATION_HOURS}h`;
}
```

### `mobile/src/data/mock-venues.ts`
```ts
import type { Venue } from "@/types/models";

// Locais FICTÍCIOS em bairros reais de BH (nomes inventados para não
// sugerir parceria com bares de verdade; endereços aproximados).
export const MOCK_VENUES: Venue[] = [
  { id: "v1", name: "Lua Roxa Club", category: "balada", neighborhood: "Savassi", address: "Rua Pernambuco, 1200", latitude: -19.9389, longitude: -43.9346 },
  { id: "v2", name: "Boteco do Mineirinho", category: "boteco", neighborhood: "Santa Tereza", address: "Rua Mármore, 350", latitude: -19.9175, longitude: -43.919 },
  { id: "v3", name: "Sereno Bar", category: "bar", neighborhood: "Lourdes", address: "Rua Curitiba, 2000", latitude: -19.9335, longitude: -43.9455 },
  { id: "v4", name: "Varanda Funcionários", category: "bar", neighborhood: "Funcionários", address: "Rua Alagoas, 800", latitude: -19.933, longitude: -43.931 },
  { id: "v5", name: "Porão 31", category: "balada", neighborhood: "Centro", address: "Rua da Bahia, 900", latitude: -19.923, longitude: -43.937 },
  { id: "v6", name: "Pé de Serra", category: "boteco", neighborhood: "Santa Tereza", address: "Rua Salinas, 1500", latitude: -19.9155, longitude: -43.916 },
  { id: "v7", name: "Esquina de Lourdes", category: "bar", neighborhood: "Lourdes", address: "Rua Marília de Dirceu, 150", latitude: -19.932, longitude: -43.943 },
  { id: "v8", name: "Galpão Noturno", category: "balada", neighborhood: "Centro", address: "Avenida Afonso Pena, 700", latitude: -19.92, longitude: -43.938 },
];
```

### `mobile/src/data/mock-posts.ts`
```ts
import { getExpiresAt } from "@/lib/posts";
import type { Post, VibeLevel } from "@/types/models";

type MockPostSeed = {
  id: string;
  venueId: string;
  username: string;
  vibe: VibeLevel;
  minutesAgo: number; // há quantos minutos foi postado (relativo a "agora")
  comment?: string;
};

// > 120 min = já expirou (regra das 2h). O "Pé de Serra" (110 min) expira
// 10 min depois de abrir o app: dá para ver a regra funcionando ao vivo.
const SEEDS: MockPostSeed[] = [
  { id: "p1", venueId: "v1", username: "ana.bh", vibe: 3, minutesAgo: 10, comment: "Pista lotada, DJ mandando bem!" },
  { id: "p2", venueId: "v1", username: "rafa_noturno", vibe: 3, minutesAgo: 25 },
  { id: "p3", venueId: "v1", username: "ju.savassi", vibe: 2, minutesAgo: 40, comment: "Fila andando rápido" },
  { id: "p4", venueId: "v1", username: "pedrao", vibe: 3, minutesAgo: 90 },
  { id: "p5", venueId: "v1", username: "bia.roxa", vibe: 2, minutesAgo: 150, comment: "Começando a encher" },
  { id: "p6", venueId: "v2", username: "lu_santate", vibe: 2, minutesAgo: 5, comment: "Samba na calçada 🎶" },
  { id: "p7", venueId: "v2", username: "caio.bh", vibe: 3, minutesAgo: 30 },
  { id: "p8", venueId: "v2", username: "ana.bh", vibe: 2, minutesAgo: 60, comment: "Tropeiro saindo" },
  { id: "p9", venueId: "v3", username: "ju.savassi", vibe: 2, minutesAgo: 15 },
  { id: "p10", venueId: "v3", username: "pedrao", vibe: 2, minutesAgo: 50, comment: "Mesa fácil ainda" },
  { id: "p11", venueId: "v3", username: "bia.roxa", vibe: 1, minutesAgo: 100 },
  { id: "p12", venueId: "v8", username: "rafa_noturno", vibe: 3, minutesAgo: 20, comment: "Open bar até meia-noite" },
  { id: "p13", venueId: "v8", username: "caio.bh", vibe: 2, minutesAgo: 45 },
  { id: "p14", venueId: "v4", username: "lu_santate", vibe: 2, minutesAgo: 70 },
  { id: "p15", venueId: "v4", username: "ana.bh", vibe: 1, minutesAgo: 200 },
  { id: "p16", venueId: "v6", username: "pedrao", vibe: 1, minutesAgo: 110, comment: "Tranquilo, bom pra conversar" },
  { id: "p17", venueId: "v5", username: "bia.roxa", vibe: 3, minutesAgo: 130 },
  { id: "p18", venueId: "v5", username: "caio.bh", vibe: 2, minutesAgo: 300 },
];

/** Gera os posts com datas relativas ao `now` (sempre há ativos e expirados). */
export function buildMockPosts(now: Date): Post[] {
  return SEEDS.map((seed) => {
    const createdAt = new Date(now.getTime() - seed.minutesAgo * 60_000);
    return {
      id: seed.id,
      venueId: seed.venueId,
      userId: `user-${seed.username}`,
      username: seed.username,
      vibe: seed.vibe,
      comment: seed.comment ?? null,
      createdAt: createdAt.toISOString(),
      expiresAt: getExpiresAt(createdAt).toISOString(),
    };
  });
}
```

### `mobile/src/data/mock-profile.ts`
```ts
import type { Profile, Title } from "@/types/models";

// Os títulos secretos abaixo são PROVISÓRIOS: a lista real de easter eggs
// será definida pelo usuário antes da Etapa 9.
export const MOCK_TITLES: Title[] = [
  { id: "inimigo-do-fim", name: "Inimigo do fim", description: "Fez check-in depois das 3h", secret: false },
  { id: "rei-da-noite", name: "Rei da noite", description: "Chegou ao nível 3", secret: false },
  { id: "rainha-baladeira", name: "Rainha baladeira", description: "Fez check-in em 5 baladas diferentes", secret: false },
  { id: "secreto-1", name: "Coruja de Santa Tereza", description: "Easter egg provisório", secret: true },
  { id: "secreto-2", name: "Lenda da Savassi", description: "Easter egg provisório", secret: true },
];

export const MOCK_PROFILE: Profile = {
  id: "user-voce",
  username: "noturno.bh",
  points: 340,
  level: 3,
  streakWeeks: 4,
  selectedTitleId: "inimigo-do-fim",
  unlockedTitleIds: ["inimigo-do-fim", "rei-da-noite"],
};
```

### `mobile/src/services/mock-delay.ts`
```ts
// Simula a demora de uma requisição de rede, para vermos o "carregando".
// Sai na Etapa 4, quando os dados vierem do Supabase de verdade.
export const MOCK_DELAY_MS = 400;

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### `mobile/src/services/venues.ts`
```ts
import { buildMockPosts } from "@/data/mock-posts";
import { MOCK_VENUES } from "@/data/mock-venues";
import { MOCK_DELAY_MS, wait } from "@/services/mock-delay";
import type { Post, Venue } from "@/types/models";

// As telas só conhecem ESTAS funções. Na Etapa 4 trocamos o "miolo"
// (mock → Supabase) sem mexer nas telas. Por isso já são async.

export async function fetchVenues(): Promise<Venue[]> {
  await wait(MOCK_DELAY_MS);
  return MOCK_VENUES;
}

export async function fetchVenueById(id: string): Promise<Venue | null> {
  await wait(MOCK_DELAY_MS);
  return MOCK_VENUES.find((venue) => venue.id === id) ?? null;
}

export async function fetchPosts(): Promise<Post[]> {
  await wait(MOCK_DELAY_MS);
  return buildMockPosts(new Date());
}

export async function fetchPostsByVenue(venueId: string): Promise<Post[]> {
  const posts = await fetchPosts();
  return posts.filter((post) => post.venueId === venueId);
}
```

### `mobile/src/services/profile.ts`
```ts
import { MOCK_PROFILE, MOCK_TITLES } from "@/data/mock-profile";
import { MOCK_DELAY_MS, wait } from "@/services/mock-delay";
import type { Profile, Title } from "@/types/models";

export async function fetchMyProfile(): Promise<Profile> {
  await wait(MOCK_DELAY_MS);
  return MOCK_PROFILE;
}

export async function fetchTitles(): Promise<Title[]> {
  await wait(MOCK_DELAY_MS);
  return MOCK_TITLES;
}
```

### `mobile/__tests__/posts.test.ts`
```ts
import { averageVibe, getActivePosts, getExpiresAt, isPostActive, toVibeLevel } from "@/lib/posts";
import type { Post } from "@/types/models";

// "Agora" fixo → teste sempre dá o mesmo resultado (determinístico).
const NOW = new Date("2026-10-18T23:00:00.000Z");

function makePost(minutesAgo: number, overrides: Partial<Post> = {}): Post {
  const createdAt = new Date(NOW.getTime() - minutesAgo * 60_000);
  return {
    id: `p-${minutesAgo}`,
    venueId: "v1",
    userId: "u1",
    username: "teste",
    vibe: 2,
    comment: null,
    createdAt: createdAt.toISOString(),
    expiresAt: getExpiresAt(createdAt).toISOString(),
    ...overrides,
  };
}

describe("getExpiresAt", () => {
  it("soma 2 horas à data de criação", () => {
    const created = new Date("2026-10-18T20:00:00.000Z");
    expect(getExpiresAt(created).toISOString()).toBe("2026-10-18T22:00:00.000Z");
  });
});

describe("isPostActive", () => {
  it("post de 10 minutos atrás está ativo", () => {
    expect(isPostActive(makePost(10), NOW)).toBe(true);
  });
  it("post de 119 minutos atrás ainda está ativo", () => {
    expect(isPostActive(makePost(119), NOW)).toBe(true);
  });
  it("post com exatamente 2 horas já expirou", () => {
    expect(isPostActive(makePost(120), NOW)).toBe(false);
  });
  it("post de 3 horas atrás expirou", () => {
    expect(isPostActive(makePost(180), NOW)).toBe(false);
  });
});

describe("getActivePosts", () => {
  it("remove expirados e ordena do mais recente ao mais antigo", () => {
    const posts = [makePost(60), makePost(150), makePost(5)];
    expect(getActivePosts(posts, NOW).map((p) => p.id)).toEqual(["p-5", "p-60"]);
  });
});

describe("averageVibe", () => {
  it("retorna null sem posts", () => {
    expect(averageVibe([])).toBeNull();
  });
  it("calcula a média", () => {
    const posts = [makePost(1, { vibe: 1 }), makePost(2, { vibe: 2 }), makePost(3, { vibe: 3 })];
    expect(averageVibe(posts)).toBe(2);
  });
});

describe("toVibeLevel", () => {
  it.each([
    [1.2, 1],
    [2.4, 2],
    [2.5, 3],
    [3, 3],
  ])("média %p vira nível %p", (average, expected) => {
    expect(toVibeLevel(average)).toBe(expected);
  });
});
```

### `mobile/__tests__/ranking.test.ts`
```ts
import { getExpiresAt } from "@/lib/posts";
import { getVenueRanking } from "@/lib/ranking";
import type { Post, Venue } from "@/types/models";

const NOW = new Date("2026-10-18T23:00:00.000Z");

function makeVenue(id: string, name: string): Venue {
  return { id, name, category: "bar", neighborhood: "Savassi", address: "Rua X, 1", latitude: 0, longitude: 0 };
}

function makePost(id: string, venueId: string, minutesAgo: number, vibe: 1 | 2 | 3 = 2): Post {
  const createdAt = new Date(NOW.getTime() - minutesAgo * 60_000);
  return {
    id,
    venueId,
    userId: "u1",
    username: "teste",
    vibe,
    comment: null,
    createdAt: createdAt.toISOString(),
    expiresAt: getExpiresAt(createdAt).toISOString(),
  };
}

const venues = [
  makeVenue("a", "Bar A"),
  makeVenue("b", "Bar B"),
  makeVenue("c", "Bar C"),
  makeVenue("z", "Zeca Bar"),
  makeVenue("d", "Dona Bar"),
];

const posts = [
  // A: 3 ativos, o mais recente há 30 min
  makePost("a1", "a", 30, 3),
  makePost("a2", "a", 40, 3),
  makePost("a3", "a", 50, 3),
  // B: 3 ativos, o mais recente há 5 min → ganha o desempate
  makePost("b1", "b", 5, 1),
  makePost("b2", "b", 60, 1),
  makePost("b3", "b", 90, 1),
  // C: 1 ativo + 2 expirados
  makePost("c1", "c", 10, 2),
  makePost("c2", "c", 130, 2),
  makePost("c3", "c", 300, 2),
  // Z e D: nenhum post
];

describe("getVenueRanking", () => {
  const ranking = getVenueRanking(venues, posts, NOW);

  it("ordena por posts ativos, desempata pelo mais recente e depois pelo nome", () => {
    expect(ranking.map((r) => r.venue.id)).toEqual(["b", "a", "c", "d", "z"]);
  });

  it("não conta posts expirados", () => {
    const c = ranking.find((r) => r.venue.id === "c");
    expect(c?.activePostCount).toBe(1);
  });

  it("calcula a média de animação só dos ativos", () => {
    expect(ranking.find((r) => r.venue.id === "a")?.averageVibe).toBe(3);
  });

  it("local sem posts fica com contagem 0, média null e sem último post", () => {
    expect(ranking.find((r) => r.venue.id === "z")).toMatchObject({
      activePostCount: 0,
      averageVibe: null,
      lastPostAt: null,
    });
  });

  it("não altera o array original de locais", () => {
    expect(venues.map((v) => v.id)).toEqual(["a", "b", "c", "z", "d"]);
  });
});
```

### `mobile/__tests__/format.test.ts`
```ts
import { formatActivity, formatTimeAgo } from "@/lib/format";

const NOW = new Date("2026-10-18T23:00:00.000Z");

function minutesAgo(minutes: number): string {
  return new Date(NOW.getTime() - minutes * 60_000).toISOString();
}

describe("formatTimeAgo", () => {
  it.each([
    [0, "agora"],
    [15, "há 15 min"],
    [60, "há 1h"],
    [65, "há 1h05"],
    [110, "há 1h50"],
  ])("%p minutos → %p", (minutes, expected) => {
    expect(formatTimeAgo(minutesAgo(minutes), NOW)).toBe(expected);
  });
});

describe("formatActivity", () => {
  it("sem posts", () => expect(formatActivity(0)).toBe("Parado por enquanto"));
  it("singular", () => expect(formatActivity(1)).toBe("1 post nas últimas 2h"));
  it("plural", () => expect(formatActivity(3)).toBe("3 posts nas últimas 2h"));
});
```

Resultado esperado de `npm test`: 3 suites e todos os testes passando. Para mostrar ao usuário que o teste protege a regra, sugira um exercício: trocar `<` por `<=` em `isPostActive` e ver o teste "exatamente 2 horas" falhar.

Commits do 2b (sugestão: 2 commits):
- `chore(mobile): configura Jest e React Native Testing Library`
- `feat(mobile): adiciona tipos, dados mock e regras de expiração e ranking`

---

## 5. Sub-etapa 2c: feed com FlatList e VenueCard

Crie a pasta `src/components`.

### `mobile/src/components/VibeIndicator.tsx`
```tsx
import { StyleSheet, Text, View } from "react-native";

import { VIBE_LABELS } from "@/constants/labels";
import { colors } from "@/constants/theme";
import { toVibeLevel } from "@/lib/posts";

type VibeIndicatorProps = {
  vibe: number | null; // média de animação (ex.: 2.6) ou null sem posts
};

export function VibeIndicator({ vibe }: VibeIndicatorProps) {
  if (vibe === null) {
    return <Text style={styles.empty}>—</Text>;
  }
  const level = toVibeLevel(vibe);
  return (
    <View style={styles.container}>
      <Text style={styles.flames}>{"🔥".repeat(level)}</Text>
      <Text style={styles.label}>{VIBE_LABELS[level]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", minWidth: 72 },
  flames: { fontSize: 18 },
  label: { marginTop: 2, fontSize: 12, color: colors.accent },
  empty: { minWidth: 72, textAlign: "center", fontSize: 18, color: colors.muted },
});
```

### `mobile/src/components/VenueCard.tsx`
```tsx
import { Pressable, StyleSheet, Text, View } from "react-native";

import { VibeIndicator } from "@/components/VibeIndicator";
import { CATEGORY_LABELS } from "@/constants/labels";
import { colors } from "@/constants/theme";
import { formatActivity } from "@/lib/format";
import type { Venue } from "@/types/models";

// PROPS = dados que o "pai" (a tela) entrega para o componente.
// O card não busca nada nem sabe navegar: só desenha e avisa quando é tocado.
type VenueCardProps = {
  venue: Venue;
  activePostCount: number;
  averageVibe: number | null;
  position?: number; // posição no ranking (1, 2, 3...)
  onPress?: () => void;
};

export function VenueCard({ venue, activePostCount, averageVibe, position, onPress }: VenueCardProps) {
  const isActive = activePostCount > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${venue.name}`}
      style={({ pressed }) => [styles.card, !isActive && styles.cardInactive, pressed && styles.cardPressed]}
    >
      {position !== undefined && <Text style={styles.position}>{`${position}º`}</Text>}
      <View style={styles.info}>
        <Text style={styles.name}>{venue.name}</Text>
        <Text style={styles.meta}>{`${CATEGORY_LABELS[venue.category]} · ${venue.neighborhood}`}</Text>
        <Text style={[styles.activity, isActive && styles.activityOn]}>{formatActivity(activePostCount)}</Text>
      </View>
      <VibeIndicator vibe={averageVibe} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  cardInactive: { opacity: 0.6 },
  cardPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  position: { fontSize: 18, fontWeight: "bold", color: colors.accent, minWidth: 32 },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: "bold", color: colors.text },
  meta: { marginTop: 2, fontSize: 13, color: colors.muted },
  activity: { marginTop: 6, fontSize: 13, color: colors.muted },
  activityOn: { color: colors.highlight },
});
```

### `mobile/src/components/EmptyState.tsx`
```tsx
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

type EmptyStateProps = {
  emoji?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ emoji = "🌙", title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {message !== undefined && <Text style={styles.message}>{message}</Text>}
      {actionLabel !== undefined && onAction !== undefined && (
        <Pressable onPress={onAction} accessibilityRole="button" style={styles.button}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 24 },
  emoji: { fontSize: 40 },
  title: { marginTop: 12, fontSize: 18, fontWeight: "bold", color: colors.text, textAlign: "center" },
  message: { marginTop: 6, fontSize: 14, color: colors.muted, textAlign: "center" },
  button: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 999, backgroundColor: colors.accent },
  buttonText: { fontSize: 15, fontWeight: "bold", color: colors.background },
});
```

### `mobile/src/app/(tabs)/index.tsx` (FINAL)
```tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { VenueCard } from "@/components/VenueCard";
import { colors } from "@/constants/theme";
import { getVenueRanking, type VenueRanking } from "@/lib/ranking";
import { fetchPosts, fetchVenues } from "@/services/venues";

// Busca os dados (service) e calcula o ranking (lib). Fica fora do componente
// porque não depende de nada da tela.
async function loadRanking(): Promise<VenueRanking[]> {
  const [venues, posts] = await Promise.all([fetchVenues(), fetchPosts()]);
  return getVenueRanking(venues, posts, new Date());
}

export default function FeedScreen() {
  const router = useRouter();
  // ESTADO = memória da tela. Quando muda, a tela redesenha.
  const [ranking, setRanking] = useState<VenueRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Roda uma vez quando a tela aparece ([] = sem dependências).
  useEffect(() => {
    loadRanking().then((result) => {
      setRanking(result);
      setIsLoading(false);
    });
  }, []);

  // Puxar a lista para baixo → recarrega.
  async function handleRefresh() {
    setIsRefreshing(true);
    const result = await loadRanking();
    setRanking(result);
    setIsRefreshing(false);
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <FlatList
      data={ranking}
      keyExtractor={(item) => item.venue.id}
      renderItem={({ item, index }) => (
        <VenueCard
          venue={item.venue}
          position={index + 1}
          activePostCount={item.activePostCount}
          averageVibe={item.averageVibe}
          onPress={() => router.push({ pathname: "/venue/[id]", params: { id: item.venue.id } })}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.subtitle}>Descubra onde a noite está rolando em BH</Text>
          <Text style={styles.hint}>Os rolês mais quentes da região</Text>
        </View>
      }
      ListEmptyComponent={<EmptyState title="Nenhum local cadastrado" message="Volte mais tarde!" />}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.accent} />
      }
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { padding: 16 },
  header: { marginBottom: 16 },
  subtitle: { fontSize: 16, color: colors.accent },
  hint: { marginTop: 4, fontSize: 14, color: colors.highlight },
  separator: { height: 12 },
});
```
Observações: o link temporário saiu. Tratamento de erro (`.catch`) e cancelamento do efeito ficam para as Etapas 4 e 11, porque o mock nunca falha. O texto do hint precisa ser confirmado com o usuário (ver seção 0, item 9).

### `mobile/__tests__/VenueCard.test.tsx`
```tsx
import { fireEvent, render, screen } from "@testing-library/react-native";

import { VenueCard } from "@/components/VenueCard";
import type { Venue } from "@/types/models";

const venue: Venue = {
  id: "v-test",
  name: "Bar do Teste",
  category: "bar",
  neighborhood: "Savassi",
  address: "Rua Teste, 1",
  latitude: 0,
  longitude: 0,
};

describe("VenueCard", () => {
  it("mostra nome, categoria, bairro, posts ativos e animação", async () => {
    await render(<VenueCard venue={venue} activePostCount={3} averageVibe={2.6} />);
    expect(screen.getByText("Bar do Teste")).toBeOnTheScreen();
    expect(screen.getByText("Bar · Savassi")).toBeOnTheScreen();
    expect(screen.getByText("3 posts nas últimas 2h")).toBeOnTheScreen();
    expect(screen.getByText("Bombando")).toBeOnTheScreen();
  });

  it("mostra 'Parado por enquanto' quando não há posts ativos", async () => {
    await render(<VenueCard venue={venue} activePostCount={0} averageVibe={null} />);
    expect(screen.getByText("Parado por enquanto")).toBeOnTheScreen();
  });

  it("avisa o pai quando é tocado", async () => {
    const handlePress = jest.fn();
    await render(<VenueCard venue={venue} activePostCount={1} averageVibe={1} onPress={handlePress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Ver detalhes de Bar do Teste" }));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});
```
(O VenueCard foi feito de propósito sem router e sem expo-symbols. Assim o teste não precisa simular navegação nem módulos nativos. É um bom argumento para "componentes burros + tela inteligente".)

Commit do 2c: `feat(mobile): lista locais ranqueados no feed com VenueCard`

---

## 6. Sub-etapa 2d: tela do local e perfil

### `mobile/src/components/PostItem.tsx`
```tsx
import { StyleSheet, Text, View } from "react-native";

import { VIBE_LABELS } from "@/constants/labels";
import { colors } from "@/constants/theme";
import { formatTimeAgo } from "@/lib/format";
import type { Post } from "@/types/models";

type PostItemProps = {
  post: Post;
  now: Date; // "agora" vem de fora → o componente continua puro
};

export function PostItem({ post, now }: PostItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.username}>@{post.username}</Text>
        <Text style={styles.time}>{formatTimeAgo(post.createdAt, now)}</Text>
      </View>
      <Text style={styles.vibe}>{`${"🔥".repeat(post.vibe)} ${VIBE_LABELS[post.vibe]}`}</Text>
      {post.comment !== null && <Text style={styles.comment}>{post.comment}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 14, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  topRow: { flexDirection: "row", justifyContent: "space-between" },
  username: { fontSize: 14, fontWeight: "bold", color: colors.text },
  time: { fontSize: 12, color: colors.muted },
  vibe: { marginTop: 6, fontSize: 14, color: colors.accent },
  comment: { marginTop: 6, fontSize: 14, color: colors.text },
});
```

### `mobile/src/app/venue/[id].tsx` (FINAL)
```tsx
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { PostItem } from "@/components/PostItem";
import { VibeIndicator } from "@/components/VibeIndicator";
import { CATEGORY_LABELS } from "@/constants/labels";
import { POST_DURATION_HOURS } from "@/constants/rules";
import { colors } from "@/constants/theme";
import { formatActivity } from "@/lib/format";
import { averageVibe, getActivePosts } from "@/lib/posts";
import { fetchPostsByVenue, fetchVenueById } from "@/services/venues";
import type { Post, Venue } from "@/types/models";

// Os 3 "momentos" possíveis da tela. O TypeScript garante que, em "ready",
// venue e posts existem (sem precisar checar null em todo lugar).
type ScreenState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "ready"; venue: Venue; activePosts: Post[]; loadedAt: Date };

export default function VenueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<ScreenState>({ status: "loading" });

  // [id] = roda de novo se o id da URL mudar.
  useEffect(() => {
    Promise.all([fetchVenueById(id), fetchPostsByVenue(id)]).then(([venue, posts]) => {
      if (venue === null) {
        setState({ status: "not-found" });
        return;
      }
      const loadedAt = new Date();
      setState({ status: "ready", venue, activePosts: getActivePosts(posts, loadedAt), loadedAt });
    });
  }, [id]);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  if (state.status === "loading") {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Carregando..." }} />
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (state.status === "not-found") {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Local não encontrado" }} />
        <EmptyState
          emoji="🤷"
          title="Local não encontrado"
          message="Esse local não existe ou saiu do ar."
          actionLabel="Voltar"
          onAction={goBack}
        />
      </View>
    );
  }

  const { venue, activePosts, loadedAt } = state;

  return (
    <>
      <Stack.Screen options={{ title: venue.name }} />
      <FlatList
        data={activePosts}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => <PostItem post={item} now={loadedAt} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.name}>{venue.name}</Text>
            <Text style={styles.meta}>{`${CATEGORY_LABELS[venue.category]} · ${venue.neighborhood}`}</Text>
            <Text style={styles.address}>{`📍 ${venue.address}`}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.activity}>{formatActivity(activePosts.length)}</Text>
              <VibeIndicator vibe={averageVibe(activePosts)} />
            </View>
            <Text style={styles.sectionTitle}>O que estão dizendo</Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            emoji="😴"
            title="Nada rolando agora"
            message={`Ninguém postou aqui nas últimas ${POST_DURATION_HOURS} horas.`}
          />
        }
        contentContainerStyle={styles.content}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 16 },
  header: { marginBottom: 16 },
  name: { fontSize: 26, fontWeight: "bold", color: colors.text },
  meta: { marginTop: 4, fontSize: 14, color: colors.accent },
  address: { marginTop: 4, fontSize: 14, color: colors.muted },
  statsRow: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activity: { fontSize: 14, color: colors.highlight },
  sectionTitle: { marginTop: 24, fontSize: 18, fontWeight: "bold", color: colors.text },
  separator: { height: 10 },
});
```
Teste manual do id desconhecido: no 2d, coloque temporariamente `<Link href="/venue/xyz">` no feed, ou abra `qualaboa://venue/xyz` pelo Safari no iPhone. A segunda opção pode não funcionar no Expo Go (lá o scheme é `exp://`), então o link temporário é a opção mais simples.

### `mobile/src/app/(tabs)/perfil.tsx` (FINAL)
```tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import { fetchMyProfile, fetchTitles } from "@/services/profile";
import type { Profile, Title } from "@/types/models";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [titles, setTitles] = useState<Title[]>([]);
  // Título escolhido: só na memória por enquanto (salvar no banco = Etapa 9).
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchMyProfile(), fetchTitles()]).then(([loadedProfile, loadedTitles]) => {
      setProfile(loadedProfile);
      setTitles(loadedTitles);
      setSelectedTitleId(loadedProfile.selectedTitleId);
    });
  }, []);

  if (profile === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const selectedTitle = titles.find((title) => title.id === selectedTitleId);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.avatar}>🦉</Text>
        <Text style={styles.username}>@{profile.username}</Text>
        <Text style={styles.selectedTitle}>
          {selectedTitle ? `👑 ${selectedTitle.name}` : "Sem título escolhido"}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <StatBox label="Pontos" value={String(profile.points)} />
        <StatBox label="Nível" value={String(profile.level)} />
        <StatBox label="Streak" value={`${profile.streakWeeks} sem. 🔥`} />
      </View>

      <Text style={styles.sectionTitle}>Seus títulos</Text>
      <Text style={styles.sectionHint}>Toque num título desbloqueado para exibi-lo no perfil.</Text>

      {titles.map((title) => {
        const isUnlocked = profile.unlockedTitleIds.includes(title.id);
        const isSelected = title.id === selectedTitleId;
        const isHiddenSecret = title.secret && !isUnlocked;

        let status = "🔒 Bloqueado";
        if (isSelected) status = "✅ Exibindo";
        else if (isUnlocked) status = "Desbloqueado";

        return (
          <Pressable
            key={title.id}
            disabled={!isUnlocked}
            onPress={() => setSelectedTitleId(title.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled: !isUnlocked }}
            style={[styles.titleRow, isSelected && styles.titleRowSelected, !isUnlocked && styles.titleRowLocked]}
          >
            <Text style={styles.titleName}>{isHiddenSecret ? "??? (título secreto)" : title.name}</Text>
            <Text style={styles.titleDescription}>
              {isHiddenSecret ? "Continue explorando a noite para descobrir." : title.description}
            </Text>
            <Text style={styles.titleStatus}>{status}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// Componente pequeno, usado só aqui → pode morar no mesmo arquivo.
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 16, paddingBottom: 32 },
  header: { alignItems: "center", marginBottom: 20 },
  avatar: { fontSize: 56 },
  username: { marginTop: 8, fontSize: 22, fontWeight: "bold", color: colors.text },
  selectedTitle: { marginTop: 4, fontSize: 15, color: colors.accent },
  statsRow: { flexDirection: "row", gap: 10 },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: colors.text },
  statLabel: { marginTop: 2, fontSize: 12, color: colors.muted },
  sectionTitle: { marginTop: 28, fontSize: 18, fontWeight: "bold", color: colors.text },
  sectionHint: { marginTop: 4, marginBottom: 12, fontSize: 13, color: colors.muted },
  titleRow: {
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleRowSelected: { borderColor: colors.accent, borderWidth: 2 },
  titleRowLocked: { opacity: 0.5 },
  titleName: { fontSize: 16, fontWeight: "bold", color: colors.text },
  titleDescription: { marginTop: 2, fontSize: 13, color: colors.muted },
  titleStatus: { marginTop: 6, fontSize: 12, color: colors.accent },
});
```

Commit do 2d: `feat(mobile): adiciona telas de local e perfil com dados mock`
Fechamento: `docs: registra etapa 2 no PROGRESSO`. Se o usuário preferir um commit único (o CLAUDE.md fala em "commit ao final da etapa"), use `feat(mobile): adiciona navegação, feed, local e perfil com dados mock e testes`. Recomendo commits por sub-etapa: o histórico fica menor e mais didático.

---

## 7. Conceitos para a parte E (fixação)
Rotas por arquivo, grupo `(tabs)` e rota dinâmica `[id]`; Stack vs Tabs; `useLocalSearchParams`; `router.push` com `pathname` e `params` (rotas tipadas); componente, props e tipo de props; estado (`useState`) e efeito (`useEffect`) com dependências; FlatList (`data`, `keyExtractor`, `renderItem`, Header, Empty, Separator) e por que FlatList em vez de `map` em listas longas; `RefreshControl`; async/await e `Promise.all`; função pura e injeção de `now` para testes determinísticos; tipo união discriminada (`ScreenState`); Jest (`describe`, `it`, `expect`, `it.each`) e RNTL (`await render`, `screen.getByText`, `getByRole`, `await fireEvent.press`, `jest.fn`).

Exercício sugerido: adicionar um 9º local mock com 5 posts ativos e prever, antes de abrir o app, em que posição ele aparece. Depois, escrever o teste no `ranking.test.ts`.
Pergunta de revisão: "Por que `isPostActive` recebe `now` em vez de chamar `new Date()` lá dentro?"

## 8. Riscos e possíveis erros
- `tsc` reclamando de `"/venue/[id]"` no `router.push`: os tipos das rotas ainda não foram gerados. Rode `npx expo start` uma vez e depois o `tsc` de novo.
- Tela branca ou "Unmatched route" logo depois de mover o index: `npx expo start --clear`.
- Erro ERESOLVE envolvendo test-renderer/react: confira se a versão instalada é `test-renderer@~1.2.0`.
- "Cannot find module '@react-native/jest-preset'": `npm install --save-dev "@react-native/jest-preset@~0.86.3"`.
- Teste do VenueCard com warning de `act(...)`: confira se há `await` antes de `render` e de `fireEvent.press` (RNTL v14).
- Nenhum arquivo de teste dentro de `src/app`. O expo-router transformaria esses arquivos em rotas.

### Arquivos principais
- mobile\src\app\_layout.tsx
- mobile\src\app\(tabs)\_layout.tsx (novo; `Tabs` vem de `expo-router/js-tabs`)
- mobile\src\lib\ranking.ts e mobile\src\lib\posts.ts (novos)
- mobile\src\app\(tabs)\index.tsx (movido de src\app\index.tsx)
- mobile\package.json (scripts, bloco jest com moduleNameMapper)