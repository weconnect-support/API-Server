import Router from 'koa-router';
import {client_id, client_secret} from "./naverAppInfo.js";
import {domain} from "./serviceURL.js"
const router = new Router();
import {google} from 'googleapis'
import {client, connection, jwtKey} from '../../serverPrivacy.js';
import knex from 'knex';
import crypto from "crypto";
import {gclient_id, gclient_secret,gapi_key} from "./googleAppInfo.js";
import jwt from 'jsonwebtoken';
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
router.post('/',async(ctx)=>{	
	const conn = knex({client:client, connection:connection});
	console.log(ctx.request.body)
	const {platform} =  ctx.request.body;
	if(platform == undefined || (platform >= 5 || platform <= 0)){
		console.log(platform);
		console.log(platform == undefined);
		console.log(platform >= 5);
		console.log(platform <= 0);
		ctx.body = {"status":"no", "code":-1, "text":"platform not found"};
	}
	else if(platform == 4){
		const {email, password} = ctx.request.body;
		let userCheck = await conn("users").select().where({email:email, password:crypto.createHash('sha512').update(password).digest('hex')});
		if(userCheck.length == 1){
			let {idx, email,nickname}  = userCheck[0];
			let token = jwt.sign({"idx":idx,"nickname":nickname}, jwtKey);
			ctx.body = {"status":"ok","code":1,"userinfo": userCheck[0],token:token,"text":"login_success"}
		}
		else{
			ctx.body = {"status":"no","code":2,"text":"login_fail"}
		}
	}
	else{
		ctx.body = {"status":"no","code":1, "test": "non dev"}
	}

})
module.exports = router;
