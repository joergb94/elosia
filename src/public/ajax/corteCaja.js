URL = '/corteCaja';
idUser = $("#idUser").val();
$(function (){

    $("#formCantidadInicial").on('submit', (e) => {
        e.preventDefault();

        var formData = {
            cantidadCorte : $("#cantidadCorte").val()
        };

        $.ajax({
            url: URL+'/add',
            method:'POST',
            data: formData,
            success: function (data){
                if(data === 1){
                    $("#formCantidadInicial").trigger("reset");
                    consultaCorte();
                    swal("Guardado", "Cantidad inicial establecida", "success");
                }else{
                    swal("No Guardado", "No se ha podido guardar", "error");
                }
            },
            error:function(err){
                console.log(err);
            }
        });
    });

    $("#formEditarCorte").on('submit', (e) => {
        e.preventDefault();

        swal({
            title: "¿Estas Seguro?",
            text: "Se Actualizará el Corte de Caja",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Si",
            closeOnConfirm: false
        }, function () {
            var formData = {
                idCorte : $("#idCorte").val(),
                cantidadCorte : $("#cantidadCorteEditar").val()
            };
    
            $.ajax({
                url:URL+"/update", 
                method:'POST', 
                data: formData,
                success: function(data){
                    $("#modalEditar").modal('toggle');
                    swal("Corte Actualizado", "", "success");
                    consultaCorte();
                },
                error: function(err){
                    console.log(err);
                }
            });
        });
    });

    
    $("#formCortes").submit(function(e){
        e.preventDefault();

        $.ajax({
            url:URL+"/consultaCortes", 
            method:'POST', 
            data: $(this).serialize(),
            success: function(data){ 
                let htmlCortes = "";
                if(data != ""){
                    data.forEach(function(dato){
                        htmlCortes += '<tr>';
                        htmlCortes += '<td class="text-center">'+dato.nombreUser+'</td>';
                        htmlCortes += '<td class="text-center">$ '+formatNumber(dato.cantidadCorte)+'</td>';
                        inicioCorte = moment(dato.inicioCorte).format("DD-MM-YYYY kk:mm");
                        finCorte = moment(dato.finCorte).format("DD-MM-YYYY kk:mm");
                        htmlCortes += '<td class="text-center">'+inicioCorte+'</td>';
                        htmlCortes += '<td class="text-center">'+finCorte+'</td>';
                        htmlCortes += '<td class="text-center"><a href="#" data-toggle="modal" data-target="#modalTransaccionesCorte" onclick="transaccionesCorte('+dato.idCorte+')" class="badge badge-info">Ver Transacciones</a></td>';
                        htmlCortes += '<td class="text-center"><a href="#" onclick="resumenCorte('+dato.idCorte+')" class="badge badge-success">Ver Resumen</a></td>';
                        htmlCortes += '</tr>';
                    });    
                }else{
                    htmlCortes += '<tr><td colspan="5" class="text-center"><h5>No hay cortes</h5></td></tr>';
                }
                $("#seccionCortesUser").html(htmlCortes);
            },
            error: function(err){
                console.log(err);
            }
        });
    });

    consultaCorte();
})

function consultaCorte(){

    $.ajax({
        url:URL+"/consultaCorte", 
        method:'POST', 
        data: {idUser:idUser},
        success: function(data){
            $("#idCorte").val(data.idCorte);
            $("#btnResumenCorte").attr("onclick", "resumenCorte("+data.idCorte+")");
            $("#cantidadCorteEditar").val(data.cantidadCorte);
            $("#labelCorteIniciado").html("Corte iniciado en $" + formatNumber(data.cantidadCorte));
            $("#formCantidadInicial").hide();
            $("#btnNuevoCorte").show();
            $("#btnEditarCorte").show();
            $("#btnResumenCorte").show();
        },
        error: function(err){
            $("#idCorte").val('');
            $("#labelCorteIniciado").html('');
            $("#formCantidadInicial").show();
            $("#btnNuevoCorte").hide();
            $("#btnEditarCorte").hide();
            $("#btnResumenCorte").hide();
            console.log(err);
        }
    });
}

$("#btnNuevoCorte").on('click', () =>{

    swal({
        title: "¿Estas Seguro?",
        text: "Se realizará el Corte de Caja",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Si",
        closeOnConfirm: false
    }, function () {
        
        idCorte = $("#idCorte").val();
        $.ajax({
            url:URL+"/nuevoCorte", 
            method:'POST', 
            data: {idUser:idUser, idCorte:idCorte},
            success: function(data){
                
                swal({
                    title: "Corte Cerrado",
                    text: "",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true
                }, function () {
                    resumenCorte(idCorte);
                    consultaCorte();
                });
            },
            error: function(err){
                console.log(err);
            }
        });
    });   

});
// RESUMEN

function resumenCorte(idCorte){
    $("#modalResumenCorte").modal('toggle');
    $.ajax({
        url:URL+"/resumenCorte", 
        method:'POST', 
        data: {idCorte:idCorte},
        success: function(data){
            console.log(data)
            $("#corteInicial").val("$"+formatNumber(data.corte[0].cantidadCorte));
            $("#ganancias").val("$"+formatNumber(data.ganancias));
            $("#abonos_total").val("$"+formatNumber( data.totalAbono[0].total_abono));
            
            $("#dineroVentas").val("$ "+formatNumber(data.dineroVentas[0].dineroVentas + data.totalAbono[0].total_abono));
            $("#totalVentas").val(data.totalVentas[0].totalVentas); 
            $("#totalProductos").val(data.totalProducto);
            $("#totalCancelados").val(data.totalCancelados[0].totalCancelados);
            
            htmlImprime = '';
            
            htmlImprime += `
                <tr>
                    <td style="padding:4px; border: 1px solid black;border-collapse: collapse; text-align:center">$ ${formatNumber(data.corte[0].cantidadCorte)}</td>
                    <td style="padding:4px; border: 1px solid black;border-collapse: collapse; text-align:center">$ ${formatNumber(data.ganancias)}</td>
                    <td style="padding:4px; border: 1px solid black;border-collapse: collapse; text-align:center">$ ${formatNumber(data.dineroVentas[0].dineroVentas)}</td>
                    <td style="padding:4px; border: 1px solid black;border-collapse: collapse; text-align:center">${data.totalVentas[0].totalVentas}</td>
                    <td style="padding:4px; border: 1px solid black;border-collapse: collapse; text-align:center">${data.totalProducto}</td>
                    <td style="padding:4px; border: 1px solid black;border-collapse: collapse; text-align:center">${data.totalCancelados[0].totalCancelados}</td>
                </tr>
            `;
            $("#fechaInicioCorte").html(moment(data.corte[0].inicioCorte).format("DD-MM-YYYY kk:mm"));
            $("#fechaFinCorte").html(moment(data.corte[0].finCorte).format("DD-MM-YYYY kk:mm"));
            $("#seccionResumen").html(htmlImprime);
        },
        error: function(err){
            console.log(err);
        }
    });
}


function transaccionesCorte(idCorte){
    $("#modalVerCortes").modal('toggle');
    $.ajax({
        url:URL+"/transaccionesCorte", 
        method:'POST', 
        data: {idCorte:idCorte},
        success: function(data){
            htmlVerTransacciones = '';
            for(var i=0; i<data.length; i++){
                htmlVerTransacciones += '<tr>';
                htmlVerTransacciones += '<td class="text-center">$ '+formatNumber(data[i].totalTransaccion)+'</td>';
                fechaOperacion = moment(data[i].fechaOperacion).format("DD-MM-YYYY kk:mm");
                htmlVerTransacciones += '<td class="text-center">'+fechaOperacion+'</td>';
                htmlVerTransacciones += '<td class="text-center"><a href="#" data-toggle="modal" data-target="#modalDetalleTransaccionesCorte" onclick="verDetalleTransaccionCorte('+data[i].idTransaccion+')" class="badge badge-info">Ver Detalles</a></td>';
                htmlVerTransacciones += '</tr>';
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
            for(var i=0; i<data.length; i++){
                htmlVerDTTransacciones += '<tr>';
                htmlVerDTTransacciones += '<td>'+data[i].codigoProd+'</td>';
                htmlVerDTTransacciones += '<td>'+data[i].nombreProd+'</td>';
                htmlVerDTTransacciones += '<td class="text-center">$ '+formatNumber(data[i].precioVentaProd)+'</td>';
                htmlVerDTTransacciones += '<td class="text-center">'+data[i].cantidad+'</td>';
                htmlVerDTTransacciones += '<td class="text-center">$ '+formatNumber(data[i].precioVentaProd * data[i].cantidad)+'</td>';
                fecha = moment(data[i].fechaOperacion).format("DD-MM-YYYY kk:mm");
                htmlVerDTTransacciones += '<td>'+fecha+'</td>';
                htmlVerDTTransacciones += '</tr>';
            }
            
            $("#seccionDetalleTransaccion").html(htmlVerDTTransacciones);
        },
        error: function(err){
            console.log(err);
        }
    });

}

// BOTONES PARA REGRESAR
$("#btnBackDetalle").click(function(){
    $("#modalDetalleTransaccionesCorte").modal('toggle');
    $("#modalTransaccionesCorte").modal('toggle');

});
$("#btnBackTransacciones").click(function(){
    $("#modalTransaccionesCorte").modal('toggle');
    $("#modalVerCortes").modal('toggle');
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