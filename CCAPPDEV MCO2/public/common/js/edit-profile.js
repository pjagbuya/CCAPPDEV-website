document.addEventListener("DOMContentLoaded", function() {
    var pencilIcons = document.querySelectorAll(".fa-pencil");

    pencilIcons.forEach(function(icon) {
        icon.addEventListener("click", function() {
            var editId = icon.getAttribute("id");
            var targetId = editId.replace("edit-", "");
            var editFunction = getEditFunction(targetId);
            if (editFunction) {
                editFunction();
            }
        });
    });

    var plusIcon = document.getElementById("edit-contact");
    if (plusIcon) {
        plusIcon.addEventListener("click", function() {
            enableEditContact();
        });
    }

    var editImageButton = document.querySelector(".btn.btn-warning.my-2");
    if (editImageButton) {
        editImageButton.addEventListener("click", function() {
            enableEditImageSource();
        });
    }

    function getEditFunction(targetId) {
        switch(targetId) {
            case "name":
                return enableEditName;
            case "course":
                return enableEditCourse;
            case "about":
                return enableEditAbout;
            case "email":
                return enableEditEmail; 
            case "username":
                return enableEditUsername;
            default:
                return null;
        }
    }

    function enableEditImageSource() {
        var elementToEdit = document.getElementById("edit-imageSource");
        if (elementToEdit) {
            var inputField = document.createElement('input');
            inputField.placeholder = "Paste image link here"; // Add placeholder text
            elementToEdit.parentNode.insertBefore(inputField, elementToEdit.nextSibling); // Insert input field after the button
            inputField.focus();
    
            inputField.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    var newValue = inputField.value;
                    var profileName = document.getElementById("userId");
                    var userId = profileName.getAttribute("data-dlsu-id"); // Retrieve the dlsuID value
                    sendUpdateToServer(userId, "imageSource", newValue);
    
                    // Update the existing image src with the new value
                    var image = document.querySelector(".profile-image");
                    if (image) {
                        image.src = newValue;
                    }
    
                    // Remove the input field
                    inputField.remove();
                }
            });
        }
    }
 
    function enableEditCourse() {
        var course = document.getElementById("course");
        if (course) {
            enableEdit(course, "course");
        }
    }

    function enableEditUsername() {
        var username = document.getElementById("username");
        var pencilIcon = document.getElementById("edit-username");
        
        if (username) {
            enableEdit(username, "username");
            
            // Append pencil icon if it doesn't exist
            if (!pencilIcon) {
                appendPencilIcon(username);
            }
        }
    }
    
    function appendPencilIcon(elementToEdit) {
        var pencilIcon = document.createElement('i');
        pencilIcon.classList.add('fa', 'fa-solid', 'fa-pencil');
        pencilIcon.id = 'edit-username';
        elementToEdit.appendChild(pencilIcon);
    }

    function enableEditAbout() {
        var about = document.getElementById("about");
        if (about) {
            enableEdit(about, "about");
        }
    }

    function enableEditEmail() {
        var email = document.getElementById("email");
        if (email) {
            enableEdit(email, "email");
        }
    }

    function enableEditName() {
        var firstNameElement = document.getElementById("firstName");
        var middleInitialElement = document.getElementById("middleInitial");
        var lastNameElement = document.getElementById("lastName");
    
        if (firstNameElement && middleInitialElement && lastNameElement) {
            // Enable editing for first name
            editNames(firstNameElement, middleInitialElement, lastNameElement);
        }
    }

    function editNames(firstNameElement, middleInitialElement, lastNameElement) {
        var fValue = firstNameElement.textContent.trim();
        var mValue = middleInitialElement.textContent.trim();
        var lValue = lastNameElement.textContent.trim();
    
        var firstNameInput = createInput(fValue);
        var middleInitialInput = createInput(mValue);
        var lastNameInput = createInput(lValue);
    
        firstNameElement.innerHTML = '';
        firstNameElement.appendChild(firstNameInput);
    
        middleInitialElement.innerHTML = '';
        middleInitialElement.appendChild(middleInitialInput);
    
        lastNameElement.innerHTML = '';
        lastNameElement.appendChild(lastNameInput);
    
        firstNameInput.focus();
    
        document.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                var newFirstName = firstNameInput.value;
                var newMiddleInitial = middleInitialInput.value;
                var newLastName = lastNameInput.value;
    
                var profileName = document.getElementById("userId");
                var userId = profileName.getAttribute("data-dlsu-id");
    
                sendUpdateToServer(userId, "firstName", newFirstName);
                sendUpdateToServer(userId, "middleInitial", newMiddleInitial);
                sendUpdateToServer(userId, "lastName", newLastName);
    
                firstNameElement.textContent = newFirstName;
                middleInitialElement.textContent = newMiddleInitial;
                lastNameElement.textContent = newLastName;
    
                firstNameElement.parentElement.querySelector(".fa-pencil").style.display = "inline-block";
            }
        });
    }
    
    function createInput(initialValue) {
        var input = document.createElement('input');
        input.value = initialValue || '';
        return input;
    }
    
    function enableEdit(inputField, fieldName) {
        var textToEdit = inputField.textContent.trim();
        var input = document.createElement('input');
        input.value = textToEdit;
        inputField.innerHTML = '';
        inputField.appendChild(input);
        input.focus();
        input.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                var newValue = input.value;
                var profileName = document.getElementById("userId");
                var userId = profileName.getAttribute("data-dlsu-id"); 
                sendUpdateToServer(userId, fieldName, newValue);
                inputField.textContent = newValue;
                inputField.parentElement.querySelector(".fa-pencil").style.display = "inline-block";

            }
        });
    }

    function enableEditContact() {
        var contactTd = document.getElementById("contact");
        if (contactTd) {
            var plusIcon = document.getElementById("edit-contact");
            plusIcon.style.display = "none"; // Hide the plus icon while editing

            var textToEdit = contactTd.textContent.trim();
            var input = document.createElement('input');
            input.value = textToEdit;
            contactTd.innerHTML = '';
            contactTd.appendChild(input);
            input.focus();
            input.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    var newValue = input.value;
                    var profileName = document.getElementById("userId");
                    var userId = profileName.getAttribute("data-dlsu-id"); // Retrieve the dlsuID value
                    sendUpdateToServer(userId, "contact", newValue);
                    contactTd.textContent = newValue;
                    plusIcon.style.display = "inline-block"; // Show the plus icon after editing

                }
            });
        }
    }

    function sendUpdateToServer(userId, fieldName, newValue) {
        fetch('/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId, fieldName: fieldName, newValue: newValue })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); 
            window.location.reload();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
 
    // DELETE PROFILE FUNCTIONS

    document.getElementById("deleteProfileBtn").addEventListener("click", confirmDelete);

    function confirmDelete() {
        var profileName = document.getElementById("userId");
        var userId = profileName.getAttribute("data-dlsu-id");
        if (window.confirm('This will delete your account. Are you sure?')) {
            deleteProfile(userId);
        }
    }
    
    function deleteProfile(userId) {
        console.log('Request sent to the server');
        fetch('/deleteProfile', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            console.log("gagi");
            // Redirect to the login page
            window.location.href = 'http://localhost:3000/login';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
});

