URL = '/corteCaja';
$(function (){
    flagTickets();
    tipoPV();
})

function flagTickets(){
    $.ajax({
        url:URL+"/flagTickets", 
        method:'POST', 
        success: function(data){
            flagTicket = data.flagTickets;
            if(flagTicket === 1){
                $("#flagTicket").parent().find(".switchery").trigger("click");
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}

function tipoPV(){
    $.ajax({
        url:URL+"/tipoPV", 
        method:'GET', 
        success: function(data){
            $("#id_configuracion_pv").val(data.id_configuracion_pv);
        },
        error: function(err){
            console.log(err);
        }
    });
}

$("#flagTicket").on( 'change', function() {
    idCorte = $("#idCorte").val();
    if( $(this).is(':checked') ) {
        $.ajax({
            url: URL+"/activarTickets",
            data: {idCorte: idCorte},
            type:"POST",
            error: function(err){
                console.log(err);
            }
        });
    } else {
        $.ajax({
            url: URL+"/desactivarTickets",
            data: {idCorte: idCorte},
            type:"POST",
            error: function(err){
                console.log(err);
            }
        });
    }
});

$("#id_configuracion_pv").on( 'change', function() {
    id_configuracion_pv = $("#id_configuracion_pv").val();
    $.ajax({
        url: URL+"/configurarTipo",
        data: {id_configuracion_pv: id_configuracion_pv},
        type:"POST",
        success: function(data){
            console.log(data);
        },
        error: function(err){
            console.log(err);
        }
    });
});