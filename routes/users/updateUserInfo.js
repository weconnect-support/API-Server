import Router from 'koa-router';
const router = new Router();
import {jwtKey, client, connection} from '../../serverPrivacy.js';
import knex from 'knex';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import axios from 'axios';
const conn = knex({client:client, connection:connection})
import {tokenCheck} from "../util/tokenCheck.js";
router.put('/', async(ctx)=> {
	const {authorization} = ctx.request.header;
	if(!ctx.request.body.password){
		ctx.body = {"status":"no","code":-2, "text":"invalid parameter"};
		return;
	}
	if(tokenCheck(authorization)){
		ctx.body = {"status":"no","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decode = jwt.verify(authorization, jwtKey);
		var res;
		var {password} = ctx.request.body
		var token;

		try{
			res = await conn("users").update({
				"password":crypto.createHash('sha512')
				.update(password)
				.digest('hex'),
				"last_modify_time": conn.raw("now()")
			}).where({idx:decode.idx});
			res = await conn("users").select().where({idx:decode.idx, platform:4});
			delete res[0].password
			token = jwt.sign({"idx":res[0].idx,"nickname":res[0].nickname,"expire":new Date(), platform : res[0].platform},jwtKey);

		}
		catch(e){
			ctx.body = {"status":"no","code":-1, "text":"fail.."}
		}
		ctx.body = {"status":"ok","code":1,"text":"modify_complate",token:token}
	}
})
router.patch('/', async(ctx)=> {
	const {authorization} = ctx.request.header;
	const {nickname, name, phone, address, address_detail} = ctx.request.body;
	if(!nickname || !name || !phone || !address || !address_detail){
		ctx.body = {"status":"no","code":-2, "text":"invalid parameter"};
		return;
	}
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decode = jwt.verify(authorization, jwtKey);
		var res;
		var token;
		try{
			res = await conn("users").update({
				"nickname":nickname,
				"name" : name,
				"phone":phone,
				"address":address,
				"address_detail" : address_detail,
				"last_modify_time":conn.raw("now()")
			}).where({idx:decode.idx});
			res = await conn("users").select().where({idx:decode.idx});
			token = jwt.sign({"idx":res[0].idx,"nickname":res[0].nickname,"expire":new Date(),"platform":res[0].platform},jwtKey);

		}
		catch(e){
			console.log(e);
			ctx.body = {"status":"no","code":-1, "text":"fail.."}
		}
		ctx.body = {"status":"ok","code":1,"text":"data_modify_complate",token:token}
	}
})
module.exports = router;
