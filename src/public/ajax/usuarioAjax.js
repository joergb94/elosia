URL = "/usuarios";

$(document).ready(function(){
    
    getTiposUsuario();
    getUsuario();

    $("#formAddUsuario").on("submit", function(e){
        e.preventDefault();
        formData = $(this).serialize();
        action = $(this).attr('data-action');

        $.ajax({
            url:URL+"/"+action,
            data: formData,
            method:"POST",
            success: function(data){
                swal("Guardado", "", "success");
                newData(data, action);
                lista();
            },
            error: function(err){
                console.log(err);
            }
        });
    });

    $(".btnLista").click(function(){
        lista();
    });

    $(".btnNuevo").click(function(){
        nuevo();
    });

        
    $("#checkPass").change(function(){
        if($(this).is(':checked')){
            $(".showPass").show();
            $("#password").prop('required', true);
        }else{
            $("#password").prop('required', false);
            $(".showPass").hide();
        }
    });
});

function newData(data, action){

    buttons = checkStatus(data.estatusUser, data.idUser);
                
    newRow = `
        <tr id="usuario${data.idUser}">
            <td>${data.nombreUser}</td>
            <td>${data.username}</td>
            <td>${data.descripcionTipo}</td>
            ${buttons}
        </tr>
    `;

    if(action === 'add'){
        $('table > tbody > tr:first').before(newRow);
    }else{
        $("#usuario"+data.idUser).replaceWith(newRow);
    }
}

// MOSTRAR LISTA
function lista(){
    $(".formAdd").hide();
    $(".lista").show();
}

// MOSTRAR FORMULARIO
function nuevo(){
    $(".lista").hide();
    $(".formAdd").show();
    $(".seccionCheck").hide();
    $(".showPass").show();
    $("#password").attr('required', true);
    $("#btnRegistro").val('Registrar');
    $("#formAddUsuario").trigger('reset');
    $("#formAddUsuario").attr('data-action', 'add');
    $("#idUser").val("");
}

function getTiposUsuario(){
    $.ajax({
        url:URL+"/getPerfiles",
        method:"POST",
        dataType: "JSON",
        success: function(data){
            htmlPerfiles = "";
            htmlPerfiles += `<option value="" >Seleccionar</option>`;
            data.forEach(function(data){
                htmlPerfiles += `
                    <option value="${data.idTipoUser}">${data.descripcionTipo}</option>
                `;
            });
            $("#tipoUsuario").html(htmlPerfiles);
        },
        error: function(err){
            console.log(err);
        }
    });
}

// BOTONES SEGUN ESTATUS
function checkStatus(status, id){
    if(status === 1){
        buttons = `
            <td class="text-left">
                <button type="button" onclick="edit(${id})" title="Editar Usuario" class="badge badge-warning"><i class="fas fa-edit"></i> </button> 
                <button type="button" onclick="desactivar(${id})" title="Desactivar Usuario" class="badge badge-success">Activo</button> 
                </td>
                `;
    }else{
        buttons = `
            <td class="text-left">
            <button type="button" onclick="edit(${id})" title="Editar Usuario" class="badge badge-warning"><i class="fas fa-edit"></i> </button> 
            <button type="button" onclick="activar(${id})" title="Activar Usuario" class="badge badge-danger">Inactivo</button> 
        </td>
        `;
    }
    return buttons;
}

// PARA LISTA DE PERFILES
function getUsuario(){
    $.ajax({
        url:URL+"/list",
        method:"POST",
        dataType: "JSON",
        success: function(data){
            htmlUsuario = "";
            data.forEach(function(data){
                buttons = checkStatus(data.estatusUser, data.idUser);
                
                htmlUsuario += `
                    <tr id="usuario${data.idUser}">
                        <td>${data.nombreUser}</td>
                        <td>${data.username}</td>
                        <td>${data.descripcionTipo}</td>
                        ${buttons}
                    </tr>
                `;
            });
            $("#seccionUsuario").html(htmlUsuario);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function edit(id){
    nuevo();
    $(".seccionCheck").show();
    $(".showPass").hide();
    $("#password").attr('required', false);
    $.ajax({
        url:URL+"/update",
        data: {id:id},
        method:"POST",
        success: function(data){
            $("#formAddUsuario").attr('data-action', 'editar');
            $("#idUser").val(data.idUser);
            $("#nombreUser").val(data.nombreUser);
            $("#username").val(data.username);
            $("#tipoUsuario").val(data.tipoUsuario);
            $("#btnRegistro").val('Editar');
        },
        error: function(err){
            console.log(err);
        }
    });
}
// ACCIONES DE BOTONES
function desactivar(id){

    swal({
        title: "¿Estas Seguro?",
        text: "Se Desactivará el Usuario",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Si",
        closeOnConfirm: false
    }, function () {
        $.ajax({
            url:URL+"/delete",
            data: {id:id},
            method:"POST",
            success: function(data){
                swal("Desactivado", "", "success");

                newData(data, "editar");
            },
            error: function(err){
                console.log(err);
            }
        });
    });   
}

function activar(id){
    
    swal({
        title: "¿Estas Seguro?",
        text: "Se Activará el Usuario",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Si",
        closeOnConfirm: false
    }, function () {
        $.ajax({
            url:URL+"/activar",
            data: {id:id},
            method:"POST",
            success: function(data){
                swal("Activado", "", "success");
                newData(data, "editar");
            },
            error: function(err){
                console.log(err);
            }
        });
    });   
}