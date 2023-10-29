import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMC0yOVQxNDo0NDoxNC40ODFaIiwiaWF0IjoxNjk4NTkwNjU0fQ.pIcBiLNUB3dbL20n26Z3wPFFI8xcpBe-5EyAu4G5IOg"


const outVolunteer = async(idx)=>{
	console.log("[!] out Volunteer TEST!")
	let data = await axios({
		method: 'delete',
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
	await outVolunteer(12);//complate
	await outVolunteer(12);//joined_user
}
test();
