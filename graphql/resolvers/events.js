
const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

const USER_ID = '5c7723a3e555214ae278da01';

module.exports = {
    events: async () => {
        try{
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event)
            })
        } catch(err) {
            throw err;
        }
    },
    createEvent: async args => {
        try{
            const event = new Event({
                title: args.eventInput.title, 
                description: args.eventInput.description, 
                price: +args.eventInput.price, 
                date: new Date(args.eventInput.date),
                creator: USER_ID
            });
            const result = await event.save(); 
            const createdEvent = transformEvent(result)

            const eventCreator = await User.findById(USER_ID);
            if(!eventCreator){
                throw new Error('User not found!!')
            }
            eventCreator.createdEvents.push(event);
            await eventCreator.save();
            return createdEvent;
        } catch (err) {
            throw err;
        }    
    }
}