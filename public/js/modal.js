
// Add Apiary ----------------------------------------------------------------------------
function loadAddApiary(){
    let modal = document.getElementById('modalAddApiary'); 
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());
}

// Add Group -----------------------------------------------------------------------------
function loadAddGroup(dataDict){
    let modal = document.getElementById('modalAddGroup');
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());

    let apiaryID = dataDict ? dataDict['apiaryID'] : null;

    apiariesDropdown(modal, apiaryID);
}

// Add Hive ------------------------------------------------------------------------------
function loadAddHive(dataDict){
    let modal = document.getElementById('modalAddHive');
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());

    let apiaryID = dataDict ? dataDict['apiaryID'] : null;
    let groupID = dataDict ? dataDict['groupID'] : null;

    apiariesDropdown(modal, apiaryID);
    groupsDropdown(modal, apiaryID, groupID);
}

// Add Family ----------------------------------------------------------------------------
function loadAddFamily(dataDict){
    let modal = document.getElementById('modalAddFamily');
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());
        
    let apiaryID = dataDict ? dataDict['apiaryID'] : null;
    let groupID = dataDict ? dataDict['groupID'] : null;
    let hiveID = dataDict ? dataDict['hiveID'] : null;

    apiariesDropdown(modal, apiaryID);
    groupsDropdown(modal, apiaryID, groupID);
    hivesDropdown(modal, apiaryID, groupID, hiveID);
}

// Helper functions ----------------------------------------------------------------------
// Return string date for datetime selector format "YYYY-mm-DDTHH:MM"
function dateToInputString(date){
    let z  = n =>  ('0' + n).slice(-2);

    return date.getFullYear() + '-' + 
        z(date.getMonth()+1) + '-' +
        z(date.getDate()) + 'T' +
        z(date.getHours()) + ':'  + 
        z(date.getMinutes()); 
}

function validateModal(elem){
    let isValid = true;
    let modal = elem.parentElement.parentElement;
    let dataDict = {};


    modal.querySelectorAll('input').forEach(e => {
        if(e.name != null && e.name != undefined && e.name != '' && !dataDict[e.name]){
            if(e.getAttribute('not-null') === 'true' && !e.value){
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
    
    if (isValid){
        submitForm(modal, dataDict);
    }
}

function submitForm(modal, dataDict) {
    let actionURL = modal.getAttribute('action');
    
    $.ajax({
        url: actionURL,
        type: 'POST',
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
    console.log(['apiary start', apiaryID]);

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
    console.log(['group start', apiaryIDParam, groupID]);

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
                    let disableFlag = groupID === undefined ? true : false;
    
                    data.forEach(e => {
                        let opt = document.createElement('option');
                        opt.value = e.ID;
                        opt.innerHTML = e.Name;
                        console.log([groupID, e.ID]);
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



