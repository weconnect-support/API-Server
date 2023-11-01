import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.get('/wishlist',async(ctx)=>{
	console.log("wishlist");
	const {idx} = ctx.params;
		var decoded;
		var read = 0;
		const {authorization} = ctx.request.header;
		if(tokenCheck(authorization)){
			ctx.body = {"status":"no","code":-1, "text":"invalid token"}
			return;
		}
		else{
			decoded = jwt.verify(authorization, jwtKey);
			let wishlist = await conn("wishlist")
				.join("volunteers", 'wishlist.volunteer_idx','=','volunteers.idx')
				.select()
				.where({
					"wishlist.user_idx":decoded.idx,
				})
				ctx.body = {
					'status' : "ok", 
					"code" : 1,
					"data":{
						"wishlist":wishlist
					},
					"text" : "show_wishlist_complate"
				}
		}
});
module.exports = router;
