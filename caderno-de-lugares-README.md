# Caderno de Lugares — guia de publicação

Este é um app real (não um rascunho de conversa): uma vez publicado, os dados ficam
guardados num banco de dados de verdade (Supabase) e sincronizam **em tempo real**
entre todos os celulares da família, para sempre — não depende do Claude.

Duas contas gratuitas são necessárias: **Supabase** (banco de dados) e **Vercel** (hospedagem).
Nenhuma das duas pede cartão de crédito no plano gratuito.

Tempo estimado: 15–20 minutos, só na primeira vez.

---

## Passo 1 — Criar o banco de dados no Supabase

1. Acesse **https://supabase.com** e crie uma conta gratuita (pode entrar com o Google).
2. Clique em **New project**.
   - Dê um nome, ex: `caderno-de-lugares`
   - Crie uma senha para o banco (guarde num lugar seguro, mas você não vai precisar dela no dia a dia)
   - Escolha a região mais próxima (ex: South America / US East)
   - Clique em **Create new project** e aguarde ~1–2 minutos até provisionar.
3. No menu lateral, abra **SQL Editor**.
4. Abra o arquivo `supabase-schema.sql` (está nesta pasta), copie todo o conteúdo,
   cole no editor do Supabase e clique em **Run**.
   - Isso cria a tabela `places` e liga a sincronização em tempo real.
5. No menu lateral, vá em **Project Settings** (ícone de engrenagem) → **API**.
   - Copie o valor de **Project URL**
   - Copie o valor de **anon public** (a chave "anon")

## Passo 2 — Configurar o app

1. Abra o arquivo `config.js` (nesta pasta) em qualquer editor de texto.
2. Substitua:
   ```js
   const SUPABASE_URL = "COLE_AQUI_A_PROJECT_URL";
   const SUPABASE_ANON_KEY = "COLE_AQUI_A_ANON_PUBLIC_KEY";
   ```
   pelos valores que você copiou no passo anterior. Salve o arquivo.

## Passo 3 — Publicar no Vercel

### Opção A — mais rápida (sem precisar de GitHub)

1. Instale o [Node.js](https://nodejs.org) se ainda não tiver (qualquer versão recente).
2. Abra o Terminal (Mac) ou PowerShell/CMD (Windows) e instale a ferramenta da Vercel:
   ```bash
   npm install -g vercel
   ```
3. Navegue até esta pasta pelo terminal, por exemplo:
   ```bash
   cd caminho/para/caderno-de-lugares
   ```
4. Rode:
   ```bash
   vercel
   ```
   - Vai pedir para logar (abre o navegador — pode usar Google ou GitHub)
   - Pergunta "Set up and deploy?" → Enter (sim)
   - Pergunta o nome do projeto → pode aceitar o padrão ou digitar `caderno-de-lugares`
   - Pergunta o diretório → aceite o padrão (`./`)
   - Não é preciso configurar build command nem output directory — é um site estático
5. Ao final ele mostra uma URL de teste. Para publicar na URL definitiva, rode:
   ```bash
   vercel --prod
   ```
6. Você vai receber uma URL parecida com:
   `https://caderno-de-lugares.vercel.app`

Essa é a URL que você compartilha com a família.

### Opção B — via GitHub (se preferir manter tudo versionado)

1. Crie um repositório novo no GitHub e suba os arquivos desta pasta.
2. Acesse **https://vercel.com**, crie conta/login, clique em **Add New → Project**.
3. Importe o repositório que você criou.
4. Em "Framework Preset" deixe como **Other** (é HTML puro, não precisa de build).
5. Clique em **Deploy**.
6. Ao terminar, você recebe a URL pública do site.

Para atualizar depois: basta dar `git push` — o Vercel publica de novo automaticamente.

## Passo 4 — Usar em família

1. Envie a URL final (ex: `https://caderno-de-lugares.vercel.app`) para todos no WhatsApp/família.
2. Cada pessoa abre no celular e digita o nome dela na primeira vez (fica salvo só naquele aparelho).
3. Dica: em "Adicionar à Tela de Início" (Android) ou "Adicionar à Tela Inicial" (iPhone, no
   Safari, ícone de compartilhar) o site vira um ícone de app na tela do celular.
4. Qualquer lugar adicionado, editado ou removido por alguém aparece **na hora** nos outros
   celulares — não precisa atualizar a página manualmente (a bolinha ao lado do nome fica
   verde quando a sincronização em tempo real está ativa).

---

## Arquivos deste projeto

- `index.html` — o app inteiro (interface + lógica)
- `config.js` — onde você cola a URL e a chave do seu projeto Supabase
- `supabase-schema.sql` — script que cria a tabela no banco de dados
- `README.md` — este guia

## Sobre segurança

Este app é pensado para uso privado em família: qualquer pessoa que tenha a URL do site
consegue ver e editar os lugares (não tem login/senha). Isso é intencional para manter
simples. Recomendações:
- Não divulgue a URL publicamente (redes sociais, grupos grandes etc.)
- Se quiser um nível extra de proteção, o Vercel oferece "Password Protection" nos planos
  pagos; ou posso adicionar um PIN simples de acesso ao app — é só pedir.

## Se algo der errado

- **Aviso amarelo "app não conectado"**: falta preencher `config.js` corretamente (Passo 2).
- **Nada aparece / erro ao carregar**: confira se rodou o `supabase-schema.sql` (Passo 1.4)
  e se colou a URL/chave certas.
- **Mudanças não aparecem em tempo real em outro celular**: verifique a última linha do
  `supabase-schema.sql` (`alter publication supabase_realtime add table places;`) — ela
  precisa ter rodado sem erro.
