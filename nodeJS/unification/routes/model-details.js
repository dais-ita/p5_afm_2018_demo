// *******************************************************************************
// * (C) Copyright IBM Corporation 2018
// * All Rights Reserved
// *******************************************************************************

let express = require('express');
let router = express.Router();
let request = require('request-promise');
let config = require('../config');
let fn = require('./functions-general');
let parmType = null;
let parmModel = null;

router.get('/', function (req, res) {
    parmType = req.query.type;
    parmModel = req.query.model;

    const options = {
        method: 'GET',
        uri: fn.getModelsAllUrl(config)
    };

    request(options)
        .then(function (response) {
            // Success
            let result = JSON.parse(response).models;
            let matchedModel = fn.matchedModel(parmModel, result);

            if (matchedModel == null) {
                console.log("Error - no model matches '" + parmModel + "'");
            }

            if (parmType == "html") {
                let jsPage = {
                    "title": config.unified_apis.model.details.url,
                    "model": matchedModel,
                    "parameters": {
                        "type": parmType,
                        "model": parmModel
                    }
                };

                res.render(config.unified_apis.model.details.route, jsPage);
            } else {
                res.json(matchedModel);
            }
        })
        .catch(function (err) {
            // Error
            console.log(err);
            return res.sendStatus(500);
        })
});

module.exports = router;
