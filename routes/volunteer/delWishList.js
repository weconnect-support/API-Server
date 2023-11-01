import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.delete('/:idx/wishlist',async(ctx)=>{
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
		const {authorization} = ctx.request.header;
		if(tokenCheck(authorization)){
			ctx.body = {"status":"no","code":-2, "text":"invalid token"}
			return;
		}
		else{
			decoded = jwt.verify(authorization, jwtKey);
			await conn("wishlist")
				.where({
					"user_idx":decoded.idx,
					"volunteer_idx":idx
				})
				.del()
			ctx.body = {
				"status":"ok",
				"code":1,
				"text":"volunteer_wishlist_delete_complate"
			}
		}
	}
});
module.exports = router;
