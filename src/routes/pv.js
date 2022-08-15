const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');

router.get('/add', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 1)){
        res.render('pv/add', {menus});
    }else{
        res.redirect(menus[0].link);
    }

});

// BUSCAR PRODUCTO POR CODIGO
router.post('/buscarId', isLoggedIn, async(req, res) => {
    const {idProd} = req.body;
    const result = await pool.query('SELECT * FROM producto WHERE idProd = ? AND estatusProd = 1', [idProd]);
    res.json(result);
});
// BUSCAR PRODUCTO POR CODIGO
router.post('/buscarCode', isLoggedIn, async(req, res) => {
    const {nombreProd} = req.body;
    const result = await pool.query('SELECT * FROM producto WHERE codigoProd = ? AND estatusProd = 1', [nombreProd]);
    res.json(result);
});
// BUSCAR PRODUCTO POR NOMBRE
router.post('/buscarNom', isLoggedIn, async(req, res) => {
    const {nombreProd} = req.body;
    const result = await pool.query("SELECT * FROM producto WHERE nombreProd LIKE '%"+nombreProd+"%' AND estatusProd = 1 ");
    res.json(result);
});

// PARA SELECT CLIENTES
router.post('/listClientes', isLoggedIn, async(req, res) => {
    const clientes = await pool.query("SELECT * FROM cliente WHERE estatusCliente = 1");
    res.json(clientes);
});

// RESTAR STOCK AL SELECCIONAR EL PRODUCTO EN VENTA
router.post('/restarStock', isLoggedIn, async(req, res) =>{
    var nuevaCantidad = 0;
    const {idProd, cantidadProd, cantidadActual} = req.body;
    nuevaCantidad = Number(cantidadActual) - Number(cantidadProd);   
    await pool.query('UPDATE producto SET cantidadProd = ? WHERE idProd = ?', [nuevaCantidad, idProd]);
    res.json(1);
});
// SUMAR STOCK AL SELECCIONAR EL PRODUCTO EN VENTA
router.post('/sumarStock', isLoggedIn, async(req, res) =>{
    var nuevaCantidad = 0;
    
    const {idProd, cantidadProd} = req.body;

    const producto = await pool.query('SELECT * FROM producto WHERE idProd = ?', [idProd]);
    
    nuevaCantidad = Number(producto[0].cantidadProd) + Number(cantidadProd);   
    await pool.query('UPDATE producto SET cantidadProd = ? WHERE idProd = ?', [nuevaCantidad, idProd]);
    res.json(1);
});



// GUARDAR TRANSACCION
router.post('/transaccion', isLoggedIn, async(req, res) => {
    // FALTA PONER EL ID USER
    var idCliente = req.body.idCliente;
    const {idProd, cantidadProd, totalTransaccion} = req.body;

    // console.log(idCliente);
    if(idCliente != ""){
        // HAY CLIENTE Y LA TRANSACCION NO SE HA PAGADO
        idCliente = idCliente;
        estatusTransaccion = 0;
        const usuario = await pool.query("SELECT * FROM cliente WHERE idCliente = ?", [idCliente]);
        saldoTotal = parseInt(usuario[0].saldoTotal) + parseInt(totalTransaccion);
        saldoRestante = parseInt(usuario[0].saldoRestante) + parseInt(totalTransaccion);
        // ACTUALIZAR TOTALES EN TABLA CLIENTE
        await pool.query("UPDATE cliente SET saldoTotal = ?, saldoRestante = ? WHERE idCliente = ?", [saldoTotal, saldoRestante, idCliente]);
    }else{
        // NO HAY CLIENTE Y LA TRANSACCION YA SE PAGO
        idCliente = 0;
        estatusTransaccion = 1;
    }

    // CONSULTAR ID CORTE DEL USUARIO
    const corte = await pool.query("SELECT * FROM corte_caja WHERE idUser = ? AND estatusCorte = 1 LIMIT 1", [req.user.idUser]);

    // PARA TABLA TRANSACCION
    const newTransaccion = {
        idUser : req.user.idUser,
        idCliente,
        totalTransaccion,
        estatusTransaccion,
        idCorte: corte[0].idCorte
    }

    const guardarTransaccion = await pool.query("INSERT INTO transaccion SET ?", [newTransaccion]);

    // PARA TABLA DETALLE TRANSACCION
    var idTransaccion = guardarTransaccion.insertId;

    for (let i = 0; i < idProd.length; i++) {

        const newTransaccionD = {
            idTransaccion : idTransaccion,
            idProd:idProd[i],
            cantidad:cantidadProd[i]
        }
        await pool.query("INSERT INTO transaccion_detalle SET ?", [newTransaccionD]);    
    }

    req.flash('success', 'Transaccion Guardada');
    res.redirect('/pv/add');
});
// CONSULTAR FLAG DE TICKETS
router.post("/flagTickets", isLoggedIn, async(req, res) => {
    
    const flagTickets = await pool.query("SELECT * FROM flagtickets");
    res.json(flagTickets[0]);
});
module.exports = router;