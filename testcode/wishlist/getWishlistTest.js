import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0wMVQxNjozOTozNi45NzRaIiwiaWF0IjoxNjk4ODU2Nzc2fQ.iGkJEy-MZrAX4oCscJ83rjz4V1ocRNPVr30afHmnfaA"
const getWishList = async()=>{
	console.log("[!] Get WishList TEST!")
	let data = await axios({
		method: 'GET',
		url: 'https://api-dev.weconnect.support/volunteer/wishlist',
		headers: { 
			'Authorization':jwt 
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await getWishList();
}
test();
