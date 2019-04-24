const axios = require('axios');

exports.handler = function (event, context, callback) {
    const {
        SN_TICKET,
        TOKEN
    } = process.env;

    // Send user response
    const send = body => {
        callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            },
            body: JSON.stringify(body)
        });
    }

    const getInc = () => {

        let xmls = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:inc=\"http://www.service-now.com/IncidentServiceAPI\">\r\n   <soapenv:Header/>\r\n   <soapenv:Body>\r\n      <inc:IncidentAPIRequest>\r\n         <snTicketNumber>${SN_TICKET}</snTicketNumber>\r\n         <sourceSystem>Test</sourceSystem>\r\n         <operation>GetRecord</operation>\r\n      </inc:IncidentAPIRequest>\r\n   </soapenv:Body>\r\n</soapenv:Envelope>";

        axios.post('https://aigm3.service-now.com/IncidentAPI.do?SOAP=',
                xmls, {
                    headers: {
                        "Content-Type": "text/xml",
                        "Access-Control-Allow-Origin": "*",
                        "Authorization": "Basic ${TOKEN}",
                    }
                }).then(res =>
                send(res))
            .catch(err => send(err));

    }

    // Make sure method is GET
    if (event.httpMethod == 'GET') {
        // Run
        getInc();
    }
}



// Changes XML to JSON
function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};
