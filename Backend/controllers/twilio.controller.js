const client = require("../services/twilio");
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const { getIO } = require("../socket"); 

// twilio.controller.js

module.exports.callDriver = (req, res) => {
  const { phone, rideId,pickup, destination } = req.body;

  client.calls
    .create({
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      url: `https://0483-2401-4900-5d36-923-28a0-c37d-6e66-e4a5.ngrok-free.app/twilio/ivr?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&rideId=${rideId}`,
    })
    .then((call) => {
      console.log("Call SID:", call.sid);
      res.status(200).json({ success: true, callSid: call.sid });
    })
    .catch((err) => {
      console.error("Call error:", err);
      res.status(500).json({ success: false, error: err.message });
    });
};



// module.exports.voice = (req, res) => {
//   const twiml = new VoiceResponse();

//   twiml.say(
//   { voice: 'Polly.Aditi', language: 'hi-IN' },
//   'नमस्ते! आपके पास एक नयी राइड है। पिकअप लोकेशन Delhi से, डेस्टिनेशन Noida तक। अगर आप राइड कन्फर्म करना चाहते हैं तो 1 दबाइये। अगर आप राइड कैंसल करना चाहते हैं तो 0 दबाइये।'
// );


//   res.type("text/xml");
//   res.send(twiml.toString()); // Twilio expects properly stringified XML
// };


module.exports.ivr = (req, res) => {
  const { pickup, destination, rideId } = req.query; 

  const twiml = new VoiceResponse();

  // Gather user input
  const gather = twiml.gather({
    action: `/twilio/handle-input?rideId=${rideId}&pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}`,
    numDigits: 1,
    timeout: 10
  });

  gather.say(
    { voice: 'Polly.Aditi', language: 'hi-IN' },
    `नमस्ते! आपके पास एक नयी राइड है। पिकअप लोकेशन ${pickup} से, डेस्टिनेशन ${destination} तक। अगर आप राइड कन्फर्म करना चाहते हैं तो 1 दबाइये। अगर आप राइड कैंसल करना चाहते हैं तो 0 दबाइये।`
  );

  res.type('text/xml');
  res.send(twiml.toString());
};

module.exports.handleInput = (req, res) => {
    const digit = req.body.Digits;
    const rideId = req.query.rideId;
    const pickup = req.query.pickup;
    const destination = req.query.destination;

    const io = getIO(); 

    const twiml = new VoiceResponse();

    if (digit === '1') {
        console.log(`Ride from ${pickup} to ${destination} accepted by driver.`);

        io.emit('ride-accepted', { rideId, pickup, destination });

        twiml.say(
            { voice: 'Polly.Aditi', language: 'hi-IN' },
            `आपने ${pickup} से ${destination} तक की राइड स्वीकार कर ली है। धन्यवाद!`
        );
    } else if (digit === '0') {
        console.log(`Ride from ${pickup} to ${destination} rejected by driver.`);

        io.emit('ride-rejected', { rideId, pickup, destination });

        twiml.say(
            { voice: 'Polly.Aditi', language: 'hi-IN' },
            `आपने ${pickup} से ${destination} तक की राइड अस्वीकार कर दी है। धन्यवाद!`
        );
    } else {
        twiml.say(
            { voice: 'Polly.Aditi', language: 'hi-IN' },
            'आपने सही विकल्प नहीं चुना। कृपया फिर से प्रयास करें।'
        );
    }

    res.type('text/xml').send(twiml.toString());
};
