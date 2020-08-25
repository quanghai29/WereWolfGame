module.exports = function (req,res,next) {
    if (req.session.username === null)
      return res.redirect(`/account/login`);
    next();
};