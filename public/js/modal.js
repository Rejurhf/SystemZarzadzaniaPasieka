
// Add Apiary ----------------------------------------------------------------------------
function loadAddApiary(){
    document.getElementById('modalAddApiary').style.display = 'block';
    document.querySelector('#modalAddApiary .apiaryCreationDate input').value = 
        dateToInputString(new Date());
}

// Add Group -----------------------------------------------------------------------------
function loadAddGroup(){
    document.getElementById('modalAddGroup').style.display='block';
    document.querySelector('#modalAddGroup .groupCreationDate input').value = 
        dateToInputString(new Date());
}

// Add Hive ------------------------------------------------------------------------------
function loadAddHive(){
    document.getElementById('modalAddHive').style.display='block';
    document.querySelector('#modalAddHive .hiveCreationDate input').value = 
        dateToInputString(new Date());
}

// Add Family ----------------------------------------------------------------------------


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

