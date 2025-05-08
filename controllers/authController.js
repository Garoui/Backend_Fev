const crypto = require('crypto');
const userModel = require('../models/userSchema');
const nodemailer = require('nodemailer');

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) return res.status(404).json({ message: 'Email not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1h
  await user.save();

  const resetUrl = `http://localhost:3000/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
     host: 'sandbox.smtp.mailtrap.io', // ou celui que tu trouves
   port: 2525,
   auth: {
     user: '5305f86d9eafb8',
     pass: 'd9f542d7f65991'
   }
 });
// service: 'gmail',
//   auth: {
//     user: 'abirgaroui13@gmail.com',  // Remplace par ton adresse email
//     pass: 'abirGaroui12&'        // Ou ton mot de passe d'application
//   }
// });

  const mailOptions = {
    to: user.email,
    subject: 'Password Reset Link',
    html: `<p>Click here to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
  };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) return res.status(500).json({ message: 'Email not sent' });
//     res.status(200).json({ message: 'Reset email sent' });


//   });
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err); // Afficher l'erreur dans la console pour plus de détails
      return res.status(500).json({ message: 'Email not sent' });
    }
    res.status(200).json({ message: 'Reset email sent' });
  });
};

module.exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
    
  });

  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });

 
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  res.status(200).json({ message: 'Password updated' });
 

};
