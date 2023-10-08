import axios from "axios"

const url = "https://api-dev.weconnect.support/users"
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoiengiLCJleHBpcmUiOiIyMDIzLTEwLTA4VDA3OjQ1OjEwLjM0MFoiLCJwbGF0Zm9ybSI6NCwiaWF0IjoxNjk2NzUxMTEwfQ.J_KMJGSi0Aww6oLUosFVbT0q0IPd9hKI8KX_AIjZPn0"
const updateUser = async()=>{
	console.log("[!] user Account PW Update Test!");
	console.log("[+] TEST URL : " + url )
	let d = await axios({
		url :url, 
		method:"PUT", 
		headers:{
			authorization : jwt
		},
		data : {
			"password":"momo"
		}
	})
	console.log(d.data);
	console.log("[+] Done.");
}
updateUser();
