const URL = '/clientes';

$(document).ready(function(){
    
    $("#formAbono").submit(function(e){
        e.preventDefault();
        var form = $(this);

        swal({
            title: "¿Estas Seguro?",
            text: "Se abonará a la cuenta",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
        }, function () {

            if($("#cantidadAbono").val() <= 0){
                swal("Valor inválido", "El valor debe ser mayor a 0", "error");
            }else{
                $.ajax({
                    url:URL+"/abonar",
                    method:"POST",
                    data:form.serialize(),
                    success: function(data){
                       
                        if(data.status === 0){
                            swal(data.titulo, data.texto, data.type);
                        }else if(data.status === 1){
                            // REMOVER ROW
                            swal("Guardado", "Se ha Abonado a la cuenta", "success");
                            $("#modalAbonar").modal('toggle');
                            $("#formAbono").trigger('reset');
                            $("#tr"+$("#idCliente").val()).remove();
                        }else{
                            swal("Guardado", "Se ha Abonado a la cuenta", "success");
    
                            $("#modalAbonar").modal('toggle');
                            $("#formAbono").trigger('reset');
                            // ACTUALIZAR ROW
                            let htmlAbono = '';
                            htmlAbono += '<tr id="tr'+data[0].idCliente+'">';
                            htmlAbono += '<td>'+data[0].nombreCliente+'</td>'
                            htmlAbono += '<td class="text-center">$ '+formatNumber(data[0].saldoTotal)+'</td>'
                            htmlAbono += '<td class="text-center">$ '+formatNumber(data[0].saldoRestante)+'</td>'
                            htmlAbono += '<td class="text-center"><button class="btn btn-info" data-toggle="modal" data-target="#modalTransaccionesCliente" onclick="transaccionesCliente('+data[0].idCliente+')"><i class="fas fa-eye"></i></button></td>';
                            htmlAbono += '<td class="text-center"><button class="btn btn-success" data-toggle="modal" data-target="#modalAbonos" onclick="abonosCliente('+data[0].idCliente+')"><i class="fas fa-file-alt"></i></button></td>';
                            htmlAbono += '</tr>';
        
                            $("#tr"+data[0].idCliente).replaceWith(htmlAbono);
                        }
                        checkTabla();
                    },
                    error:function(err){
                        console.log(err);
                    
                    }
                });
            }
        });
	});
});

function transaccionesCliente(idCliente){
    $.ajax({
        url:URL+"/transaccionesCliente", 
        method:'POST', 
        data: {idCliente:idCliente},
        success: function(data){

            htmlVerTransacciones = '';
            for(var i=0; i<data.transaccionCliente.length; i++){
                htmlVerTransacciones += '<tr>';
                htmlVerTransacciones += '<td class="text-center">$ '+formatNumber(data.transaccionCliente[i].totalTransaccion)+'</td>';
                fechaOperacion = moment(data.transaccionCliente[i].fechaOperacion).format("DD-MM-YYYY kk:mm");
                htmlVerTransacciones += '<td class="text-center">'+fechaOperacion+'</td>';
                htmlVerTransacciones += '<td class="text-center"><a href="#" data-toggle="modal" data-target="#modalDetalleCompra" onclick="detalleCompra('+data.transaccionCliente[i].idTransaccion+')" class="badge badge-info">Ver Detalles</a></td>';
                htmlVerTransacciones += '</tr>';
            }
            
            $("#seccionTransaccion").html(htmlVerTransacciones);
             $("#saldoRestanteModal").html('$ '+formatNumber(data.totalTransaccion[0].saldoRestante));
             $("#btnAbonar").attr('onclick', 'showPromptMessage('+idCliente+')');
            },
            error: function(err){
                console.log(err);
        }
    });
}

function detalleCompra(idTransaccion){
    $("#modalTransaccionesCliente").modal('toggle');
    $.ajax({
        url:URL+'/detalleCompra',
        method:'POST',
        data: {idTransaccion:idTransaccion},
        success: function (data){
            html = '';
            for(var i=0; i<data.length; i++){
                html += '<tr>';
                html += '<td>'+data[i].codigoProd+'</td>';
                html += '<td>'+data[i].nombreProd+'</td>';
                html += '<td class="text-center">$ '+formatNumber(data[i].precioVentaProd)+'</td>';
                html += '<td class="text-center">x'+data[i].cantidad+'</td>';
                html += '<td class="text-center">$ '+formatNumber(data[i].precioVentaProd * data[i].cantidad)+'</td>';
                fecha = moment(data[i].fechaOperacion).format("DD-MM-YYYY kk:mm");
                html += '<td>'+fecha+'</td>';
                html += '</tr>';
            }
            
            $("#seccionProductosModal").html(html);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function abonosCliente(idCliente){
    $.ajax({
        url:URL+"/historialAbonos",
        method:"POST",
        data:{idCliente:idCliente},
        success: function(data){
            var htmlHistAbono = "";

            if(data != 0){
                data.forEach(function(dato){
                    htmlHistAbono += '<tr>';
                    fechaAbono = moment(dato.fechaAbono).format("DD-MM-YYYY kk:mm");
                    htmlHistAbono += '<td class="text-center">'+fechaAbono+'</td>';
                    htmlHistAbono += '<td class="text-center">$ '+formatNumber(dato.cantidadAbono)+'</td>';
                    htmlHistAbono += '</tr>';
                });
            }else{
                htmlHistAbono += '<tr><td colspan="2" class="text-center"><h4>No hay Abonos</h4></td></td>';
            }
            $("#seccionAbonos").html(htmlHistAbono);
            
        },
        error: function(err){
            console.log(err);
        }
    });
}

// BOTONES PARA REGRESAR
$("#btnBackDetalle").click(function(){
    $("#modalTransaccionesCliente").modal('toggle');
    $("#modalDetalleCompra").modal('toggle');

});

// FUNCION PARA DAR FORMATO A NUMEROS
function formatNumber(num) {
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
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}
function showPromptMessage(idCliente) {
    $("#modalTransaccionesCliente").modal('toggle');
    $("#idCliente").val(idCliente);
}

function checkTabla(){
    var numTR = $("#tablaPagosPendientes").find("tr").length;
    numTR = numTR - 1;

    if(numTR == 0){
        htmlTabla = '<tr><td colspan="5"><h4 class="text-center">No hay datos</h4></td></tr>';
        $("#seccionInventario").html(htmlTabla);
    }
        
}
checkTabla();