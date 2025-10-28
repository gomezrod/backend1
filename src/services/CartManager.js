import { promises as fs } from 'fs';
import path from 'path';

const baseDir = process.cwd();
const dataDir = path.resolve(baseDir, 'db');
const cartsFilePath = path.join(dataDir, 'carts.json');

const ensureDataDir = async () => {
    try {
        await fs.mkdir(dataDir, { recursive: true });
    }catch (err) {
        console.error("Error al crear directorio de datos (carritos)", err);
    }
};

const readData = async (filePath) => {
    await ensureDataDir();
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        }
        throw err;
    }
};

const writeData = async (filePath, data) => {
    await ensureDataDir();
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        throw err;
    }
};

export class CartManager {
    constructor() {
        this.path = cartsFilePath;
    }

    async createCart() {
        const carts = await readData(this.path);
        const newId = carts.length > 0 ? Math.max(...carts.map(c => Number(c.id))) + 1 : 1;

        const newCart = {
            id: newId,
            products: []
        };

        carts.push(newCart);
        await writeData(this.path, carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await readData(this.path);
        const cart = carts.find(c => c.id === id);

        if(!cart) {
            console.error(`Error: No se encontró ningún carrito con el ID ${id}.`);
            return null;
        } else {
            return cart;
        }
    }

    async addProductToCart(cartId, productId) {
        const carts = await readData(this.path);
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if(cartIndex === -1) {
            console.error(`Error: No se encontró ningún carrito con el ID ${cartId}.`);
            return { status: 'error', message: `No se encontró ningún carrito con el ID ${cartId}.` };
        }

        const cart = carts[cartIndex];
        const productInCartIndex = cart.products.findIndex(p => p.productId === productId);
        if(productInCartIndex !== -1) {
            cart.products[productInCartIndex].quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }
        carts[cartIndex] = cart;
        await writeData(this.path, carts);
        return { status: 'success', cart: cart };
    }

    async removeProductFromCart(cartId, productId) {
        const carts = await readData(this.path);
        const cartIndex = carts.findIndex(c => c.id === cartId);
        if(cartIndex === -1) {
            console.error(`Error: No se encontró ningún carrito con el ID ${cartId}.`);
            return { status: 'error', message: `No se encontró ningún carrito con el ID ${cartId}.` };
        }
        const cart = carts[cartIndex];
        const productInCartIndex = cart.products.findIndex(p => p.productId === productId);
        if(productInCartIndex === -1) {
            console.error(`Error: El producto con ID ${productId} no se encuentra en el carrito ${cartId}.`);
            return { status: 'error', message: `El producto con ID ${productId} no se encuentra en el carrito ${cartId}.` };
        }
        cart.products.splice(productInCartIndex, 1);
        carts[cartIndex] = cart;
        await writeData(this.path, carts);
        return { status: 'success', cart: cart };
    }

    async deleteCart(cartId) {
        const carts = await readData(this.path);
        const cartIndex = carts.findIndex(c => c.id === cartId);
        if(cartIndex === -1) {
            console.error(`Error: No se encontró ningún carrito con el ID ${cartId}.`);
            return { status: 'error', message: `No se encontró ningún carrito con el ID ${cartId}.` };
        }
        const newCarts = carts.filter(c => c.id !== cartId);
        await writeData(this.path, newCarts);
        return { status: 'success', message:'Carrito eliminado correctamente'};
    }
}