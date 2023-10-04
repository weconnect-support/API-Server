import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.get('/:idx',async(ctx)=>{
	console.log("inex");
	const {idx} = ctx.params;
	const {authorization} = ctx.request.header;
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		const volunteers = await conn("volunteers").select().where({idx:idx}).andWhereNot({"is_delete":"1"});
		if(volunteers.length == 0){
			ctx.body = {"status":"ok","code":0,"text":"invalid idx"}
		}
		else{
			ctx.body = {"status":"ok","data":volunteers[0],"text":"volunteers data complate"}
		}
	}
});
router.get('/',async(ctx)=>{
	const {idx} = ctx.params;
	const {authorization} = ctx.request.header;
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		const volunteers = await conn("volunteers").select().where({is_delete:0});
		if(volunteers.length == 0){
			ctx.body = {"status":"ok","code":0,"text":"invalid data"}
		}
		else{
			ctx.body = {"status":"ok","data":volunteers, "text":"volunteers data complate"}
		}
	}
});
module.exports = router;


