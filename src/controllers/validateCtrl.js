const payloadCheck = require('payload-validator');

// Expected JSON Schema to validate against
let expected = { 
    "rule": {}
};



function validateCtrl(req, res) {
    // Get JSON payload from request object
    let incoming = req.body;
    // Checks if the incoming JSON schema/payload is the same as expected
    // If validated returns an object with the success key which results to either true or false.
    // Empty object results to false
    let result = payloadCheck.validator(incoming, expected, [], true);
  
    if (result.success) {
        // Collects JSON from the request body
        const {rule, data} = incoming;
        // Checks if rule is truthy
        if (rule) {
            // Check if data is truthy
            if (data) {
    
                // check for data field type
                if (typeof data === 'string' || Array.isArray(data) || typeof data === 'object'){
    
                    //  check for the type of rule field
                    if (typeof rule === 'object') { 
                        // Checks against the equal condition rule
                        if (rule.condition === 'eq') {
                             /*
                                This is to check if the "rule.field" key is separated by fullstop(.)
                                if so it will split it to an array of individual elements with
                                e.g { rule: "mission.count" } = ["mission", "count"]
                                IF otherwise i.e there isn't any fullstop(.), it will result to a one
                                element array e.g {rule: "mission"} = ["mission"]
                             */ 
                            const fieldSplit = rule.field.split('.');

                            let [firstKey, secondKey] = fieldSplit;
                            // Checks for the length of the array since the constraint states that the object must not be more than two levels
                            if (fieldSplit.length === 1) {
                                // Checks if data[firstKey]'s value is truthy
                                if (data[firstKey]) {
                                    // perform validation
                                    if ( data[firstKey] === rule.condition_value ) {
                                        res.header("Content-Type", "application/json; charset=UTF-8");

                                        return res.status(200).json({
                                                message: `field ${rule.field} successfully validated.`,
                                                status: 'success',
                                                data: {
                                                    validation: {
                                                        error: false,
                                                        field: rule.field,
                                                        field_value: data[firstKey],
                                                        condition: rule.condition,
                                                        condition_value: rule.condition_value
                                                    }
                                                }
                                            });
                                    }else{
                                        res.header("Content-Type", "application/json; charset=UTF-8");

                                        return res.status(400).json({
                                                message: `field ${rule.field} failed validation.`,
                                                status: 'error',
                                                data: {
                                                    validation: {
                                                        error: true,
                                                        field: rule.field,
                                                        field_value: data[firstKey],
                                                        condition: rule.condition,
                                                        condition_value: rule.condition_value
                                                    }
                                                }
                                            });
                                    }
                                }else{
                                res.header("Content-Type", "application/json; charset=UTF-8");

                                return res.status(400).json({
                                            message: `field ${rule.field} is missing from data.`,
                                            status: 'error',
                                            data: null
                                    });
                                }
                            }
                            // Checks for the length of the array since the constraint states that the object must not be more than two levels
                            if (fieldSplit.length === 2){
                                // Checks if data[firstKey]'s value is truthy
                                if (data[firstKey]) {
                                    // Checks if data.[firstKey][secondKey]'s value is truthy
                                    if (data[firstKey][secondKey]) {
                                        // Perform validation
                                        if ( data[firstKey][secondKey] === rule.condition_value ) {
                                            res.header("Content-Type", "application/json; charset=UTF-8");

                                            return res.status(200).json({
                                                    message: `field ${rule.field} successfully validated.`,
                                                    status: 'success',
                                                    data: {
                                                        validation: {
                                                            error: false,
                                                            field: rule.field,
                                                            field_value: data[firstKey][secondKey],
                                                            condition: rule.condition,
                                                            condition_value: rule.condition_value
                                                        }
                                                    }
                                                });
                                        }else{
                                            res.header("Content-Type", "application/json; charset=UTF-8");

                                            return res.status(400).json({
                                                    message: `field ${rule.field} failed validation.`,
                                                    status: 'error',
                                                    data: {
                                                        validation: {
                                                            error: true,
                                                            field: rule.field,
                                                            field_value: data[firstKey],
                                                            condition: rule.condition,
                                                            condition_value: rule.condition_value
                                                        }
                                                    }
                                                });
                                        }
                                    }else{
                                    res.header("Content-Type", "application/json; charset=UTF-8");
                                    
                                    return res.status(400).json({
                                            message: `field ${rule.field} is missing from data.`,
                                            status: 'error',
                                            data: null
                                        });
                                    }
                                }else{
                                    res.header("Content-Type", "application/json; charset=UTF-8");
                                    return res.status(400).json({
                                            message: `field ${rule.field} is missing from data.`,
                                            status: 'error',
                                            data: null
                                        });
                                }

                            }
                        }
                        // Checks against the "not equal" condition rule
                        else if (rule.condition === 'neq') {
                            /*
                                This is to check if the "rule.field" key is separated by fullstop(.)
                                if so it will split it to an array of individual elements with
                                e.g { rule: "mission.count" } = ["mission", "count"]
                                IF otherwise i.e ther isn't any fullstop(.), it will result to a one
                                element array e.g {rule: "mission"} = ["mission"].
                            */
                            const fieldSplit = rule.field.split('.');
                            
                            let [firstKey, secondKey] = fieldSplit;
                            // Checks for the length of the array since the constraint states that the object must not be more than two levels
                            if (fieldSplit.length === 1) {
                                // Checks if data[firstKey]'s value is truthy
                                if (data[firstKey]) {
                                    // Perform validation
                                    if ( data[firstKey] !== rule.condition_value ) {
                                        res.header("Content-Type", "application/json; charset=UTF-8");

                                        return res.status(200).json({
                                                message: `field ${rule.field} successfully validated.`,
                                                status: 'success',
                                                data: {
                                                    validation: {
                                                        error: false,
                                                        field: rule.field,
                                                        field_value: data[firstKey],
                                                        condition: rule.condition,
                                                        condition_value: rule.condition_value
                                                    }
                                                }
                                            });
                                    }else{
                                        res.header("Content-Type", "application/json; charset=UTF-8");

                                        return res.status(400).json({
                                                message: `field ${rule.field} failed validation.`,
                                                status: 'error',
                                                data: {
                                                    validation: {
                                                        error: true,
                                                        field: rule.field,
                                                        field_value: data[firstKey],
                                                        condition: rule.condition,
                                                        condition_value: rule.condition_value
                                                    }
                                                }
                                            });
                                    }
                                }else{
                                res.header("Content-Type", "application/json; charset=UTF-8");

                                return res.status(400).json({
                                            message: `field ${rule.field} is missing from data.`,
                                            status: 'error' ,
                                            data: null
                                    });
                                }
                            }
                            // Checks for the length of the array since the constraint states that the object must not be more than two levels
                            if (fieldSplit.length === 2){
                                //Checks if data[firstKey]'s value is truthy
                                if (data[firstKey]) {
                                    // Check if data[firstKey][secondKey]'s value is truthy
                                    if (data[firstKey][secondKey]) {
                                        // Perform validation
                                        if ( data[firstKey][secondKey] !== rule.condition_value ) {
                                            res.header("Content-Type", "application/json; charset=UTF-8");

                                            return res.status(200).json({
                                                    message: `field ${rule.field} successfully validated.`,
                                                    status: 'success',
                                                    data: {
                                                        validation: {
                                                            error: false,
                                                            field: rule.field,
                                                            field_value: data[firstKey][secondKey],
                                                            condition: rule.condition,
                                                            condition_value: rule.condition_value
                                                        }
                                                    }
                                                });
                                        }else{
                                            res.header("Content-Type", "application/json; charset=UTF-8");

                                            res.status(400).json({
                                                    message: `field ${rule.field} failed validation.`,
                                                    status: 'error',
                                                    data: {
                                                        validation: {
                                                            error: true,
                                                            field: rule.field,
                                                            field_value: data[firstKey][secondKey],
                                                            condition: rule.condition,
                                                            condition_value: rule.condition_value
                                                        }
                                                    }
                                                });
                                        }
                                    }else{
                                    res.header("Content-Type", "application/json; charset=UTF-8");
                                    
                                    return res.status(400).json({
                                            message: `field ${rule.field} is missing from data.`,
                                            status: 'error',
                                            data: null
                                        });
                                    }
                                }else{
                                    res.header("Content-Type", "application/json; charset=UTF-8");

                                    return res.status(400).json({
                                            message: `field ${rule.field} is missing from data.`,
                                            status: 'error',
                                            data: null
                                        });
                                }

                            }

                        }
                        // Checks against the "greater than" condition rule
                        else if (rule.condition === 'gt') {
                            /*
                                This is to check if the "rule.field" key is separated by fullstop(.)
                                if so it will split it to an array of individual elements with
                                e.g { rule: "mission.count" } = ["mission", "count"]
                                IF otherwise i.e ther isn't any fullstop(.), it will result to a one
                                element array e.g {rule: "mission"} = ["mission"].
                            */
                            const fieldSplit = rule.field.split('.');

                            let [firstKey, secondKey] = fieldSplit;
                            // Checks for the length of the array since the constraint states that the object must not be more than two levels
                            if (fieldSplit.length === 1) {
                                // Checks if the data[firstKey]'s value is truthy
                                if (data[firstKey]) {
                                    // Perform validation
                                    if ( data[firstKey] > rule.condition_value ) {
                                        res.header("Content-Type", "application/json; charset=UTF-8");

                                        return res.status(200).json({
                                                message: `field ${rule.field} successfully validated.`,
                                                status: 'success',
                                                data: {
                                                    validation: {
                                                        error: false,
                                                        field: `${rule.field}`,
                                                        field_value: data[firstKey],
                                                        condition: rule.condition,
                                                        condition_value: rule.condition_value
                                                    }
                                                }
                                            });
                                    }else{
                                        res.header("Content-Type", "application/json; charset=UTF-8");

                                        return res.status(400).json({
                                                message: `field ${rule.field} failed validation.`,
                                                status: 'error',
                                                data: {
                                                    validation: {
                                                        error: true,
                                                        field: rule.field,
                                                        field_value: data[firstKey],
                                                        condition: rule.condition,
                                                        condition_value: rule.condition_value
                                                    }
                                                }
                                            });
                                    }
                                }else{
                                  res.header("Content-Type", "application/json; charset=UTF-8");

                                  return res.status(400).json({
                                            message: `field ${firstKey} is missing from data.`,
                                            status: 'error' ,
                                            data: null
                                    });
                                }
                            }
                            // Checks for the length of the array since the constraint states that the object must not be more than two levels
                            if (fieldSplit.length === 2){
                                if (data[firstKey]) {
                                    // check if rule.field is valid in data object
                                    if (data[firstKey][secondKey]) {
                                        // perform validation
                                        if ( data[firstKey][secondKey] > rule.condition_value ) {
                                            res.header("Content-Type", "application/json; charset=UTF-8");

                                            return res.status(200).json({
                                                    message: `field ${rule.field} successfully validated.`,
                                                    status: 'success',
                                                    data: {
                                                        validation: {
                                                            error: false,
                                                            field: `${rule.field}`,
                                                            field_value: data[firstKey][secondKey],
                                                            condition: rule.condition,
                                                            condition_value: rule.condition_value
                                                        }
                                                    }
                                                });
                                        }else{
                                            res.header("Content-Type", "application/json; charset=UTF-8");

                                            return res.status(400).json({
                                                    message: `field ${rule.field} failed validation.`,
                                                    status: 'error',
                                                    data: {
                                                        validation: {
                                                            error: true,
                                                            field: `${rule.field}`,
                                                            field_value: data[firstKey][secondKey],
                                                            condition: rule.condition,
                                                            condition_value: rule.condition_value
                                                        }
                                                    }
                                                });
                                        }
                                    }else{
                                        res.header("Content-Type", "application/json; charset=UTF-8");

                                        return res.status(400).json({
                                            message: `field ${rule.field} is missing from data.`,
                                            status: 'error',
                                            data: null
                                        });
                                    }
                                }else{
                                    res.header("Content-Type", "application/json; charset=UTF-8");

                                    return res.status(400).json({
                                        message: `field ${rule.field} is missing from data.`,
                                        status: 'error',
                                        data: null
                                    });
                                }
                    
                            }

                        }
                        // Checks against the "greater than or equal" condition rule
                        else if (rule.condition === 'gte') {
                            /*
                                This is to check if the "rule.field" key is separated by fullstop(.)
                                if so it will split it to an array of individual elements with
                                e.g { rule: "mission.count" } = ["mission", "count"]
                                IF otherwise i.e ther isn't any fullstop(.), it will result to a one
                                element array e.g {rule: "mission"} = ["mission"].
                            */
                            const fieldSplit = rule.field.split('.');

                            let [firstKey, secondKey] = fieldSplit;
                            // Checks for the length of the array since the constraint states that the object must not be more than two levels
                            if (fieldSplit.length === 1) {
                                if (data[firstKey]) {
                                    // perform validation
                                    if ( data[firstKey] >= rule.condition_value ) {
                                        res.header("Content-Type", "application/json; charset=UTF-8");

                                        return res.status(200).json({
                                            message: `field ${rule.field} successfully validated.`,
                                            status: 'success',
                                            data: {
                                                validation: {
                                                    error: false,
                                                    field: rule.field,
                                                    field_value: data[firstKey],
                                                    condition: rule.condition,
                                                    condition_value: rule.condition_value
                                                }
                                            }
                                        });
                                    }else{
                                        res.header("Content-Type", "application/json; charset=UTF-8");

                                        return res.status(400).json({
                                            message: `field ${rule.field} failed validation.`,
                                            status: 'error',
                                            data: {
                                                validation: {
                                                    error: true,
                                                    field: rule.field,
                                                    field_value: data[firstKey],
                                                    condition: rule.condition,
                                                    condition_value: rule.condition_value
                                                }
                                            }
                                        });
                                    }
                                }else{
                                    res.header("Content-Type", "application/json; charset=UTF-8");

                                    return res.status(400).json({
                                                message: `field ${firstKey} is missing from data.`,
                                                status: 'error',
                                                data: null
                                        });
                                }
                            }
                            // Checks for the length of the array since the constraint states that the object must not be more than two levels
                            if (fieldSplit.length === 2){
                                //Checks if the data[firstKey]'s value is truthy
                                if (data[firstKey]) { 
                                    // Checks if the data[firstKey][secondKey]'s value is truthy
                                    if (data[firstKey][secondKey]) {
                                        // Perform validation
                                        if ( data[firstKey][secondKey] >= rule.condition_value ) {
                                            res.header("Content-Type", "application/json; charset=UTF-8");

                                            return res.status(200).json({
                                                    message: `field ${rule.field} successfully validated.`,
                                                    status: 'success',
                                                    data: {
                                                        validation: {
                                                            error: false,
                                                            field: rule.field,
                                                            field_value: data[firstKey][secondKey],
                                                            condition: rule.condition,
                                                            condition_value: rule.condition_value
                                                        }
                                                    }
                                                });
                                        }else{
                                            res.header("Content-Type", "application/json; charset=UTF-8");

                                            return res.status(400).json({
                                                    message: `field ${rule.field} failed validation.`,
                                                    status: 'error',
                                                    data: {
                                                        validation: {
                                                            error: true,
                                                            field: rule.field,
                                                            field_value: data[firstKey][secondKey],
                                                            condition: rule.condition,
                                                            condition_value: rule.condition_value
                                                        }
                                                    }
                                                });
                                        }
                                    }else{
                                    res.header("Content-Type", "application/json; charset=UTF-8");

                                    return res.status(400).json({
                                            message: `field ${rule.field} is missing from data.`,
                                            status: 'error' ,
                                            data: null
                                        });
                                    }
                                }else{
                                    res.header("Content-Type", "application/json; charset=UTF-8");

                                    return res.status(400).json({
                                        message: `field ${rule.field} is missing from data.`,
                                        status: 'error' ,
                                        data: null
                                    });
                                }
                            }
                        }
                        // Checks against "contains" condition rule
                        else if (rule.condition === 'contains') {
                            // Checks if the rule.field value is in the data array which results in a boolean
                            if (data.includes(rule.condition_value)) {
                                // Get the index of the value;
                                let index = data.indexOf(rule.field);
                                
                                res.header("Content-Type", "application/json; charset=UTF-8");

                                return res.status(200).json({
                                        message: `field ${rule.field} successfully validated.`,
                                        status: 'success',
                                        data: {
                                            validation: {
                                                error: false,
                                                field: rule.field,
                                                field_value: data[index],
                                                condition: rule.condition,
                                                condition_value: rule.condition_value
                                            }
                                        }
                                    });
                            }else{
                                res.header("Content-Type", "application/json; charset=UTF-8");

                                return res.status(400).json({
                                        message: `field ${rule.field} is missing from data.`,
                                        status: 'error' ,
                                        data: null
                                    });
                            }

                        }else {
                            res.header("Content-Type", "application/json; charset=UTF-8");

                            return res.status(400).json({
                                    message: 'Abeg no try am again. This na dangerous play.',
                                    status: 'error',
                                    data: null 
                                });
                        }
                    }else{
                        res.header("Content-Type", "application/json; charset=UTF-8");

                        return res.status(400).json({
                                message: 'rule should be an object.',
                                status: 'error',
                                data: null
                            });
                    }
                }else{
                    res.header("Content-Type", "application/json; charset=UTF-8");

                    return res.status(400).json({
                            message: 'data should be an array or a string or a JSON object.',
                            status: 'error',
                            data: null
                        });
                }
            }else{
                res.header("Content-Type", "application/json; charset=UTF-8");

                return res.status(400).json({
                        message: 'data is required.',
                        status : 'error',
                        data: null
                    });
            }
        }else{
            res.header("Content-Type", "application/json; charset=UTF-8");

            return res.status(400).json({
                    message: 'rule is required.',
                    status : 'error',
                    data: null
                });
        }
    }else{
        res.header("Content-Type", "application/json; charset=UTF-8");

        return res.status(400).json({
            message: 'Invalid JSON payload passed.',
            status: 'error',
            data: null
        });
    }
}

module.exports = validateCtrl;