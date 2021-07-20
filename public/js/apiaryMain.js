
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

                    for(let apiary of data){
                        let apiaryContainer = document.createElement('div');
                        let apiaryHeader = document.createElement('div');
                        let apiaryHeaderText = document.createElement('p');
                        let apiaryContent = document.createElement('div');

                        apiaryContainer.classList.add('apiary-container');
                        apiaryHeader.classList.add('apiary-header');
                        apiaryContent.classList.add('apiary-content');

                        apiaryHeaderText.innerHTML = apiary['ApiaryName']; 
                        apiaryHeader.appendChild(apiaryHeaderText);

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

                            for(let hive of group['HiveList']){
                                let hiveElem = document.createElement('div');
                                let hiveText = document.createElement('p');

                                hiveElem.classList.add('hive-elem');
                                if(hive['FamilyID']){
                                    hiveElem.classList.add('occupied');
                                }

                                hiveText.innerHTML = hive['HiveNum'];
                                hiveElem.appendChild(hiveText);
                                hiveElem.setAttribute('value', hive['HiveID']);
                                hiveElem.onclick = function(){
                                    hiveOnClick(hive['HiveID'])
                                };

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


