const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');

const pool = require('../database');
const helpers = require('../lib/helpers');

// MOSTRAR FORMULARIO AGREGAR USUARIO
router.get('/list', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 8)){
        res.render('usuarios/add', {menus});
    }else{
        res.redirect(menus[0].link);
    }

});

// GUARDAR USUARIO EN LA BD
router.post('/add', isLoggedIn, async(req, res) => {
    
    const {nombreUser, username, password, tipoUsuario} = req.body;
    const newUser = {
        nombreUser,
        username, 
        password,
        tipoUsuario
    }

    newUser.password = await helpers.encryptPass(password);

    const usuario = await pool.query('INSERT INTO usuario set ?', [newUser]);

    const id = usuario.insertId;

    if(usuario.affectedRows >= 1){
        const usuario = await pool.query('SELECT u.idUser, u.nombreUser, u.username, tu.descripcionTipo, u.estatusUser FROM usuario u INNER JOIN tipo_usuario tu ON u.tipoUsuario = tu.idTipoUser WHERE idUser = ?', [id]);
        res.json(usuario[0]);
    }else{
        res.json(0);
    }
});

// MOSTRAR TABLA USUARIOS
router.post('/getPerfiles', isLoggedIn, async(req, res) => {
    const perfiles = await pool.query('SELECT * FROM tipo_usuario WHERE estatusTipoUser = 1');
    res.json(perfiles);
});
// MOSTRAR TABLA USUARIOS
router.post('/list', isLoggedIn, async(req, res) => {
    const usuarios = await pool.query('SELECT * FROM usuario u INNER JOIN tipo_usuario tu ON u.tipoUsuario = tu.idTipoUser');
    res.json(usuarios);
});

// DESACTIVAR USUARIOS
router.post('/delete', isLoggedIn, async(req, res) => {
    const {id} = req.body;
    const usuario = await pool.query('UPDATE usuario SET estatusUser = 0 WHERE idUser = ?', [id]);
    if(usuario.affectedRows >= 1){
        const usuario = await pool.query('SELECT u.idUser, u.nombreUser, u.username, tu.descripcionTipo, u.estatusUser FROM usuario u INNER JOIN tipo_usuario tu ON u.tipoUsuario = tu.idTipoUser WHERE idUser = ?', [id]);
        res.json(usuario[0]);
    }else{
        res.json(0);
    }
});

// ACTIVAR USUARIOS
router.post('/activar', isLoggedIn, async(req, res) => {
    const {id} = req.body;
    const usuario = await pool.query('UPDATE usuario SET estatusUser = 1 WHERE idUser = ?', [id]);
    if(usuario.affectedRows >= 1){
        const usuario = await pool.query('SELECT u.idUser, u.nombreUser, u.username, tu.descripcionTipo, u.estatusUser FROM usuario u INNER JOIN tipo_usuario tu ON u.tipoUsuario = tu.idTipoUser WHERE idUser = ?', [id]);
        res.json(usuario[0]);
    }else{
        res.json(0);
    }
});

// EDITAR USUARIOS
router.post('/update', isLoggedIn, async(req, res) => {
    
    const {id} = req.body;
    const usuario = await pool.query('SELECT * FROM usuario WHERE idUser = ?', [id]);
    res.json(usuario[0]);
});

router.post('/editar', isLoggedIn, async(req, res) => {

    const {nombreUser, username, password, tipoUsuario, idUser} = req.body;
    let newUser = {};
    if(password != ""){
         newUser = {
            nombreUser, 
            username,
            password,
            tipoUsuario
        };
        newUser.password = await helpers.encryptPass(password);
    }else{
         newUser = {
            nombreUser, 
            username,
            tipoUsuario
        };
    }

    usuario = await pool.query('UPDATE usuario SET ? WHERE idUser = ?', [newUser, idUser]);

    if(usuario.affectedRows >= 1){
        const usuario = await pool.query('SELECT u.idUser, u.nombreUser, u.username, tu.descripcionTipo, u.estatusUser FROM usuario u INNER JOIN tipo_usuario tu ON u.tipoUsuario = tu.idTipoUser WHERE idUser = ?', [idUser]);
        res.json(usuario[0]);
    }else{
        res.json(0);
    }

});

module.exports = router;