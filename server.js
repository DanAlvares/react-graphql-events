const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const app = express();

const schema = require('./graphql/schema');
const rootValue = require('./graphql/resolvers');

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
        schema,
        rootValue,
        graphiql: true
    })
);

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds351455.mlab.com:51455/${process.env.MONGO_DB}`)
    .then(() => {})
    .catch((err) => {
        console.log(err)
    })

app.listen(3001, () => console.log(`Running on port 3001`));
