const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');

const pool = require('../database');

router.get('/', isLoggedIn, async(req, res) => {
    const idUser = req.user.idUser;
    const menus = await pool.query("SELECT * FROM usuario U INNER JOIN tipo_usuario TU ON U.tipoUsuario = TU.idTipoUser INNER JOIN detalle_menu_tipo DT ON DT.idTipoUser = TU.idTipoUser INNER JOIN menu M ON DT.idMenu = M.id_menu WHERE U.idUser = ? ORDER BY M.id_menu", [idUser]);

    if(helpers.checkRole(menus, 11)){
        const menu = await pool.query("SELECT * FROM menu");
        res.render('perfiles/add', {menu, menus});
    }else{
        res.redirect(menus[0].link);
    }

});

router.post('/list',isLoggedIn, async(req, res) => {
    const perfiles = await pool.query("SELECT * FROM tipo_usuario");
    res.json(perfiles);
});

// CONSULTA DE MENUS
router.post('/getMenu', isLoggedIn, async(req, res)=>{
    const menu = await pool.query("SELECT * FROM menu");
    res.json(menu);
});
// CONSULTA DE MENUS DE UN PERFIL
router.post('/getMenuPerfil', isLoggedIn, async(req, res)=>{
    const {id} = req.body;
    let menuPerfil = await pool.query("SELECT * FROM detalle_menu_tipo dt INNER JOIN tipo_usuario tu ON dt.idTipoUser = tu.idTipoUser WHERE dt.idTipoUser = ?", [id]);
    if(menuPerfil != ""){
        res.json({
            menuPerfil,
            result:1
        });
    }else{
        menuPerfil = await pool.query("SELECT * FROM tipo_usuario WHERE idTipoUser = ? ", [id]);
        res.json(
            {
                menuPerfil,
                result:2
            }
        );
    }
});

// AGREGAR PERFIL
router.post('/addPerfil', isLoggedIn, async(req, res)=>{
    const {descripcionTipo} = req.body;
    const newPerfil = {
        descripcionTipo
    }
    const validaperfil = await pool.query("SELECT descripcionTipo FROM tipo_usuario WHERE descripcionTipo = ? AND estatusTipoUser = 1", [descripcionTipo]);
    if(validaperfil != ""){
        res.json(0);
    }else{
        const perfil = await pool.query("INSERT INTO tipo_usuario SET ?", [newPerfil]);
        res.json(perfil);
    }
});

// EDITAR PERFIL
router.post('/editPerfil', isLoggedIn, async(req, res)=>{
    const {descripcionTipo, idTipoUser} = req.body;
    const newPerfil = {
        descripcionTipo
    }
    const validaperfil = await pool.query("SELECT descripcionTipo FROM tipo_usuario WHERE descripcionTipo = ? AND estatusTipoUser = 1", [descripcionTipo]);
    if(validaperfil != ""){
        res.json(0);
    }else{
        const perfil = await pool.query("UPDATE tipo_usuario SET ? WHERE idTipoUser = ?", [newPerfil, idTipoUser]);
        res.json(perfil);
    }
});

// AGREGAR MENU A PERFIL
router.post('/addMenuPerfil', isLoggedIn, async(req, res)=>{
    const {idMenu, idTipoUser} = req.body;
    const newMenu = {
        idMenu,
        idTipoUser
    }

    const addMenu = await pool.query("INSERT INTO detalle_menu_tipo SET ?", [newMenu]);
    res.json(addMenu);
});

// BORRAR MENU A PERFIL
router.post('/deleteMenuPerfil', isLoggedIn, async(req, res)=>{
    const {idMenu, idTipoUser} = req.body;
 
    const deleteMenu = await pool.query("DELETE FROM detalle_menu_tipo WHERE idTipoUser = ? AND idMenu = ?", [idTipoUser, idMenu]);
    res.json(deleteMenu);
});

// DESHACER CAMBIOS DE  MENU A PERFIL
router.post('/deleteMenus', isLoggedIn, async(req, res)=>{
    const {idTipoUser} = req.body;

    const deleteMenus = await pool.query("DELETE FROM detalle_menu_tipo WHERE idTipoUser = ?", [idTipoUser]);
    const deletePerfil = await pool.query("UPDATE tipo_usuario SET estatusTipoUser = 0 WHERE idTipoUser = ?", [idTipoUser]);
    res.json(deleteMenus);
});

// VALIDAR PERFIL
router.post('/validaPerfil', isLoggedIn, async(req, res)=>{
    const {descripcionTipo} = req.body;
    const perfil = await pool.query("SELECT descripcionTipo FROM tipo_usuario WHERE descripcionTipo = ? AND estatusTipoUser = 1", [descripcionTipo]);
    res.json(perfil);
});

// DESACTIVAR
router.post('/delete', isLoggedIn, async(req, res)=>{
    const {id} = req.body;
    const perfil = await pool.query("UPDATE tipo_usuario SET estatusTipoUser = 0 WHERE idTipoUser = ? ", [id]);
    res.json(perfil);
});
// ACTIVAR
router.post('/active', isLoggedIn, async(req, res)=>{
    const {id} = req.body;
    const perfil = await pool.query("UPDATE tipo_usuario SET estatusTipoUser = 1 WHERE idTipoUser = ? ", [id]);
    res.json(perfil);
});
// EDITAR
router.post('/edit', isLoggedIn, async(req, res)=>{
    const {id} = req.body;
    const perfil = await pool.query("SELECT * FROM tipo_usuario WHERE idTipoUser = ? ", [id]);
    res.json(perfil[0]);
});



module.exports = router;