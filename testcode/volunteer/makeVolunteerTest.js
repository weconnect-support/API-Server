import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0yMVQwNzoxNDo0Ny4wMTRaIiwiaWF0IjoxNzAwNTUwODg3fQ.79f2e86VtqRGjln9tFvB4ia3mislGRieF5_XIYrFU_g"
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
			"type":1, //1 = volunteer, 2 customer
			"detail": "detail test",
			"location": "location test",
			"address": "address test",
			"address_detail": "addresss detail",
			"category": "art",
			"due_date": "2023-12-20",
			"customer_limit": 1,
			"volunteer_limit": 1,
			"deadline": "2023-12-15",
			"photo":[]
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await makeVolunteer();
}
test();
