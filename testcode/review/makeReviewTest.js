import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0wOFQxMToxMzozNS40MjlaIiwiaWF0IjoxNjk5NDQyMDE1fQ.626iZFb3vTRwf4AbztYbX6i5P7kIdTjfum543-bsngQ"
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
