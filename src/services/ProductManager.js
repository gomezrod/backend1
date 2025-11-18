import {promises as fs} from 'fs';
import path from 'node:path'

const baseDir = process.cwd();
const dataDir = path.resolve(baseDir, 'db');
const productsFilePath = path.join(dataDir, 'products.json');

const ensureDataDir = async () => {
    try {
        await fs.mkdir(dataDir, {recursive: true});
        
    } catch(err) {
        console.error("Error creando directorio de datos (productos)");
        
    }
}

const readData = async (filePath) => {
    await ensureDataDir(); // Asegura que el directorio exista
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return []; // Si el archivo no existe, retorna un arreglo vacío
        }
        throw error;
    }
};

const writeData = async (filePath, data) => {
    await ensureDataDir();
    try {
        const datos = await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return datos;
    }catch(err){
        if(err.code === 'ENOENT'){
            return [];
        }
        throw err;
    }
}


export default class ProductManager{
    constructor(){
        this.path = productsFilePath;
    }

    async addProduct(product){
        const { title, description, price, thumbnails, code, stock, category } = product;
        if (!title || !description || typeof(price)!=='number' || !code || typeof(stock)!=='number' || !category){
            console.error("Error: falta completar algún campo o un tipo de dato es incorrecto");
            return { status: 'error', message: 'falta completar algún campo o un tipo de dato es incorrecto' };
        }

        const products = await readData(this.path);
        
        if(!products){
            return { status: 'error', message: 'No se puede leer el archivo' };
        }
        const codeExists = products.some( product => product.code === code);
        if (codeExists){
            console.error(`Error: Ya existe un producto con el código ${code}`);
            return { status: 'error', message: `Ya existe un producto con el código ${code}` };
        }

        const newId = products.length>0 ? Math.max(...products.map(p=>Number(p.id))) + 1 : 1;

        const newProduct = {
            id: newId,
            title,
            description,
            code,
            price,
            status: product.status ?? true,
            stock,
            category,
            thumbnails: thumbnails ?? []
        };

        products.push(newProduct);
        
        await writeData(this.path, products);
        
        console.log(`Producto "${title}" agregado exitosamente con ID:${newProduct.id}`);
        return { status: 'success', product: newProduct };
    }

    async getProducts(){
        return await readData(this.path);
    }

    async getProductById(id){
        // console.log(this.products.filter(product => product.id===id)[0]||'No se encontró el producto');
        const products = await readData(this.path);
        const product = products.find(p => p.id === id);
        if(!product){
            console.error(`Error: No se encontró ningún producto con el ID ${id}.`);
            return null;
        }else{
            return product;
        }
    }

    async updateProduct(id, updateData){
        const products = await readData(this.path);
        const productIndex = products.findIndex(p => p.id === id);

        if(productIndex === -1){
            console.error(`Error: El producto con ID: ${id} no encontrado para actualizar.`);
            return{ status: 'error', message: 'No se pudo actualizar, producto no encontrado.'};
        }
        
        const updatedProduct = {
            ...products[productIndex],
            ...updateData,
            id: id
        }

        products[productIndex] = updatedProduct;
        await writeData(this.path, products);

        console.log(`Producto con ID: ${id} actualizado.`);
        return { status: 'success', product: updatedProduct };
    }

    async deleteProduct(id) {
        let products = await readData(this.path);
        const initialLength = products.length;

        products = products.filter(p => p.id !== id);

        if(products.length === initialLength){
            console.error(`Error: Producto con ID: ${id} no encontrado para eliminar.`);
            return { status: 'error', message: 'Error: No se puede eliminar, producto no encontrado'};
        }

        await writeData(this.path, products);
        console.log(`Producto con ID: ${id} eliminado correctamente.`);
        return { status: 'success' };
    }
}

// const testProduct = {
//             "id": 1,
//             "title": "Laptop Pro 15\"",
//             "description": "Potente laptop para profesionales creativos. Intel i7, 32GB RAM, 1TB SSD.",
//             "code": "ELEC001",
//             "price": 1899.99,
//             "status": true,
//             "stock": 15,
//             "category": "Electrónica",
//             "thumbnails": [
//                 "/images/products/laptop_pro_1.jpg",
//                 "/images/products/laptop_pro_2.jpg"
//             ]
// }

// console.log('testing:');

// const manager = new ProductManager();
// await manager.addProduct(testProduct);
// manager.getProducts().then(products => console.log(products));
// await manager.addProduct(testProduct);