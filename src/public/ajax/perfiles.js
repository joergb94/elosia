URL = "/perfiles"
$(document).ready(function(){

    getPerfiles();

    $("#formAddPerfiles").on("submit", function(e){
        e.preventDefault();
        formData = $(this).serialize();
        action = $(this).attr('data-action');

        $.ajax({
            url:URL+"/"+action,
            data: formData,
            method:"POST",
            success: function(data){
                if(data != 0){
                    $(".seccionBtnPerfil").hide();
                    $("#formAddMenu").show();
                    // CAMBIAR AL EDITAR
                    if(data.insertId != 0){
                        $("#idTipoUser").val(data.insertId);
                    }else{
                        idTipoUserE = $("#idTipoUserE").val();
                        $("#idTipoUser").val(idTipoUserE);
                    }
                    $("#descripcionTipo").attr("disabled", true);
                    getPerfiles();
                }else{
                    swal("Perfil Existente", "", "error");
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    });

    // OPCIONES DEL MENU
    $(".addMenu").click(function(e){
        e.preventDefault();
        id_menu = $(this).val();
        idTipoUser = $("#idTipoUser").val();
        $("#menuActive"+id_menu).hide();
        $("#menuDisabled"+id_menu).show();

        $.ajax({
            url:URL+"/addMenuPerfil",
            data: {idMenu:id_menu, idTipoUser:idTipoUser},
            method:"POST",
            success: function(data){
                // console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        });

    });
    // OPCIONES DEL MENU
    $(".removeMenu").click(function(e){
        e.preventDefault();
        id_menu = $(this).val();
        idTipoUser = $("#idTipoUser").val();
        $("#menuDisabled"+id_menu).hide();
        $("#menuActive"+id_menu).show();

        $.ajax({
            url:URL+"/deleteMenuPerfil",
            data: {idMenu:id_menu, idTipoUser:idTipoUser},
            method:"POST",
            success: function(data){
                // console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    });

    // REGISTRAR OPCIONES MENU
    $("#btnGuardarMenu").click(function(){
        idTipoUser = $("#idTipoUser").val();

        $.ajax({
            url:URL+"/getMenuPerfil",
            data: {id:idTipoUser},
            method:"POST",
            success: function(data){
                if(data.result === 1){
                    swal({
                        title: "¿Estas Seguro?",
                        text: "Se guardaran los cambios",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#dc3545",
                        confirmButtonText: "Si",
                        cancelButtonText: "No, cancelar",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            swal("Guardado!", "Se han guardado los permisos", "success");
                            nuevo();
                        } else {
                           
                            $.ajax({
                                url:URL+"/deleteMenus",
                                data: {idTipoUser:idTipoUser},
                                method:"POST",
                                success: function(data){
                                    swal("Cancelado", "", "error");
                                    $(".addMenu").show();
                                    $(".removeMenu").hide();
                                    nuevo();
                                },
                                error: function(err){
                                    console.log(err);
                                }
                            });
                        }
                    });
                }else{
                   swal("Error", "Debe seleccionar al menos 1 menú", "error");
                }
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

    $("#descripcionTipo").keyup(function(){
        if($(this).val() != ""){
            validaPerfil($(this).val());
        }else{
            $("#basic-addon2").html("");
        }
    });
});

// MOSTRAR MENUS DEL PERFIL
function getMenuPerfil(id){
    $(".addMenu").show();
    $(".removeMenu").hide();
    $.ajax({
        url:URL+"/getMenuPerfil",
        data: {id:id},
        method:"POST",
        success: function(data){
            $(".lista").hide();
            $(".seccionBtnPerfil").hide();
            $(".formAdd").show();
            $("#formAddMenu").show();
            $("#btnGuardarMenu").html('Editar');
            $("#idTipoUser").val(data.menuPerfil[0].idTipoUser);
            $("#descripcionTipo").val(data.menuPerfil[0].descripcionTipo);
            $("#descripcionTipo").attr("disabled", true);
            if(data.result === 1){
                data.menuPerfil.forEach(function(data){
                    $("#menuActive"+data.idMenu).hide();
                    $("#menuDisabled"+data.idMenu).show();
                });
            }else{
                $(".addMenu").show();
                $(".removeMenu").hide();
            }
        },
        error: function(err){
            console.log(err);
        }
    });
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
    $("#btnRegistro").attr('value', 'Registrar');
    $(".seccionBtnPerfil").show();
    $("#formAddMenu").hide();
    $("#idTipoUser").val("");
    $("#idTipoUser2").val("");
    $("#descripcionTipo").attr("disabled", false);
    $("#formAddPerfiles").trigger('reset');
    $("#basic-addon2").html('');
    $(".addMenu").show();
    $(".removeMenu").hide();
}

// VALIDAR EXISTENCIA DE PERFIL
function validaPerfil(perfil){
    $("#basic-addon2").html('<i class="fas fa-spinner fa-spin"></i>');
    $.ajax({
        url:URL+"/validaPerfil",
        data: {descripcionTipo:perfil},
        method:"POST",
        success: function(data){
            if(data.length > 0){
                $("#basic-addon2").html('<i class="far fa-times-circle text-danger"></i>');
            }else{
                $("#basic-addon2").html('<i class="far fa-check-circle text-success"></i>');
            }
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
                <button type="button" onclick="edit(${id})" title="Editar Perfil" class="badge badge-warning"><i class="fas fa-edit"></i> </button> 
                <button type="button" onclick="getMenuPerfil(${id})" title="Editar Menu" class="badge badge-info"><i class="fas fa-edit"></i> </button> 
                <button type="button" onclick="desactivar(${id})" title="Desactivar Perfil" class="badge badge-success">Activo</button> 
                </td>
                `;
    }else{
        buttons = `
            <td class="text-left">
            <button type="button" onclick="edit(${id})" title="Editar Perfil" class="badge badge-warning"><i class="fas fa-edit"></i> </button> 
            <button type="button" onclick="getMenuPerfil(${id})" title="Editar Menu" class="badge badge-info"><i class="fas fa-edit"></i> </button> 
            <button type="button" onclick="activar(${id})" title="Activar Perfil" class="badge badge-danger">Inactivo</button> 
        </td>
        `;
    }
    return buttons;
}

// PARA LISTA DE PERFILES
function getPerfiles(){
    $.ajax({
        url:URL+"/list",
        method:"POST",
        dataType: "JSON",
        success: function(data){
            htmlPerfiles = "";
            data.forEach(function(data){
                buttons = checkStatus(data.estatusTipoUser, data.idTipoUser);
                
                htmlPerfiles += `
                    <tr id="perfil${data.idTipoUser}">
                        <td>${data.descripcionTipo}</td>
                        ${buttons}
                    </tr>
                `;
            });
            $("#seccionPerfiles").html(htmlPerfiles);
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
        text: "Se Desactivará el Perfil",
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
                getPerfiles();
                swal("Desactivado", "", "success");
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
        text: "Se Activará el Perfil",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Si",
        closeOnConfirm: false
    }, function () {
        $.ajax({
            url:URL+"/active",
            data: {id:id},
            method:"POST",
            success: function(data){
                getPerfiles();
                swal("Activado", "", "success");
            },
            error: function(err){
                console.log(err);
            }
        });
    });   
    
}

function edit(id){
    $.ajax({
        url:URL+"/edit",
        data: {id:id},
        method:"POST",
        success: function(data){
            nuevo();
            action = $("#formAddPerfiles").attr('data-action', 'editPerfil');
            $("#idTipoUserE").val(data.idTipoUser);
            $("#descripcionTipo").val(data.descripcionTipo);
            $("#btnRegistro").val('Editar');
        },
        error: function(err){
            console.log(err);
        }
    });
}