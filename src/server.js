import express from 'express';

const app = express();
console.log("iniciando");
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send('Hola, mundo!');
});

app.listen(PORT, () => {
    console.log(`Server ejecutándose en http://localhost:${PORT}`); 
});

