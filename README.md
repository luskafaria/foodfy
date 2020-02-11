
<h1 align="center">
FOODFY
  <br>
  <br>
  <img src="https://github.com/luskafaria/foodfy/blob/master/public/assets/chef.png" alt="FOODFY LOGO" width="200">

<br>  
<br>
 DESAFIO FINAL DO BOOTCAMP LAUNCHBASE
</h1>

<p align="center">Projeto desenvolvido como critério de aprovação para o bootcamp ministrado pela Rocketseat.</p>
<p align="center">Agradecimento especial ao instrutor <a href='https://github.com/maykbrito/'>Mayk Brito</a> por toda a dedicação ao desenvolvimento de seus alunos.</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  </a>
</p>

<hr />

## Características

Este projeto é uma representação teórica de um sistema de gerenciamento de site de receitas. Para construí-lo foram empregados os conceitos mais fundamentais do desenvolvimento web, passando pelo frontend e backend.

## Ingredientes

- NodeJS v13.2.0
- PostgreSQL
- Nunjucks
- Editor de texto da sua preferência

## Modo de preparo

0) Copie este repositório como preferir: clone ou download;
1) No terminal, execute o comando npm install para instalar todas as dependências;
2) Adicione as credenciais de acesso ao banco de dados no arquivo src/app/config/db.js. Neste projeto utilizamos o PostgreSQL;
3) Com o banco de dados ativo, execute a rotina de população do banco de dados que está no arquivo seed.js;
4) Adicione, caso ainda não exista, uma imagem de sua preferência à pasta public/images e utilize o nome 'placeholder.png'. Este arquivo será utilizado como imagem para todos os chefs e receitas da nossa apliação;

**_Atenção ao excluir usuários e chefs pois estamos utilizando o mesmo placeholder para os avatares e imagens de receitas. Lembre-se de criar um novo arquivo com o nome 'placeholder.png' na pasta public/images sempre que excluir um chef ou receita._**

5) Execute a aplicação com o comando npm start.

## Observações

Para acessar a área restrita basta escolher algum usuário na tabela 'users', copiar o endereço de e-mail e utilizar a senha padrão '1'.

Para utilizar a função de recuperação de senha inclua a configuração do mailtrap no arquivo src/lib/mailer.js.

Caso seu banco de dados já esteja populado e tenha a tabela foodfy criada, execute a rotina de higienização que se encontra no arquivo foodfydb.sql com a tag --to run seeds.

Crie novos chefs e receitas antes de testar as lógicas de remoção e edição, pois os elementos criados pelo seed.js compartilham o mesmo placeholder.


Rende infinitas porções. :hearth:

## Licença

Esse projeto está sob a licença MIT. Veja a página [LICENSE](https://opensource.org/licenses/MIT) para mais detalhes.
