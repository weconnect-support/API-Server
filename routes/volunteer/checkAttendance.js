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
		if(type == undefined || coordinate == undefined){
			ctx.body = {"status":"no", "code":-2, "text":"parameter_error"}
			return;
		}
		
		const check = await conn("volunteers")
			.select()
			.where({
				"idx":idx,
				"is_delete":0,
			}).andWhere("due_date", ">",conn.raw("now()"))
		if(check.length == 0 ){
			ctx.body = {"status":"no","code":-3, "text":"invalid_idx"}
		}
		var decoded = jwt.verify(authorization, jwtKey);
		console.log("gogogo")
		var updateFlag = undefined;
		if(type == 1){
			updateFlag = await conn("volunteer_join")
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
			updateFlag = await conn("customer_join")
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
		if(updateFlag == 1){
			ctx.body = {"status":"ok","code":1,"text":"attendance_complate"};
		}
		else{
			ctx.body = {"status":"no","code":-4, "text":"attendance_fail"}
		}
	}
});
module.exports = router;


