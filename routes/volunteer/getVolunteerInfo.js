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
		.select('volunteers.*', 'users.nickname','users.name','users.email')
	//'volunteers.idx', 'volunteers.title','volunteers.detail','volunteers.location','volunteers.address','volunteers.address_detail','volunteers.user_idx','users.nickname','users.name','users.email')
		.where({"volunteers.is_delete":0, "volunteers.idx":idx});
	const comment = await conn("comment")
		.join('users','comment.user_idx', '=', 'users.idx')
		.select("comment.*", "users.name","users.nickname")
		.where({
			"comment.is_delete":0, 
			"comment.volunteer_idx":idx
		})
	if(volunteers.length == 0){
		ctx.body = {"status":"ok","code":-1,"text":"invalid idx"}
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
		for(let i=0;i<comment.length;i++){//make protect comment
			console.log(comment[i]);
			if(decoded != 0){
				console.log(decoded.idx)
				if((decoded.idx != comment[i].user_idx && comment[i].is_protect == 1)||(decoded.idx != volunteers[0].user_idx && comment[i].is_protect == 1)){
					comment[i].comment = "protect...";
				}
			}
			else{//user only watch protect comment
				comment[i].comment = "protect.."
			}
		}
		const volunteer_people = await conn("volunteer_join")
			.join('users','volunteer_join.user_idx', '=', 'users.idx')
			.select('volunteer_join.*','users.nickname','users.name','users.email', ).where({
				"volunteer_join.volunteer_idx":idx,
				"volunteer_join.is_delete":0
			})
		const customer_people = await conn("customer_join")
			.join('users','customer_join.user_idx', '=', 'users.idx')
			.select('customer_join.*','users.nickname','users.name','users.email', ).where({
				"customer_join.volunteer_idx":idx,
				"customer_join.is_delete":0
			})
		var joined = 0;
		if(decoded == 0)
			joined = -1;
		else{
			for(let i = 0;i<volunteer_people.length;i++){
				if(volunteer_people[i].user_idx == decoded.idx){
					joined = 1;
					break;
				}
			}
			for(let i=0;i<customer_people.length;i++){
				if(customer_people[i].user_idx == decoded.idx){
					joined = 2;
					break;
				}
			}
		}
		volunteers[0].joined = joined;
		ctx.body = {
			"status":"ok",
			"code":1,
			"data":{
				"volunteer":volunteers[0],
				"comments":comment,
				"current_customer":customer_people.length,
				"customers":customer_people,
				"current_volunteer":volunteer_people.length,
				"volunteers": volunteer_people,
			},
			"text":"volunteers data complate"
		}
	}
	///}
});
router.get('/',async(ctx)=>{
	const {idx} = ctx.params;
	const {authorization} = ctx.request.header;
	var volunteers = await conn("volunteers")
		.join('users','volunteers.user_idx','=','users.idx')
		.select('volunteers.*',/*'volunteers.idx','volunteers.type','volunteers.title','volunteers.detail','volunteers.location',*/'users.nickname','users.name','users.email')
		.where({"volunteers.is_delete":0, });
	if(volunteers.length == 0){
		ctx.body = {"status":"ok","code":0,"text":"invalid data"}
	}
	else{
		console.log(volunteers.length)
		console.log(volunteers[volunteers.length-1])	
		const volunteer_people = await conn("volunteer_join")
			.join('users','volunteer_join.user_idx', '=', 'users.idx')
			.select('volunteer_join.*','users.nickname','users.name','users.email', )
			.where(
				"volunteer_join.volunteer_idx", '<=',volunteers[volunteers.length-1].idx
			).andWhere("volunteer_join.volunteer_idx", '>=',volunteers[0].idx)
			.andWhere("volunteer_join.is_delete",0)
		console.log(volunteer_people);
		const customer_people = await conn("customer_join")
			.join('users','customer_join.user_idx', '=', 'users.idx')
			.select('customer_join.*','users.nickname','users.name','users.email', )
			.where(
				"customer_join.volunteer_idx", '<=',volunteers[volunteers.length-1].idx
			).andWhere("customer_join.volunteer_idx", '>=',volunteers[0].idx)
			.andWhere("customer_join.is_delete",0)

		for(let i = 0; i<volunteers.length;i++){
			volunteers[i].volunteers = []
			volunteers[i].customers = []
		}
		for(let j = 0 ; j< volunteers.length;j++){
			for(let i=0;i<volunteer_people.length;i++){
				if(volunteers[j].idx == volunteer_people[i].volunteer_idx){
					volunteers[j].volunteers.push(volunteer_people[i])
				}
			}
			volunteers[j].current_volunteer = volunteers[j].volunteers.length;
		}
		for(let j = 0 ; j< volunteers.length;j++){
			for(let i=0;i<customer_people.length;i++){
				if(volunteers[j].idx == customer_people[i].volunteer_idx){
					volunteers[j].customers.push(customer_people[i])
				}
			}
			volunteers[j].current_customer = volunteers[j].customers.length;
		}
		ctx.body = {"status":"ok","data":volunteers, "text":"volunteers data complate"}
	}
});
module.exports = router;


