const URL = '/pv';
idUser = $("#idUser").val();
var flagTicketCliente = true;
var flagTickets = true;

// DESACTIVAR ALERTA DE SALIR DE PAGINA
$("#btnPagarClick").click(function (e) {
    bPreguntar = false;
})

$(function () {

    checkCorteActivo();
    funcionflagTickets()
    // FOCUS
    $("#cantidadProducto").on('click', () => {
        $("#cantidadProducto").val("");
    });
    $("#cantidadProducto").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            $("#buscaProducto").focus();
        }
    });
    // BUSCAR PRODUCTO DESDE INPUT PRINCIPAL
    $("#buscaProducto").on('change', () => {
        buscaProducto = $("#buscaProducto").val();
        cantidadProducto = $("#cantidadProducto").val();
        cantidadProducto = parseInt(cantidadProducto);

        if (cantidadProducto > 0) {
            // if (!isNaN(buscaProducto)) {
            $.ajax({
                url: URL + '/buscarCode',
                method: 'POST',
                data: {
                    nombreProd: buscaProducto
                },
                success: function (data) {
                    if (data != false) {
                        bPreguntar = true;
                        if (data[0].cantidadProd >= cantidadProducto) {
                            // RESTAR CANTIDAD A LA BD
                            $.ajax({
                                url: URL + '/restarStock',
                                method: 'POST',
                                data: {
                                    idProd: data[0].idProd,
                                    cantidadProd: cantidadProducto,
                                    cantidadActual: data[0].cantidadProd
                                },
                                error: function (err) {
                                    console.log(err);
                                }
                            });

                            // RESET CAMPOS DE BUSQUEDA
                            $("#buscaProducto").val("");
                            $("#cantidadProducto").val(1);
                            $("#buscaProducto").focus();

                            // GENERAR TABLA
                            let html = '';
                            var htmlTicket = '';

                            // SINO EXISTE CREAR, SINO ACTUALIZAR
                            if (!($('.cant' + data[0].idProd)[0])) {
                                calcularTotalPagar(data[0].precioVentaProd, cantidadProducto);
                                html += '<tr class="gradeA" id="row' + data[0].idProd + '">';
                                html += '<input type="hidden" name="idProd[]" value="' + data[0].idProd + '">';
                                html += '<input type="hidden" name="cantidadProd[]" value="' + cantidadProducto + '">';
                                html += '<td>' + data[0].codigoProd + '</td>';
                                html += '<td>' + data[0].nombreProd + '</td>';
                                html += '<td class="text-center">$ ' + formatNumber(data[0].precioVentaProd) + ' </td>';
                                html += '<td class="text-center">' + cantidadProducto + ' <input type="hidden" value="' + cantidadProducto + '" class="cant' + data[0].idProd + '"></td>';
                                html += '<td class="text-danger text-center"><a href="#" class="btn btn-danger" onclick="borrarProducto(' + data[0].idProd + ', ' + data[0].precioVentaProd + ', ' + cantidadProducto + ')"><i class="fas fa-trash-alt"></i></a></td>';
                                html += '</tr>';
                                $("#seccionVenta").append(html);

                                htmlTicket += ` 
                                        <tr style="border-top: 1px dashed black;border-collapse: collapse;" id="rowTicket${data[0].idProd}">
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 30px;max-width: 30px;word-break: break-all;">${cantidadProducto}</td>
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 75px;max-width: 75px;">${data[0].nombreProd}</td>
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 50px;max-width: 50px;word-break: break-all;">$ ${formatNumber(data[0].precioVentaProd)}</td>
                                        </tr>
                                    `;
                                $("#seccionTicket").append(htmlTicket);
                            } else {
                                cantidadHidden = $('.cant' + data[0].idProd).val();
                                cantidadHidden = Number(cantidadHidden);
                                cantidadProductoR = cantidadHidden + cantidadProducto;

                                calcularTotalPagar(data[0].precioVentaProd, cantidadProducto);
                                html += '<tr class="gradeA" id="row' + data[0].idProd + '">';
                                html += '<input type="hidden" name="idProd[]" value="' + data[0].idProd + '">';
                                html += '<input type="hidden" name="cantidadProd[]" value="' + cantidadProductoR + '">';
                                html += '<td>' + data[0].codigoProd + '</td>';
                                html += '<td>' + data[0].nombreProd + '</td>';
                                html += '<td class="text-center">$ ' + formatNumber(data[0].precioVentaProd) + '</td>';
                                html += '<td class="text-center">' + cantidadProductoR + ' <input type="hidden" value="' + cantidadProductoR + '" class="cant' + data[0].idProd + '"></td>';
                                html += '<td class="text-danger text-center"><a href="#" class="btn btn-danger" onclick="borrarProducto(' + data[0].idProd + ', ' + data[0].precioVentaProd + ', ' + cantidadProductoR + ')"><i class="fas fa-trash-alt"></i></a></td>';
                                html += '</tr>';
                                $('#row' + data[0].idProd).replaceWith(html);

                                htmlTicket += ` 
                                        <tr style="border-top: 1px dashed black;border-collapse: collapse;" id="rowTicket${data[0].idProd}">
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 30px;max-width: 30px;word-break: break-all;">${cantidadProductoR}</td>
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 75px;max-width: 75px;">${data[0].nombreProd}</td>
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 50px;max-width: 50px;word-break: break-all;">$ ${formatNumber(data[0].precioVentaProd)}</td>
                                        </tr>
                                        `;
                                $('#rowTicket' + data[0].idProd).replaceWith(htmlTicket);
                            }
                        } else {
                            $("#buscaProducto").val("");
                            $("#cantidadProducto").val(1);
                            $("#buscaProducto").focus();
                            swal('Producto Agotado', 'Producto no disponible', 'error');
                        }
                    } else {
                        $("#buscaProducto").val("");
                        $("#cantidadProducto").val(1);
                        $("#buscaProducto").focus();
                        swal('No Encontrado', 'Producto no encontrado', 'error');
                    }

                },
                error: function (err) {
                    console.log(err);
                }
            });
            // }
        } else {
            swal("Valor inválido", "El valor debe ser mayor a 0", "error");
        }
    });

    // BUSCAR DESDE EL MODAL
    $("#formBuscarProducto").on('submit', (e) => {
        e.preventDefault();

        buscaProductoModal = $("#buscaProductoModal").val();

        $.ajax({
            url: URL + '/buscarNom',
            method: 'POST',
            data: {
                nombreProd: buscaProductoModal
            },
            success: function (data) {
                let htmlModal = '';
                if (data != false) {
                    data.forEach(function (dato) {

                        htmlModal += '<tr class="gradeA">';
                        if (dato.cantidadProd >= 1) {
                            htmlModal += '<td ><input type="number" name="cantidadProdModal" style="width: 90px" class="form-control cantM' + dato.idProd + ' all-hide-input" onkeypress=agregarRow(' + dato.idProd + ') onkeyup=keyAgregarProductos(' + dato.idProd + ') </td>';
                        } else {
                            htmlModal += '<td ><input type="text" name="cantidadProdModal" style="width: 90px" class="form-control text-danger" value="Agotado" disabled></td>';
                        }
                        htmlModal += '<td>' + dato.codigoProd + '</td>';
                        htmlModal += '<td>' + dato.nombreProd + '</td>';
                        htmlModal += '<td class="text-center">$ ' + formatNumber(dato.precioVentaProd) + '</td>';
                        htmlModal += '<td class="text-center">' + dato.cantidadProd + '</td>';
                        htmlModal += '<input type="hidden" value="' + dato.idProd + '" name="idProd[]">';
                        htmlModal += '<input type="hidden" value="' + dato.cantidadProd + '" name="cantidadProdHidden[]">';
                        htmlModal += '</tr>';
                    });
                } else {
                    htmlModal += '<tr class="gradeA">';
                    htmlModal += '<td colspan="7" class="text-center"><h5>No han encontrado resultados</h5></td>';
                    htmlModal += '</tr>';
                }
                $("#seccionProductosModal").html(htmlModal);
            },
            error: function (err) {
                console.log(err);
            }
        });
    });
});

// FUNCION PARA INPUTS DEL MODAL
function keyAgregarProductos(idProd) {
    cantidadModal = $('.cantM' + idProd).val();
    if (cantidadModal > 0) {
        $('.cantM' + idProd).removeClass('all-hide-input');
        $('.all-hide-input').hide();
    } else {
        $('.cantM' + idProd).addClass('all-hide-input');
        $('.all-hide-input').show();
    }

}

// AGREGAR A TABLA DESDE MODAL
function agregarRow(idProd) {

    bPreguntar = true;
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {

        $("#modalBuscarProducto").modal('toggle');

        cantidadModal = $('.cantM' + idProd).val();
        cantidadModal = parseInt(cantidadModal);
        $('.cantM' + idProd).val("");
        if (cantidadModal > 0) {
            // if (!isNaN(codigoProd)) {
            $.ajax({
                url: URL + '/buscarId',
                method: 'POST',
                data: {
                    idProd: idProd
                },
                success: function (data) {
                    if(cantidadModal > 0){

                        $("#buscaProducto").focus();
                        if (data[0].cantidadProd >= cantidadModal) {
    
                            // RESTAR CANTIDAD A LA BD 
                            $.ajax({
                                url: URL + '/restarStock',
                                method: 'POST',
                                data: {
                                    idProd: data[0].idProd,
                                    cantidadProd: cantidadModal,
                                    cantidadActual: data[0].cantidadProd
                                },
                                error: function (err) {
                                    console.log(err);
                                }
                            });
    
                            let html = '';
                            var htmlTicket = '';
                            if (!($('.cant' + idProd)[0])) {
                                calcularTotalPagar(data[0].precioVentaProd, cantidadModal);
                                html += '<tr class="gradeA" id="row' + data[0].idProd + '">';
                                html += '<input type="hidden" name="idProd[]" value="' + data[0].idProd + '">';
                                html += '<input type="hidden" name="cantidadProd[]" value="' + cantidadModal + '">';
                                html += '<td>' + data[0].codigoProd + '</td>';
                                html += '<td>' + data[0].nombreProd + '</td>';
                                html += '<td class="text-center">$ ' + formatNumber(data[0].precioVentaProd) + ' <input type="hidden" value="' + data[0].precioVentaProd + '"</td>';
                                html += '<td class="text-center">' + cantidadModal + ' <input type="hidden" value="' + cantidadModal + '" class="cant' + idProd + '"></td>';
                                html += '<td class="text-danger text-center"><a href="#" class="btn btn-danger" onclick="borrarProducto(' + data[0].idProd + ', ' + data[0].precioVentaProd + ', ' + cantidadModal + ')"><i class="fas fa-trash-alt"></i></a></td>';
                                html += '</tr>';
                                $("#seccionVenta").append(html);
    
                                htmlTicket += ` 
                                        <tr style="border-top: 1px dashed black;border-collapse: collapse;" id="rowTicket${data[0].idProd}">
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 30px;max-width: 30px;word-break: break-all;">${cantidadModal}</td>
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 75px;max-width: 75px;">${data[0].nombreProd}</td>
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 50px;max-width: 50px;word-break: break-all;">$ ${formatNumber(data[0].precioVentaProd)}</td>
                                        </tr>
                                    `;
                                $("#seccionTicket").append(htmlTicket);
                            } else {
                                cantidadHidden = $('.cant' + idProd).val();
                                cantidadHidden = Number(cantidadHidden);
                                cantidadProductoR = cantidadHidden + cantidadModal;
    
                                calcularTotalPagar(data[0].precioVentaProd, cantidadModal);
    
                                html += '<tr class="gradeA" id="row' + data[0].idProd + '">';
                                html += '<input type="hidden" name="idProd[]" value="' + data[0].idProd + '">';
                                html += '<input type="hidden" name="cantidadProd[]" value="' + cantidadProductoR + '">';
                                html += '<td>' + data[0].codigoProd + '</td>';
                                html += '<td>' + data[0].nombreProd + '</td>';
                                html += '<td class="text-center">$ ' + formatNumber(data[0].precioVentaProd) + ' <input type="hidden" value="' + data[0].precioVentaProd + '"</td>';
                                html += '<td class="text-center">' + cantidadProductoR + ' <input type="hidden" value="' + cantidadProductoR + '" class="cant' + idProd + '"></td>';
                                html += '<td class="text-danger text-center"><a href="#" class="btn btn-danger" onclick="borrarProducto(' + data[0].idProd + ', ' + data[0].precioVentaProd + ', ' + cantidadProductoR + ')"><i class="fas fa-trash-alt"></i></tr></a>';
                                html += '</tr>';
    
                                $('#row' + data[0].idProd).replaceWith(html);
    
                                htmlTicket += ` 
                                        <tr style="border-top: 1px dashed black;border-collapse: collapse;" id="rowTicket${data[0].idProd}">
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 30px;max-width: 30px;word-break: break-all;">${cantidadProductoR}</td>
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 75px;max-width: 75px;">${data[0].nombreProd}</td>
                                            <td style="text-align:center;font-size: 11px;font-family: 'Times New Roman';border-top: 1px dashed black;border-collapse: collapse; width: 50px;max-width: 50px;word-break: break-all;">$ ${formatNumber(data[0].precioVentaProd)}</td>
                                        </tr>
                                    `;
                                $('#rowTicket' + data[0].idProd).replaceWith(htmlTicket);
                                $("#btnPagar").show();
                            }
                        } else {
                            $("#buscaProducto").val("");
                            $("#cantidadProducto").val(1);
                            $("#buscaProducto").focus();
                            swal('Producto Agotado', 'Producto no disponible', 'error');
                        }
                    }else{
                        swal({
                            title: "Intenta de nuevo",
                            text: "",
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#dc3545",
                            confirmButtonText: "Ok",
                            closeOnConfirm: true
                        }, function () {
                            $("#modalBuscarProducto").modal('toggle');
                        });
                    }

                },
                error: function (err) {
                    console.log(err);
                }
            });
            // }
        } else {
            swal("Valor inválido", "El valor debe ser mayor a 0", "error");
        }

    }

}

aPagar = 0;

function borrarProducto(idProd, valor, cantidad) {

    swal({
        title: "¿Estas Seguro?",
        text: "El producto se eliminará",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Si, Eliminar",
        closeOnConfirm: false
    }, function () {

        // SUMAR CANTIDAD A LA BD 
        $.ajax({
            url: URL + '/sumarStock',
            method: 'POST',
            data: {
                idProd: idProd,
                cantidadProd: cantidad
            },
            error: function (err) {
                console.log(err);
            }
        });

        swal("Eliminado", "", "success");
        // ELIMINAR ROW
        $("#row" + idProd).remove();
        $("#rowTicket" + idProd).remove();
        $("#buscaProducto").focus();

        // CALCULAR CANTIDAD A PAGAR
        totalEliminar = cantidad * valor;
        aPagar = aPagar - totalEliminar;
        $("#APagar").html(formatNumber(aPagar));
        $("#totalTransaccion").val(aPagar);

        // VALIDAR QUE HAYA PAGO PARA MOSTRAR BOTON
        if (aPagar > 0) {
            $("#btnPagar").show();
        } else {
            $("#btnPagar").hide();
        }
    });
}


function calcularTotalPagar(valor, cantidad) {
    total = cantidad * valor;
    aPagar = aPagar + total;

    $("#APagar").html(formatNumber(aPagar));
    $("#totalTransaccion").val(aPagar);

    if (aPagar > 0) {
        $("#btnPagar").show();
    } else {
        $("#btnPagar").hide();
    }
}

function totalTicket() {
    totalTransaccion = $("#totalTransaccion").val();
    $("#subtotalTicket").html("TOTAL: $" + formatNumber(totalTransaccion));
}

$('#checkCliente').change(function () {
    var htmlSelect = '';
    if ($('#checkCliente').is(':checked')) {
        flagTicketCliente = false;
        $.ajax({
            url: URL + '/listClientes',
            method: 'POST',
            success: function (data) {

                htmlSelect += '<option value="">Seleccionar Cliente</option>';

                for (var i = 0; i < data.length; i++) {
                    htmlSelect += '<option value="' + data[i].idCliente + '">' + data[i].nombreCliente + '</option>';
                }
                $("#idCliente").html(htmlSelect);
                $("#idCliente").show();
                $("#idCliente").attr('required', true);
            },
            error: function (err) {
                console.log(err);
            }
        });

    } else {
        flagTicketCliente = true;
        htmlSelect += '<option value="">Seleccionar Cliente</option>';
        $("#idCliente").html(htmlSelect);
        $("#idCliente").hide();
        $("#idCliente").attr('required', false);
    }
});

function funcionflagTickets() {
    $.ajax({
        url: URL + "/flagTickets",
        method: 'POST',
        success: function (data) {
            if (data.flagTickets === 1) {
                flagTickets = true;
            } else {
                flagTickets = false;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// VERIFICAR SI HAY CORTE DE CAJA SINO REDIRECCIONAR
function checkCorteActivo() {
    $.ajax({
        url: "/corteCaja/actualCortesUser",
        method: 'POST',
        data: {
            idUser: idUser
        },
        success: function (data) {
            $("#cantidadProducto").attr('disabled', false);
            $("#buscaProducto").attr('disabled', false);
            $("#idCliente").attr('disabled', false);
        },
        error: function (err) {
            // BLOQUEAR TODOS LOS INPUTS 
            $("#cantidadProducto").attr('disabled', true);
            $("#buscaProducto").attr('disabled', true);
            $("#idCliente").attr('disabled', true);

            swal({
                title: "No se ha configurado corte",
                text: "Por favor configura el Corte de Caja",
                type: "error",
                confirmButtonColor: "#dc3545",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
            }, function () {
                location.href = '/corteCaja/';
            });
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
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}

function fecha() {
    fecha = new Date();
    fecha = moment(fecha).format("DD-MM-YYYY kk:mm");
    $("#fechaTicket").html(fecha);
}
fecha();

function imprimir() {
    if (flagTickets) {
        if (flagTicketCliente) {
            totalTicket();
            PrintElem('#yourdiv');
        }
    }
}

function clearModal() {
    $("#buscaProductoModal").val("");
    $("#seccionProductosModal").html("");
}

$("#cantidadProducto").keydown(function () {
    notAllowDecimal($(this));
});