exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404', isAuthenticated : req.session.isLoggedIn });
};

exports.get505 = (req,res,next)=>{
  res.status(500).render('500',{
    pageTitle : 'Technical Eror',
    path : '/500',
    isAuthenticated : req.session.isLoggedIn
  })
}