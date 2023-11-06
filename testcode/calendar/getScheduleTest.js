import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0wNlQxMzozMzowNi4yNTlaIiwiaWF0IjoxNjk5Mjc3NTg2fQ.Cc_Jtl4cJLCzZbS4-H_v_x4hDVOAfiaTquILGz74VE0" 
const getScheduleTest = async(year,month)=>{
	console.log("[!] Get Schedule TEST!")
	let data = await axios({
		method: 'GET',
		url: `https://api-dev.weconnect.support/calendar/${year}/${month}`,
		headers: { 
			'Authorization':jwt 
		}
	})
	console.log(data.data);
	console.log("[=] test end..");
}
const test = async()=>{
	await getScheduleTest(2023,10);
}
test();
