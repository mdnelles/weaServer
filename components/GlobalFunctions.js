const conf          = require('../config/config')
const nodemailer  = require('nodemailer')

exports.extMailer(to,sub,msg){

     to = decodeURI(to);
     sub = decodeURI(sub);
     msg = decodeURI(msg);
     let smtp = o.global.mailer_smtp.toString()
     let port = parseInt(conf.global.mailer_port)
     let user = conf.global.mailer_address.toString()
     let pass = conf.global.mailer_password.toString()
 
     nodemailer.createTestAccount((err, account) => {
         // create reusable transporter object using the default SMTP transport
         let transporter = nodemailer.createTransport({
             host: smtp,
             port: port,
             secure: false, // true for 465, false for other ports
             auth: {
                 user: user, // generated ethereal user
                 pass: pass // generated ethereal password
             }
         });
     
         // setup email data with unicode symbols
         let mailOptions = {
             from: '"Web Servre Server (do not reply)" <donotreply@gmail.com>', // sender address
             to: to, // list of receivers
             subject: sub, // Subject line
             text: msg, // plain text body
             html: '<b>'+msg+'</b>' // html body
         };
     
         // send mail with defined transport object
         transporter.sendMail(mailOptions, (error, info) => {
             if (error) {
                 return console.log(error);
             }
             console.log('Message sent: %s', info.messageId);
             // Preview only available when sending through an Ethereal account
             console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
     
         });
     });
 
     setTimeout(shutDown, 3000); // 10 seconds
 
 }
 
exports.moneyFormat(num){
     var formatter = new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency: 'USD',

       // These options are needed to round to whole numbers if that's what you want.
       //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
       //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
     });

     return formatter.format(num); /* $2,500.00 */
} 


 function shutDown(){
     process.exitCode = 1;
 }
 
 module.exports = {
     extMailer: extMailer,
      
 }
