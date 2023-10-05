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
	var data;
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
					is_delete: 0,
					phone : phone,
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
		const {access_token} = ctx.request.body
		if(!access_token){
			ctx.body = {"status":"no","code":-1 ,"text": "parameter validation check error"};
			return;
		}
		if(platform == 1){//google
			try{
				data = await axios({
					url:`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
				})
			}
			catch(err){
				ctx.body = {"status":"no", "code":3,"text":"access_token_err"};
				return;
			}
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
					is_delete: 0,
					signup_date:conn.raw("now()"),
					phone : phone,
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
			try{
				data = await axios({
					url:'https://kapi.kakao.com/v2/user/me?secure_resource=true',
					headers:{
						'Authorization':`Bearer ${access_token}`,
						'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
					}
				});
			}
			catch(err){
				ctx.body = {"status":"no", "code":3,"text":"access_token_err"};
				return
			}
			const {email} = data.data.kakao_account;
			const name = data.data.kakao_account.profile.nickname;
			if(await accountCheck(email, platform)){
				ctx.body = {"status":"no", "code":2,"text":"email vaild"};
				return;
			}
			let signUpUser = await conn("users").insert(
				{
					email: email,
					name: name,
					nickname : nickname,
					is_delete: 0,
					signup_date:conn.raw("now()"),
					phone : phone,
					platform : platform,
					noti_flag : noti_flag,
					device_id : device_id,
					agree_term_date : conn.raw("now()"),
					last_modify_time : conn.raw("now()"),
					address: address,
					address_detail: address_detail,
				}
			);

			resTxt = "join_complate_using_kakao"
		}
		else{//naver.com
			try{
				data = await axios({
					url :'https://openapi.naver.com/v1/nid/me',
					headers:{
						"Authorization":`Bearer ${access_token}`
					}
				});
			}
			catch(err){
				ctx.body = {"status":"no", "code":3,"text":"access_token_err"};
				return;
			}
			const {email} = data.data.response;
			//mobile, mobile_e164
			if(await accountCheck(email, platform)){
				ctx.body = {"status":"no", "code":2,"text":"email vaild"};
				return;
			}
			const {name} = data.data.response;
			const phone = data.data.response.mobile_e164;
			let signUpUser = await conn("users").insert({
				email: email,
				name: name,
				nickname : nickname,
				is_delete: 0,
				signup_date:conn.raw("now()"),
				phone : phone,
				platform : platform,
				noti_flag : noti_flag,
				device_id : device_id,
				agree_term_date : conn.raw("now()"),
				last_modify_time : conn.raw("now()"),
				address: address,
				address_detail: address_detail,
			});
			resTxt = "join_complate_using_naver"
		}

		ctx.body = {"status":"ok","code":1, "text":resTxt}
	}
	else{
		ctx.body = {"status":"no", "code":-1, "text":"platform not found"}
	}


});

module.exports = router;
