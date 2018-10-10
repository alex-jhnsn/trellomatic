var email 	= require("emailjs");
var server 	= email.server.connect({
   user:    process.env.EMAIL_ADDRESS, 
   password:process.env.EMAIL_PASSWORD, 
   host:    "smtp.gmail.com", 
   ssl:     true
});
 


module.exports = {
  Send: function(boardName, boardJson) {
    server.send({
      text:    boardJson, 
      from:    process.env.EMAIL_ADDRESS, 
      to:      process.env.RECIPIENTS,
      subject: boardName
    }, function(err, message) {  });
  }
}

