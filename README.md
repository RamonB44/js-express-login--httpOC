# js-express-login--httpOC
Backend js + MongoDB | MySql | PostgreSQL V1
-----------------------------------------------\

Crear una base de datos en PostgreSQl segun el archivo .env.example

Ejecutar los siguientes comandos

npm i -save

npm install -g sequelize-cli

npm i dotenv

luego 

export NODE_ENV=development

y al final

npx dotenv -e ./.env sequelize db:migrate

npx dotenv -e ./.env sequelize db:seed:all