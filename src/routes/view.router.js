import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.render('realTimeProducts', {
        title: 'Productos en tiempo real con Socket.io'
    })
});

export default router;