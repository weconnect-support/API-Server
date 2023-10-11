const axios = require('axios');
const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMC0xMVQxNzoxNzowMS4wMjdaIiwiaWF0IjoxNjk3MDQ0NjIxfQ.iGHZ9Uo3pA8bs1i9yGA2cysRMnkgA3vIhsOpp5tRIq4'
const makeComment = async(idx)=>{
	console.log("[!] make Comment test!");
	let data = {
		"comment": "comment test postman",
		"is_protect": 0
	};
	let config = {
		method: 'POST',
		url: `https://api-dev.weconnect.support/volunteer/${idx}/comment`,
		headers: { 
			'Authorization':jwt 
		},
		data : data
	};

	let res = await axios(config)
	console.log(res.data);
	console.log("[!] Done.");
}
const main = async()=>{
	await makeComment(1);
	await makeComment(100);
}
main();
