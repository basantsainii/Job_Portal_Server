import sendMails from "./src/Utils/mailer.js";


const subject = "my first email";
const email = 'basantsaini.tank@gmail.com';
const content = '<p>my name is basant </p><p> my name is basant <a href="http://google.com/">google</a></p>';

sendMails(email, subject, content);