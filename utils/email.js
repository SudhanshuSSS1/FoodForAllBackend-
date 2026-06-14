const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
  try {
    // We use Brevo (formerly Sendinblue) REST API to bypass Render's SMTP port blocking
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { email: process.env.SMTP_USER, name: 'FoodForAll' },
        to: [{ email: options.email }],
        subject: options.subject,
        htmlContent: options.html || options.message.replace(/\n/g, '<br>')
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      throw new Error(`Brevo Error: ${errorData.message || JSON.stringify(errorData)}`);
    }

    console.log('Email sent successfully via Brevo API');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
