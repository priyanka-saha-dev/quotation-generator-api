var nodemailer = require('nodemailer');
var CONSTANTS = require('./../constants');

var transporter = nodemailer.createTransport({
  service: CONSTANTS.SENDER_EMAIL_SERVICE,
  auth: {
    user: CONSTANTS.SENDER_EMAIL_ID,
    pass: CONSTANTS.SENDER_EMAIL_PASSWORD
  }
});

var mailOptions = {
  from: CONSTANTS.SENDER_EMAIL_ID,
  to: CONSTANTS.RECIEVER_EMAIL_ID,
  cc: CONSTANTS.RECIEVER_COPY_EMAIL_ID,
  subject: CONSTANTS.EMAIL_SUBJECT,
  //text: CONSTANTS.EMAIL_BODY,
  attachments: [
    
  ]
};

var parseCB = (error, resp) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent : ' + resp.response);
  }
}

function generateEmailSvc(data) {
  //console.log('Mailing with attchment - ' + filePath);
  let mydata = data.email.Item;
  mailOptions.text = JSON.stringify(mydata);
  return transporter.sendMail(mailOptions, parseCB);
}


module.exports = generateEmailSvc;