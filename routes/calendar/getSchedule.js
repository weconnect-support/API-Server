import Router from 'koa-router';
const router = new Router();
import {connection, client,jwtKey} from "../../serverPrivacy.js";
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.get('/:year/:month', async(ctx) => {
	const {authorization} = ctx.request.header;
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		const {year, month} = ctx.request.params
		if(year == undefined || month == undefined ){
			ctx.body = {"status":"ok", "code" : -2, "text": "parameter_validation_error"}
			return;
		}
		try{
			var endYear = year;
			var endMonth = parseInt(month)+1;
			if(month == 12){
				endYear = parseInt(year)+1;
				endMonth = 1;
			}
			const vschedule = await conn("volunteer_join")
				.join("volunteers", "volunteers.idx","=","volunteer_join.volunteer_idx")
				.select()
				.where({
					"volunteers.is_delete":0,
					"volunteer_join.is_delete":0
				})
				.andWhere('volunteers.due_date', '>=',`${year}-${month}-01`)
				.andWhere('volunteers.due_date',"<",`${endYear}-${endMonth}-01`)
			const cschedule = await conn("customer_join")
				.join("volunteers", "volunteers.idx","=","customer_join.volunteer_idx")
				.select()
				.where({
					"volunteers.is_delete":0,
					"customer_join.is_delete":0
				})
				.andWhere('volunteers.due_date', '>=',`${year}-${month}-01`)
				.andWhere('volunteers.due_date',"<",`${endYear}-${endMonth}-01`)

			ctx.body = {"status":"ok", "data":{volunteer_schedule:vschedule, customer_schedule:cschedule}, "text":"schedule_complate"};
		}
		catch(e){
			console.log(e)
			ctx.body = {"status":"no","code":-3, "text":"schedule_fail"}
		}
	}
});

module.exports = router;


