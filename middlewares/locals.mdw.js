module.exports = function (app) {
  app.use((req, res, next) => {
    console.log(req.session);
    if(typeof (req.session.username) === 'undefined'){
      req.session.username = null;
    }
    res.locals.username = req.session.username;
    //console.log(res.locals.name);
    next();
  })
};
