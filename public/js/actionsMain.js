
$(document).ready(function() {
    $('.js-example-basic-multiple').select2();
});

// Action functions ----------------------------------------------------------------------
function loadInspection(dataDict){
    let modal = document.getElementById('modalInspection'); 
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());
	modal.querySelector('.comment textarea').value = '';
        
    let apiaryID = dataDict ? dataDict['apiaryID'] : null;
    let groupID = dataDict ? dataDict['groupID'] : null;
    let hiveID = dataDict ? dataDict['hiveID'] : null;
	let attrDict = {name: ['state', 'size', 'origin'],
					type: ['STATE', 'SIZE', 'ORIGIN']};

    apiariesDropdown(modal, apiaryID);
    groupsDropdown(modal, apiaryID, groupID);
    occupiedHivesDropdown(modal, apiaryID, groupID, hiveID);
    familyAttributeDropdown(modal, attrDict);
}

function loadFeeding(){
    let modal = document.getElementById('modalFeeding'); 
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());

    familiesDropdown(modal, 'familyID');
}

function loadHarvesting(){
    let modal = document.getElementById('modalHarvesting'); 
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());
}

function loadTreatment(){
    let modal = document.getElementById('modalTreatment'); 
    modal.style.display = 'block';
    modal.querySelector('.creationDate input').value = dateToInputString(new Date());
}
