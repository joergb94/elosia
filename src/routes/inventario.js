const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');
// RENDERIZAR PANTALLA
router.get('/', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 4)){
        const productos = await pool.query("SELECT * FROM producto P INNER JOIN categoria CAT ON P.idCategoria = CAT.idCategoria ORDER BY P.idProd DESC");
        const categorias = await pool.query("SELECT C.nombreCategoria, SUM(P.cantidadProd) AS stock FROM producto P INNER JOIN categoria C ON P.idCategoria = C.idCategoria WHERE P.estatusProd = 1 GROUP BY P.idCategoria");
        res.render('inventario/inventario', {productos, categorias, menus});
    }else{
        res.redirect(menus[0].link);
    }

});

// GENERAR TABLA
router.post('/getTabla', isLoggedIn, async(req, res) => {
    const productos = await pool.query("SELECT * FROM producto P INNER JOIN categoria CAT ON P.idCategoria = CAT.idCategoria ORDER BY P.idProd DESC");
    const categorias = await pool.query("SELECT C.nombreCategoria, SUM(P.cantidadProd) AS stock FROM producto P INNER JOIN categoria C ON P.idCategoria = C.idCategoria WHERE P.estatusProd = 1 GROUP BY P.idCategoria");
    data = {
        productos,
        categorias
    }
    res.json(data);
});

// ACTUALIZAR STOCK
router.post('/stock', isLoggedIn, async(req, res) =>{
    let nuevaCantidad = 0;
    let arrayId = [];
    let arrayNoId = [];

    const {idProd, cantidadProdAgregar, cantidadProdHidden, flagOp} = req.body;
    for(var i=0; i<idProd.length; i++){
        if(cantidadProdAgregar[i] != ""){

            if(flagOp[i] === 'suma'){
                nuevaCantidad = Number(cantidadProdAgregar[i]) + Number(cantidadProdHidden[i]);
                await pool.query('UPDATE producto SET cantidadProd = ? WHERE idProd = ?', [nuevaCantidad, idProd[i]]);
                consultaProducto = await pool.query('SELECT * FROM producto P INNER JOIN categoria CAT ON P.idCategoria = CAT.idCategoria WHERE P.idProd = ?', [idProd[i]]);
                arrayId.push(consultaProducto[0]);
            }else{
                nuevaCantidad = Number(cantidadProdHidden[i]) - Number(cantidadProdAgregar[i]);
                if(nuevaCantidad >= 0){
                    await pool.query('UPDATE producto SET cantidadProd = ? WHERE idProd = ?', [nuevaCantidad, idProd[i]]);
                    consultaProducto = await pool.query('SELECT * FROM producto P INNER JOIN categoria CAT ON P.idCategoria = CAT.idCategoria WHERE P.idProd = ?', [idProd[i]]);
                    arrayId.push(consultaProducto[0]);
                }else{
                    arrayNoId.push(idProd[i]);
                }
            }
        }
    }
    data = {
        arrayId,
        arrayNoId
    }
    res.json(data);
});
// CONSULTAR TIPO DE PV
router.post("/tipoPV", isLoggedIn, async(req, res) => {
    
    const configuracion_pv = await pool.query("SELECT * FROM configuracion_pv WHERE estatus = 1");
    res.json(configuracion_pv[0]);
});

module.exports = router;