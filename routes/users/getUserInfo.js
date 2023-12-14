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
			const cjoined = await conn("customer_join")
				.join('volunteers','customer_join.volunteer_idx','=', 'volunteers.idx')
				.select('customer_join.*', 'volunteers.*')
				.where({
					"customer_join.user_idx":decoded.idx,
					"customer_join.is_delete":0
				})
				.orderBy('customer_join.idx','desc')
				console.log("cjoined : ")
				console.log(cjoined)
			const vjoined = await conn("volunteer_join")
				.join('volunteers','volunteer_join.volunteer_idx','=','volunteers.idx')
				.select('volunteer_join.*', 'volunteers.*')
				.where({
					"volunteer_join.user_idx":decoded.idx,
					"volunteer_join.is_delete":0
				})
				.orderBy('volunteer_join.idx','desc')
			const d = new Date()
			var cjoined_passed = []
			var cjoined_apply = []
			var vjoined_passed = []
			var vjoined_apply = []
			for(let i=0;i<cjoined.length;i++) {
				var cmp = new Date(cjoined[i].due_date)
				if(d < cmp) {
					cjoined_apply.push(cjoined[i])
				}
				else{
					cjoined_passed.push(cjoined[i])
				}
			}
			for(let i=0;i<vjoined.length;i++){
				var cmp = new Date(vjoined[i].due_date)
				if(d < cmp){
					vjoined_apply.push(vjoined[i])
				}
				else{
					vjoined_passed.push(vjoined[i])
				}
			}
			ctx.body = {
				"status":"ok",
				"code":1,
				"text":"complate",
				'customer_joined_apply':cjoined_apply,
				'customer_joined_passed':cjoined_passed,
				'volunteer_joined_apply':vjoined_apply,
				'volunteer_joined_passed':vjoined_passed,
				"userInfo":users[0]
			};
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
			const cjoined = await conn("customer_join")
				.join('volunteers','customer_join.volunteer_idx','=', 'volunteers.idx')
				.select('customer_join.*', 'volunteers.*')
				.where({
					"customer_join.user_idx":decoded.idx,
					"customer_join.is_delete":0
				})
				.orderBy('customer_join.idx','desc')
				console.log("cjoined : ")
				console.log(cjoined)
			const vjoined = await conn("volunteer_join")
				.join('volunteers','volunteer_join.volunteer_idx','=','volunteers.idx')
				.select('volunteer_join.*', 'volunteers.*')
				.where({
					"volunteer_join.user_idx":decoded.idx,
					"volunteer_join.is_delete":0
				})
				.orderBy('volunteer_join.idx','desc')
			const d = new Date()
			var cjoined_passed = []
			var cjoined_apply = []
			var vjoined_passed = []
			var vjoined_apply = []
			for(let i=0;i<cjoined.length;i++) {
				var cmp = new Date(cjoined[i].due_date)
				cjoined[i].maked = 0;
				if(cjoined[i].user_idx == decoded.idx){
					cjoined[i].maked = 1;
				}
				if(d < cmp) {
					cjoined_apply.push(cjoined[i])
				}
				else{
					cjoined_passed.push(cjoined[i])
				}
			}
			for(let i=0;i<vjoined.length;i++){
				var cmp = new Date(vjoined[i].due_date)
				vjoined[i].maked = 0;
				if(vjoined[i].user_idx == decoded.idx){
					vjoined[i].maked = 1;
				}

				if(d < cmp){
					vjoined_apply.push(vjoined[i])
				}
				else{
					vjoined_passed.push(vjoined[i])
				}
			}
			const volunteer_joined = {
				cjoined_passed : cjoined_passed,
				cjoined_apply : cjoined_apply,
				vjoined_passed : vjoined_passed,
				vjoined_apply : vjoined_apply
			}
			ctx.body={"status":"ok","code":1,"text":"complate","userInfo":users[0], volunteer_joined};
		}
	}
});
module.exports = router;


