const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');
// RENDERIZAR PRINCIPAL
router.get('/', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 7)){
        res.render('reportes/reportes', {menus});
    }else{
        res.redirect(menus[0].link);
    }

});

// PARA SELECT USUARIOS
router.post('/listUsers', isLoggedIn, async(req, res) => {
    const usuarios = await pool.query("SELECT * FROM usuario");
    res.json(usuarios);
});

// TRANSACCIONES POR USUARIO
router.post("/transaccionesUser", isLoggedIn, async(req, res) => {
    const {idUser, fechaInicio, fechaFin} = req.body;

    let user;
    if(idUser != ""){
        user = 'idUser = '+idUser+' AND';
    }else{
        user = '';
    }
    
    const transaccion = await pool.query("SELECT idTransaccion, totalTransaccion, fechaOperacion, estatusTransaccion FROM transaccion WHERE "+user+" (estatusTransaccion = 1 OR estatusTransaccion = 2) AND DATE(fechaOperacion) >= '"+fechaInicio+"' AND  DATE(fechaOperacion) <= '"+fechaFin+"' ");
    
    const dineroVentas = await pool.query("SELECT SUM(totalTransaccion) AS dineroVentas FROM transaccion WHERE "+user+" estatusTransaccion = 1 AND DATE(fechaOperacion) >= '"+fechaInicio+"' AND  DATE(fechaOperacion) <= '"+fechaFin+"'");
    
    const totalVentas = await pool.query("SELECT COUNT(idTransaccion) AS totalVentas FROM transaccion WHERE "+user+" DATE(fechaOperacion) >= '"+fechaInicio+"' AND  DATE(fechaOperacion) <= '"+fechaFin+"' AND estatusTransaccion = 1");
    
    const totalProductos = await pool.query("SELECT SUM(TD.cantidad) AS totalProductos FROM transaccion_detalle TD INNER JOIN transaccion T ON TD.idTransaccion = T.idTransaccion WHERE "+user+" T.estatusTransaccion = 1 AND DATE(T.fechaOperacion) >= '"+fechaInicio+"' AND  DATE(T.fechaOperacion) <= '"+fechaFin+"'");

    const totalCancelados = await pool.query("SELECT COUNT(idTransaccion) AS totalCancelados FROM transaccion WHERE "+user+" estatusTransaccion = 2 AND DATE(fechaOperacion) >= '"+fechaInicio+"' AND  DATE(fechaOperacion) <= '"+fechaFin+"'");
    
    const sumaPrecioProd = await pool.query("SELECT sum(p.precioProd * td.cantidad) AS ganancia FROM transaccion_detalle td INNER JOIN transaccion t ON td.idTransaccion = t.idTransaccion INNER JOIN producto p ON td.idProd = p.idProd WHERE "+user+" t.estatusTransaccion = 1 AND DATE(fechaOperacion) >= '"+fechaInicio+"' AND  DATE(fechaOperacion) <= '"+fechaFin+"'");

    let ganancia = dineroVentas[0].dineroVentas - sumaPrecioProd[0].ganancia; 


    datos = {
        transaccion, 
        dineroVentas,
        totalVentas,
        totalProductos,
        totalCancelados,
        ganancia
    }
    res.json(datos);
});


// TRANSACCIONES DE UN CORTE EN ESPECIFICO
router.post("/detalleTransaccionesCorte", isLoggedIn, async(req, res) => {
    const {idTransaccion} = req.body;
    
    const corteUser = await pool.query("SELECT P.codigoProd, P.nombreProd, P.precioVentaProd, TD.cantidad, T.totalTransaccion, T.fechaOperacion FROM transaccion_detalle TD INNER JOIN transaccion T ON TD.idTransaccion = T.idTransaccion INNER JOIN producto P ON TD.idProd = P.idProd WHERE TD.idTransaccion = ?", [idTransaccion]);
    res.json(corteUser);
});

// PRODUCTO MAS VENDIDO Y MENOS
router.post("/topVentas", isLoggedIn, async(req, res) => {
    const {fechaInicio, fechaFin} = req.body;

    const masVendido = await pool.query("SELECT P.codigoProd, P.nombreProd, TD.idProd, SUM(TD.cantidad) AS totalVendidos FROM transaccion_detalle TD INNER JOIN transaccion T ON TD.idTransaccion = T.idTransaccion INNER JOIN producto P ON TD.idProd = P.idProd WHERE (T.estatusTransaccion = 1 OR T.estatusTransaccion = 2) AND DATE(T.fechaOperacion) >= '"+fechaInicio+"' AND  DATE(T.fechaOperacion) <= '"+fechaFin+"' GROUP BY TD.idProd ORDER BY totalVendidos DESC LIMIT 10");
    
    arrayMas = [];
    masVendido.forEach(producto => {
        if(producto.totalVendidos > 1){ 
            arrayMas.push(producto.totalVendidos);
        }   
    });
    var min = Math.min(...arrayMas);

    const menosVendido = await pool.query("SELECT P.codigoProd, P.nombreProd, TD.idProd, SUM(TD.cantidad) AS totalVendidos FROM transaccion_detalle TD INNER JOIN transaccion T ON TD.idTransaccion = T.idTransaccion INNER JOIN producto P ON TD.idProd = P.idProd WHERE (T.estatusTransaccion = 1 OR T.estatusTransaccion = 2) AND DATE(T.fechaOperacion) >= '"+fechaInicio+"' AND  DATE(T.fechaOperacion) <= '"+fechaFin+"' GROUP BY TD.idProd ORDER BY totalVendidos ASC LIMIT 10");

    datos = {
        masVendido,
        menosVendido,
        min
    }
    res.json(datos);
});

// PRODUCTOS AGOTADOS
router.post("/agotados", isLoggedIn, async(req, res) => {
   
    const agotados = await pool.query("SELECT * FROM producto WHERE cantidadProd = 0");

    const porAgotarse = await pool.query("SELECT * FROM producto WHERE cantidadProd <= minimoStock AND cantidadProd > 0");

    datos = {
        agotados,
        porAgotarse
    }
    res.json(datos);
});

// OBTENER DATOS GENERALES DE GANANCIAS
// QUITAR****
router.post('/datosCorte', isLoggedIn, async(req,res) =>{
    
    let totalEnCaja;
    const corte = await pool.query("SELECT idCorte, cantidadCorte FROM corte_caja WHERE idUser = ? AND estatusCorte = 1 LIMIT 1", [req.user.idUser]);
    const ganancias = await pool.query("SELECT SUM(totalTransaccion) AS ingresos FROM transaccion WHERE idCorte = ? AND estatusTransaccion = 1", [corte[0].idCorte]);
    
    if(ganancias[0].ingresos != null){
        totalEnCaja = parseInt(ganancias[0].ingresos) + parseInt(corte[0].cantidadCorte);
    }else{
        totalEnCaja = corte[0].cantidadCorte;
    }
    datos = {
        corte,
        ganancias,
        totalEnCaja
    }
    res.json(datos);
})

module.exports = router;