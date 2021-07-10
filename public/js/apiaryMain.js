
window.onload = function() {
	let select = document.querySelector('#dashboard .apiary-main');

	// Get hive list
    if(select){
        $.ajax({
            url: '/hivelist',
            type: 'POST',
            dataType: 'json',
            success: function(data){
                if(data && data.length){
					console.log(['POST /hivelist', data]);
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                createAlert(jqXhr.responseText, 'Error');
            }
        })
    }
  };
