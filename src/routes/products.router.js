import {Router} from 'express';
import ProductManager from '../services/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try{
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch(err){
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product =  await productManager.getProductById(id);

        if(product){
            res.status(200).json(product);
        }else{
            res.status(404).json({ status: 'error', message: `Producto con ID ${id} no encontrado` });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const result = await productManager.addProduct(productData);

        if(result.status === 'error'){
            res.status(400).json({ status: 'error', message: result.message });
        }else{
            
            res.status(201).json({ status: 'success', product: result.product });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const updateData = req.body;
        const result = await productManager.updateProduct(id, updateData);

        if(result.status === 'error'){
            res.status(404).json({ status: 'error', message: result.message });
        }else{
            res.status(200).json({ status: 'success', product: result.product });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const result = await productManager.deleteProduct(id);

        if(result.status === 'error'){
            res.status(404).json({ status: 'error', message: result.message });
        }else{
            res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

export default router;