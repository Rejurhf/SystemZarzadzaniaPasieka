
// Add Apiary ----------------------------------------------------------------------------
function loadAddApiary(){
    document.getElementById('modalAddApiary').style.display = 'block';
    document.querySelector('#form-addapiary .date input').value = 
        dateToInputString(new Date());
}

function validateAddApiary(){
    let isValid = true;
    var name = document.querySelector('#form-addapiary .name input').value;
    let date = document.querySelector('#form-addapiary .date input').value;

    if(!name){
        isValid = false;
        document.querySelector('#form-addapiary .name input').classList.add('notValid');
    }

    if(!date){
        isValid = false;
        document.querySelector('#form-addapiary .date input').classList.add('notValid');
    }

    if (isValid){
        submitForm('/apiary', {apiaryName: name, apiaryCreationDate: date});
    }
}

// Add Group -----------------------------------------------------------------------------
function loadAddGroup(){
    document.getElementById('modalAddGroup').style.display='block';
    document.querySelector('#form-addgroup .date input').value = 
        dateToInputString(new Date());
}

function validateAddGroup(){
    let isValid = true;
    let apiaryName = document.querySelector('#form-addgroup .apiaryName select').value;
    let date = document.querySelector('#form-addgroup .date input').value;
    let groupName = document.querySelector('#form-addgroup .groupName input').value;

    if(!apiaryName){
        isValid = false;
        document.querySelector('#form-addgroup .apiaryName select').classList.add('notValid');
    }
    if(!date){
        isValid = false;
        document.querySelector('#form-addgroup .date input').classList.add('notValid');
    }
    if(!groupName){
        isValid = false;
        document.querySelector('#form-addgroup .groupName input').classList.add('notValid');
    }

    if (isValid){
        let json = {apiaryName: apiaryName, 
            groupCreationDate: date, 
            groupName: groupName}
        submitForm('/group', json);
    }
}

// Add Hive ------------------------------------------------------------------------------


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

function submitForm(actionURL, dataDict) {
    $.ajax({
        url: actionURL,
        type: 'POST',
        dataType: 'json',
        data: dataDict,
        success: function(data){
            createAlert(data.message, data.severity);
            if(!data.isError){
                closeModal(actionURL);
            }
        },
        error: function( jqXhr, textStatus, errorThrown ){
            createAlert(jqXhr.responseText, 'Error');
        }
    })
}

function closeModal(actionURL){
    if(actionURL === '/apiary'){
        document.getElementById('modalAddApiary').style.display='none';
        document.querySelector('#form-addapiary .name input')
            .classList.remove('notValid');
        document.querySelector('#form-addapiary .date input')
            .classList.remove('notValid');
    }else if(actionURL === '/group'){
        document.getElementById('modalAddGroup').style.display='none';
        document.querySelector('#form-addgroup .groupName input')
            .classList.remove('notValid');
        document.querySelector('#form-addgroup .date input').classList.remove('notValid');
    }
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

