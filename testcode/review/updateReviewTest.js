import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0wOFQxMToxMzozNS40MjlaIiwiaWF0IjoxNjk5NDQyMDE1fQ.626iZFb3vTRwf4AbztYbX6i5P7kIdTjfum543-bsngQ"
const updateReview = async(idx,review)=>{
	console.log("[!] update Review @Volunteer TEST!")
	let data = await axios({
		method: 'PUT',
		url: `https://api-dev.weconnect.support/volunteer/${idx}/review/${review}`,
		headers: { 
			'Authorization':jwt 
		},
		data:{
			"contents":"adafffmzmcvmz"
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await updateReview(1,1);
}
test();
