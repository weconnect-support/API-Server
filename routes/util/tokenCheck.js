import jwt from 'jsonwebtoken';
import {jwtKey} from '../../serverPrivacy.js'
const tokenCheck = (token)=>{
	console.log("tokencheck");
	if(!token){
		return 1;
	}
	const now = new Date();
	var decode;
	try{
		decode = jwt.verify(token, jwtKey);
	}
	catch(e){
		return 1;
	}

	var v  = new Date(decode.expire)
	v.setHours(v.getHours()+1);
	console.log("now ; "+now);
	console.log("t d : "+v);
	if(now > v){//expire
		console.log("ex..");
		return 1;
	}
	else{
		console.log("cc..");
		return 0;
	}
	
}

module.exports = {
	tokenCheck : tokenCheck
}
