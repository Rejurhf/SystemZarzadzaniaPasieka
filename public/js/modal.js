
// Helper functions ----------------------------------------------------------------------
// Return string date for datetime selector format "YYYY-mm-DDTHH:MM"
function dateTimeToInputString(date){
    let z  = n =>  ('0' + n).slice(-2);

    return date.getFullYear() + '-' + 
        z(date.getMonth()+1) + '-' +
        z(date.getDate()) + 'T' +
        z(date.getHours()) + ':'  + 
        z(date.getMinutes()); 
}

// Return string date for datetime selector format "YYYY-mm-DD"
function dateToInputString(date){
    let z  = n =>  ('0' + n).slice(-2);

    return date.getFullYear() + '-' + 
        z(date.getMonth()+1) + '-' +
        z(date.getDate()); 
}

function validateModal(elem){
    let isValid = true;
    let modal = elem.parentElement.parentElement;
    let dataDict = {};

    modal.querySelectorAll('input').forEach(e => {
        if(e.name != null && e.name != undefined && e.name != '' && !dataDict[e.name]){
            if((e.getAttribute('not-null') === 'true' && !e.value) || 
                    (e.getAttribute('name') === 'hiveNum' && !(/^\d+$/.test(e.value)))){
                isValid = false;
                e.classList.add('notValid');
            }
            dataDict[e.name] = e.value;
        }
    })
    modal.querySelectorAll('select').forEach(e => {
        if(e.name != null && e.name != undefined && e.name != '' && !dataDict[e.name]){
            if(e.getAttribute('not-null') === 'true' && !e.value){
                isValid = false;
                e.classList.add('notValid');
            }
            dataDict[e.name] = e.value;
        }
    })
    modal.querySelectorAll('textarea').forEach(e => {
        if(e.name != null && e.name != undefined && e.name != '' && !dataDict[e.name]){
            if(e.getAttribute('not-null') === 'true' && !e.value){
                isValid = false;
                e.classList.add('notValid');
            }
            dataDict[e.name] = e.value;
        }
    })
    
    if (isValid){
        submitForm(modal, dataDict);
    }
}

function submitForm(modal, dataDict) {
    let actionURL = modal.getAttribute('action');
    let actionType = modal.getAttribute('action-type');
    
    $.ajax({
        url: actionURL,
        type: actionType,
        dataType: 'json',
        data: dataDict,
        success: function(data){
            createAlert(data.message, data.severity);
            generateGridView();
            if(!data.isError){
                closeModal(modal);
            }
        },
        error: function( jqXhr, textStatus, errorThrown ){
            createAlert(jqXhr.responseText, 'Error');
        }
    })
}

function closeModal(elem){
    let modal = elem;
    if(!elem.classList.contains('modal-content'))
        modal = elem.parentElement.parentElement;

    modal.parentElement.style.display = 'none';
    modal.querySelectorAll('input').forEach(e => {e.classList.remove('notValid')});
    modal.querySelectorAll('select').forEach(e => {e.classList.remove('notValid')});
	if(modal.querySelector('.apiaryID select'))
		modal.querySelector('.apiaryID select').value = null;
	if(modal.querySelector('.groupID select'))
		modal.querySelector('.groupID select').value = null;
	if(modal.querySelector('.hiveID select'))
		modal.querySelector('.hiveID select').value = null;
}

function createAlert(message, severity){
    let alertBox = document.getElementById('AlertBox');

    let alert = document.createElement('div');
    alert.classList.add('alert');
    alert.classList.add(`severity-${severity}`);

    alert.innerHTML = `<span class="closebtn" onclick="this.parentElement.remove();">
        ×</span> ${message}`;
    
    alertBox.appendChild(alert);
    setTimeout(function(){alert.remove();}, 30000);
}

// Dropdowns -----------------------------------------------------------------------------
function apiariesDropdown(modal, apiaryID){
    let select = modal.querySelector('.apiaryID select');

    // Get dropdown data
    if(select){
        $.ajax({
            url: '/apiaries',
            type: 'GET',
            dataType: 'json',
            success: function(data){
                if(data && data.length){
                    select.innerHTML = '';
                    let disableFlag = false;

                    data.forEach(e => {
                        let opt = document.createElement('option');
                        opt.value = e.ID;
                        opt.innerHTML = e.Name;
                        if(parseInt(apiaryID, 10) === e.ID){
                            opt.selected = true;
                            disableFlag = true;
                        }
                        select.appendChild(opt);
                    })
                    select.disabled = disableFlag;
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                createAlert(jqXhr.responseText, 'Error');
            }
        })
    }
}

function groupsDropdown(modal, apiaryIDParam, groupID){
    let select = modal.querySelector('.groupID select');

    // Get dropdown data
    if(select){
        let apiaryID = apiaryIDParam ? 
            apiaryIDParam : modal.querySelector('.apiaryID select').value;
        let dataDict = {apiaryID: apiaryID};

        return $.ajax({
            url: '/groups',
            type: 'POST',
            dataType: 'json',
            data: dataDict,
            success: function(data){
                if(data && data.length){
                    select.innerHTML = '';
                    select.appendChild(document.createElement('option'));
                    let disableFlag = apiaryIDParam ? true : false;
    
                    data.forEach(e => {
                        let opt = document.createElement('option');
                        opt.value = e.ID;
                        opt.innerHTML = e.Name;
                        if(parseInt(groupID, 10) === e.ID){
                            opt.selected = true;
                            disableFlag = true;
                        }
                        select.appendChild(opt);
                    })   
                    select.disabled = disableFlag;
                }else{
                    select.innerHTML = '';
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                createAlert(jqXhr.responseText, 'Error');
            }
        })
    }
}

function hivesDropdown(modal, apiaryIDParam, groupIDParam, hiveID){
    let select = modal.querySelector('.hiveID select');

    if(select){
        let apiaryID = apiaryIDParam ? 
            apiaryIDParam : modal.querySelector('.apiaryID select').value;
        let groupID = groupIDParam ? 
            groupIDParam : modal.querySelector('.groupID select').value;
        let dataDict = {apiaryID: apiaryID, groupID: groupID};

        // Get dropdown data
        $.ajax({
            url: '/hives',
            type: 'POST',
            dataType: 'json',
            data: dataDict,
            success: function(data){
                if(data && data.length){
                    select.innerHTML = '';
                    let disableFlag = false;
    
                    data.forEach(e => {
                        let opt = document.createElement('option');
                        opt.value = e.ID;
                        opt.innerHTML = e.Number;
                        if(parseInt(hiveID, 10) === e.ID){
                            opt.selected = true;
                            disableFlag = true;
                        }
                        select.appendChild(opt);
                    });
                    select.disabled = disableFlag;
                }else{
                    select.innerHTML = '';
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                createAlert(jqXhr.responseText, 'Error');
            }
        })
    }
}

function familiesDropdown(modal){
    let select = modal.querySelector('.parentID select');

    // Get dropdown data
    if(select){
        $.ajax({
            url: '/apiary/familylist',
            type: 'GET',
            dataType: 'json',
            success: function(data){
                if(data && data.length){
                    select.innerHTML = '';
                    select.appendChild(document.createElement('option'));

                    data.forEach(e => {
                        let opt = document.createElement('option');
                        opt.value = e.ID;
                        opt.innerHTML = e.Name;
                        select.appendChild(opt);
                    })
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                createAlert(jqXhr.responseText, 'Error');
            }
        })
    }
}

function familyAttributeDropdown(modal, attrDict){
	let select = [];
	for(let i in attrDict.name){
		select.push(modal.querySelector(`.${attrDict.name[i]} select`));
	}

    // Get dropdown data
    if(select.length > 0){
        $.ajax({
            url: '/familyattributes',
            type: 'POST',
            dataType: 'json',
			data: attrDict,
            success: function(data){
                if(data){
					for(let i in attrDict.name){
						select[i].innerHTML = '';
						
						if(data[attrDict.name[i]] != undefined){
							data[attrDict.name[i]].forEach(e => {
								let opt = document.createElement('option');
								opt.value = e.Attribute;
								opt.innerHTML = e.Description;
								select[i].appendChild(opt);
							})

                            if((attrDict.name[i] === 'origin' && select[i].value != 'PURCHASE') || 
                                    (attrDict.name[i] === 'endReason' && select[i].value != 'SALE'))
                                modal.querySelector('.price').classList.add('hidden');
                            
                            if((attrDict.name[i] === 'origin' && select[i].value === 'PURCHASE'))
                                modal.querySelector('.parentID').classList.add('hidden');
                        
						}
					}
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                createAlert(jqXhr.responseText, 'Error');
            }
        })
    }
}

// On Changes ----------------------------------------------------------------------------
function onChangeApiary(elem){
    let modal = $(elem).closest('.modal')[0];
    if(modal.querySelector('.groupID select'))
		modal.querySelector('.groupID select').value = null;
    
    groupsDropdown(modal);
    hivesDropdown(modal);
}

function onChangeGroup(elem){
    let modal = $(elem).closest('.modal')[0];
    
    hivesDropdown(modal);
}

function onChangePriceInfluence(elem){
    let modal = $(elem).closest('.modal')[0];
    let selectPrice =  modal.querySelector('.price');
    let selectParent =  modal.querySelector('.parentID');

    if(elem.value === 'PURCHASE' || elem.value === 'SALE'){
        selectPrice.classList.remove('hidden');
        selectParent.classList.add('hidden');
    }else{
        selectPrice.classList.add('hidden');
        selectParent.classList.remove('hidden');
    }
}
