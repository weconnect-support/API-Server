import axios from "axios"

const url = "https://api-dev.weconnect.support/users"
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoiengiLCJleHBpcmUiOiIyMDIzLTEwLTA4VDA4OjAwOjU4LjYyOFoiLCJwbGF0Zm9ybSI6NCwiaWF0IjoxNjk2NzUyMDU4fQ.vwx2_E1TeoWcsa02QI218aQQJunPdbmisVw6bKKn6Ps"
const updateUser = async()=>{
	console.log("[!] user Information Update Test!");
	console.log("[+] TEST URL : " + url )
	let d = await axios({
		url :url, 
		method:"PATCH", 
		headers:{
			authorization :jwt 
		},
		data:{
 			"nickname":"testAPINickname",
			"name" :"testname",
			"phone":"01012341234",
			"address":"api address test",
			"address_detail":"api test address detail",
			"noti_flag":0,
			"device_id":"device_id test",
}
	})
	console.log(d.data);
	console.log("[+] Done.");
}
updateUser();
