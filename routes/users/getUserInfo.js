import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
router.get('/:idx',async(ctx)=>{
	console.log("idx");
	const {idx} = ctx.params;
	const {authorization} = ctx.request.header;
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		const users = await conn("users").select().where({idx:idx,is_delete:0});
		if(users.length != 1){
			ctx.body = {"status":"no", "code":-1, "text":"invalid user"};
		}
		else{
			delete users[0].password;
			delete users[0].is_delete;
			delete users[0].delete_date;
			ctx.body={"status":"ok","code":1,"text":"complate","userInfo":users[0]};
		}
	}
});

router.get('/',async(ctx)=>{
	const {authorization} = ctx.request.header;
	console.log(ctx.request)
	if(tokenCheck(authorization)){
		ctx.body = {"status":"ok","code":-1, "text":"invalid token"}
		return;
	}
	else{
		var decoded = jwt.verify(authorization, jwtKey);
		console.log(decoded);
		const users = await conn("users").select().where({idx:decoded.idx, is_delete:0});
		if(users.length != 1){
			ctx.body = {"status":"no", "code":-1, "text":"invalid user"};
		}
		else{
			delete users[0].password;
			delete users[0].is_delete;
			delete users[0].delete_date;
			ctx.body={"status":"ok","code":1,"text":"complate","userInfo":users[0]};
		}
	}
});
module.exports = router;


