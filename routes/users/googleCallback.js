import Router from 'koa-router';
const router = new Router();
import {googleClientID, googleClientSecret, domain} from "../../serverPrivacy.js";
import {google} from 'googleapis'
import axios from 'axios';
//https://oauth2.example.com/auth?error=access_denied
//error request
const oauth2Client = new google.auth.OAuth2(
  googleClientID,
  googleClientSecret,
  domain+"/users/login/google"
);
//console.log(google);
router.get('/',async(ctx)=> {
	const googleData = await oauth2Client.getToken(ctx.query.code);
	let access_token = googleData.tokens.access_token;
	console.log(access_token);
	var data = await axios({
	url:`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
	})
	console.log(data.data)
	ctx.body=data.data;
});


module.exports = router;
