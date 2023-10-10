import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.put('/:idx',async(ctx)=>{
	const {authorization} = ctx.request.header;
	const {idx} = ctx.params
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid_token"}
		return;
	}
	else{
		
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		try{
			const{
				title,
				detail,
				location,
				address,
				address_detail,
				category,
				due_date,
				customer_limit,//int
				volunteer_limit,//int
				deadline,
				is_dead
			} = ctx.request.body;
			if(!title || !detail || !location || !address || !address_detail || !category || !due_date || ((customer_limit == undefined) || customer_limit <= 0) || ((volunteer_limit == undefined)|| volunteer_limit <= 0) || !deadline || is_dead == undefined || (is_dead != 0 && is_dead != 1)){
				ctx.body = {"status":"no","code":-2 ,"text": "parameter_validation_check_error"};
				return;
			}
			let d = new Date();
			let due = new Date(due_date);
			let dead = new Date(deadline);
			if(!(d < due) || !(d < dead)){
				ctx.body = {"status":"no", "code":-3, "text": "invalid_date"}
				return;
			}

			//data recv
			const volunteers = await conn("volunteers").select().where({"idx":idx,"user_idx":decoded.idx,"is_delete":0});
			if(volunteers.length == 0){
				ctx.body = {"status":"no","code":-5,"text":"invalid_idx"}
				return;

			}
			await conn("volunteers").update({
				"title":title,
				"detail":detail,
				"location":location,
				"address":address,
				"address_detail":address_detail,
				"category":category,
				"due_date":due_date,
				"customer_limit":customer_limit,
				"volunteer_limit":volunteer_limit,
				"deadline": deadline,
				"is_dead": is_dead,
				"delete_time":conn.raw("now()")
			}).where({"idx":idx, "user_idx":decoded.idx})
		}
		catch(e){
			ctx.body = {"status":"no","code":-4,"text":"invalid_data"}
		}//catch
		ctx.body = {"status":"ok","code":1,"text":"update_volunteer_complate"};
	}
});
module.exports = router;


