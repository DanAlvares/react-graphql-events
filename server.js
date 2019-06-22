const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const isAuth = require('./middleware/authenticate')
const app = express();

const schema = require('./graphql/schema');
const rootValue = require('./graphql/resolvers');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(bodyParser.json());
app.use(isAuth);
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
