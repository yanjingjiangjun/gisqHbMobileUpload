
export function getDeviceInfo(callback){
	console.log("call getDeviceInfo success" )
	if(!!callback) plus.device.getInfo({
		success:function(e){
			callback(e);
		},
		fail:function(e){
			callback(e);
		}
	});
}
export default {getDeviceInfo};