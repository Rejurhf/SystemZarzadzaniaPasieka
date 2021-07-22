
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
                    // Create Apiary grid
                    for(let apiary of data){
                        // Create Apiary
                        let apiaryContainer = document.createElement('div');
                        let apiaryHeader = document.createElement('div');
                        let apiaryHeaderText = document.createElement('p');
                        let apiaryContent = document.createElement('div');

                        apiaryContainer.classList.add('apiary-container');
                        apiaryHeader.classList.add('apiary-header');
                        apiaryContent.classList.add('apiary-content');

                        apiaryHeaderText.innerHTML = apiary['ApiaryName']; 
                        apiaryHeader.appendChild(apiaryHeaderText);

                        // Create Groups for Apiary
                        for(let group of apiary['GroupList']){
                            let groupContainer = document.createElement('div');
                            let groupHeader = document.createElement('div');
                            let groupHeaderText = document.createElement('p');
                            let groupContent = document.createElement('div');
                            
                            groupContainer.classList.add('group-container');
                            groupHeader.classList.add('group-header');
                            groupContent.classList.add('group-content');

                            groupHeaderText.innerHTML = group['GroupName']; 
                            groupHeader.appendChild(groupHeaderText);

                            // Create Hives for group
                            for(let hive of group['HiveList']){
                                let hiveElem = document.createElement('div');
                                let hiveText = document.createElement('p');
                                let hiveMenu = document.createElement('span');

                                hiveElem.classList.add('hive-elem');
                                if(hive['FamilyID']){
                                    hiveElem.classList.add('occupied');
                                }

                                hiveText.innerHTML = hive['HiveNum'];
                                hiveElem.appendChild(hiveText);
                                
                                // Add Hive menu
                                hiveMenu.innerHTML = 'Usuń';
                                hiveMenu.classList.add('hive-menu');
                                hiveMenu.onclick = function(e){
                                    hiveDeleteOnClick(e, hive['HiveID']);
                                };
                                hiveElem.appendChild(hiveMenu);

                                // Add Hive tail on click
                                hiveElem.setAttribute('value', hive['HiveID']);
                                hiveElem.onclick = function(){
                                    hiveOnClick(hive['HiveID'])
                                };

                                // If no GroupID add hives without group
                                if(group['GroupID']){
                                    groupContent.appendChild(hiveElem);
                                }else{
                                    apiaryContent.appendChild(hiveElem);
                                }
                                
                            }

                            if(group['GroupID']){
                                groupContainer.appendChild(groupHeader);
                                groupContainer.appendChild(groupContent);

                                apiaryContent.appendChild(groupContainer);
                            }
                        }

                        apiaryContainer.appendChild(apiaryHeader);
                        apiaryContainer.appendChild(apiaryContent);

                        select.appendChild(apiaryContainer);
                    }
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                createAlert(jqXhr.responseText, 'Error');
            }
        })
    }
};

function hiveOnClick(hiveID){
    console.log(hiveID);
    let urlStr = '/apiary/hive/' + hiveID;
    window.location = urlStr;
}

function hiveDeleteOnClick(e, hiveID){
    e.stopPropagation();
    let urlStr = '/apiary/hive/' + hiveID 

    $.ajax({
        url: urlStr,
        type: 'DELETE',
        dataType: 'json',
        success: function(data){
            createAlert(data.message, data.severity);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            createAlert(jqXhr.responseText, 'Error');
        }
    })
}



