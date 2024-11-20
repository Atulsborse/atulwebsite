require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (like HTML, CSS, JS)
app.use(express.static('public'));

// POST route to handle form submission
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or your email provider (e.g., Yahoo, Outlook)
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });

        // Email options
        const mailOptions = {
            from: email, // Sender's email
            to: process.env.RECIPIENT_EMAIL, // Recipient email
            subject: `Portfolio Inquiry: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Try again later.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
