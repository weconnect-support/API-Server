import Router from 'koa-router';
const router = new Router();
import {connection, client,jwtKey} from "../../../serverPrivacy.js";
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../../util/tokenCheck.js';
import crypto from 'crypto';
import fs from 'fs';
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
		const {photo, contents} = ctx.request.body
		if(!contents || photo == undefined){
			ctx.body = {"status":"no", "code": -5, "text" : "parameter_error"}
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
				.andWhere("volunteers.due_date", "<=",conn.raw("now()"))
			const cschedule = await conn("customer_join")
				.join("volunteers", "volunteers.idx","=","customer_join.volunteer_idx")
				.select()
				.where({
					"volunteers.is_delete":0,
					"customer_join.is_delete":0,
					"customer_join.user_idx":decoded.idx
				})
				.andWhere("volunteers.due_date", "<=",conn.raw("now()"))
			let flag = 0;
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
				contents: contents,
				type : flag,
				created_at : conn.raw('now()'),
				modify_time : conn.raw('now()'),
				is_delete : 0,
			})
			for(let i=0;i<photo.length;i++){
				var buffer = Buffer.from(photo[i], "base64");
				var filename = "review"+insert+"-"+(new Date()+"")
				filename = crypto.createHash("sha256").update(filename).digest('hex')
				fs.writeFileSync(`/home/run/img/${filename}.jpg`, buffer);
				await conn('review_img').insert({
					"review_idx":insert,
					"url":`${filename}.jpg`
				})
			}	

			ctx.body = {"status":"ok","code":1,"text":"volunteer_review_add_complate"};
		}
		catch(e){
			console.log(e)
			ctx.body = {"status":"no","code":-3, "text":"add_review_fail"}
		}
	}
});

module.exports = router;


