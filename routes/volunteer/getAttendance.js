import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.get('/:idx/attendance',async(ctx)=>{
	const {authorization} = ctx.request.header;
	const {idx} = ctx.params
	if(tokenCheck(authorization)){
		ctx.body = {"status":"no","code":-1, "text":"invalid_token"}
		return;
	}
	else{
		const check = await conn("volunteers")
			.select()
			.where({
				"idx":idx,
				"is_delete":0,
			})
		if(check.length == 0 ){
			ctx.body = {"status":"no","code":-2, "text":"invalid_idx"}
		}
		var decoded = jwt.verify(authorization, jwtKey);
		var attendance = await conn("volunteer_join")
			.select()
			.where({
				"volunteer_idx":idx,
				"attendance":1,
				"is_delete":0
			})
	}
	ctx.body = {"status":"ok","code":1,"data":attendance,"text":"show_attendance_complate"};
});
module.exports = router;


