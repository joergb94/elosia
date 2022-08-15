const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');

// MOSTRAR FORMULARIO
router.get('/add', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 5)){
        const categorias = await pool.query('SELECT * FROM categoria WHERE estatusCategoria = 1');
        res.render('productos/add', {categorias:categorias, menus});
    }else{
        res.redirect(menus[0].link);
    }
});

// MOSTRAR FORMULARIO
router.get('/categoria', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 5)){
        res.render('productos/categoria', {menus});
    }else{
        res.redirect(menus[0].link);
    }
});

// CHECK CODIGO
router.post('/checkCodigo', isLoggedIn, async(req, res) => {
    const {codigoProd} = req.body;
    const result = await pool.query("SELECT * FROM producto WHERE codigoProd = ?", [codigoProd]);
    res.json(result);
});

// MOSTRAR BARCODE
router.get('/barcode', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 9)){
        const productos = await pool.query('SELECT * FROM producto');
        res.render('productos/barcode', {productos, menus});
    }else{
        res.redirect(menus[0].link);
    }

    
});

// LISTAR CATEGORIAS PARA SELECT
router.post('/listCat', isLoggedIn, async(req, res) => {
    const categorias = await pool.query('SELECT * FROM categoria WHERE estatusCategoria = 1');
    res.json(categorias);
});

// AGREGAR PRODUCTO
router.post('/add', isLoggedIn, async(req, res) =>{

    const {nombreProd, codigoProd, precioProd, precioVentaProd, cantidadProd, minimoStock, idCategoria} = req.body;
    const newProducto = {
        nombreProd,
        codigoProd, 
        precioProd, 
        precioVentaProd, 
        cantidadProd,
        minimoStock,
        idCategoria
    }
    await pool.query('INSERT INTO producto SET ?', [newProducto]);
    res.json(1);

});

// LISTAR
router.get('/list', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 5)){        
        const productos = await pool.query('SELECT * FROM producto P INNER JOIN categoria CAT ON P.idCategoria = CAT.idCategoria ORDER BY P.codigoProd ASC');
        res.render('productos/list', {productos, menus});
    }else{
        res.redirect(menus[0].link);
    }

});

// ELIMINAR
router.post('/delete', isLoggedIn, async(req, res) => {
    const {id} = req.body;
    const producto = await pool.query('UPDATE producto SET estatusProd = 0 WHERE idProd = ?', [id]);
    if(producto.affectedRows >= 1){
        res.json(1);
    }else{
        res.json(0);
    }
});

// ACTIVAR
router.post('/activar', isLoggedIn, async(req, res) => {
    const {id} = req.body;
    const producto = await pool.query('UPDATE producto SET estatusProd = 1 WHERE idProd = ?', [id]);
    if(producto.affectedRows >= 1){
        res.json(1);
    }else{
        res.json(0);
    };
});

// EDITAR
router.get('/update/:id', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 5)){
        const {id} = req.params;
        const producto = await pool.query('SELECT * FROM producto WHERE idProd = ?', [id]);
        const categorias = await pool.query('SELECT * FROM categoria WHERE estatusCategoria = 1');
    
        res.render('productos/update', {producto:producto[0], categorias:categorias, menus});
    }else{
        res.redirect(menus[0].link);
    }


});

router.post('/update/:id', isLoggedIn, async(req, res) => {
    const {id} = req.params;
    const {nombreProd, codigoProd, precioProd, precioVentaProd, minimoStock, idCategoria} = req.body;
    const newProducto = {
        nombreProd,
        codigoProd, 
        precioProd, 
        precioVentaProd,
        minimoStock,
        idCategoria
    }

    await pool.query('UPDATE producto SET ? WHERE idProd = ?', [newProducto, id]);
    req.flash('success', 'Producto Actualizado');
    res.redirect('/productos/list');
});

// AGREGAR CATEGORIA
router.post('/addCategoria', isLoggedIn, async(req, res) =>{

    const {nombreCategoria} = req.body;

    const newCategoria = {
        nombreCategoria
    }
    const categoria = await pool.query('INSERT INTO categoria SET ?', [newCategoria]);
    if(categoria.affectedRows >= 1){
        res.json(1);
    }else{
        res.json(0);
    }

});

// LISTAR CATEGORIA
router.get('/listCat', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 5)){
        const categorias = await pool.query('SELECT * FROM categoria WHERE estatusCategoria = 1');
        res.render('productos/listCat', {categorias, menus});
    }else{
        res.redirect(menus[0].link);
    }


});

// EDITAR CATEGORIA
router.get('/updateCat/:id', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 5)){
        const {id} = req.params;
        const categoria = await pool.query('SELECT * FROM categoria WHERE idCategoria = ?', [id]);
        res.render('productos/updateCat', {categoria:categoria[0], menus});
    }else{
        res.redirect(menus[0].link);
    }

});

router.post('/updateCat/:id', isLoggedIn, async(req, res) => {
    const {id} = req.params;
    const {nombreCategoria} = req.body;

    const newCategoria = {
        nombreCategoria
    }

    await pool.query('UPDATE categoria SET ? WHERE idCategoria = ?', [newCategoria, id]);
    req.flash('success', 'Producto Actualizado');
    res.redirect('/productos/listCat');
});

// ELIMINAR CATEGORIA
router.post('/deleteCat', isLoggedIn, async(req, res) => {
    const {id} = req.body;
    const categoria = await pool.query('UPDATE categoria SET estatusCategoria = 0 WHERE idCategoria = ?', [id]);
    if(categoria.affectedRows >= 1){
        res.json(1);
    }else{
        res.json(0);
    }
});

module.exports = router;
