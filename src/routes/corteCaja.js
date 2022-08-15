const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');

// RENDERIZAR CORTE DE CAJA
router.get('/', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 10)){
        res.render('corteCaja/corteCaja', {menus});
    }else{
        res.redirect(menus[0].link);
    }

});
// RENDERIZAR CONFIGURACION
router.get('/configuracion', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 9)){
        res.render('corteCaja/configuracion', {menus});
    }else{
        res.redirect(menus[0].link);
    }

});

// RENDERIZAR TRANSACCIONES
router.get('/transacciones', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 2)){    
        res.render('corteCaja/transacciones', {menus});
    }else{
        res.redirect(menus[0].link);
    }
});

router.post('/add', isLoggedIn, async(req, res) =>{

    cantidadCorte = req.body.cantidadCorte;

    const newCorte = {
        idUser: req.user.idUser, 
        cantidadCorte
    }

    saveQuery = await pool.query("INSERT INTO corte_caja SET ?", [newCorte]);
    if(saveQuery.affectedRows){
        res.json(1);
    }else{
        res.json(0);
    }
});

router.post('/update', isLoggedIn, async(req, res) =>{

    const {idCorte, cantidadCorte} = req.body;

    saveQuery = await pool.query("UPDATE corte_caja SET cantidadCorte = ? WHERE idCorte = ?", [cantidadCorte, idCorte]);
    if(saveQuery.affectedRows){
        res.json(1);
    }else{
        res.json(0);
    }
});

// CORTE ACTUAL DEL USUARIO 
router.post("/actualCortesUser", isLoggedIn, async(req, res) => {
    const {idUser} = req.body;
    
    const corteUser = await pool.query("SELECT * FROM corte_caja WHERE idUser = ? AND estatusCorte = 1", [idUser]);
    // console.log(corteUser);
    res.json(corteUser[0]);
});

// CONSULTAR FLAG DE TICKETS
router.post("/flagTickets", isLoggedIn, async(req, res) => {
    
    const flagTickets = await pool.query("SELECT * FROM flagtickets");
    res.json(flagTickets[0]);
});
// CONSULTAR TIPO DE PV
router.get("/tipoPV", isLoggedIn, async(req, res) => {    
    const configuracion_pv = await pool.query("SELECT * FROM configuracion_pv WHERE estatus = 1");
    res.json(configuracion_pv[0]);
});
// CONFIGURAR TIPO DE PV
router.post("/configurarTipo", isLoggedIn, async(req, res)=>{
    const {id_configuracion_pv} = req.body;
    await pool.query("UPDATE configuracion_pv SET estatus = 1 WHERE id_configuracion_pv = ?", [id_configuracion_pv]);
    await pool.query("UPDATE configuracion_pv SET estatus = 0 WHERE id_configuracion_pv != ?", [id_configuracion_pv]);
    res.json(1);
});

// TODOS LOS CORTES ANTIGUOS DEL USUARIO 
router.post("/consultaCortes", isLoggedIn, async(req, res) => {
    const {fechaInicio, fechaFin} = req.body;
    const cortes = await pool.query("SELECT CJ.idCorte, U.nombreUser, CJ.cantidadCorte, CJ.inicioCorte, CJ.finCorte FROM corte_caja CJ INNER JOIN usuario U ON CJ.idUser = U.idUser WHERE  DATE(finCorte) >= '"+fechaInicio+"' AND  DATE(finCorte) <= '"+fechaFin+"' AND estatusCorte = 0 ORDER BY CJ.idCorte DESC ");
    res.json(cortes);
});

// TRANSACCIONES DE UN CORTE EN ESPECIFICO
router.post("/transaccionesCorte", isLoggedIn, async(req, res) => {
    const {idCorte} = req.body;
    
    const corteUser = await pool.query("SELECT idTransaccion, totalTransaccion, fechaOperacion FROM transaccion WHERE idCorte = ? AND estatusTransaccion = 1", [idCorte]);
    res.json(corteUser);
});

// TRANSACCIONES DE UN CORTE EN ESPECIFICO
router.post("/detalleTransaccionesCorte", isLoggedIn, async(req, res) => {
    const {idTransaccion} = req.body;
    
    const corteUser = await pool.query("SELECT P.codigoProd, P.nombreProd, P.precioVentaProd, TD.cantidad, T.totalTransaccion, T.fechaOperacion FROM transaccion_detalle TD INNER JOIN transaccion T ON TD.idTransaccion = T.idTransaccion INNER JOIN producto P ON TD.idProd = P.idProd WHERE TD.idTransaccion = ?", [idTransaccion]);
    res.json(corteUser);
});

// CONSULTAR SI HAY CORTE DE CAJA
router.post("/consultaCorte", isLoggedIn, async(req, res) => {
    const {idUser} = req.body;
    
    const corteUser = await pool.query("SELECT * FROM corte_caja WHERE idUser = ? AND estatusCorte = 1 LIMIT 1", [idUser]);
    res.json(corteUser[0]);
});

// ACTUALIZAR PARA NUEVO CORTE
router.post("/nuevoCorte", isLoggedIn, async(req, res) => {
    const {idCorte, idUser} = req.body;
    
    await pool.query("UPDATE corte_caja SET estatusCorte = 0, finCorte = CURRENT_TIMESTAMP WHERE idCorte = ? AND idUser = ?", [idCorte, idUser]);
    res.json(1);
});

// CANCELAR TRANSACCION
router.post("/delete", isLoggedIn, async(req, res) => {
    const {idTransaccion, idUser} = req.body;
    
    await pool.query("UPDATE transaccion SET estatusTransaccion = 2 WHERE idTransaccion = ? AND idUser = ?", [idTransaccion, idUser]);

    // DEVOLVER LA CANTIDAD A LOS PRODUCTOS
    const detalleTransaccion = await pool.query("SELECT idProd, cantidad FROM transaccion_detalle WHERE idTransaccion = ?", [idTransaccion]);
    for (let i = 0; i < detalleTransaccion.length; i++) {

        // CONSULTAR CANTIDAD ACTUAL DE PRODUCTO
        const cantidadProductoActual = await pool.query('SELECT cantidadProd FROM producto WHERE idProd = ?', [detalleTransaccion[i].idProd]);
        // SUMAR A LA CANTIDAD LO QUE SE ESTA CANCELANDO
        cantidadProdN = parseInt(cantidadProductoActual[0].cantidadProd) + parseInt(detalleTransaccion[i].cantidad);
        // ACTUALIZAR STOCK DEL PRODUCTO
        await pool.query("UPDATE producto SET cantidadProd = ? WHERE idProd = ?", [cantidadProdN, detalleTransaccion[i].idProd]);
        // console.log(cantidadProdN);
        
    }
    
    res.json(1);
});

// CONFIGURAR TICKETS
router.post("/activarTickets", isLoggedIn, async(req, res)=>{

    await pool.query("UPDATE flagtickets SET flagTickets = 1");
    res.json(1);
});

router.post("/desactivarTickets", isLoggedIn, async(req, res)=>{

    await pool.query("UPDATE flagtickets SET flagTickets = 0");
    res.json(1);
});


// RESUMEN DE CORTE
router.post("/resumenCorte", isLoggedIn, async(req, res)=>{

    const {idCorte} = req.body;
    
    const transaccion = await pool.query("SELECT idTransaccion, totalTransaccion, fechaOperacion, estatusTransaccion FROM transaccion WHERE idCorte = ? AND (estatusTransaccion = 1 OR estatusTransaccion = 2)", [idCorte]);
        
    const dineroVentas = await pool.query("SELECT SUM(totalTransaccion) AS dineroVentas FROM transaccion WHERE idCorte = ? AND estatusTransaccion = 1", [idCorte]);
    
    const totalVentas = await pool.query("SELECT COUNT(idTransaccion) AS totalVentas FROM transaccion WHERE idCorte = ?  AND estatusTransaccion = 1", [idCorte]);
    
    const totalProductos = await pool.query("SELECT SUM(TD.cantidad) AS totalProductos FROM transaccion_detalle TD INNER JOIN transaccion T ON TD.idTransaccion = T.idTransaccion WHERE T.idCorte = ? AND T.estatusTransaccion = 1 ", [idCorte]);
    
    const totalCancelados = await pool.query("SELECT COUNT(idTransaccion) AS totalCancelados FROM transaccion WHERE idCorte = ? AND estatusTransaccion = 2 ", [idCorte]);

    const corte = await pool.query("SELECT * FROM corte_caja WHERE idCorte = ? LIMIT 1", [idCorte]);
   
    const sumaPrecioProd = await pool.query("SELECT sum(p.precioProd * td.cantidad) AS ganancia FROM transaccion_detalle td INNER JOIN transaccion t ON td.idTransaccion = t.idTransaccion INNER JOIN producto p ON td.idProd = p.idProd WHERE idCorte = ? AND t.estatusTransaccion = 1", [idCorte]);

    let ganancias = dineroVentas[0].dineroVentas - sumaPrecioProd[0].ganancia; 
    
    let totalProducto;
    if(totalProductos[0].totalProductos != null){
        totalProducto = totalProductos[0].totalProductos
    }else{
        totalProducto = 0;
    }
    
    datos = {
        transaccion, 
        dineroVentas,
        totalVentas,
        totalProducto,
        totalCancelados,
        corte,
        ganancias
    }
    res.json(datos);
});


module.exports = router;