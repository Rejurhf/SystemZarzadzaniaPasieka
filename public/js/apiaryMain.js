
window.onload = function() {
	generateGridView();
};

function generateGridView(){
    let select = document.querySelector('#dashboard .apiary-main');
    select.innerHTML = '';

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
                        // Create Apiary -------------------------------------------------
                        let apiaryContainer = document.createElement('div');
                        let apiaryHeader = document.createElement('div');
                        let apiaryHeaderText = document.createElement('div');
                        let apiaryContent = document.createElement('div');
                        let apiaryMenu = document.createElement('div');
                        let apiaryMenuItemList = ['Dodaj Ul', 'Dodaj Grupę', 'Usuń Pasiekę'];

                        apiaryContainer.classList.add('apiary-container');
                        apiaryContainer.setAttribute('value', apiary['ApiaryID']);
                        apiaryContainer.setAttribute('name', apiary['ApiaryName']);
                        apiaryHeader.classList.add('apiary-header');
                        apiaryContent.classList.add('apiary-content');

                        apiaryHeaderText.appendChild(document.createElement('span'));
                        apiaryHeaderText.firstChild.innerHTML = apiary['ApiaryName'];
                        apiaryHeaderText.classList.add('header-text'); 
                        // Add Apiary menu
                        for (let i = 0; i < apiaryMenuItemList.length; i++) {
                            let menuItem = document.createElement('div');
                            menuItem.classList.add('menu-item');
                            let dataDict = {apiaryID: apiary['ApiaryID']};
                            if(apiaryMenuItemList[i] === 'Dodaj Ul'){
                                menuItem.onclick = function(e){
                                    loadAddHiveWrapper(e, dataDict);
                                };
                            }else if(apiaryMenuItemList[i] === 'Dodaj Grupę'){
                                menuItem.onclick = function(e){
                                    loadAddGroupOnClick(e, dataDict);
                                };
                            }else if(apiaryMenuItemList[i] === 'Usuń Pasiekę'){
                                menuItem.onclick = function(e){
                                    apiaryDeleteOnClick(e, dataDict);
                                };
                            }
                            menuItem.appendChild(document.createElement('span'));
                            menuItem.firstChild.innerHTML = apiaryMenuItemList[i];
                            apiaryMenu.appendChild(menuItem);
                        }
                        apiaryMenu.classList.add('menu');
                        apiaryMenu.classList.add('group-menu');
                        apiaryHeaderText.appendChild(apiaryMenu);

                        apiaryHeader.appendChild(apiaryHeaderText);

                        // Create Groups for Apiary --------------------------------------
                        for(let group of apiary['GroupList']){
                            let groupContainer = document.createElement('div');
                            let groupHeader = document.createElement('div');
                            let groupHeaderText = document.createElement('div');
                            let groupContent = document.createElement('div');
                            let groupMenu = document.createElement('div');
                            let groupMenuItemList = ['Dodaj Ul', 'Usuń Grupę'];
                            
                            groupHeaderText.appendChild(document.createElement('span'));
                            groupHeaderText.firstChild.innerHTML = group['GroupName'];
                            groupHeaderText.classList.add('header-text'); 
                            // Add Group menu
                            for (let i = 0; i < groupMenuItemList.length; i++) {
                                let menuItem = document.createElement('div');
                                menuItem.classList.add('menu-item');
                                if(groupMenuItemList[i] === 'Dodaj Ul'){
                                    menuItem.onclick = function(e){
                                        let dataDict = {apiaryID: apiary['ApiaryID'],
                                            groupID: group['GroupID']};
                                        loadAddHiveWrapper(e, dataDict);
                                    };
                                }else if(groupMenuItemList[i] === 'Usuń Grupę'){
                                    menuItem.onclick = function(e){
                                        let dataDict = {apiaryID: apiary['ApiaryID'],
                                            groupID: group['GroupID']};
                                        groupDeleteOnClick(e, dataDict);
                                    };
                                }
                                menuItem.appendChild(document.createElement('span'));
                                menuItem.firstChild.innerHTML = groupMenuItemList[i];
                                groupMenu.appendChild(menuItem);
                            }
                            groupMenu.classList.add('menu');
                            groupMenu.classList.add('group-menu');
                            groupHeaderText.appendChild(groupMenu);

                            groupContainer.classList.add('group-container');
                            groupContainer.setAttribute('value', group['GroupID']);
                            groupContainer.setAttribute('name', group['GroupName']);
                            groupHeader.classList.add('group-header');
                            groupContent.classList.add('group-content');
                            
                            groupHeader.appendChild(groupHeaderText);

                            // Create Hives for group ------------------------------------
                            for(let hive of group['HiveList']){
                                let hiveElem = document.createElement('div');
                                let hiveText = document.createElement('p');
                                let hiveMenu = document.createElement('div');
                                let hiveMenuItemList = ['Usuń Ul'];

                                hiveElem.classList.add('hive-elem');
                                if(hive['FamilyID']){
                                    hiveElem.classList.add('occupied');
                                    hiveMenuItemList.push('Usuń Rodzinę');
                                }else{
                                    hiveMenuItemList.push('Dodaj Rodzinę');
                                }

                                hiveText.innerHTML = hive['HiveNum'];
                                hiveElem.appendChild(hiveText);
                                
                                // Add Hive menu
                                for (let i = 0; i < hiveMenuItemList.length; i++) {
                                    let menuItem = document.createElement('div');
                                    menuItem.classList.add('menu-item');
                                    let dataDict = {apiaryID: apiary['ApiaryID'],
                                        apiaryName: apiary['ApiaryName'],
                                        groupID: group['GroupID'],
                                        groupName: group['GroupName'],
                                        hiveID: hive['HiveID'],
                                        hiveNum: hive['HiveNum'],
                                        familyID: hive['FamilyID']};
                                    if(hiveMenuItemList[i] === 'Usuń Ul'){
                                        menuItem.onclick = function(e){
                                            hiveDeleteOnClick(e, dataDict);
                                        };
                                    }else if(hiveMenuItemList[i] === 'Usuń Rodzinę'){
                                        menuItem.onclick = function(e){
                                            loadDeleteFamilyWrapper(e, dataDict);
                                        };
                                    }else if(hiveMenuItemList[i] === 'Dodaj Rodzinę'){
                                        menuItem.onclick = function(e){
                                            loadAddFamilyWrapper(e, dataDict);
                                        };
                                    }
                                    menuItem.appendChild(document.createElement('span'));
                                    menuItem.firstChild.innerHTML = hiveMenuItemList[i];
                                    hiveMenu.appendChild(menuItem);
                                }
                                hiveMenu.classList.add('menu');
                                hiveMenu.classList.add('hive-menu');
                                hiveElem.appendChild(hiveMenu);


                                // Add Hive tail on click
                                hiveElem.setAttribute('value', hive['HiveID']);
                                hiveElem.setAttribute('name', hive['HiveNum']);
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
}

function hiveOnClick(hiveID){
    let urlStr = '/apiary/hive/' + hiveID;
    window.location = urlStr;
}

// Delete OnClick ------------------------------------------------------------------------
function apiaryDeleteOnClick(e, dataDict){
    e.stopPropagation();
    let urlStr = '/apiary/' + dataDict['apiaryID']; 

    $.ajax({
        url: urlStr,
        type: 'DELETE',
        dataType: 'json',
        success: function(data){
            createAlert(data.message, data.severity);
            generateGridView();
        },
        error: function( jqXhr, textStatus, errorThrown ){
            createAlert(jqXhr.responseText, 'Error');
        }
    })
}

function groupDeleteOnClick(e, dataDict){
    e.stopPropagation();
    let urlStr = '/apiary/group/' + dataDict['groupID']; 

    $.ajax({
        url: urlStr,
        type: 'DELETE',
        dataType: 'json',
        success: function(data){
            createAlert(data.message, data.severity);
            generateGridView();
        },
        error: function( jqXhr, textStatus, errorThrown ){
            createAlert(jqXhr.responseText, 'Error');
        }
    })
}

function hiveDeleteOnClick(e, dataDict){
    e.stopPropagation();
    let urlStr = '/apiary/hive/' + dataDict['hiveID']; 

    $.ajax({
        url: urlStr,
        type: 'DELETE',
        dataType: 'json',
        success: function(data){
            createAlert(data.message, data.severity);
            generateGridView();
        },
        error: function( jqXhr, textStatus, errorThrown ){
            createAlert(jqXhr.responseText, 'Error');
        }
    })
}

// Add Wrapper ---------------------------------------------------------------------------
function loadAddGroupOnClick(e, dataDict){
    e.stopPropagation();
    loadAddGroup(dataDict);
}

function loadAddHiveWrapper(e, dataDict){
    e.stopPropagation();
    loadAddHive(dataDict);
}

function loadAddFamilyWrapper(e, dataDict){
    e.stopPropagation();
    loadAddFamily(dataDict);
}

// Delete Wrapper ------------------------------------------------------------------------
function loadDeleteFamilyWrapper(e, dataDict){
    e.stopPropagation();
    loadDeleteFamily(dataDict);
}

// Add functions -------------------------------------------------------------------------
function loadAddApiary(){
    let modal = document.getElementById('modalAddApiary'); 
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());
}

function loadAddGroup(dataDict){
    let modal = document.getElementById('modalAddGroup');
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());

    let apiaryID = dataDict ? dataDict['apiaryID'] : null;

    apiariesDropdown(modal, apiaryID);
}

function loadAddHive(dataDict){
    let modal = document.getElementById('modalAddHive');
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());

    let apiaryID = dataDict ? dataDict['apiaryID'] : null;
    let groupID = dataDict ? dataDict['groupID'] : null;

    apiariesDropdown(modal, apiaryID);
    groupsDropdown(modal, apiaryID, groupID);
}

function loadAddFamily(dataDict){
    let modal = document.getElementById('modalAddFamily');
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());
    modal.querySelector('.comment textarea').value = '';
        
    let apiaryID = dataDict ? dataDict['apiaryID'] : null;
    let groupID = dataDict ? dataDict['groupID'] : null;
    let hiveID = dataDict ? dataDict['hiveID'] : null;
	let attrDict = {name: ['state', 'size'],
					type: ['STATE', 'SIZE']};

    apiariesDropdown(modal, apiaryID);
    groupsDropdown(modal, apiaryID, groupID);
    hivesDropdown(modal, apiaryID, groupID, hiveID);
    familyAttributeDropdown(modal, attrDict);
    familiesDropdown(modal, 'parentID');
}

// Delete functions ----------------------------------------------------------------------
function loadDeleteFamily(dataDict){
    let modal = document.getElementById('modalDeleteFamily');
    modal.style.display = 'block';
    // Add date and clear comment
    modal.querySelector('.transactionTime input').value = dateToInputString(new Date());
    modal.querySelector('.comment textarea').value = '';

    // Insert readOnly values (Apriary, Group, Hive)
    let labelApiary = modal.querySelector('.apiaryID .readOnly');
    labelApiary.innerHTML = dataDict['apiaryName'];
    labelApiary.setAttribute('value', dataDict['apiaryID']);
	if(dataDict['groupID']){
		let labelGroup = modal.querySelector('.groupID .readOnly');
		labelGroup.innerHTML = dataDict['groupName'];
		labelGroup.setAttribute('value', dataDict['groupID']);
		modal.querySelector('.groupID').classList.remove('hidden');
	}else{
		modal.querySelector('.groupID').classList.add('hidden');
	}
    let labelHive = modal.querySelector('.hiveID .readOnly');
    labelHive.innerHTML = dataDict['hiveNum'];
    labelHive.setAttribute('value', dataDict['hiveID']);
    modal.firstChild.setAttribute('action', `/apiary/family/${dataDict.familyID}`);

    // Get Attributes
	let attrDict = {name: ['state', 'size', 'endReason'],
					type: ['STATE', 'SIZE', 'END_REASON']};
	familyAttributeDropdown(modal, attrDict);
}
