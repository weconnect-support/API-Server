import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.get('/:idx',async(ctx)=>{
	console.log('idx');
	const {idx} = ctx.params;
	const volunteers = await conn("volunteers")
		.join('users','volunteers.user_idx','=','users.idx')
		.select('volunteers.title','volunteers.detail','volunteers.location','users.idx','users.nickname','users.name','users.email')
		.where({"volunteers.is_delete":0});
	const comment = await conn("comment")
		.join('users','comment.user_idx', '=', 'users.idx')
		.select("comment.*", "users.name","users.nickname")
		.where({
			"comment.is_delete":0, 
			"comment.volunteer_idx":idx
		})
	if(volunteers.length == 0){
		ctx.body = {"status":"ok","code":0,"text":"invalid idx"}
	}
	else{
		var decoded;
		var read = 0;
		const {authorization} = ctx.request.header;
		if(tokenCheck(authorization)){
			decoded = 0;
		}
		else{
			decoded = jwt.verify(authorization, jwtKey);
			console.log(decoded);
		}
		for(let i=0;i<comment.length;i++){
			if(decoded != 0){
				console.log(decoded.idx)
				if(decoded.idx != comment[i].user_idx && comment[i].is_protect == 1){
					comment[i].comment = "protect...";
				}
			}
			else{
				comment[i].comment = "protect.."
			}
		}
		ctx.body = {
			"status":"ok",
			"code":1,
			"data":{
				"volunteer":volunteers[0],
				"comments":comment,
			},
			"text":"volunteers data complate"
		}
	}
	///}
});
router.get('/',async(ctx)=>{
	const {idx} = ctx.params;
	const {authorization} = ctx.request.header;
	/*if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		*/
	const volunteers = await conn("volunteers")
		.join('users','volunteers.user_idx','=','users.idx')
		.select('volunteers.title','volunteers.detail','volunteers.location','users.nickname','users.name','users.email')
		.where({"volunteers.is_delete":0});
	if(volunteers.length == 0){
		ctx.body = {"status":"ok","code":0,"text":"invalid data"}
	}
	else{
		ctx.body = {"status":"ok","data":volunteers, "text":"volunteers data complate"}
	}
	//}
});
module.exports = router;


