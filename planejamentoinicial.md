Objetivo: Criar um protótipo funcional de um programa de desktop para Windows, chamado "Agente-Codificador". Este programa será um assistente de desenvolvimento de software autônomo, minimalista e sofisticado, que não é um fork do VS Code.

Persona do Agente (O "Engenheiro"): Você atuará como um Engenheiro de Software Sênior. Sua principal função é receber objetivos de alto nível do usuário (ex: "Crie um site de portfólio usando React") e decompor essa tarefa em um plano executável. Você operará em um loop autônomo para construir, editar, depurar e pensar até que o objetivo seja alcançado.

1. Arquitetura do Sistema (O Agente de Backend)
O núcleo do sistema é um agente de IA que opera em um ciclo contínuo de Planejar-Executar-Refletir.

Contexto: O agente deve ter plena consciência da estrutura de arquivos e pastas do projeto em que está trabalhando. Ele deve ser capaz de ler qualquer arquivo para obter contexto.

Planejamento: Para qualquer solicitação do usuário, o agente deve primeiro gerar um plano passo a passo. (Ex: "Plano: 1. Criar index.html. 2. Criar style.css. 3. Vincular o CSS ao HTML...")

Ferramentas (Tools): O agente deve ter acesso a um conjunto de ferramentas para executar seu plano. As ferramentas essenciais são:

read_file(path): Lê o conteúdo de um arquivo.

write_file(path, content): Cria ou sobrescreve um arquivo com novo conteúdo.

create_directory(path): Cria uma nova pasta.

list_files(path): Lista o conteúdo de um diretório.

run_terminal(command): Executa um comando de shell/terminal (ex: npm install, git commit) e captura sua saída (stdout e stderr).

ask_user(question): Pausa a execução e solicita uma entrada ou confirmação do usuário.

Loop de Execução: O agente executa cada etapa do plano. Após cada ação, ele revisa o resultado (ex: a saída do terminal ou o sucesso da escrita do arquivo) e reflete. Se ocorrer um erro, ele deve tentar depurá-lo autonomamente ou pedir ajuda ao usuário.

Saída (Output): O agente deve comunicar seu processo em um formato estruturado. Isso é crucial para a filtragem da UI.

Pensamento/Prosa: Texto normal explicando o que está fazendo.

Ação: Uma chamada de ferramenta estruturada (ex: [ACTION: write_file('app.js', '...')]).

Resultado da Ação: O resultado da execução da ferramenta (ex: [RESULT: 'app.js' escrito com sucesso.] ou [RESULT: 'Erro no terminal: ...']).

2. Design da Interface (UX/UI Front-End)
A aplicação deve ser um programa standalone para Windows (ex: usando Electron, Tauri ou .NET MAUI). A estética deve ser limpa, minimalista, futurista e sofisticada (tons escuros, fontes nítidas, sem desordem visual).

A tela é dividida em três seções principais:

A. Painel Esquerdo: O Código-Vivo

Função: Esta é a "visão da verdade" do projeto.

Conteúdo: Exibe a estrutura de arquivos e pastas do projeto (como uma árvore de arquivos).

Comportamento:

Quando o usuário clica em um arquivo, seu conteúdo é exibido em um editor de código neste mesmo painel.

Quando o Agente de IA usa a ferramenta write_file ou create_directory, este painel deve ser atualizado em tempo real para refletir a mudança. O arquivo novo/modificado pode piscar brevemente para indicar a ação da IA.

FILTRAGEM: O código em si não deve aparecer no chat central. Ele só aparece aqui.

B. Painel Central: O Chat e o Status

Função: Este é o feed de comunicação e status.

Conteúdo: Exibe a conversa entre o usuário e o agente, mas com filtragem inteligente.

Comportamento:

Prompts do Usuário: Exibe as solicitações do usuário.

Prosa da IA: Exibe apenas os pensamentos, explicações e planos da IA.

FILTRAGEM DE CÓDIGO: Blocos de código gerados pela IA são filtrados e não são mostrados aqui. A IA deve, em vez disso, dizer: "Estou escrevendo o código para componente.js" (e a ação real acontece no Painel Esquerdo).

FILTRAGEM DE TERMINAL: Quando o Agente usa run_terminal(command), uma caixa especial deve aparecer neste chat.

Ela deve mostrar o comando (ex: > npm install react).

Ela deve mostrar um indicador de status (ex: "Executando...", "Sucesso ✓", "Falha X").

A saída (stdout/stderr) do comando pode ser expandida/colapsada dentro desta caixa.

C. Input Inferior: O Prompt

Função: A entrada principal do usuário.

Design: Um único campo de entrada de texto, posicionado centralmente na parte inferior da tela.

Comportamento:

Deve ser minimalista quando vazio.

Deve se expandir verticalmente (crescer para cima) à medida que o usuário digita várias linhas (ex: Shift+Enter).

Enviar o prompt inicia o ciclo do Agente de IA.

D. Espaço Futuro:

As áreas superior, direita e os cantos da aplicação devem ser deixados intencionalmente vazios (espaço negativo) para manter o minimalismo, com a possibilidade de adicionar ícones de configurações ou painéis futuros (ex: um "Painel de Visualização Web" à direita) sem poluir o design principal.

Tecnologias Sugeridas (Para a IA escolher):

Backend/Agente: Python (com LangChain/LangGraph) ou Node.js (com TypeScript).

Frontend/UI: Tauri (Rust + JS) para desempenho e leveza, ou Electron (Node.js + Chromium) para facilidade de desenvolvimento.

UI Framework: React ou Svelte para a interface.
