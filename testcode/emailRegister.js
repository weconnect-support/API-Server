import axios from 'axios';

const register = async()=>{
	console.log("[!] TEST register start!")
	/*
	{
	"email":"sori@email.com",
	"password":"z",
	"name":"jingeun",
	"phone":"+821012341234",
	"nickname":"xiaxia",
	"address":"kokookokoko",
	"address_detail":"zz",
    	"platform":4,
	"noti_flag":1
	}
	*/
	let data = await axios(
		{
			url :"https://ss-dev.noe.systems/users/join",
			method : "POST",
			data : 	{
				"email":"sori@eemail.com",
				"password":"z",
				"name":"jingeun",
				"phone":"+821012341234",
				"nickname":"xiaxia",
				"address":"kokookokoko",
				"address_detail":"zz",
				"device_id":"testdevice",
			    	"platform":4,
				"noti_flag":1
			}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
register();
