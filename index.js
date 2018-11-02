"use strict";

var AWS = require('aws-sdk');
var emailGeneratorSvc = require('./emailGeneratorModule/generateEmailSvc');

var s3 = new AWS.S3();


//var pdfGeneratorService = require('./pdfGenerationModule/pdfGeneratorService');

// Get "Hello" Dynamo table name.  Replace DEFAULT_VALUE 
// with the actual table name from your stack.
const quotationDBArn = process.env['QUOTATION_DB'] || 'DEFAULT_VALUE';  //'Mark-HelloTable-1234567';
const quotationDBArnArr = quotationDBArn.split('/');
const quotationTableName = quotationDBArnArr[quotationDBArnArr.length - 1];

// handleHttpRequest is the entry point for Lambda requests
exports.handleHttpRequest = function (request, context, done) {
  try {
    console.log('request recieved : ', request);

    const userId = request.pathParameters.userId;
    let response = {
      headers: {},
      body: '',
      statusCode: 200
    };

    switch (request.httpMethod) {
      case 'GET': {
        console.log('GET');
        let dynamo = new AWS.DynamoDB();
        var params = {
          TableName: quotationTableName,
          Key: { 'user_id': { S: userId } },
          ProjectionExpression: 'email, company, birthdate'
        };
        // Call DynamoDB to read the item from the table
        dynamo.getItem(params, function (err, data) {
          if (err) {
            console.log("Error", err);
            throw `Dynamo Get Error (${err})`
          } else {
            console.log("Success Data : ", data);

            //Send Email
            data.userID = userId;
            emailGeneratorSvc(data);

            response.body = JSON.stringify(data);
            done(null, response);
          }
        });
        break;
      }
      case 'POST': {
        console.log('POST');
        let reqData = request.body;
        let bodyJSON = JSON.parse(request.body || '{}');
        let dynamo = new AWS.DynamoDB();
        let params = {
          TableName: quotationTableName,
          Item: {
            'user_id': { S: userId },
            'email': { S: bodyJSON['email'] },
            'company': { S: bodyJSON['company'] },
            'birthdate': { S: bodyJSON['birthdate'] }
          }
        };
        dynamo.putItem(params, function (error, data) {
          if (error) {
            throw `Dynamo Error (${error})`;
          } else {
            console.log('Post data', data);

            // https://medium.com/think-serverless/image-upload-and-retrieval-from-s3-using-aws-api-gateway-and-lambda-b4c2961e8d1
            // http://www.isummation.com/blog/using-aws-lambda-to-generate-pdf/
            
            //1. Generate PDF

            //2. Upload PDF to S3

            //3. Download attachment from S3

            //4. Send email - Done 
            // data.email = bodyJSON['email'];
            // emailGeneratorSvc(response);

            done(null, response);
          }
        })
        break;
      }
    }
  } catch (e) {
    done(e, null);
  }
}