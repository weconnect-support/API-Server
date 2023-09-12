import Router from 'koa-router';
const router = new Router();
import {gclient_id, gclient_secret,gapi_key} from "./googleAppInfo.js";
import {google} from 'googleapis'
import {domain} from "./serviceURL.js"
import axios from 'axios';
//https://oauth2.example.com/auth?error=access_denied
//error request
const oauth2Client = new google.auth.OAuth2(
  gclient_id,
  gclient_secret,
  domain+"/users/login/google"
);

router.get('/',async(ctx)=> {
	let res = await oauth2Client.getToken(ctx.query.code);
	ctx.body=res.tokens;
});


module.exports = router;
