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
		try{
			res = await conn("users").update({"nickname":nick,"last_modify_time":conn.raw("now()")}).where({idx:decode.idx});
			res = await conn("users").select().where({idx:decode.idx});
		}
		catch(e){
			console.log("asdf");
			console.log(e);
		}
		ctx.body = {"status":"ok","code":1,"text":"dataModify","data" : decode, res:res[0]}
	}
})

module.exports = router;
