import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.delete('/',async(ctx)=>{
	const {authorization} = ctx.request.header;
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		const users = await conn("users").select().where({idx:decoded.idx});
		if(users.length != 1){
			ctx.body = {"status":"no", "code":-1, "text":"invalid user"};
		}
		else{
			const del = await conn("users").update({"is_delete":1, "delete_date":conn.raw("now()")}).where({"idx":users[0].idx})
			ctx.body={"status":"ok","code":1,"text":"user_delete_success"};
		}
	}
});
module.exports = router;


