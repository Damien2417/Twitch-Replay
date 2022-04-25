chrome.runtime.onInstalled.addListener(async () => {
  let m3u8=[];
  let isStarted=[];
  let check=false;
  function logResponse(responseDetails) {
	if(isStarted.includes(responseDetails.tabId)){
		if(!responseDetails.initiator.includes('chrome-extension')){
		  console.log(responseDetails);
		  if(responseDetails.url.includes('.ts') & responseDetails.initiator.includes('twitch.tv')){
			  fetch(responseDetails.url)
			  .then(resp => resp.blob())
			  .then(blob => {
				  if(blob.size>1){
					  check=false;
					  m3u8.forEach(function(item){								  
						if(responseDetails.tabId==item.id){
						  check=true;
						  item.blobs.push(blob);
						}
					  });
						if (!check){
							let video = new Object();
							video.id = responseDetails.tabId;
							video.blobs=[];
							video.blobs.push(blob);
							m3u8.push(video);						
						}						
						
						chrome.tabs.query({active: true}, function(tabs){
							let size=[];
							let sizetemp=0;
							m3u8.forEach(function(item){			  
								  item.blobs.forEach(function(item2){			  
									sizetemp+=item2.size;
								  });									  
								  size[item.id]=sizetemp;
								  sizetemp=0;
							  });
							  console.log(m3u8);
							  
							  chrome.tabs.query({}, function(tabs) {
								for (var i=0; i<tabs.length; ++i) {
									chrome.tabs.sendMessage(tabs[i].id, {method: 'blobs', data:size[tabs[i].id]/1000000, data2:tabs[i].id});
								}
							  });
							  
							//chrome.tabs.sendMessage(tabs[0].id, {method: 'blobs', data:size/1000000, data2:tabs[0].id});  
						});
					}
			  });			
		  }		
		}
	}
  }
  
  chrome.webRequest.onResponseStarted.addListener(logResponse,{urls: ['<all_urls>']});
	
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	  console.log(sender);
	if (request.method == 'start'){
		console.log("starting...");
		isStarted.push(sender.tab.id);	
      sendResponse({});
	}
	else if (request.method == 'stop'){
		console.log("stopping...");
		var myIndex = isStarted.indexOf(sender.tab.id);
		if (myIndex !== -1) {
			isStarted.splice(myIndex, 1);
		}
      sendResponse({});
	}
	else if (request.method == 'clean'){
		console.log("cleaning...");
		m3u8.forEach(function(item){								  
			if(sender.tab.id==item.id){
			  item.blobs=[];
			}
		  });
		delete m3u8;
      sendResponse({});
	}
	else if (request.method == 'download'){
		console.log("downloading...");
		
		m3u8.forEach(function(item){
			if(request.id.replace('video','')==item.id){
				console.log("downloading tabs id "+item.id);
				console.log(item.blobs.length+ " .ts parts");
				const newBlob = new Blob(item.blobs)
				const finalFile = new File([newBlob], "video.mp4",{type:'video/mp4'});
				const a = document.createElement("a")
				const url = URL.createObjectURL(finalFile);
				a.href = url;
				a.download = "video.mp4";
				document.body.appendChild(a);
				a.click();
			}
		  });
		  sendResponse({});
	}
    else 
      sendResponse({});
  });
});