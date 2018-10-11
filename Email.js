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
      text:    "Here's the actions from the retro!", 
      from:    `Trellomatic <${process.env.EMAIL_ADDRESS}>`, 
      to:      process.env.RECIPIENTS,
      subject: boardName,
      attachment: 
      [
      {data:boardJson, alternative:true},
      ]
    }, function(err, message) { console.log( err || "sent" ) });
  }
}

