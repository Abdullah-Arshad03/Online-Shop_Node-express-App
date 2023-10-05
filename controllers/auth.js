exports.getLogin = (req ,res , next) =>{
    res.render("auth/login.ejs", {
        pageTitle: "Login",
        path: "/login"
      });
}

