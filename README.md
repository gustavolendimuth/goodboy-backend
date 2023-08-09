# Good Boy - Backend
Good Boy é uma plataforma de e-commerce para produtos de animais de estimação, projetada para ser simples, fácil e prática para uso em lojas físicas sem vendedor. Visite [Good Boy](https://goodboy.net.br) para ver o deploy do projeto.

O backend do Good Boy é dividido em duas partes. A primeira parte contém as informações dos produtos que são armazenadas no banco de dados do CMS da [Sanity](https://sanity.io). A segunda parte guarda as informações sobre as vendas, que é construída com ExpressJs e usa o banco de dados MySQL.

## Front-end
[Repositório do Frontend](https://github.com/gustavolendimuth/good-boy)

## Configuração do Projeto
Para configurar o projeto, siga as etapas abaixo:

1. **Instale as Dependências**: Execute o comando `npm install` para instalar todas as dependências necessárias listadas no arquivo `package.json`.
2. **Configure as Variáveis de Ambiente**: Se necessário, configure as variáveis de ambiente relevantes para o projeto, como detalhes do banco de dados e outras configurações específicas.
3. **Preparação do Banco de Dados**: Se você estiver usando a opção de redefinição de banco de dados, certifique-se de ter a variável de ambiente `DATABASE_RESET` configurada como `true`.

## Iniciando o Projeto

Aqui estão os principais comandos para iniciar e gerenciar o projeto:

- **Build**: Execute `npm run build` para compilar o projeto usando o TypeScript.
- **Iniciar o Projeto**: Execute `npm start` para iniciar o projeto. Isso executará os scripts de pré-início e pós-construção conforme definido no `package.json`.
- **Modo de Desenvolvimento**: Execute `npm run dev` para iniciar o projeto em modo de desenvolvimento com o `ts-node-dev`.
- **Gerenciamento de Banco de Dados**: Use `npm run db:setup` para configurar o banco de dados, incluindo a criação, migração e semeadura.
- **Docker Compose**: Utilize os comandos `npm run compose:up`, `npm run compose:down`, `npm run compose:up:dev`, e `npm run compose:down:dev` para gerenciar os contêineres Docker conforme necessário.
- **Logs**: Execute `npm run logs` para visualizar os logs do Docker Compose.
