import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.post('/:idx/join',async(ctx)=>{
	console.log('idx');
	const {idx} = ctx.params;
	const volunteers = await conn("volunteers")
		.select()
		.where({"volunteers.is_delete":0, "volunteers.idx":idx});
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
		let flag = -1;
		const joinData = {
			user_idx : decoded.idx,
			volunteer_idx : idx,
			attendance : 0,
			is_delete : 0,
			joined_at : conn.raw("now()")
		}
		console.log("@@@@@@@@@@@@@@@@");
		if(type == 1){
			const volunteer_people = await conn("volunteer_join")
				.select('*').
				where({
					"volunteer_idx":idx,
					"user_idx":decoded.idx,
					"volunteer_join.is_delete":0
				})
			if(volunteer_people.length == 0){
				await conn("volunteer_join").insert(joinData)
				flag = 1;
			}
			else{
				flag = 0;
			}

		}
		else if(type==2){
			const customer_people = await conn("customer_join")
				.select('*')
				.where({
					"volunteer_idx":idx,
					"user_idx": decoded.idx,
					"is_delete":0
				})
			if(customer_people.length == 0 ){
				await conn("customer_join").insert(joinData);
				flag = 1;
			}
			else{
				flag = 0;
			}
		}
		else{
			ctx.body = {"status":"no","code":-2,"text":"invalid_parameter_error"}
		}
		if(flag == 1){
			ctx.body = {
				"status":"ok",
				"code":1,
				"text":"volunteers_join_complate"
			}
		}
		else{
			ctx.body = {
				"status":"no",
				"code":-4,
				"text":"joined_user"
			}
		}
	}
});
module.exports = router;


