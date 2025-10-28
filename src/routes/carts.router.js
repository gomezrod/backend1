import {Router} from 'express';
import { CartManager } from '../services/CartManager.js';
import { ProductManager } from '../services/ProductManager.js';

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', cart: newCart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(id);
        
        if(cart){
            res.status(200).json(cart);
        } else {
            res.status(404).json({ status: 'error', message: `Carrito con ID ${id} no encontrado` });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const product = await productManager.getProductById(productId);
        if(!product){
            return res.status(404).json({ status: 'error', message: `Producto con ID ${productId} no encontrado` });
        }

        const result = await cartManager.addProductToCart(cartId, productId);

        if(result.status === 'error'){
            res.status(404).json({ status: 'error', message: result.message });
        }else{
            res.status(200).json({ status: 'success', cart: result.cart });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const result = await cartManager.removeProductFromCart(cartId, productId);
        if(result.status === 'error'){
            res.status(404).json({ status: 'error', message: result.message });
        }else{
            res.status(200).json({ status: 'success', cart: result.cart });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const result = await cartManager.deleteCart(cartId);
        if(result.status === 'error'){
            res.status(404).json({ status: 'error', message: result.message });
        }else{
            res.status(200).json({ status: 'success', message: `Carrito con ID ${cartId} eliminado` });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

export default router;