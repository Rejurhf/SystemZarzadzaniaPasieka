
// Add Apiary ----------------------------------------------------------------------------
function loadAddApiary(){
    let modal = document.getElementById('modalAddApiary'); 
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());

    apiariesDropdown(modal);
}

// Add Group -----------------------------------------------------------------------------
function loadAddGroup(){
    let modal = document.getElementById('modalAddGroup');
    modal.style.display='block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());

    apiariesDropdown(modal);
}

// Add Hive ------------------------------------------------------------------------------
function loadAddHive(){
    let modal = document.getElementById('modalAddHive');
    modal.style.display='block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());

    apiariesDropdown(modal);
    groupsDropdown(modal);
}

// Add Family ----------------------------------------------------------------------------
function loadAddFamily(){
    let modal = document.getElementById('modalAddFamily');
    modal.style.display='block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());
        
    apiariesDropdown(modal);
    groupsDropdown(modal);
    hivesDropdown(modal);
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

    console.log(["validate", isValid]);
    
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
function apiariesDropdown(modal){
    let select = modal.querySelector('.apiaryID select');

    // Get dropdown data
    if(select){
        $.ajax({
            url: '/apiaries',
            type: 'GET',
            dataType: 'json',
            success: function(data){
                if(data.length){
                    select.innerHTML = '';
            
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

function groupsDropdown(modal){
    let apiaryID = parseInt(modal.querySelector('.apiaryName select').value);
    let dataDict = {apiaryID: apiaryID};
    let select = modal.querySelector('.groupName select');

    // Get dropdown data
    if(select){
        $.ajax({
            url: '/groups',
            type: 'GET',
            dataType: 'json',
            data: dataDict,
            success: function(data){
                if(data.length){
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

function hivesDropdown(modal){
    let apiaryID = parseInt(modal.querySelector('.apiaryName select').value);
    let groupID = parseInt(modal.querySelector('.groupName select').value);
    let dataDict = {apiaryID: apiaryID, groupID: groupID};
    let select = modal.querySelector('.hiveNum select');

    // Get dropdown data
    if(select){
        $.ajax({
            url: '/hives',
            type: 'GET',
            dataType: 'json',
            data: dataDict,
            success: function(data){
                if(data.length){
                    select.innerHTML = '';
    
                    data.forEach(e => {
                        let opt = document.createElement('option');
                        opt.value = e.ID;
                        opt.innerHTML = e.Name;
                        select.appendChild(opt);
                    });
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
    
    groupsDropdown(modal);
    hivesDropdown(modal);
}

function onChangeGroup(elem){
    let modal = $(elem).closest('.modal')[0];
    
    hivesDropdown(modal);
}



