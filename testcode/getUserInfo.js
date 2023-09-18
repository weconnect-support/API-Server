import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoi7YWM7Iqk7Yq4MSIsImV4cGlyZSI6IjIwMjMtMDktMThUMTQ6NDI6NDguNDkzWiIsImlhdCI6MTY5NTA0ODE2OH0.WD2PeaQCcTLygtLthJvWjy58yR1PFOCshRfiSEUlxgo"
const getUser = async()=>{
	console.log("[!] Get User Infomation TEST!")
	let data = await axios(
		{
			url :"https://ss-dev.noe.systems/users",
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
			url :`https://ss-dev.noe.systems/users/${idx}`,
			method : "GET",
			headers : {'authorization':jwt}

	})
	console.log(data.data);
	console.log("[=] test end..");
}
getUser();
getUserIdx(5);
