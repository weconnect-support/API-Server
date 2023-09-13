import Router from 'koa-router';
import {domain} from "./serviceURL.js";
const router = new Router();
import {google} from 'googleapis';
import knex from "knex";
import {client, connection} from "../../serverPrivacy.js";
import crypto from "crypto";
import axios from "axios";
const conn = knex({client:client, connection:connection})
const accountCheck = async(email, platform)=>{
	let signupCheck = await conn("users").select().where({email : email, platform : platform})
	if(signupCheck.length == 0)
		return 0
	else
		return 1;
}
router.post('/', async(ctx)=> {
	const {platform,nickname,noti_flag,device_id,phone,address,address_detail} = ctx.request.body
	if(!nickname || !noti_flag || !device_id || !phone || !address){
		ctx.body = {"status":"no","code":-1 ,"text": "parameter validation check error"};
		return;
	}
	
	if(platform == 4){
		const {email, password, name} = ctx.request.body;
		if(!email || !password){
			ctx.body = {"status":"no","code":-1 ,"text": "parameter validation check error"};
			return;
		}
		if((await accountCheck(email,platform)) ){
			ctx.body = {"status":"no", "code":2,"text":"email vaild"};
		}
		else{
			let signUpUser = await conn("users").insert(
				{
					email: email,
					password: crypto.createHash('sha512').update(password).digest('hex'),
					name: name,
					nickname : nickname,
					is_delete: null,
					signup_date:conn.raw("now()"),
					platform : 4,
					noti_flag : noti_flag,
					device_id : device_id,
					agree_term_date : conn.raw("now()"),
					last_modify_time : conn.raw("now()"),
					address: address,
					address_detail: address_detail,
				}
			);
			ctx.body = {"status":"ok","code":1,"text":"join_complate"};
		}
	}
	else if(platform <= 3 || platform >= 1 ){
		var resTxt = "";	
		if(platform == 1){//google
			const {access_token} = ctx.request.body
			let data = await axios({
				url:`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
			})
			console.log(data.data)
			const {email,name} = data.data;
			if(await accountCheck(email, platform)){
				ctx.body = {"status":"no", "code":2,"text":"email vaild"};
				return;
			}
			let signUpUser = await conn("users").insert(
					{
					email: email,
					name: name,
					nickname : nickname,
					is_delete: null,
					signup_date:conn.raw("now()"),
					platform : platform,
					noti_flag : noti_flag,
					device_id : device_id,
					agree_term_date : conn.raw("now()"),
					last_modify_time : conn.raw("now()"),
					address: address,
					address_detail: address_detail,
				}
			);
			resTxt = "join_complate_using_google"
		}
		else if(platform == 2){//kakao
			resTxt = "join_complate_using_kakao"
		}
		else{//naver.com

		}
			
		ctx.body = {"status":"ok","code":1, "text":resTxt}
	}
	else{
		ctx.body = {"status":"no", "code":-1, "text":"platform not found"}
	}

	
});

module.exports = router;
