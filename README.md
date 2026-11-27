# AcessRun

Site da AcessRun: uma plataforma de corrida pensada para pessoas com deficiência (PCD). Inspirada no Strava, no Nike Run Club e no adidas Running, mas com acessibilidade em primeiro lugar.

## O que o site faz

- **Registrar atividade** em cinco modalidades: cadeira de rodas, handbike, corrida com prótese, corrida com guia e caminhada ou corrida adaptada. Calcula ritmo e velocidade, tem cronômetro, medição por GPS e avisos por voz durante o treino.
- **Feed da comunidade** com aplausos (como os kudos do Strava).
- **Rotas acessíveis** com filtros (sem degraus, piso liso, inclinação, banheiro acessível, iluminação, sombra) e avaliação feita pelos usuários.
- **Provas com categoria PCD**, com filtro por categoria e detalhes de largada adaptada.
- **Encontre um guia**: cadastro para quem precisa de guia e para guias voluntários, com consentimento da LGPD.
- **Comunidade**: clubes e um desafio coletivo do mês.

## Recursos de acessibilidade

- Painel de ajustes (botão **Acessibilidade** ou **Alt + A**): tamanho do texto até 150%, alto contraste, leitura facilitada para dislexia, reduzir animações, destacar links e foco, cursor grande e régua de leitura. As escolhas ficam salvas no navegador.
- Leitura em voz alta de cada seção e do texto selecionado.
- Tradutor de Libras **VLibras** (carregado a partir de vlibras.gov.br).
- Comandos de voz (Chrome e Edge): "registrar", "rotas", "provas", "guias", "contraste", "aumentar", "diminuir", "ler".
- Navegação por teclado, link "Pular para o conteúdo", foco sempre visível, textos alternativos e avisos para leitores de tela (NVDA, VoiceOver, TalkBack).
- Fonte Atkinson Hyperlegible, criada para pessoas com baixa visão.

Meta: WCAG 2.2 nível AA e a Lei Brasileira de Inclusão (Lei 13.146/2015).

## Estrutura

```
index.html              página
css/style.css           estilos (temas claro, escuro e alto contraste)
js/app.js               funcionamento do site
js/firebase.js          conexão com o Firestore
js/firebase-config.js   suas chaves do Firebase (preencher)
assets/                 logo e ilustração
firestore.rules         regras de segurança do banco
firebase.json           configuração do Firebase Hosting
```

## Ligar o Firebase

Sem configuração, o site funciona em **modo demonstração**: os dados ficam salvos só no navegador de quem usa.

1. No [Console do Firebase](https://console.firebase.google.com), abra o seu projeto.
2. Em **Configurações do projeto > Seus apps**, crie um **App da Web** e copie o objeto `firebaseConfig`.
3. Cole os valores em `js/firebase-config.js`.
4. Em **Firestore Database**, crie o banco (modo de produção).
5. Em **Firestore Database > Regras**, cole o conteúdo de `firestore.rules` e publique.

O site cria sozinho estas coleções:

| Coleção | O que guarda | Quem lê |
|---|---|---|
| `atividades` | treinos do feed e aplausos | todos |
| `avaliacoesRotas` | notas de acessibilidade das rotas | todos |
| `cadastrosGuia` | pedidos de guia e guias voluntários | só a equipe, no Console |

As chaves do `firebaseConfig` podem ficar no código: elas identificam o projeto, e quem protege os dados são as regras do Firestore.

## Publicar

**GitHub Pages:** no repositório, vá em **Settings > Pages**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.

**Firebase Hosting:**

```
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy
```

GPS, microfone (comandos de voz) e VLibras só funcionam com o site publicado em HTTPS.

## Fontes da pesquisa

- IBGE, PNAD Contínua 2022: 18,6 milhões de pessoas com deficiência no Brasil.
- Strava: suporte (tipos de esporte com cadeira de rodas e handbike) e relatório Year in Sport 2025.
- Nike Newsroom (novembro de 2024): cerca de 300 corridas guiadas por áudio e seis planos de treino no Nike Run Club.
- App Store: adidas Running, com mais de 90 esportes e comunidades adidas Runners.
- Cyclocosm (2021): análise de acessibilidade do site do Strava.
