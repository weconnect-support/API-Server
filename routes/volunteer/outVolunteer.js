import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.delete('/:idx/join',async(ctx)=>{
	console.log('idx dleete');
	const {idx} = ctx.params;
	const volunteers = await conn("volunteers")
		.select()
		.where({"is_delete":0, "idx":idx, "is_delete":0, "is_dead":0})
		.andWhere("deadline", ">", conn.raw("now()"));
	if(volunteers.length == 0){
		ctx.body = {"status":"no","code":-1,"text":"invalid idx"}
		return;
	}
	else{
		/*
		 *{ 
			type : int
		  }
		  */
		const {type} = ctx.request.body
		if(type == undefined){
			ctx.body = {"status":"no","code":-2,"text":"invalid_parameter_error"}
			return;
		}
		var decoded;
		var read = 0;
		const {authorization} = ctx.request.header;
		if(tokenCheck(authorization)){
			ctx.body = {"status":"no","code":-3, "text":"invalid_token"}
			return;
		}
		else{
			decoded = jwt.verify(authorization, jwtKey);
			console.log(decoded);
		}
		var flag = 0;
		var update
		if(type == 1){
			update = await conn("volunteer_join")
			.update({
				"is_delete":1,
				"deleted_at":conn.raw("now()"),
			})
			.where({
				"volunteer_idx":idx,
				"user_idx":decoded.idx,
				"is_delete":0,
			})
			flag =1;
		}
		else if(type==2){
			update = await conn("customer_join")
			.update({
				"is_delete":1,
				"deleted_at":conn.raw("now()"),
			})
			.where({
				"volunteer_idx":idx,
				"user_idx":decoded.idx,
				"is_delete":0
			})
			flag = 1
		}
		if(flag){
			if(update == 1){
				ctx.body = {"status" : "ok", "code": 1, "text": "volunteer_signout_complate"}
			}
			else{
				ctx.body = {"status" : "no", "code": -4, "text": "volunteer_not_joined"}
			}
		}
		else{
			ctx.body = {"status":"no", "code":-2, "text":"invalid_parameter_error"}
		}
	}
});
module.exports = router;


