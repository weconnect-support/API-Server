import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMC0xM1QyMDozODoyMi41NzJaIiwiaWF0IjoxNjk3MjI5NTAyfQ.h5G5kbYY-xcWljk4ewkAxcQkLvRIDMs5sAL1sHjnIsw"
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
			"category": "category test",
			"due_date": "2023-10-20",
			"customer_limit": 1,
			"volunteer_limit": 1,
			"deadline": "2023-10-15"
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await makeVolunteer();
}
test();
