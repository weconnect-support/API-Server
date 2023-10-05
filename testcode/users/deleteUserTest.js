import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoibW9tbyIsImV4cGlyZSI6IjIwMjMtMDktMzBUMTQ6MTU6MjkuMTY1WiIsImlhdCI6MTY5NjA4MzMyOX0.jhq10HQ3C6_5bVTrKZb6-uyktKyItLnYrvKAJldqETs"
const delUser = async()=>{
	console.log("[!] Delete User Account TEST!")
	await getUserIdx(5)
	let data = await axios(
		{
			url :"https://api-dev.weconnect.support/users",
			method : "DELETE",
			headers : {'authorization':jwt}

	})
	console.log(data.data);
	console.log("[=] test end..");
}
delUser();
