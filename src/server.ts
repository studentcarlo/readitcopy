import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
const PORT = process.env.PORT
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import subRoutes from './routes/subs';
import miscRoutes from './routes/misc'
import userRoutes from './routes/users'
import trim from './middleware/trim';


const app = express();
app.use(express.json())
app.use(morgan('dev'))

app.use(trim)
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin:process.env.ORIGIN,
    optionsSuccessStatus: 200
}))
app.use(express.static('public'))
app.get('/',(_,res) => res.send('Hello World'));
// user authRoutes for all endpoint starting with '/api/auth'
app.use('/api/auth',authRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/subs',subRoutes);
app.use('/api/misc',miscRoutes);
app.use('/api/users',userRoutes);


app.listen(PORT,async () => {
    console.log(`Server running at http://localhost:${PORT}`)

    try {
        await createConnection()
        console.log('Database connection created')
    } catch (err) {
        console.log(err)
    }  

});


// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
