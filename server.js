const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();

const events = []

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => events,
            createEvent: args => {
                const event = {
                    _id: Math.random().toString(),
                    title: args.eventInput.title, 
                    description: args.eventInput.description, 
                    price: +args.eventInput.price, 
                    date: new Date().toISOString()
                };
                events.push(event);
                return event;
            }
        },
        graphiql: true
    })
);

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds351455.mlab.com:51455/graphql-events`)
    .then(() => {})
    .catch((err) => {
        console.log(err)
    })

app.listen(3000, () => console.log(`Running on port 3000`));