import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoibW9tbyIsImV4cGlyZSI6IjIwMjMtMTAtMDRUMTc6MzY6NTQuODY2WiIsImlhdCI6MTY5NjQ0MTAxNH0.WZsaX4lMiBsbGZ3x1fFUmVNM8L8IAhRyP7FfKyKJYjU"
const getVolunteerInfo = async()=>{
	console.log("[!] Get Volunteer Infomation TEST!")
	let data = await axios({
		method: 'GET',
		url: 'https://api-dev.weconnect.support/volunteer',
		headers: { 
			'Authorization':jwt 
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const getVolunteerInfoIdx = async(idx)=>{
	console.log("[!] Get getVolunteer Infomation using idx TEST!")
	let data = await axios({
		method : "GET",
		url: `https://api-dev.weconnect.support/volunteer/${idx}`,
		headers : {'authorization':jwt}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await getVolunteerInfo();
	await getVolunteerInfoIdx(1);
	await getVolunteerInfoIdx(100);
}
test();
