import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0wOFQwNzoyNDoxMC4xMjdaIiwiaWF0IjoxNjk5NDI4MjUwfQ.jDWmr5fDRClqa4Jgkz29RwkX0HDL7aJY9vFp1zOSKsI" 
const deleteReview = async(idx,review)=>{
	console.log("[!] DELETE Review @Volunteer TEST!")
	let data = await axios({
		method: 'DELETE',
		url: `https://api-dev.weconnect.support/volunteer/${idx}/review/${review}`,
		headers: { 
			'Authorization':jwt 
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await deleteReview(1,13);
}
test();
