import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMC0xMVQxNjoyNTowNi4wMjhaIiwiaWF0IjoxNjk3MDQxNTA2fQ.Gp6ETT_YxrntQLaIyN5o3nVFy62uPcCCBKCVeS2JpJ8"
const updateVolunteer = async(idx)=>{
	console.log("[!] update Volunteer TEST!")
	let data = await axios({
		method: 'PUT',
		url: `https://api-dev.weconnect.support/volunteer/${idx}`,
		headers: { 
			'Authorization':jwt 
		},
		data:{
			"title": "api title",
			"detail": "api detail",
			"location": "location",
			"address": "address api",
			"address_detail": "address ddteail api",
			"category": "apicategory",
			"due_date": "2023-10-14",
			"customer_limit": 3,
			"volunteer_limit": 3,
			"deadline": "2023-10-19",
			"is_dead":0
		}
	})
		console.log(data.data);
		console.log("[=] test end..");
}
const test = async()=>{
	await updateVolunteer(1);
}
test();
