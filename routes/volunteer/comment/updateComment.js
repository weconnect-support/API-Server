import Router from 'koa-router';
import {connection, client,jwtKey} from "../../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.put('/:idx/comment/:commentIdx',async(ctx)=>{
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
			const{
					comment
			} = ctx.request.body;
			if(!comment){
				ctx.body = {"status":"no","code":-2 ,"text": "parameter_validation_check_error"};
				return;
			}
			//data recv
			const volunteers = await conn("volunteers").select().where({"idx":idx,"is_delete":0});
			if(volunteers.length == 0){
				ctx.body = {"status":"no","code":-4,"text":"invalid_idx"}
				return;
			}
			await conn("comment").update({
				"comment":comment,
				"last_modify_time" : conn.raw("now()"),
			}).where({
				"idx":commentIdx,
				"user_idx":decoded.idx
			})
		}
		catch(e){
			ctx.body = {"status":"no","code":-3,"text":"invalid_data"}
		}//catch
		ctx.body = {"status":"ok","code":1,"text":"update_volunteer_comment_complate"};
	}
});
module.exports = router;


