import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
const fs = require("fs");
import crypto from 'crypto';
router.post('/',async(ctx)=>{
	console.log("make volunteer");
	const {authorization} = ctx.request.header;
	if(tokenCheck(authorization)){
		ctx.body = {"status":"no","code":-1, "text":"invalid_token"}
		return;
	}
	else {
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		try {
			const {
				type,//int
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
				photo
			} = ctx.request.body;
			if(((type == undefined) || (type>=2 || type<=0))||!title || !detail || !location || !address || !address_detail || !category || !due_date || ((customer_limit == undefined) || customer_limit <= 0) || ((volunteer_limit == undefined)|| volunteer_limit <= 0) || !deadline || photo == undefined){
				ctx.body = {"status":"no","code":-2 ,"text": "parameter_validation_check_error"};
				return;
			}
			let d = new Date();
			let due = new Date(due_date);
			let dead = new Date(deadline);
			if(!(d < due) || !(d < dead)) {
				ctx.body = {"status":"no", "code":-3, "text": "invalid_date"}
				return;
			}
			//data recv
			var now = conn.raw("now()");
			const volunteers = await conn("volunteers").insert({
				"type": type,// 1 = volunteer, 2 customer
				"title" : title,
				"detail" : detail,
				"user_idx" : decoded.idx,
				"location" : location,
				"address" : address,
				"address_detail":address_detail,
				"category":category,
				"is_delete":0,
				"delete_time":null,
				"last_modify_time":now,
				"due_date":due_date,
				"customer_limit":customer_limit,
				"volunteer_limit":volunteer_limit,
				"deadline": deadline,
				"is_dead": 0
			})
			console.log("volunteers : "+volunteers[0]);
			const joinData = {
				user_idx : decoded.idx,
				volunteer_idx : volunteers, // last idx
				attendance : 0,
				is_delete : 0,
				joined_at : now,
			}
			let filename;
			console.log("thisthis");
			for(let i=0;i<photo.length;i++){
				var buffer = Buffer.from(photo[i], "base64");
				filename = volunteers+"-"+(new Date()+"")
				filename = crypto.createHash("sha256").update(filename).digest('hex')
				fs.writeFileSync(`/tmp/${filename}.jpg`, buffer);
				await conn('volunteer_img').insert({
					"volunteer_idx":volunteers,
					"url":`${filename}.jpg`
				})
			}
			//img recv
			if(type == 1){
				await conn("volunteer_join").insert(joinData)
			}
			else{
				await conn("customer_join").insert(joinData)
			}
		}
		catch(e){
			console.log(e);
			ctx.body = {"status":"no","code":-4,"text":"invalid_data"}
			return;
		}//catch
		ctx.body = {"status":"ok","code":1,"text":"make_volunteer_complate"}
	}
});
module.exports = router;


