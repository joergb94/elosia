URL = '/productos';
$(function(){

    // FORMULARIO PRODUCTO
    $("#formProductos").submit(function(e){
        e.preventDefault();

        formData = {
            nombreProd:$("#nombreProd").val(),
            codigoProd:$("#codigoProd").val(),
            precioProd:$("#precioProd").val(),
            precioVentaProd:$("#precioVentaProd").val(),
            cantidadProd:$("#cantidadProd").val(),
            minimoStock:$("#minimoStock").val(),
            idCategoria:$("#idCategoria").val()
        };

        // VALIDAR QUE EL CODIGO NO EXISTA
        $.ajax({
            url: URL+"/checkCodigo",
            method:"POST",
            data: {codigoProd:formData.codigoProd},
            success: function(data){
                if(data != false){
                    swal('Código Existente', 'El código ya ha sido registrado en ' + data[0].nombreProd, 'error');
                }else{
                    $.ajax({
                        url: URL+"/add",
                        method:"POST",
                        data: formData,
                        success: function(data){
                            $("#formProductos").trigger('reset');
                            swal('Guardado', 'Se ha registrado el Producto', 'success');
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                }
            },
            error: function(err){
                console.log(err);
            }
        }); 
    });

    // FORMULARIO CATEGORIA
    $("#formCategoria").submit(function(e){
        e.preventDefault();

        formData = {
            nombreCategoria:$("#nombreCategoria").val(),
        };

        // VALIDAR QUE EL CODIGO NO EXISTA
        $.ajax({
            url: URL+"/addCategoria",
            method:"POST",
            data: formData,
            success: function(data){
                $("#formCategoria").trigger('reset');
                swal('Guardado', 'Categoría creada', 'success');
            },
            error: function(err){
                console.log(err);
            }
        }); 
    });
});

function desactivar(id){

    swal({
        title: "¿Estas Seguro?",
        text: "Se desactivará el Producto",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Si",
        closeOnConfirm: false
    }, function () {

        $.ajax({
            url:URL+"/delete", 
            method:'POST', 
            data: {id:id},
            success: function(data){

                swal({
                    title: "Desactivado",
                    text: "Se ha Desactivado el Producto",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                }, function () {
                    location.href = URL+'/list';
                }); 
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
        text: "Se Activará el Producto",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Si",
        closeOnConfirm: false
    }, function () {
        
        $.ajax({
            url:URL+"/activar", 
            method:'POST', 
            data: {id:id},
            success: function(data){

                swal({
                    title: "Activado",
                    text: "Se ha Activado el Producto",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                }, function () {
                    location.href = URL+'/list';
                }); 
            },
            error: function(err){
                console.log(err);
            }
        });
    }); 
}

//  CATEGORIA
function eliminarCat(id){

    swal({
        title: "¿Estas Seguro?",
        text: "Se Eliminará la Categoría",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Si",
        closeOnConfirm: false
    }, function () {

        $.ajax({
            url:URL+"/deleteCat", 
            method:'POST', 
            data: {id:id},
            success: function(data){

                swal({
                    title: "Eliminado",
                    text: "Se ha Eliminado la Categoría",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                }, function () {
                    location.href = URL+'/listCat';
                }); 
            },
            error: function(err){
                console.log(err);
            }
        });
    }); 
}

idCategoriaHidden = $("#idCategoriaHidden").val();
if(idCategoriaHidden != ""){
    $("select").val(idCategoriaHidden);
}
