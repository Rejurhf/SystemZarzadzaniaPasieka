
// Add Apiary
function addApiary(){
    document.getElementById('modalAddApiary').style.display = 'block';
    document.querySelector('#form-addapiary .date input').value = dateToInputString(new Date());
}

function closeAddApiary(){
    document.getElementById('modalAddApiary').style.display='none';
    document.querySelector('#form-addapiary .name input').classList.remove('inNotVal');
    document.querySelector('#form-addapiary .date input').classList.remove('inNotVal');
}

function validateAddApiary(){
    let formNotValid = false;
    var name = document.querySelector('#form-addapiary .name input').value;
    let date = document.querySelector('#form-addapiary .date input').value;

    if(!name){
        formNotValid = true;
        document.querySelector('#form-addapiary .name input').classList.add('inNotVal');
    }

    if(!date){
        formNotValid = true;
        document.querySelector('#form-addapiary .date input').classList.add('inNotVal');
    }

    if (formNotValid){
        if(event.preventDefault){
            event.preventDefault();
        }else{
           event.returnValue = false; // for IE as dont support preventDefault;
        }
    }else{
        if(event.preventDefault){
            event.preventDefault();
        }else{
           event.returnValue = false; // for IE as dont support preventDefault;
        }

        submitForm(name, date)
    }
}

// Helper functions
// Return string date for datetime selector format "YYYY-mm-DDTHH:MM"
function dateToInputString(date){
    let z  = n =>  ('0' + n).slice(-2);

    return date.getFullYear() + '-' + 
        z(date.getMonth()+1) + '-' +
        z(date.getDate()) + 'T' +
        z(date.getHours()) + ':'  + 
        z(date.getMinutes()); 
}

function submitForm(name, date) {
    let action = 'http://localhost:3000/apiary'
    let http = new XMLHttpRequest();
    http.open("POST", action, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    let params = `apiaryName=${name}&apiaryCreationDate=${date}`;
    http.send(params);
    closeAddApiary();
}
