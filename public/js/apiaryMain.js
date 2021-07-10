
window.onload = function() {
	let select = document.querySelector('#dashboard .apiary-container');

	// Get hive list
    if(select){
        $.ajax({
            url: '/hivelist',
            type: 'POST',
            dataType: 'json',
            success: function(data){
                if(data && data.length){
                    // select.innerHTML = data;
            
					console.log([data]);
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                createAlert(jqXhr.responseText, 'Error');
            }
        })
    }
  };
