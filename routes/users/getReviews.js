import Router from 'koa-router';
const router = new Router();
import {connection, client,jwtKey} from "../../serverPrivacy.js";
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.get('/:idx/review', async(ctx) => {
	const {idx} = ctx.request.params
	try{
		var reviews = await conn('review')
			.select()
			.where({
				user_idx:idx,
				is_delete:0
			});
		if(reviews.length == 0){
			ctx.body = {"status":"no", "code" : -2, "text": "invalid_idx"}
			return;
		}
	}
	catch(e){
		ctx.body = {"status":"no", "code":-1,"text":"get_review_list_fail"};
		console.log(e);
		return;
	}

	ctx.body = {
		"status":"ok",
		"code":1,
		"reviews":reviews, 
		"text":"get_review_list_complate"
	};
})
router.get('/:idx/review/:review', async(ctx) => {
	const {authorization} = ctx.request.header;
	if(tokenCheck(authorization)){
		ctx.body = {"status":"no","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		const {idx, review} = ctx.request.params
		if(idx == undefined || review == undefined ){
			ctx.body = {"status":"no", "code" : -2, "text": "parameter_validation_error"}
			return;
		}
		try{
			var reviews = await conn('review')
				.select()
				.where({
					user_idx:idx,
					idx:review,
					is_delete:0
				})
			if(reviews.length == 0){
				ctx.body = {"status":"no","code":-4, "text":"invalid_idx"}
				return;
			}
			var img = await conn('review_img')
				.select()
				.where({
					review_idx:review
				})
			reviews[0].img = img;
			ctx.body = {"status": "ok", "code":1, "review":reviews[0], "text":"review_show_complate"}
		}
		catch(e){
			console.log(e)
			ctx.body = {"status":"no","code":-3, "text":"review_show_fail"}
		}
	}
});

module.exports = router;


