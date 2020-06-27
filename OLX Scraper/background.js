console.log("OLX Scraper background.js")

chrome.storage.sync.get("scrape_olx", function(data){
    if (data["scrape_olx"]){

    //https://stackoverflow.com/questions/26517988/unchecked-runtime-lasterror-while-running-tabs-executescript/45603880#45603880
        chrome.tabs.onUpdated.addListener(function(id, info, tab){
            chrome.pageAction.show(tab.id);
            chrome.tabs.executeScript(null, {"file": "content.js"}, _=>{
                let e = chrome.runtime.lastError;
                if (e != undefined) {
                    console.log(tab, _, e);
                }
            });
        });
    }
  });

