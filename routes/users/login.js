import Router from 'koa-router';
const router = new Router();
import {google} from 'googleapis'
import {naverClientID, naverClientSecret, client, connection, jwtKey,domain,googleClientID, googleClientSecret, kakaoClientID, kakaoClientSecret} from '../../serverPrivacy.js';
import knex from 'knex';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import axios from 'axios';
const conn = knex({client:client, connection:connection})
const accountCheck = async(email, platform)=>{
	let signupCheck = await conn("users").select().where({email : email, platform : platform, is_delete:0})
	if(signupCheck.length == 0)
		return {"code":0};
	else
		return {"code":1, "data":signupCheck[0]};
}

router.post('/',async(ctx)=>{	
	const {platform} =  ctx.request.body;
	if(platform == undefined || (platform >= 5 || platform <= 0)){
		ctx.body = {"status":"no", "code":-1, "text":"platform not found"};
		return;
	}
	else if(platform == 4){
		const {email, password} = ctx.request.body;
		if(!email || !password){
			ctx.body = {"status":"no","code": -1, "text":"parameter validation check error"}
			return;
		}
			console.log("aa");
		let userCheck = await conn("users").select().where({email:email, password:crypto.createHash('sha512').update(password).digest('hex'), is_delete: 0});
		console.log("dd");
		if(userCheck.length == 1){
			let {idx, email,nickname}  = userCheck[0];
			let token = jwt.sign({"idx":idx,"nickname":nickname,"expire":new Date()}, jwtKey);
			ctx.body = {"status":"ok","code":1,token:token,"text":"login_success"}
			return;
		}
		else{
			ctx.body = {"status":"no","code":2,"text":"login_fail"}
			return;
		}
	}
	else{
		const {access_token} = ctx.request.body;
		let email = "";
		if(!access_token){
			ctx.body = {"status":"no","code":-1 ,"text": "parameter validation check error"};
			return;
		}
		if(platform == 1){//google
			try{
				const data = await axios({
					url:`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
				})
				email = data.data.email;
			}
			catch(err){
				ctx.body = {"status":"no", "code":3,"text":"access_token_err"};
				return;
			}
		}
		else if(platform == 2){//kakao
			try{
				const data = await axios({
					url:'https://kapi.kakao.com/v2/user/me?secure_resource=true',
					headers:{
						'Authorization':`Bearer ${access_token}`,
						'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
					}
				});
				console.log(data.data);
				email = data.data.kakao_account.email;
				if(!email){
					ctx.body = {"status":"no", "code":4,"text":"not_found_email_at_kakao_oauth"};
					return;

				}
				console.log("kk email : "+ email);
			}
			catch(err){
				ctx.body = {"status":"no", "code":3,"text":"access_token_err"};
				return
			}
		}
		else{//naver
			try{
				const data = await axios({
					url :'https://openapi.naver.com/v1/nid/me',
					headers:{
						"Authorization":`Bearer ${access_token}`
					}
				});
				email = data.data.response.email;
			}
			catch(err){
				ctx.body = {"status":"no", "code":3,"text":"access_token_err"};
				return;
			}
		}
		let userInfo = await accountCheck(email,platform);
		if(userInfo.code){ // login sucess
			let expireTime = new Date()
			expireTime.setHours(expireTime.getHours()+1);
			let token = jwt.sign({"idx":userInfo.data.idx,"nickname":userInfo.data.nickname,"platform":userInfo.data.platform,"expire":expireTime}, jwtKey);
			ctx.body = {"status":"ok", "code":1,"text":"login_success", "token":token};
		}
		else{//login fail		
			ctx.body = {"status":"no","code":2, "text": "login fail"}
		}
	}

})
module.exports = router;
