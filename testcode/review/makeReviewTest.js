import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0wN1QxMzoyNzoyMC42MjZaIiwiaWF0IjoxNjk5MzYzNjQwfQ.PuTm54hXGWokPLLY71xJ53R9FJk6JSfEBTGaoue9fH4"
const img = 'WQ=='
const makeReview = async(idx)=>{
	console.log("[!] Make Review @Volunteer TEST!")
	let data = await axios({
		method: 'POST',
		url: `https://api-dev.weconnect.support/volunteer/${idx}/review`,
		headers: { 
			'Authorization':jwt 
		},
		data:{
			'contents':"test contents",
			'photo':[img]
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await makeReview(1);
}
test();
