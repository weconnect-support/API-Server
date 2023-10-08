import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoibW9tbyIsImV4cGlyZSI6IjIwMjMtMDktMzBUMTQ6MTU6MjkuMTY1WiIsImlhdCI6MTY5NjA4MzMyOX0.jhq10HQ3C6_5bVTrKZb6-uyktKyItLnYrvKAJldqETs" 
const getUser = async()=>{
	console.log("[!] Get User Infomation TEST!")
	let data = await axios(
		{
			url :"https://api-dev.weconnect.support/users",
			method : "GET",
			headers : {'authorization':jwt}

	})
	console.log(data.data);
	console.log("[=] test end..");
}
const getUserIdx = async(idx)=>{
	console.log("[!] Get User Infomation using idx TEST!")
	let data = await axios(
		{
			url :`https://api-dev.weconnect.support/users/${idx}`,
			method : "GET",
			headers : {'authorization':jwt}

	})
	console.log(data.data);
	console.log("[=] test end..");
}
getUser();
getUserIdx(5);
