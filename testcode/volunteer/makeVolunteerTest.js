import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMC0wOVQwOTo0Mzo0Mi40NjBaIiwiaWF0IjoxNjk2ODQ0NjIyfQ.6iQo7-3odpZJEXpmYfV0bTUGcrVDQTEGj6xAHCZhPhs"
const makeVolunteer = async()=>{
	console.log("[!] Make Volunteer @Volunteer TEST!")
	let data = await axios({
		method: 'POST',
		url: 'https://api-dev.weconnect.support/volunteer',
		headers: { 
			'Authorization':jwt 
		},
		data:{
			"title": "title tett",
			"detail": "detail test",
			"location": "location test",
			"address": "address test",
			"address_detail": "addresss detail",
			"category": "category test",
			"due_date": "2023-10-11",
			"customer_limit": 1,
			"volunteer_limit": 1,
			"deadline": "2023-10-11"
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await makeVolunteer();
}
test();
