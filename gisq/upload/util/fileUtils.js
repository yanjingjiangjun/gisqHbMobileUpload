
	export function dataURLtoFile(dataurl, filename) { //将base64转换为文件
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, {
			type: mime
		})
	}
	export function readFile(path, entry,callback) {
		if (!!path) {
			var fileReader = new plus.io.FileReader();
			fileReader.onloadend = function(evt) {
				var url = evt.target.result;
				var fileJs = dataURLtoFile(url, entry.name); //转换为js 的file对象 
				var jsBlob = URL.createObjectURL(fileJs);
				if(!!callback){
					callback(fileJs,jsBlob);
				}
			}
			fileReader.readAsDataURL(entry);
		}
	
	}
	export function readLocalFile(path,callback){
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			// 可通过entry对象操作test.html文件 
			readFile(path,entry,callback);
		}, function(e) {
			alert("Resolve file URL failed: " + e.message);
		});
	}

export default {readLocalFile,dataURLtoFile}