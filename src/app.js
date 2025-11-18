import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewRouter from './routes/view.router.js'
import path from 'node:path';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import ProductManager from './services/ProductManager.js';

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(process.cwd(), '/src/views'));
app.set('view engine', 'handlebars');

const PORT = 8080;
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(process.cwd(),'src','public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/realTimeProducts', viewRouter);
app.use('/', viewRouter);
// const historialMensajes = [];
// const usuariosOnline = [];

app.get('/', (req, res) => {
    res.status(200).send('Bienvenido! Server de prueba ecommerce con Express - Curso Coderhouse Backend I');
});

const httpServer = app.listen(PORT, () => {
    console.log(`Server ejecutándose en http://localhost:${PORT}`);
});

const serverSocket = new Server(httpServer);

serverSocket.on('connection', (socket) => {
    console.log('Cliente conectado con Socket.io - ', socket.id);
    const listaProductos = [];
    productManager.getProducts().then(res => {
        if (res.length > 0) {
            res.forEach(product => listaProductos.push(product))
        } else {
            console.log('No hay productos para mostrar');
        }
    }).then(() => {
        socket.emit('listaActualizada', listaProductos);
    });

    socket.on('disconnect', (reason) => {

    });
});

