import Router from 'koa-router';
import {domain} from "./serviceURL.js"
const router = new Router();
import {google} from 'googleapis'
import knex from "knex";
import {client, connection} from "../../serverPrivacy.js"
import crypto from "crypto"
const conn = knex({client:client, connection:connection})
router.post('/', async(ctx)=> {
	const {email, password, name, nickname,phone,noti_flag,device_id,address, address_detail} = ctx.request.body;

	let accountCheck = await conn("users").select().where({email:email})
	console.log(accountCheck.length);
	if(accountCheck.length >= 1 ){
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
});

module.exports = router;
