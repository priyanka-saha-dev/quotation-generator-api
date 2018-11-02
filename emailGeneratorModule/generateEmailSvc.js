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
  // let emailData = getEmailData(data);
  // mailOptions.text = JSON.stringify(emailData);

  mailOptions.html = getEmailData(data);
  return transporter.sendMail(mailOptions, parseCB);
}

const getEmailData = (data) => {
  // let emailData = {
  //   birthDate : data.birthdate,
  //   makename : data.makename,
  //   modelname : data.modelname,
  //   regDate : data.regdate,
  //   email : data.email
  // }

  // let data = {
  //   "Item":{
  //     "email":{
  //       "S":"mail001@mail.com"
  //     }
  //   },
  //   "userID":"001"
  // }
  let htmlContent = `
    <div>
      <h3>${CONSTANTS.EMAIL_BODY}</h3>
    
      <ul>
        <li>UserID : ${JSON.stringify(data.userID)}</li>
        <li>Email : ${JSON.stringify(data.Item.email.S)}</li>
        <li>Company : ${JSON.stringify(data.Item.company.S)}</li>
        <li>Birthdate : ${JSON.stringify(data.Item.birthdate.S)}</li>
      <ul>

    </div>
  `;

  return htmlContent;
}


module.exports = generateEmailSvc;