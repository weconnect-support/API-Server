import axios from "axios"

const url = "https://ss-dev.noe.systems/users"
const updateUser = async()=>{
	console.log("[!] user Information Update Test!");
	console.log("[+] TEST URL : " + url )
	let d = await axios({
		url :url, 
		method:"PUT", 
		headers:{
			authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoiYm9ibyIsImV4cGlyZSI6IjIwMjMtMDktMTlUMTc6MTk6NTMuOTU2WiIsImlhdCI6MTY5NTE0Mzk5M30.hYdZQJA1vTHpXdxBuYu0LFbvVcjqCO3l0DoPYpvz1EE"
		},
		data : {
			"nickname":"momo"
		}
	})
	console.log(d.data);
	console.log("[+] Done.");
}
updateUser();
