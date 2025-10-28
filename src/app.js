import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.status(200).send('Bienvenido! Server de prueba ecommerce con Express - Curso Coderhouse Backend I');
});

app.listen(PORT, () => {
    console.log(`Server ejecutándose en http://localhost:${PORT}`); 
});

