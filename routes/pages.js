const express = require("express");
const app = express();
const router = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const checkAuth=(pageName)=>{return (req,res)=>{
    const token = req.cookies.token;
  if (typeof token==="string") {
    try{
    const decode = jwt.verify(token, "SECRET");
    if (decode) {
      res.render(`${pageName}`, { currentPage: `${pageName}`, signedIn: decode });
    }
    else{
        res.render(`${pageName}`,{currentPage:`login`})
    }
  }
  catch{
    res.clearCookie("token");
    res.send(`<h2>Cannot load page at moment</h2>`)
  }
  }
  else{
    res.render(`${pageName}`,{currentPage:`${pageName}`})
  }
}}
app.use(cookieParser());
router.get("/",checkAuth("home"));
router.get("/about",checkAuth("about"));
router.get("/terms",checkAuth("terms"));
router.get("/privacypolicy",checkAuth("privacypolicy"));
router.get("/home", checkAuth("home"));
router.get("/pricing",  checkAuth("pricing"));
router.get("/features",checkAuth("features") 
);
router.get("/signup",(req,res)=>{
  res.render("signup")
});
router.get("/login", (req,res)=>{
  res.render("login");
});
// router.get("/login",(req,res)=>{
//   res.redirect("/login")
// });
// router.get("/signup",(req,res)=>{
//   res.redirect("/signup")
// });
// router.get("/signup");
router.get("/otpverify",checkAuth("otpverify"))
router.get("/dashboard",(req,res)=>{
  const token=req.cookies.token
  try {
    const decode=jwt.verify(token,"SECRET");
  if(decode)
  {
    res.redirect("/user/showDashboard")
  }
  } catch (error) {
    res.redirect("/login")
  }
})
module.exports = router;
