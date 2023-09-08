//Add Listeners here
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("form"); // Select the form element
  
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent the form from submitting
  
      // Perform any additional actions you need here before redirecting the user
      // For example, you can validate the form fields, send an AJAX request, etc.
  
      // Redirect the user to the desired page (e.g., "main_page.html")
      window.location.href = "main_page.html";
    });
  });