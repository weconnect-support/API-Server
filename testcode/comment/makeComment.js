const axios = require('axios');
const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMC0xMlQxNjoyNTo0MS4wMjJaIiwiaWF0IjoxNjk3MTI3OTQxfQ.Lsb9AP21jrlOA3JWNA0bG11NYpl04YlVasKW6_Fda7k" 
const makeComment = async(idx)=>{
	console.log("[!] make Comment test!");
	let data = {
		"comment": "comment test@!@!",
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
