import Router from 'koa-router';
const router = new Router();
import {connection, client,jwtKey} from "../../../serverPrivacy.js";
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.put('/:idx/review/:review', async(ctx) => {
	const {authorization} = ctx.request.header;
	if(tokenCheck(authorization)){
		ctx.body = {"status":"no","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		const {idx, review} = ctx.request.params
		const {contents} = ctx.request.body;
		if(idx == undefined || review == undefined ||contents == undefined){
			ctx.body = {"status":"no", "code" : -2, "text": "parameter_validation_error"}
			return;
		}
		try{
			var reviews = await conn('review')
				.update({
					contents : contents,
					modify_time:conn.raw("now()")
				})
				.where({
					user_idx:decoded.idx,
					volunteer_idx:idx,
					idx:review,
					is_delete:0
				})
			console.log(reviews)
			if(reviews== 0){
				ctx.body = {"status":"no","code":-4, "text":"invalid_idx"}
				return;
			}
			ctx.body = {"status": "ok", "code":1, "text":"review_update_complate"}
		}
		catch(e){
			console.log(e)
			ctx.body = {"status":"no","code":-3, "text":"review_update_fail"}
		}
	}
});

module.exports = router;


