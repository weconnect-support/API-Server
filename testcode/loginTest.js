import axios from 'axios';

const slogin = async()=>{
	console.log("[!] TEST Social Login Start!")
	let data = await axios(
		{
			url :"https://ss-dev.noe.systems/users/login",
			method : "POST",
			data : 	{
				"access_token": "ZZlswc0Mnzjt1rArLeCysRR6rzSpvJVuv_bzUhRpCiolUQAAAYqtY5Qf",
				"platform":2, // 1 google, 2 kakao, 3 naver
			}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const login = async()=>{
	console.log("[!] TEST email Login Start!")
	let data = await axios(
		{
			url :"https://ss-dev.noe.systems/users/login",
			method : "POST",
			data : 	{
				"email":"admin@sori",
				"password":"z",
				"platform":4, //4 email
			}
	})
	console.log(data.data);
	console.log("[=] test end..");
}

const test = async()=>{
	await slogin();
	await login();
}
test();
