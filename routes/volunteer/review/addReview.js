import Router from 'koa-router';
const router = new Router();
import {connection, client,jwtKey} from "../../../serverPrivacy.js";
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.post('/:idx/review', async(ctx) => {
	const {authorization} = ctx.request.header;
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		const {idx} = ctx.request.params
		if(year == undefined || month == undefined ){
			ctx.body = {"status":"ok", "code" : -2, "text": "parameter_validation_error"}
			return;
		}
		try{
			const vschedule = await conn("volunteer_join")
				.join("volunteers", "volunteers.idx","=","volunteer_join.volunteer_idx")
				.select()
				.where({
					"volunteers.is_delete":0,
					"volunteer_join.is_delete":0,
					"volunteer_join.user_idx" : decoded.idx
				})
			const cschedule = await conn("customer_join")
				.join("volunteers", "volunteers.idx","=","customer_join.volunteer_idx")
				.select()
				.where({
					"volunteers.is_delete":0,
					"customer_join.is_delete":0,
					"customer_join.user_idx":decoded.idx
				})
			let flag = 0;
			const {photo, title, contents} = ctx.request.body
			if(!photo || !title){
				ctx.body = {"status":"no", "code": -5, "text" : "parameter_error"}
				return;
			}
			if(vschedule.length != 0){
				flag = 1;
			}
			else if(cschedule.length != 0){
				flag = 2;
			}
			else{
				flag = 0;
			}

			if(flag == 0){
				ctx.body = {status:"no", code:-4,"text":"volunteer_not_found"}
				return;
			}
			const insert = await conn("review")
				.insert({
				volunteer_idx:idx,
				user_idx:decoded.idx,
				title : title,
				contents: contents,
				created_at : conn.raw('now()'),
				modify_time : conn.raw('now()'),
				is_delete : 0,
				delete_at : null,
			})
			for(let i=0;i<photo.length;i++){

			}

			ctx.body = {"status":"ok", "data":{volunteer_schedule:vschedule, customer_schedule:cschedule}, "text":"schedule_complate"};
		}
		catch(e){
			console.log(e)
			ctx.body = {"status":"no","code":-3, "text":"add_review_fail"}
		}
	}
});

module.exports = router;


