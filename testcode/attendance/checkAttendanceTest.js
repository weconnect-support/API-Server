import axios from 'axios';

const jwt ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0wMlQxMTowOToxNi43MDNaIiwiaWF0IjoxNjk4OTIzMzU2fQ.jh19e3nR6_G4U3U7AqJ5aBGIJ1W-_feXSlfOrAvTDVg"

const checkAttendance = async(idx)=>{
	console.log("[!] Check Attendance Infomation TEST!")
	let data = await axios(
		{
			url :`https://api-dev.weconnect.support/volunteer/${idx}/attendance`,
			method : "POST",
			headers : {'authorization':jwt},
			data : {
				"type":1,
				"coordinate":"22.22,33.44"
			}

		})
	console.log(data.data);
	console.log("[=] test end..");
}
const main = async()=>{
	await checkAttendance(10);
	await checkAttendance(10);
}
main();
