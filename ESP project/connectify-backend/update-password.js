const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Prisum@1996',  // Your MySQL password
    database: 'connectify'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Function to hash password and update
async function updatePassword() {
    const email = 'newuser@example.com';
    const plaintextPassword = 'password'; // The current plaintext password

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

        // Update the user's password in the database
        db.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email],
            (err, result) => {
                if (err) throw err;
                console.log('Password updated successfully');
                db.end(); // Close the database connection
            }
        );
    } catch (error) {
        console.error('Error:', error);
    }
}

updatePassword();
