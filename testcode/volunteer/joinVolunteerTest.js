import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMC0yOVQxMjoyNzoyOS42ODVaIiwiaWF0IjoxNjk4NTgyNDQ5fQ.f5FXUbg0pczS7wCbz_jkF3sPBVz8UTKl1Upkq6JMets"


const joinVolunteer = async(idx)=>{
	console.log("[!] join Volunteer TEST!")
	let data = await axios({
		method: 'POST',
		url: `https://api-dev.weconnect.support/volunteer/${idx}/join`,
		headers: { 
			'Authorization':jwt 
		},
		data:{
			"type": 1
		}
	})
		console.log(data.data);
		console.log("[=] test end..");
}
const test = async()=>{
	await joinVolunteer(10);//complate
	await joinVolunteer(10);//joined_user
}
test();
