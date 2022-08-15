const {isLoggedIn,isAllow} = require('../lib/auth');
const helpers = {};
const pool = require('../database');
helpers.checkStatus = (estatus, id) => {
    
    if(estatus === 0){
        return ' <td class="text-center"> <a href="update/'+id+'" class="badge badge-warning"><i class="fas fa-edit"></i> </a> <a href="#" onclick="activar('+id+')" class="badge badge-danger">Inactivo</a> </td>';
        
    }else{
        return ' <td class="text-center"> <a href="update/'+id+'" class="badge badge-warning"><i class="fas fa-edit"></i> </a> <a href="#" onclick="desactivar('+id+')" class="badge badge-success">Activo</a> </td>';

    }
};

helpers.formatoPrecio = (num) => {
    if (!num || num == 'NaN') return '0';
    if (num == 'Infinity') return '&#x221e;';
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
};
helpers.checkPermiso = (tipoUsuario) => {
    if(tipoUsuario != 2){
        return accede;
    }
};
helpers.tipoUser = (tipoUsuario) => {
    if(tipoUsuario == 1){
        return ' <td class="text-center"> Administrador </td>';
    }else{
        return ' <td class="text-center"> Vendedor </td>';
    }
};

helpers.selected = (option, value) => {
    if (option === value) {
        return ' selected';
    } else {
        return ''
    }
};
helpers.checkMenu = (id_menu, link, icono, descripcionMenu) => {
    if(id_menu === 1){
        return `
            <li id="menu${id_menu}">
                <a href="${link}"><span class="btn btn-secondary btn-block"><i class="${icono}"></i> ${descripcionMenu}</span></a>
            </li>
            `;
    }else{    
        return `
            <li id="menu${id_menu}">
                <a href="${link}"><span><i class="${icono}"></i> ${descripcionMenu}</span></a>
            </li>
            `;
    }
};
helpers.checkEditarCorte = (user) => {
    if(user.tipoUsuario == 1){
        return '<a href="#" data-target="#modalEditar" data-toggle="modal" class="badge badge-danger" id="btnEditarCorte" style="display:none">Editar</a>';
    }
};



module.exports = helpers;