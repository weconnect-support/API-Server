import Router from 'koa-router';
import {connection, client,jwtKey} from "../../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.post('/:idx/comment',async(ctx)=>{
	const {authorization} = ctx.request.header;
	const {idx} = ctx.params
	if(tokenCheck(authorization)){
		ctx.body = {"status":"no","code":-1, "text":"invalid_token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		try{
			const {comment,is_protect} = ctx.request.body;
			if(!comment || is_protect == undefined||isNaN(is_protect)){
			ctx.body = {"status":"no","code":-2 ,"text": "parameter_validation_check_error"};
				return;
			}
			//data recv
			const volunteers = await conn("volunteers").select().where({"idx":idx, "is_delete":0})
			if(volunteers.length == 0 ){
				ctx.body = {"status":"no", "code" : -4, "text":"invalid_idx"}
				return;
			}
			await conn("comment").insert({
				"volunteer_idx":idx,
				"user_idx":decoded.idx,
				"created_at":conn.raw("now()"),
				"is_delete":0,
				"delete_time":null,
				"last_modify_time":conn.raw("now()"),
				"is_protect":is_protect,
				"comment":comment
			})
		}
		catch(e){
			ctx.body = {"status":"no","code":-3,"text":"invalid_data"}
		}//catch
		ctx.body = {"status":"ok","code":1,"text":"make_volunteer_comment_complate"}
	}
});
module.exports = router;


