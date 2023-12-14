import axios from 'axios';

const myVersion = "1.0";
const t = async()=>{
	let url = "https://ss-dev.noe.systems/getVersion"
	console.log("[!] APP version API Test!")
	console.log(`[+] url : ${url}`);
	let apiData = await axios({url : url, method:"GET"})
	console.log(apiData.data);
	console.log(`[+] My Version : ${myVersion}`);
	console.log(`[+] APP version : ${apiData.data.AppVersion}`)
	console.log(`[*] Version Check...`)
	if(myVersion == apiData.data.appVersion){
		console.log("[*] newest version!!");
	}
	else{
		console.log("[*] update plz..");
	}
	console.log("[!] Test Done....");
}
t();
