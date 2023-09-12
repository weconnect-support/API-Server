import Router from 'koa-router';
import {client_id, client_secret} from "./naverAppInfo.js";
import {domain} from "./serviceURL.js"
const router = new Router();
import {google} from 'googleapis'

import {gclient_id, gclient_secret,gapi_key} from "./googleAppInfo.js";

var state = "RANDOM_STATE";
var redirectURI = encodeURI(domain+"/users/login/naver");
var api_url = "";
//google authorization url
const oauth2Client = new google.auth.OAuth2(
  gclient_id,
  gclient_secret,
  domain+"/users/login/google"
);
const scopes = [
	"https://www.googleapis.com/auth/userinfo.profile",//
	"https://www.googleapis.com/auth/user.phonenumbers.read",
	"email",
	"profile",
	'phone'
];
const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true
});

router.get('/', (ctx)=> {
	api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
  // res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   ctx.body = "<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a><br><h3>"+authorizationUrl+"</h3>";
 });

module.exports = router;
