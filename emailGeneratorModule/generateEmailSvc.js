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
        <li>UserID : ${JSON.stringify(data.Item.userId.S)}</li>
        <li>Company name : ${JSON.stringify(data.Item.companyName.S)}</li>
        <li>Birthday : ${JSON.stringify(data.Item.birthDate.S)}</li>
        <li>Make name : ${JSON.stringify(data.Item.makeName.S)}</li>
        <li>Model name : ${JSON.stringify(data.Item.modelName.S)}</li>

        <li>Reg date : ${JSON.stringify(data.Item.regisDate.S)}</li>
        <li>past claims : ${JSON.stringify(data.Item.pastClaims.S)}</li>

        <li>Policy holder and main driver : ${JSON.stringify(data.Item.policyholderdriver.S)}</li>
        <li>usage : ${JSON.stringify(data.Item.usage.S)}</li>
        <li>email : ${JSON.stringify(data.Item.email.S)}</li>
      <ul>

    </div>
  `;

  return htmlContent;
}


module.exports = generateEmailSvc;