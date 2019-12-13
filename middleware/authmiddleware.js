const jwt = require('jsonwebtoken')
function authmiddleware(req, res, next) {
    try {
        const token = req.header('x-auth-token');
        if (token) {
            const userDate = jwt.verify(token, 'Inetworks'); //verfiy return payload

            if (userDate) {
                req.user = userDate;  // pass userData to the Api that will use this middleware function//
                next(); //means go to the next api//
            } else {
                res.status(400).send({ message: 'invalid token' });
            }
        } else {
            res.status(401).send({ message: 'Token not Provided' });
        }


    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = authmiddleware;