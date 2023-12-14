import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.post('/:idx/wishlist',async(ctx)=>{
	const {idx} = ctx.params;
	const volunteers = await conn("volunteers")
		.select()
		.where({"is_delete":0, "idx":idx});
	if(volunteers.length == 0){
		ctx.body = {"status":"no","code":-1,"text":"invalid idx"}
		return;
	}
	else{
		var decoded;
		var read = 0;
		const {authorization} = ctx.request.header;
		if(tokenCheck(authorization)){
			ctx.body = {"status":"no","code":-2, "text":"invalid token"}
			return;
		}
		else{
			decoded = jwt.verify(authorization, jwtKey);
			let add = await conn("wishlist")
				.select()
				.where({
					"user_idx":decoded.idx,
					"volunteer_idx":idx
				})
			if(add.length == 0){
				await conn("wishlist")
					.insert({
						"user_idx":decoded.idx,
						"volunteer_idx":idx,
						"created_at":conn.raw("now()")
					})
			}
			else{
				ctx.body = {
					'status' : "no", 
					"code" : -3,
					"text" : "wishlist_add_fail"
				}
				return;
			}
		}
		ctx.body = {
			"status":"ok",
			"code":1,
			"text":"volunteer_wishlist_add_complate"
		}
	}
});
module.exports = router;
