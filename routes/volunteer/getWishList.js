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
		let volunteer_list = []
		
		for(let i=0;i<wishlist.length;i++){
			volunteer_list.push(wishlist[i].volunteer_idx);
		}
		const volunteer_join = await conn("volunteer_join")
			.join('users','volunteer_join.user_idx', '=', 'users.idx')
			.select('volunteer_join.*','users.nickname','users.name','users.email')
			.where({"volunteer_join.is_delete":0})
			.whereIn("volunteer_join.volunteer_idx", volunteer_list);
		const customer_join = await conn("customer_join")
			.join('users','customer_join.user_idx', '=', 'users.idx')
			.select('customer_join.*','users.nickname','users.name','users.email')
			.where({"customer_join.is_delete":0})
			.whereIn("customer_join.volunteer_idx", volunteer_list);
		for(let i=0;i<wishlist.length;i++){
			wishlist[i].volunteers = [];
			wishlist[i].customers = [];
		}
		for(let j = 0;j< wishlist.length;j++){
			for(let i=0;i<volunteer_join.length;i++){
				if(wishlist[j].volunteer_idx == volunteer_join[i].volunteer_idx){
					wishlist[j].volunteers.push(volunteer_join[i])
				}
			}
			for(let k=0;k<customer_join.length;k++){
				if(wishlist[j].volunteer_idx == customer_join[k].volunteer_idx){
					wishlist[j].volunteers.push(customer_join[k])
				}
			}
			wishlist[j].current_volunteer = wishlist[j].volunteers.length;
			wishlist[j].current_customer = wishlist[j].customers.length;

		}



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
