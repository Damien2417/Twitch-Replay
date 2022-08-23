let m3u8=[];
let isStarted=[];
let check=false;

function logResponse(responseDetails) {
	if(isStarted.includes(responseDetails.tabId)){
		if(responseDetails.url.includes('.ts') & responseDetails.initiator.includes('twitch.tv')){
			console.log(responseDetails);
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
								if(isStarted.includes(tabs[i].id))
									chrome.tabs.sendMessage(tabs[i].id, {method: 'blobs', data:size[tabs[i].id]/1000000, data2:tabs[i].id});
							}
						  });
					});
				}
			});			
		}
	}
}

chrome.webRequest.onResponseStarted.addListener(logResponse,{urls: ['<all_urls>']});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
		m3u8 = [];
	  sendResponse({});
	}
	else if (request.method == 'download'){
		console.log("downloading...");
		m3u8.forEach(function(item){
			if(request.id.replace('video','')==item.id){
				console.log("downloading tabs id "+item.id);
				console.log(item.blobs.length+ " ts parts");
				const newBlob = new Blob(item.blobs)
				const finalFile = new File([newBlob], "video.mp4",{type:'video/mp4'});
				
					
				async function downloadBlob(blob, name, destroyBlob = true) {
				  // When `destroyBlob` parameter is true, the blob is transferred instantly,
				  // but it's unusable in SW afterwards, which is fine as we made it only to download
				  const send = async (dst, close) => {
					dst.postMessage({blob, name, close}, destroyBlob ? [await blob.arrayBuffer()] : []);
				  };
				  // try an existing page/frame
				  const [client] = await self.clients.matchAll({type: 'window'});
				  if (client) return send(client);
				  const WAR = chrome.runtime.getManifest().web_accessible_resources;
				  const tab = WAR?.some(r => r.resources?.includes('assets/downloader.html'))
					&& (await chrome.tabs.query({url: '*://*/*'})).find(t => t.url);
				  if (tab) {
					chrome.scripting.executeScript({
					  target: {tabId: tab.id},
					  func: () => {
						const iframe = document.createElement('iframe');
						iframe.src = chrome.runtime.getURL('assets/downloader.html');
						iframe.style.cssText = 'display:none!important';
						document.body.appendChild(iframe);
					  }
					});
				  } else {
					chrome.windows.create({url: 'assets/downloader.html', state: 'minimized'});
				  }
				  self.addEventListener('message', function onMsg(e) {
					if (e.data === 'sendBlob') {
					  self.removeEventListener('message', onMsg);
					  send(e.source, !tab);
					}
				  });
				}
				downloadBlob(finalFile,"video.mp4", false);
				
				
				
				sendResponse({});

			}
		  });
		  
	}
	else 
	  sendResponse({});
});

const transcode = async (file) => {
  const name = 'video';
  if (! ffmpeg.isLoaded()){
    await ffmpeg.load();
  }
  
  ffmpeg.FS('writeFile', name, await fetchFile(file));
  await ffmpeg.run('-i', name,  'output.mp4');
  const data = ffmpeg.FS('readFile', 'output.mp4');
	return data;
}