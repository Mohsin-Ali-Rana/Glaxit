var form = document.querySelector('form');
var confirmInput = document.getElementById('confirm-password');

// Create the inline error message spot
var errorMessage = document.createElement('p');
errorMessage.style.color = 'red';
errorMessage.style.fontSize = '14px';
confirmInput.parentNode.appendChild(errorMessage);

form.onsubmit = function(event) {
    //Prevent default form submission
    event.preventDefault(); 
    
    //Read form data using FormData object
    var myFormData = new FormData(form);
    
    // Grab the values using the 'name' attributes from the HTML
    var pass = myFormData.get('password');
    var confirmPass = myFormData.get('confirm-password');

    //Custom validation logic & inline errors
    if (pass.length < 8) {
        errorMessage.innerText = "Password must be at least 8 characters!";
    } 
    else if (pass !== confirmPass) {
        errorMessage.innerText = "Passwords do not match!";
    } 
    else {
        // If everything is correct, clear errors
        errorMessage.innerText = "Success! Form is valid.";
        errorMessage.style.color = "green";
        
        // Normally, you would send the data to a server here!
    }
};