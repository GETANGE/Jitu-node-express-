import express, {Express, Response, Request} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port: number = parseInt(process.env.PORT as string, 10) || 3000; 

const app:Express = express();
app.use(express.json());

app.get('/', (req:Request, res:Response) => {
    res.status(200).json({
        message: 'OK'
    });
})

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
