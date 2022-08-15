URL = '/corteCaja';
idUser = $("#idUser").val() 

$(function (){
   actualCortesUser();
})


function actualCortesUser(){

    $.ajax({
        url:URL+"/actualCortesUser", 
        method:'POST', 
        data: {idUser:idUser},
        success: function(data){
            verTransaccionCorte(data.idCorte);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function verTransaccionCorte(idCorte){

    $.ajax({
        url:URL+"/transaccionesCorte", 
        method:'POST', 
        data: {idCorte:idCorte},
        success: function(data){
            htmlVerTransacciones = '';
            if(data != ""){
                data.forEach(function(dato){
                    htmlVerTransacciones += '<tr>';
                    htmlVerTransacciones += '<td class="text-center">$ '+formatNumber(dato.totalTransaccion)+'</td>';
                    fechaOperacion = moment(dato.fechaOperacion).format("DD-MM-YYYY kk:mm");
                    htmlVerTransacciones += '<td class="text-center">'+fechaOperacion+'</td>';
                    htmlVerTransacciones += '<td class="text-center"><a href="#" data-toggle="modal" data-target="#modalDetalleTransaccionesCorte" onclick="verDetalleTransaccionCorte('+dato.idTransaccion+')" class="badge badge-info">Ver Detalles</a></td>';
                    htmlVerTransacciones += '</tr>';
                })
            }else{
                htmlVerTransacciones += '<tr><td colspan="3" class="text-center"><h5>No hay Transacciones</h5></td></tr>';
            }
            
            $("#seccionTransaccion").html(htmlVerTransacciones);
        },
        error: function(err){
            console.log(err);
        }
    });

}

function verDetalleTransaccionCorte(idTransaccion){
    $("#modalTransaccionesCorte").modal('toggle');
    $.ajax({
        url:URL+"/detalleTransaccionesCorte", 
        method:'POST', 
        data: {idTransaccion:idTransaccion},
        success: function(data){
            htmlVerDTTransacciones = '';
            htmlTicket = "";
            for(var i=0; i<data.length; i++){
                htmlVerDTTransacciones += '<tr>';
                htmlVerDTTransacciones += '<td>'+data[i].codigoProd+'</td>';
                htmlVerDTTransacciones += '<td>'+data[i].nombreProd+'</td>';
                htmlVerDTTransacciones += '<td class="text-center">$ '+formatNumber(data[i].precioVentaProd)+'</td>';
                htmlVerDTTransacciones += '<td class="text-center">x'+data[i].cantidad+'</td>';
                htmlVerDTTransacciones += '<td class="text-center">$ '+formatNumber(data[i].precioVentaProd * data[i].cantidad)+'</td>';
                fecha = moment(data[i].fechaOperacion).format("DD-MM-YYYY kk:mm");
                htmlVerDTTransacciones += '<td>'+fecha+'</td>';
                htmlVerDTTransacciones += '</tr>';

                htmlTicket += ` 
                    <tr style="border-top: 1px dashed black;border-collapse: collapse;">
                        <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 30px;max-width: 30px;word-break: break-all;">${data[i].cantidad}</td>
                        <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 75px;max-width: 75px;">${data[i].nombreProd}</td>
                        <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 50px;max-width: 50px;word-break: break-all;">$ ${formatNumber(data[i].precioVentaProd * data[i].cantidad)}</td>
                    </tr>
                `;

                $("#fechaTicket").html(fecha);
            }
            
            // ticket
            $("#seccionTicket").html(htmlTicket);
            $("#subtotalTicket").html("TOTAL: $" + formatNumber(data[0].totalTransaccion));
            
            $("#seccionDetalleTransaccion").html(htmlVerDTTransacciones);
            $("#btnCancelarTransaccion").attr('onclick', 'cancelarTransaccion('+idTransaccion+')');
        },
        error: function(err){
            console.log(err);
        }
    });

}

function cancelarTransaccion(idTransaccion){
    swal({
        title: "¿Estas Seguro?",
        text: "Se Cancelará la Transacción",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Si",
        closeOnConfirm: false
    }, function () {
        
        $.ajax({
            url:URL+"/delete", 
            method:'POST', 
            data: {idTransaccion:idTransaccion, idUser:idUser},
            success: function(data){
                $("#modalDetalleTransaccionesCorte").modal('toggle');
                swal("Transacción Cancelada", "", "success");
                actualCortesUser();
            },
            error: function(err){
                console.log(err);
            }
        });
    });   
}

// FUNCION PARA DAR FORMATO A NUMEROS
function formatNumber(num) {
    if (!num || num == 'NaN') return '-';
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