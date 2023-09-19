import Router from 'koa-router';
const router = new Router();
import {google} from 'googleapis'
import {jwtKey, client, connection} from '../../serverPrivacy.js';
import knex from 'knex';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import axios from 'axios';
const conn = knex({client:client, connection:connection})
import {tokenCheck} from "./tokenCheck.js";
router.put('/', async(ctx)=> {
	const {authorization} = ctx.request.header;
	console.log(ctx.request)
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decode = jwt.verify(authorization, jwtKey);
		var res;
		/*
		var option = ctx.request.body;
		delete option.platform;
		delete option.name;
		*/
		var nick = ctx.request.body.nickname
		var token;
		try{
			res = await conn("users").update({"nickname":nick,"last_modify_time":conn.raw("now()")}).where({idx:decode.idx});
			res = await conn("users").select().where({idx:decode.idx});
			delete res[0].password
			token = jwt.sign({"idx":res[0].idx,"nickname":res[0].nickname,"expire":new Date()},jwtKey);

		}
		catch(e){
			console.log(e);
			ctx.body = {"status":"no","code":-1, "text":""}
		}
		ctx.body = {"status":"ok","code":1,"text":"data_complate","data" : decode, res:res[0],token:token}
	}
})

module.exports = router;
