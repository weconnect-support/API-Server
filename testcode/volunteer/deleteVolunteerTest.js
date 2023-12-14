import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMC0xMFQxODowODozNS44OTlaIiwiaWF0IjoxNjk2OTYxMzE1fQ.bAud0AoJeWcB9ha6cOrKYEOwb5NFN36rpR1vhLpeEkQ" 
const deleteVolunteer = async(idx)=>{
	console.log("[!] delete Volunteer TEST!")
	let data = await axios({
		method: 'delete',
		url: `https://api-dev.weconnect.support/volunteer/${idx}`,
		headers: { 
			'Authorization':jwt 
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await deleteVolunteer(1);
}
test();
