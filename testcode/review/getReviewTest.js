import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0wOFQxMToxOTo0My4yNDNaIiwiaWF0IjoxNjk5NDQyMzgzfQ.ufmc1QdIkvG2ZitrO26x6USKKLpc3Kh2Qzfnw2XV8s4"
const getReview = async(idx,review)=>{
	console.log("[!] GET Review @Volunteer TEST!")
	let data = await axios({
		method: 'GET',
		url: `https://api-dev.weconnect.support/volunteer/${idx}/review/${review}`,
		headers: { 
			'Authorization':jwt 
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await getReview(1,1);
}
test();
