const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken')

module.exports = {
    createUser: async args => {
        try {
            const userExists = await User.findOne({email: args.userInput.email});
            
            if(userExists){
                throw new Error('User already exists!!')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);  
            const newUser = new User({
                email:  args.userInput.email,
                password: hashedPassword,
            })
            const result = await newUser.save();
            return {
                ...result._doc, 
                password: null,  
                _id: result.id
            }
        } catch (err) {
            throw err;
        }    
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({email});
        if(!user){
            throw new Error('User does not exist!');
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'SECRET_KEY', {
            expiresIn: '1h'
        });

        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    }
}