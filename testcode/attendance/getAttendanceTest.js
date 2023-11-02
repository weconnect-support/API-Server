import axios from 'axios';

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjUsIm5pY2tuYW1lIjoidGVzdEFQSU5pY2tuYW1lIiwiZXhwaXJlIjoiMjAyMy0xMS0wMlQxMDozMzoxMy41NjJaIiwiaWF0IjoxNjk4OTIxMTkzfQ.AuSMt0smt2dWWG5b7e89t-9JM4UEe53c1LJf_MLIQHk"

const getAttendance = async(idx)=>{
	console.log("[!] Get Attendance log Infomation TEST!")
	let data = await axios(
		{
			url :`https://api-dev.weconnect.support/volunteer/${idx}/attendance`,
			method : "GET",
			headers : {'authorization':jwt}

	})
	console.log(data.data);
	console.log("[=] test end..");
}
getAttendance(10);

