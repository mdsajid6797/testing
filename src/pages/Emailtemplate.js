export const Emailtemplate = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">I-Chest</a>
  </div>
  <p style="font-size:1.1em">Welcome to I-Chest!</p>
  <p>We are delighted to have you onboard. As a security measure, please keep this OTP confidential and do not share it with anyone.</p>
  <p>Your One-Time Password (OTP) for login is:</p>
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"> `;

export const EmailTemplatePostfix = `</h2>
  <p> This OTP will remain valid for the next 5 minutes to ensure enhanced security.</p>
  <p>If you have not attempted to log in or suspect any unauthorized activity, please get in touch with our support team immediately.</p>
  <p>Thank you for choosing I-Chest to safeguard your valuables!</p>
  <p style="font-size:0.9em;">Regards,<br />I-Chest Team</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>www.i-chest.com</p>
    <p>AECS Layout Brookefield,</p>
    <p>Bangalore Karnataka</p>
  </div>
</div>
</div>`;

// Define the email template with a placeholder for the username
export const EmailTemplateForJointAccountForgotPassword = (username) => `
<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
  <div style="margin: 50px auto; width: 70%; padding: 20px 0">
    <div style="border-bottom: 1px solid #eee">
      <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">I-Chest</a>
    </div>
    <p style="font-size: 1.1em">Welcome to I-Chest!</p>
    <p style="font-size: 1.1em">This is your username: ${username}</p>
    <p>We are delighted to inform you that someone has created a joint account with you. Please <a href="http://localhost:3000/reset-password">click here to reset your password</a></p>
    <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;"> 
`;
