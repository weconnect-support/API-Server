import axios from 'axios';

const register = async()=>{
	console.log("[!] TEST register start!")
	/*
	{
	"access_token":"AAAANR5lXy6XUAgVZnK74itpV2VHiI3GuimpdX5I7w-2dC5XBP0xhaE-c-DjdgxIlBmsMn-A6DIIAqGql8Sc3HQVZtU",
	"name":"jingeun lee",
	"phone":"+821012341234",
	"nickname":"sori",
	"address":"gogogo",
	"address_detail":"zz",
	"platform":1, // 1 google, 2 kakao, 3 naver
	"device_id":"asdf1234",
	"noti_flag":1
	}
	*/
	let data = await axios(
		{
			url :"https://ss-dev.noe.systems/users/join",
			method : "POST",
			data : 	{
//				"access_token":"AAAANQemzuAttr5z4uW9saHB3yYIhYSGXkUSMAwKKyc77UT9Vt6AxeGRlSWQnt06Mic2EiI8G5GlfciI-L_dApM31BI", //naver token
				"access_token": "ZZlswc0Mnzjt1rArLeCysRR6rzSpvJVuv_bzUhRpCiolUQAAAYqtY5Qf",
				"name":"jingeun",
				"phone":"+821012341234",
				"nickname":"xiaxia",
				"address":"kokookokoko",
				"address_detail":"zz",
				"device_id":"testDevice",
				"platform":2, // 1 google, 2 kakao, 3 naver
				"noti_flag":1
			}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
register();
