import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.post('/:idx/attendance',async(ctx)=>{
	const {authorization} = ctx.request.header;
	const {idx} = ctx.params
	if(tokenCheck(authorization)){
		ctx.body = {"status":"no","code":-1, "text":"invalid_token"}
		return;
	}
	else{
		const {type,coordinate} = ctx.request.body;
		if(type == undefined){
			ctx.body = {"status":"no", "code":-2, "text":"parameter_error"}
		}
		var decoded = jwt.verify(authorization, jwtKey);
		console.log("gogogo")
		if(type == 1){
			await conn("volunteer_join")
				.update({
					"coordinate":coordinate,
					"attendance":1,
					"attendance_time":conn.raw("now()")
				})
				.where({
					"volunteer_idx":idx,
					"attendance":0,
					"is_delete":0
				})
		}
		else if(type == 2){
			await conn("customer_join")
				.update({
					"coordinate":coordinate,
					"attendance":1,
					"attendance_time":conn.raw("now()")
				})
				.where({
					"type":type,
					"volunteer_idx":idx,
					"attendance":0,
					"is_delete":0
				})
		}
		else{
			ctx.body = {"status":"no", "code": -2,"text":"parameter_error" }
			return;
		}
//		const check = await conn("")
		ctx.body = {"status":"ok","code":1,"text":"attendance_complate"};
	}
});
module.exports = router;


