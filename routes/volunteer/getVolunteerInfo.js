import Router from 'koa-router';
import {connection, client,jwtKey} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';
import knex from "knex";
import jwt from 'jsonwebtoken';
import {tokenCheck} from '../util/tokenCheck.js';
const conn = knex({client:client, connection:connection});
const randomPick = (arr)=>{
	return arr[Math.floor(Math.random() * arr.length)];
}
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
		const volunteer_img = await conn("volunteer_img")
			.select()
			.where({
				"volunteer_idx":idx
			})
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
		volunteers[0].img = volunteer_img;
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

		var volIdxList = []
		for(let i = 0; i<volunteers.length;i++){
			volunteers[i].volunteers = []
			volunteers[i].customers = []
			volunteers[i].img = -1;
			volunteers[i].imgCnt = 0;
			volIdxList.push(volunteers[i].idx);
		}
		console.log(volIdxList);
		var volImgList = await conn("volunteer_img")
			.select()
			.whereIn("volunteer_idx",volIdxList);
		console.log(volImgList)
		for(let j = 0 ; j< volunteers.length;j++){
			for(let i=0;i<volunteer_people.length;i++){
				if(volunteers[j].idx == volunteer_people[i].volunteer_idx){
					volunteers[j].volunteers.push(volunteer_people[i])
				}
			}
			for(let i=0;i<customer_people.length;i++){
				if(volunteers[j].idx == customer_people[i].volunteer_idx){
					volunteers[j].customers.push(customer_people[i])
				}
			}
			for(let i=0;i<volImgList.length;i++){
				//console.log(`vtidx : ${volunteers[j].idx}`)
				//console.log(`volimglist : ${volImgList[i].volunteer_idx}`)
				if(volunteers[j].idx == volImgList[i].volunteer_idx){
					if(volunteers[j].imgCnt == 0){
						volunteers[j].img = volImgList[i].url;
					}
					volunteers[j].imgCnt += 1;
				}
			}
			if(volunteers[j].imgCnt == 0){
				volunteers[j].img = `categories/${volunteers[j].category}/${randomPick([1,2,3])}.png`
			}
			volunteers[j].current_volunteer = volunteers[j].volunteers.length;
			volunteers[j].current_customer = volunteers[j].customers.length;
		}
		ctx.body = {"status":"ok","data":volunteers, "text":"volunteers data complate"}
	}
});
module.exports = router;


