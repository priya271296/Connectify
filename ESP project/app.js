// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent the form from submitting normally

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("Login Attempted with email:", email);  // Debug log

    // Send login request
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
        .then(response => {
            console.log("Response Status:", response.status);  // Debug log for status
            if (!response.ok) {
                throw new Error('Failed to login: ' + response.statusText);  // Throw error for non-OK responses
            }
            return response.json();  // Parse the JSON response
        })
        .then(data => {
            console.log("Login Response Data:", data);  // Debug log for the response data
            if (data.token) {
                // On success, store the token in localStorage
                alert(data.message || 'Login successful!');
                localStorage.setItem('token', data.token);

                // Show the login success message
                document.getElementById('loginStatus').style.display = 'block';

                // Redirect to the dashboard after a short delay
                setTimeout(() => {
                    window.location.href = '/dashboard.html';  // Redirect to the dashboard page
                }, 1500);  // 1.5 seconds delay
            } else {
                alert('Invalid email or password');
            }
        })
        .catch(error => {
            console.error('Error:', error);  // Log any errors in the network request
            alert('An error occurred: ' + error.message);  // Show error alert
        });
});

// Handle registration form submission
document.getElementById('registerForm')?.addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent the form from submitting normally

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("Registration Attempted with email:", email);  // Debug log

    // Send registration request
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Registration Response:", data);  // Debug log
            alert(data.message || 'Registration successful');
        })
        .catch(error => {
            console.error('Error:', error);  // Log any errors in the network request
            alert('An error occurred during registration: ' + error.message);  // Show error alert
        });
});

// Function to get user profile with token from localStorage
function getProfile() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No token found, please login first');
        return;
    }
}

    // Send request to get user profile using the stored token
//     fetch('http://localhost:3000/profile', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`  // Send token as authorization header
//         }
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to fetch profile: ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('User Profile:', data);  // Debug log for user profile
//             // Display user profile or other dashboard content
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert('Failed to fetch profile');
//         });
// }
//
// // Check if the user is logged in
// window.onload = function () {
//     const token = localStorage.getItem('token');
//
//     if (token) {
//         getProfile();  // Fetch user profile if token is found
//     }
// };

// Optional: Add a logout function if needed
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    // Remove the token from localStorage on logout
    localStorage.removeItem('token');
    alert('You have been logged out');
    window.location.href = '/login.html';  // Redirect to login page
});
