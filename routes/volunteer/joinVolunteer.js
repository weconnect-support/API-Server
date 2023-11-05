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
		.where({"volunteers.is_delete":0, "volunteers.idx":idx, "is_dead":0})
		.andWhere("deadline", ">", conn.raw("now()"))
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
		var joinFlag = 0;
		const volunteer_people = await conn("volunteer_join")
			.select('*').
			where({
				"volunteer_idx":idx,
				//"user_idx":decoded.idx,
				"volunteer_join.is_delete":0
			})
		const customer_people = await conn("customer_join")
			.select('*')
			.where({
				"volunteer_idx":idx,
				"is_delete":0
			})
		for(let i=0;i<volunteer_people.length;i++){
			if(volunteer_people[i].user_idx == decoded.idx){
				joinFlag = 1;
				break;
			}
		}

		for(let i=0;i<customer_people.length;i++){
			if(customer_people[i].user_idx == decoded.idx){
				joinFlag = 1;
				break;
			}
		}
		const joinData = {
			user_idx : decoded.idx,
			volunteer_idx : idx,
			attendance : 0,
			is_delete : 0,
			joined_at : conn.raw("now()")
		}
		if(joinFlag == 1){
			ctx.body = {
				"status":"no",
				"code":-4,
				"text":"joined_user"
			}
			return;
		}
		if(type == 1){
			const volunteer_limit = volunteers[0].volunteer_limit
			for(let i=0;i<volunteer_people.length;i++){
				if(volunteer_people[i].user_idx == decoded.idx){
					joinFlag = 1;
					break;
				}
			}
			console.log("join flag = "+ joinFlag)
			if(volunteer_people.length >= volunteer_limit){
				ctx.body = {"status":"no", "code":-5, "text":"volunteer_people_queue_full"}
				return;

			}
			if(!joinFlag){
				await conn("volunteer_join").insert(joinData)
				flag = 1;
			}
			else{
				flag = 0;
			}

		}
		else if(type==2){
			const customer_limit = volunteers[0].customer_limit
			for(let i=0;i<customer_people.length;i++){
				if(customer_people[i].user_idx == decoded.idx){
					joinFlag = 1;
					break;
				}
			}

			if(customer_people.length >= customer_limit ){
				ctx.body = {"status":"no", "code":-5, "text":"volunteer_people_queue_full"}
				return;
			}
			if(!joinFlag){
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
	}
});
module.exports = router;


