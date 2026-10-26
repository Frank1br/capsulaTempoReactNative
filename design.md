Crie o design das telas de um aplicativo mobile chamado "Cápsula do Tempo".

CONCEITO
O usuário escreve mensagens para o seu "eu do futuro", com uma foto e uma data de abertura. Até essa data chegar, a cápsula fica trancada: aparece na lista, mas o conteúdo não pode ser lido. Quando a data chega, ela é "aberta" e a mensagem é revelada.

PLATAFORMA
App mobile em React Native com Expo (Expo Router). Tela de celular em retrato, com cerca de 390x844. Os layouts devem ser fáceis de implementar com componentes básicos (View, Text, Image, FlatList, TextInput, Pressable).

TELAS

0. Splash (abertura do app)
- Fundo na cor principal da paleta, ocupando a tela inteira
- No centro, o ícone do app: uma cápsula ou caixa de cartas com um pequeno cadeado, em traço simples
- Abaixo do ícone, o nome "Cápsula do Tempo" na fonte serifada dos títulos
- Opcional: uma frase curta em fonte menor, como "Escreva hoje. Leia depois."
- Visual limpo, sem botões nem interação
- Entregue duas versões: uma estática (para a splash nativa do Expo, que é só uma imagem centralizada sobre uma cor de fundo) e uma sugestão de animação curta para a transição até a Home (ex.: o cadeado se abrindo ou o ícone aparecendo com fade)

1. Home (lista de cápsulas)
- Cabeçalho com o nome do app e um pequeno resumo (ex.: "3 trancadas · 2 abertas")
- Lista vertical de cards (será uma FlatList)
- Card de cápsula trancada: título, miniatura da foto borrada com ícone de cadeado, contagem regressiva ("abre em 142 dias"), data de criação
- Card de cápsula aberta: título, miniatura nítida, emoji de humor, selo "Aberta"
- Botão flutuante (+) para criar uma nova cápsula
- Estado vazio: ilustração simples e o texto "Nenhuma cápsula ainda. Que tal escrever para o seu eu do futuro?"

2. Detalhes da cápsula (recebe o id por parâmetro de navegação)
- Versão trancada: foto borrada, cadeado grande, contagem regressiva em destaque (dias, horas), título e data em que vai abrir. Sem mostrar a mensagem.
- Versão aberta: foto em destaque no topo, título, emoji de humor, data em que foi escrita, data de abertura, mensagem completa em um bloco de leitura confortável.
- Botão de voltar no topo.

3. Nova cápsula (formulário)
- Seletor de foto (área tracejada "Toque para escolher uma foto" e, depois de escolher, a pré-visualização com opção de trocar)
- Campo: Título
- Campo: Mensagem (texto longo, multilinha)
- Campo: Data de abertura (seletor de data)
- Seletor de humor: chips com emojis 😄 😐 😢 😍 😴
- Botão principal "Selar cápsula"
- Estado de erro: campos obrigatórios vazios com borda vermelha e uma mensagem curta abaixo

4. Estatísticas (opcional, segunda aba)
- Total de cápsulas, quantas abertas, quantas trancadas, próxima a abrir

NAVEGAÇÃO
Navegação em pilha (Home → Detalhes, Home → Nova cápsula). Opcional: uma barra de abas inferior com "Cápsulas" e "Estatísticas".

COMPONENTES REUTILIZÁVEIS
Desenhe-os de forma consistente para que sejam reaproveitados entre as telas:
- CapsuleCard (variações trancada e aberta)
- LockBadge (cadeado + contagem regressiva, usado no card e nos detalhes)
- Input (label, campo, mensagem de erro)
- PrimaryButton
- MoodPicker (chips de emoji)

ESTILO VISUAL
Clima nostálgico e afetivo, como cartas guardadas numa caixa. Paleta quente (tons de papel, creme, terracota) com um acento escuro para contraste. Tipografia serifada nos títulos e sans-serif legível no corpo do texto. Cantos arredondados e sombras suaves. O cadeado e a contagem regressiva devem ser o elemento visual marcante do app. Inclua também uma versão em modo escuro.

DADOS DE EXEMPLO
Use cápsulas fictícias, por exemplo:
- "Para o Frank formado" — trancada, abre em 01/07/2027, humor 😄
- "Primeiro dia de estágio" — aberta, escrita em 10/03/2026, humor 😍
- "Antes da prova de cálculo" — trancada, abre em 15/12/2026, humor 😢