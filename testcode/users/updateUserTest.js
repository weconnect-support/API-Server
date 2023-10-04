import axios from "axios"

const url = "https://api-dev.weconnect.support/users"
const updateUser = async()=>{
	console.log("[!] user Information Update Test!");
	console.log("[+] TEST URL : " + url )
	let d = await axios({
		url :url, 
		method:"PUT", 
		headers:{
			authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoibW9tbyIsImV4cGlyZSI6IjIwMjMtMDktMzBUMTM6MjY6NDguNTg1WiIsImlhdCI6MTY5NjA4MDQwOH0.TLB04FI2t31NI5_A7YHg9cJRexVLNrhPIDlJkN3quRg"
		},
		data : {
			"nickname":"momo"
		}
	})
	console.log(d.data);
	console.log("[+] Done.");
}
updateUser();
