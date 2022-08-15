URL = "/clientes";
function desactivar(id){

    swal({
        title: "¿Estas Seguro?",
        text: "Se desactivará el Cliente",
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
                    text: "Se ha Desactivado el Cliente",
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
        text: "Se Activará el Cliente",
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
                    text: "Se ha Activado el Cliente",
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


function checkTabla(){
    var numTR = $("#tablaInventario").find("tr").length;
    numTR = numTR - 1;

    if(numTR == 0){
        htmlTabla = '<tr><td colspan="3"><h4 class="text-center">No hay datos</h4></td></tr>';
        $("#seccionInventario").html(htmlTabla);
    }
        
}
checkTabla();