
const axios = require('axios');

exports.handler = function(event, context, callback){
  const { SN_TICKET, TOKEN } = process.env;

  // Send user response
  const send = body => {
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept'
      },
      body: JSON.stringify(body)
    });
  }
  
  const getInc = () => {
    $.ajax({
      url: "https://aigm3.service-now.com/IncidentAPI.do?SOAP=",
      async: true,
      type: "POST",
      data: "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:inc=\"http://www.service-now.com/IncidentServiceAPI\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <inc:IncidentAPIRequest>\r\n         <snTicketNumber>${SN_TICKET}</snTicketNumber>\r\n         <sourceSystem>Test</sourceSystem>\r\n         <operation>GetRecord</operation>\r\n      </inc:IncidentAPIRequest>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>",
      headers: {
          "Content-Type": "text/xml",
          "Access-Control-Allow-Origin": "*",
          "Authorization": "Basic ${TOKEN}",
      },
    }).done(function (response, textStatus, xhr) {
      send(response);
    }).fail(function (xhr, textStatus, errorThrown) {
      send(xhr);
    });
  }

  // Make sure method is GET
  if(event.httpMethod == 'GET') {
    // Run
    getInc();
  }
}
