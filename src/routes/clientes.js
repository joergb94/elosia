const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');

// LISTAR
router.get('/list', isLoggedIn, async(req, res) => {

    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);
    
    if(helpers.checkRole(menus, 6)){
        const clientes = await pool.query("SELECT * FROM cliente");
        res.render('clientes/list', {clientes, menus});
    }else{
        res.redirect(menus[0].link);
    }
});

// MOSTRAR FORMULARIO AGREGAR
router.get('/add', isLoggedIn, async(req, res) => {

    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 6)){
        res.render('clientes/add', {menus});
    }else{
        res.redirect(menus[0].link);
    }
});

// GUARDAR CLIENTE
router.post('/add', isLoggedIn, async(req, res) => {
    const {nombreCliente, telefonoCliente} = req.body;
    const newCliente = {
        nombreCliente,
        telefonoCliente
    };
    await pool.query("INSERT INTO cliente SET ?", [newCliente]);
    req.flash('success', 'Cliente Registrado');
    res.redirect('/clientes/add');
    
});

// MOSTRAR FORMULARIO ACTUALIZAR
router.get('/update/:id', isLoggedIn, async(req, res) => {
    
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 6)){
        const {id} = req.params;
        const cliente = await pool.query('SELECT * FROM cliente WHERE idCliente = ?', [id]);
        res.render('clientes/update', {cliente:cliente[0], menus});
    }else{
        res.redirect(menus[0].link);
    }

});

// EDITAR CLIENTE
router.post('/update/:id', isLoggedIn, async(req, res) => {
    const {id} = req.params;
    const {nombreCliente, telefonoCliente} = req.body;
    const newCliente = {
        nombreCliente,
        telefonoCliente
    };
    await pool.query("UPDATE cliente SET ? WHERE idCliente = ? ", [newCliente, id]);
    req.flash('success', 'Cliente Actualizado');
    res.redirect('/clientes/list');
    
});

// DESACTIVAR
router.post('/delete', isLoggedIn, async(req, res) => {
    const {id} = req.body;
    const cliente = await pool.query("UPDATE cliente SET estatusCliente = 0 WHERE idCliente = ?", [id]);
    if(cliente.affectedRows >= 1){
        res.json(1);
    }else{
        res.json(0);
    };
});

// ACTIVAR
router.post('/activar', isLoggedIn, async(req, res) => {
    const {id} = req.body;
    cliente = await pool.query("UPDATE cliente SET estatusCliente = 1 WHERE idCliente = ?", [id]);
    if(cliente.affectedRows >= 1){
        res.json(1);
    }else{
        res.json(0);
    };
});

// LISTA DE PAGOS PENDIENTES
router.get('/pagos', isLoggedIn, async(req, res) =>{

    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 3)){
        const clientes = await pool.query("SELECT * FROM cliente WHERE saldoRestante > 0");
        res.render('clientes/pagos', {clientes, menus});
    }else{
        res.redirect(menus[0].link);
    }

});

// TRANSACCIONES DE UN CLIENTE EN ESPECIFICO
router.post("/transaccionesCliente", isLoggedIn, async(req, res) => {
    const {idCliente} = req.body;
    
    const transaccionCliente = await pool.query("SELECT idTransaccion, totalTransaccion, fechaOperacion FROM transaccion WHERE idCliente = ? AND estatusTransaccion = 0", [idCliente]);
    const totalTransaccion = await pool.query("SELECT saldoRestante FROM cliente WHERE idCliente = ?", [idCliente]);
    data = {
        transaccionCliente,
        totalTransaccion
    }
    res.json(data);
});

// DETALLE DE COMPRA DE CLIENTE
router.post('/detalleCompra', isLoggedIn, async(req, res) =>{
    const {idTransaccion} = req.body;
    const detalleCliente = await pool.query("SELECT P.codigoProd, P.nombreProd, P.precioVentaProd, TD.cantidad, T.totalTransaccion, T.fechaOperacion, T.idCliente FROM transaccion_detalle TD INNER JOIN transaccion T ON TD.idTransaccion = T.idTransaccion INNER JOIN producto P ON TD.idProd = P.idProd WHERE TD.idTransaccion = ?", [idTransaccion]);
    res.json(detalleCliente);
});

// GUARDAR ABONO
router.post('/abonar', isLoggedIn, async(req, res) => {
    var idCliente = req.body.idCliente;
    var cantidadAbono = req.body.cantidadAbono;

    // CONSULTAR DATOS DEL CLIENTE
    const cliente = await pool.query('SELECT * FROM cliente WHERE idCliente = ?', [idCliente]);
    // OPERACION DE RESTAR AL DATO DEL CLIENTE
    saldoRestante = parseFloat(cliente[0].saldoRestante) - parseFloat(cantidadAbono);
    // VALIDAR SI LO QUE ENVIA ES MAS DE LO QUE DEBE
    if(cantidadAbono > cliente[0].saldoRestante){
        res.json({
            titulo:"Ocurrio un error",
            texto:"La cantidad que esta ingresando es mayor a lo que debe",
            type:'error',
            status: 0
        });
    }else{

        // INSERTAR EN TABLA ABONO CLIENTE
        const newAbono = {
            idUser: req.user.idUser,
            idCliente,
            cantidadAbono
        };
        await pool.query('INSERT INTO abono_cliente SET ?', [newAbono]);
        
        // ACTUALIZAR SALDOS EN CLIENTE
        if(saldoRestante === 0){
            await pool.query('UPDATE cliente SET saldoTotal = ? WHERE idCliente = ?', [saldoRestante, idCliente]);
            await pool.query('UPDATE cliente SET saldoRestante = ? WHERE idCliente = ?', [saldoRestante, idCliente]);
            // ACTUALIZAR ESTATUS DE LA TRANSACCION
            await pool.query('UPDATE transaccion SET estatusTransaccion = 1 WHERE idCliente = ?', [idCliente]);
            // ACTUALIZAR ESTATUS DE ABONOS
            await pool.query('UPDATE abono_cliente SET estatusAbono = 0 WHERE idCliente = ?', [idCliente]);
            
            res.json({
                status:1
            });
        }else{
            await pool.query('UPDATE cliente SET saldoRestante = ? WHERE idCliente = ?', [saldoRestante, idCliente]);
    
            const clienteNuevo = await pool.query('SELECT * FROM cliente WHERE idCliente = ?', [idCliente]);
            res.json(clienteNuevo);
        }
    }
});

// VER HISTORIAL DE ABONOS DE UN CLIENTE EN PARTICULAR
router.post("/historialAbonos", async(req, res) => {
    const {idCliente} = req.body;
    
    const abonoCliente = await pool.query("SELECT cantidadAbono, fechaAbono FROM abono_cliente WHERE idCliente = ? AND estatusAbono = 1", [idCliente]);
    if(abonoCliente != ""){
        res.json(abonoCliente);
    }
    res.json(0);
});

module.exports = router;