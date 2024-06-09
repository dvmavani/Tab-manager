function fillInputField(labelText, value) {
  // Locate label elements containing the text 'First Name'
  const labels = document.querySelectorAll('label');
  labels.forEach(label => {
    if (label.textContent.trim().toLowerCase().includes(labelText.toLowerCase())) {
      // Check if the label has a 'for' attribute
      const inputId = label.getAttribute('for');
      let inputField;
      
      if (inputId) {
        // If 'for' attribute is present, find the input using it
        inputField = document.getElementById(inputId);
      } else {
        // Otherwise, find the input within the same parent element
        inputField = label.querySelector('input') || label.parentElement.querySelector('input');
      }
      
      // If an input field is found, set its value
      if (inputField) {
        inputField.value = value;
      }
    }
  });
}

// Retrieve user details and autofill the form
chrome.storage.sync.get('userDetails', function(data) {
  if (data.userDetails) {
    fillInputField('First Name', data.userDetails.name);
    fillInputField('Email', data.userDetails.email);
    fillInputField('Phone', data.userDetails.phone);
  }
});