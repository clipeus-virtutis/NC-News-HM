# Northcoders News API

## Summary

Northcoders News API is a back end project written using Node.js and making use of the express framework to create a REST API. It was written using a TDD approach, using Jest as the testing suite. The database makes use of PostgreSQL. The minimum versions of Node.js and PostgreSQL required are:

Node.js: v16.0

PostgreSQL: v12.9

This API is hosted on heroku, and can be found at the following link: https://hmm-news.herokuapp.com/api/

This link displays information on all available endpoints, and how to use them to make requests to the API.

Northcoders News API contains all of the information you would find relating to a news website. This includes information about articles, comments that relate to specific articles, users, and topics of news articles. This API is used with my front end project to display article information, and allow users to vote on articles and create comments etc. For more details on that project - please visit the following link: https://github.com/clipeus-virtutis/fe-hm-news

## Installation

If you would like to try running this project, first please check you have supported versions of Node.js and PostgreSQL installed locally (see above) - you will then need to clone this repo to your machine. To do this you should navigate to a folder in your CLI where you would like to download this project to, and run the following command:

`git clone https://github.com/clipeus-virtutis/NC-News-HM.git`

Once you have cloned the repo, you will need to open it in your preferred source code editor.

From there, you will need to create two .env files, which contain the names of the databases that are used in our development and test environment:

Create one file named `.env.development` - within this file, paste the following text `PGDATABASE=nc_news`

Create one file named `.env.test` - within this file, paste the following text `PGDATABASE=nc_news_test`

You can now run the command `npm i` to install all dependencies that the project requires - you can view a list of these from within the package.json file as well as some useful scripts.

The most important scripts will be `npm run setup-dbs` which will create the required databases, and `npm run seed` which will seed the databases with data contained within the project files.

Finally, you can run `npm t` to run all tests. Alternatively you can run `npm t utils` to just run the tests contained within `utils.test.js`, or `npm t app` to run only the tests contained within `app.test.js`
