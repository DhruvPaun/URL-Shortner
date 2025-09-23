const express = require("express");
const shortid = require("shortid");
const urlRoute = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

const Url = require("../models/urls.model");
const User = require("../models/user.model");
app.use(cookieParser());
urlRoute.post("/shortUrl", async (req, res) => {
  const { redirectUrl } = req.body;
  try {
    const parsedUrl = new URL(redirectUrl)
    if(parsedUrl.protocol!=="https:")
    {
      return res.render("home",{errType:"invalid"})
    }
  } catch (error) {
        return res.render("home",{errType:"invalid"})
  }
  const id = shortid();
  const token = req.cookies.token;
  if(!token)
  {
    const urlGenerated=await Url.create({redirectUrl:redirectUrl,shortId:id,history:[]})
    res.render("home",{redirectUrl:urlGenerated.redirectUrl,id:urlGenerated.shortId})
  }
  else{
  try {
    const decode = jwt.verify(token, "SECRET");
    const user = await User.findOne({ email: decode.email });
    const urlGenerated = await Url.create({
      redirectUrl: redirectUrl,
      shortId: id,
      history: [],
      createdBy: user._id,
    });

    await User.findOneAndUpdate(
      { email: decode.email },
      {
        $push: {
          generatedUrl: { url: urlGenerated._id },
        },
      }
    );
    res.render("home", {
      redirectUrl: urlGenerated.redirectUrl,
      id: urlGenerated.shortId,
      signedIn: decode,
    });
  } catch (error) {
    res.redirect("/login")
  }
}
});
urlRoute.get("/:id", async (req, res) => {
  const id = req.params.id;
  const date = new Date();
  const foundedUrl = await Url.findOneAndUpdate(
    { shortId: id },
    {
      $push: {
        history: {
          visits: date.toLocaleString(),
        },
      },
    }
  );
  res.redirect(foundedUrl.redirectUrl);
});
module.exports = urlRoute;
