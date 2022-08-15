const URL = '/reportes';

$(function () {

    listUser();

    $("#formFiltroReporteVentas").on('submit', (e) => {
        e.preventDefault();
        
        formData = $("#formFiltroReporteVentas").serialize();

        $.ajax({
            url:URL+"/transaccionesUser", 
            method:'POST', 
            data: formData,
            success: function(data){
                $("#dineroVentas").html("$ "+formatNumber(data.dineroVentas[0].dineroVentas));
                $("#totalVentas").html(data.totalVentas[0].totalVentas);
                $("#totalProductos").html(data.totalProductos[0].totalProductos);
                $("#totalCancelados").html(data.totalCancelados[0].totalCancelados);
                $("#totalGanancia").html("$ "+formatNumber(data.ganancia));
                html = '';
                for(var i=0; i<data.transaccion.length; i++){
                    if(data.transaccion[i].estatusTransaccion == 1){
                        html += '<tr>';
                        html += '<td class="text-center">$ '+formatNumber(data.transaccion[i].totalTransaccion)+'</td>';
                        fechaOperacion = moment(data.transaccion[i].fechaOperacion).format("DD-MM-YYYY kk:mm");
                        html += '<td class="text-center">'+fechaOperacion+'</td>';
                        html += '<td class="text-center"><a href="#" data-toggle="modal" data-target="#modalDetalleTransaccionesCorte" onclick="verDetalleTransaccionCorte('+data.transaccion[i].idTransaccion+')" class="badge badge-info">Ver Detalles</a></td>';
                        html += '</tr>';
                    }else if(data.transaccion[i].estatusTransaccion == 2){
                        html += '<tr>';
                        html += '<td class="text-center text-danger">$ '+formatNumber(data.transaccion[i].totalTransaccion)+'</td>';
                        fechaOperacion = moment(data.transaccion[i].fechaOperacion).format("DD-MM-YYYY kk:mm");
                        html += '<td class="text-center text-danger">'+fechaOperacion+'</td>';
                        html += '<td class="text-center"><a href="#" data-toggle="modal" data-target="#modalDetalleTransaccionesCorte" onclick="verDetalleTransaccionCorte('+data.transaccion[i].idTransaccion+')" class="badge badge-danger">Cancelado - Ver Detalles</a></td>';
                        html += '</tr>';
                    }
                }
                $("#seccionTransaccion").html(html);
            },
            error: function(err){
                console.log(err);
            }
        });
    });

    $("#formFiltroReporteMasVendidos").on('submit', (e) => {
        e.preventDefault();
        formData = $("#formFiltroReporteMasVendidos").serialize();
        $.ajax({
            url: URL+'/topVentas',
            method:'POST',
            data:formData,
            success:function(data){
                var htmlMasVendido = '';
                data.masVendido.forEach(function(dato){
    
                    if(dato.totalVendidos > 1){
                        htmlMasVendido += '<tr>';
                        htmlMasVendido += '<td class="text-center">'+dato.codigoProd+'</td>';
                        htmlMasVendido += '<td class="text-center">'+dato.nombreProd+'</td>';
                        htmlMasVendido += '<td class="text-center">'+dato.totalVendidos+'</td>';
                        htmlMasVendido += '</tr>';
                    }
                });
                $("#seccionMasVendidos").html(htmlMasVendido);
    
                var htmlmenosVendido = '';
                data.menosVendido.forEach(function(dato){
                    if(dato.totalVendidos < data.min){
                        htmlmenosVendido += '<tr>';
                        htmlmenosVendido += '<td class="text-center">'+dato.codigoProd+'</td>';
                        htmlmenosVendido += '<td class="text-center">'+dato.nombreProd+'</td>';
                        htmlmenosVendido += '<td class="text-center">'+dato.totalVendidos+'</td>';
                        htmlmenosVendido += '</tr>';
                    }
                });
                
                $("#seccionMenosVendidos").html(htmlmenosVendido);
            },
            error: function(err){
                console.log(err);
            }
        });
    });

});

$("#btnTabVentas").click(function(e){
    e.preventDefault();
    
    $("#btnTabVentas").addClass("active");
    $("#btnTabMasVendidos").removeClass("active");
    $("#btnTabAgotados").removeClass("active");
    $(".ventas").show();
    $(".masVendidos").hide();
    $(".agotados").hide();
});

$("#btnTabMasVendidos").click(function(e){
    e.preventDefault();
    
    $("#btnTabMasVendidos").addClass("active");
    $("#btnTabVentas").removeClass("active");
    $("#btnTabAgotados").removeClass("active");
    $(".masVendidos").show();
    $(".ventas").hide();
    $(".agotados").hide();

});

$("#btnTabAgotados").click(function(e){
    e.preventDefault();
    
    $("#btnTabAgotados").addClass("active");
    $("#btnTabMasVendidos").removeClass("active");
    $("#btnTabVentas").removeClass("active");
    $(".agotados").show();
    $(".masVendidos").hide();
    $(".ventas").hide();

    agotados();

});


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

function listUser(){
    $.ajax({
        url: URL+'/listUsers',
        method:'POST',
        success:function(data){
            var htmlSelect = '';

            htmlSelect += '<option value="">Seleccionar Vendedor</option>';

            for(var i=0; i<data.length; i++){
                htmlSelect += '<option value="'+data[i].idUser+'">'+data[i].nombreUser+'</option>';
            }
            $("#idUser").html(htmlSelect);
            $("#idUser").show();
        },
        error: function(err){
            console.log(err);
        }
    });
}



function agotados(){

    $.ajax({
        url: URL+'/agotados',
        method:'POST',
        success:function(data){
            
            var htmlAgotados = '';
            htmlAgotados = '';
            for(var i=0; i<data.agotados.length; i++){
                htmlAgotados += '<tr>';
                htmlAgotados += '<td class="text-center">'+data.agotados[i].codigoProd+'</td>';
                htmlAgotados += '<td class="text-center">'+data.agotados[i].nombreProd+'</td>';
                htmlAgotados += '<td class="text-center">'+data.agotados[i].minimoStock+'</td>';
                htmlAgotados += '<td class="text-center">'+data.agotados[i].cantidadProd+'</td>';
                htmlAgotados += '</tr>';
            }
            
            $("#seccionAgotados").html(htmlAgotados);

            var htmlPorAgotarse = '';
            htmlPorAgotarse = '';
            for(var i=0; i<data.porAgotarse.length; i++){
                htmlPorAgotarse += '<tr>';
                htmlPorAgotarse += '<td class="text-center">'+data.porAgotarse[i].codigoProd+'</td>';
                htmlPorAgotarse += '<td class="text-center">'+data.porAgotarse[i].nombreProd+'</td>';
                htmlPorAgotarse += '<td class="text-center">'+data.porAgotarse[i].minimoStock+'</td>';
                htmlPorAgotarse += '<td class="text-center">'+data.porAgotarse[i].cantidadProd+'</td>';
                htmlPorAgotarse += '</tr>';
            }
            
            $("#seccionPorAgotarse").html(htmlPorAgotarse);
        },
        error: function(err){
            console.log(err);
        }
    });
}

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