module.exports = function (req, res, next) {
    if (req.user.isSuperAdmin || req.user.isAdmin) {
        next()
    } else {
        res.status(403).send({ message: 'can  not access Super admin area' });
    }
}