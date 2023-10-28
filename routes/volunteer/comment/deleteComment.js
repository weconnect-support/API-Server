import Router from 'koa-router';
import {connection, client,jwtKey} from "../../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.delete('/:idx/comment/:commentIdx',async(ctx)=>{
	const {authorization} = ctx.request.header;
	const {idx, commentIdx} = ctx.params
	if(tokenCheck(authorization)){
		ctx.body = {"status":"no","code":-1, "text":"invalid_token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		try{
			//data recv
			const volunteers = await conn("volunteers").select().where({"idx":idx,"is_delete":0});
			if(volunteers.length == 0){
				ctx.body = {"status":"no","code":-3,"text":"invalid_idx"}
				return;
			}
			await conn("comment").update({
				"is_delete":1,
				"delete_time":conn.raw("now()")
			}).where({
				"idx":commentIdx,
				"user_idx":decoded.idx,
				"is_delete":0
			})
		}
		catch(e){
			ctx.body = {"status":"no","code":-2,"text":"invalid_data"}
		}//catch
		ctx.body = {"status":"ok","code":1,"text":"delete_volunteer_comment_complate"};
	}
});
module.exports = router;


