const nodemailer = require('nodemailer');

const sendEmailSuccess = async ({ email, plainPassword }) => {
  console.log("sendEmailSuccess Initializing: ");
  
  console.log('Received in sendEmailSuccess:', { email, plainPassword });
  
  try {
    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      }
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '<egradenavigator@gmail.com>',
      to: email,
      subject: 'Credentials',
      text: `
        Here are your login details:
        Email: ${email}
        Password: ${plainPassword}
      `,
      html: `
        <p>Here are your login details:</p>
        <p>Email: <strong>${email}</strong></p>
        <p>Password: <strong>${plainPassword}</strong></p>
      `
    });

    console.log('Message sent: %s', info.messageId);
    return { message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

module.exports = { sendEmailSuccess };
