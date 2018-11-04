var email 	= require("emailjs");
var server 	= email.server.connect({
   user:    process.env.EMAIL_ADDRESS, 
   password:process.env.EMAIL_PASSWORD, 
   host:    "smtp.gmail.com", 
   ssl:     true
});

module.exports = {
  /**
   * @param {[string]} addresses A list of addresses that you want the emails to be sent to
   * @param {string} subject The subject line of the email - I use the board name
   * @param {string} htmlContent The html content for the email 
   */
  Send: function(addresses, subject, htmlContent) {
    server.send({
      text:    "Here's the actions from the retro!", 
      from:    `Trellomatic <${process.env.EMAIL_ADDRESS}>`, 
      to:      addresses,
      subject: subject,
      attachment: 
      [
      {data:htmlContent, alternative:true},
      ]
    }, function(err, message) { console.log( err || "sent" ); return "sent"});
  }
}

