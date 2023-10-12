const axios = require('axios');
const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMC0xMlQxMzozMjoyMy4wNjVaIiwiaWF0IjoxNjk3MTE3NTQzfQ.bY0joVzW9PoFvcMLP3DI9I6RcIPbQQtPFItmFOiEThM" 
const updateComment = async(idx,commentIdx)=>{
	console.log("[!] delete Comment test!");
	let config = {
		method: 'PUT',
		url: `https://api-dev.weconnect.support/volunteer/${idx}/comment/${commentIdx}`,
		headers: { 
			'Authorization':jwt 
		},
		data : {
			"comment":"comment update"
		}
	};

	let res = await axios(config)
	console.log(res.data);
	console.log("[!] Done.");
}
const main = async()=>{
	await updateComment(1,1);
	await updateComment(100,10);
}
main();
