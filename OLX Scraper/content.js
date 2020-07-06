let stopCrawler  = false;

window.onload = function() {
    if(window.location.href.includes("https://www.olx.ro/hobby-sport-turism/biciclete-fitness/biciclete/")) {
        if (!window.location.href.includes("https://www.olx.ro/hobby-sport-turism/biciclete-fitness/biciclete/?search%5Bfilter_float_price%3Afrom%5D=300&search%5Bphotos%5D=1")) {
            // apply filters    
            window.location.href = "https://www.olx.ro/hobby-sport-turism/biciclete-fitness/biciclete/?search%5Bfilter_float_price%3Afrom%5D=300&search%5Bphotos%5D=1";
            return;
        }
        /**
         * at this point, the page is listing bikes (page number is ignored). 
         * 
         * crawl_forward opens every ad and collects the data. At the end of the list, it will navigate
         * to the next page. If the current page contains ads that have been scraped, the function will 
         * return false
         */
        if (!crawl_forward()) return;
    }

    if (window.location.href.includes("https://www.olx.ro/oferta")) {
        /**
         * at this point, the page is showing ad details, with images.
         * 
         * the data is scraped if there is a record in ads table with the adId/URL
         */
        setTimeout(() => {scrape_images();}, 4000);
    }
};

//https://stackoverflow.com/questions/51076581/download-images-using-html-or-javascript
function toDataURL(url) {
    return fetch(url).then((response) => {
            return response.blob();
        }).then(blob => {
            return URL.createObjectURL(blob);
        });
}

// https://stackoverflow.com/questions/51076581/download-images-using-html-or-javascript
async function download(url, filename) {
    const a = document.createElement("a");
    a.href = await toDataURL(url);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function scrape_images() {
    let images = document.querySelectorAll("#descGallery a");
    let desc = document.getElementById("textContent");
    let timestamp = document.querySelector('#offerbottombar .offer-bottombar__item:first-child strong')
    let adId = document.querySelector('#offerbottombar .offer-bottombar__item:last-child strong')

    if (images.length == 0) {
        images = document.querySelectorAll('#descImage img');
    }

    let timeout =  3000 + Math.random() * 1000;
    images.forEach((image, xi) => {
        
        // wait
        timeout = timeout + 500 + Math.random() * 2000;
        setTimeout(function() {
        
            // download images (maybe download from node.js server?)
            download(image.hasAttribute('href')?image.href:image.desc, adId.textContent + ' [' + (xi+1) + '].jpg');

            payload = {
                "fk_olx_ad_id": 'olx' + adId.textContent,
                "image_url": image.hasAttribute('href')?image.href:image.desc,
                "image_path": adId.textContent + ' [' + (xi+1) + '].jpg'
                    };

            const xhr = new XMLHttpRequest;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    console.log(xhr.response);

                    if (xi == images.length - 1) setTimeout(() => {window.close();},3000);
                }
            }
            xhr.onerror = function() {
                console.log(xhr.response);
            }
            xhr.open('POST','http://localhost:3000/images',true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            try {
                xhr.send(JSON.stringify(payload));
            }
            catch(err){
                console.log(err);
            }
        }, timeout)
    })

    console.log(timestamp.textContent + ' ' + adId.textContent);

    

}
/**
 * crawl all ads on this page and navigate forward to next page
 * (the crawler will not continue if an ad is already in the database)
 */
function crawl_forward() {
    let offers_container = document.getElementById("offers_table");

    let offers = offers_container.querySelectorAll("tr.wrap");

    ajaxStoreAd(offers, 0);
}

/**
 * send a POST to db API with the details of an ad
 * @param {HTML objects array} offers
 * @param {integer} index current index in array
 */
function ajaxStoreAd(offers, index) {
    if (stopCrawler) return false;

    let ad = offers[index];
    let title = ad.querySelector("td.title-cell .linkWithHash");
    let price = ad.querySelector("p.price");
    let location = ad.querySelector('.bottom-cell small:first-child');
    let id = ad.querySelector("table").getAttribute("data-id");

    console.log(title.textContent + ' ' + title.href);
    console.log(price.textContent + ' ' + location.textContent + ' ' + id  );

    payload = {
        "adId": 'olx' + id,
        "title": title.textContent,
        "url": title.href,
        "location": location.textContent,
        "price": price.textContent,
        "postedTimestamp": "",
        "active": true
            };


    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response);

            if (xhr.status = 409 && JSON.parse(xhr.response).code == "ER_DUP_ENTRY") {
                // the server has signaled a duplicated ad, meaning that the crawler should stop !?
                // TODO verify above logic when ads start to be reposted

                stopCrawler = true;
                return;
            }

            // open ad page for details and images
            var browser = window.open(title.href);
            
            browser.onunload = function(e) {
                if (e.currentTarget.location.href.includes('https://www.olx.ro/oferta')) 
                    {
                        if (index < offers.length) {
                            // simulate user interaction with random delay
                            let timeout = 3000 + Math.random() * 5000;
                            setTimeout(() => {
                                if (stopCrawler) return false;
                                
                                // crawl next ad on same page
                                stopCrawler = !ajaxStoreAd(offers, index+1);
                                
                            }, timeout);
                        }
                        else
                        {
                            // simulate user interaction with random delay
                            let timeout = 5000 + Math.random() * 15000;
                            setTimeout(() => {
                                if (stopCrawler) return false;
                                
                                // move to next ads listing page
                                window.location.href = document.querySelector('a[data-cy="page-link-next"]').href;
                                
                            }, timeout);

                        }
                    }

            }
        }
    };
    xhr.onerror = function() {
        console.log(xhr.response);
    };
    xhr.open('POST','http://localhost:3000/ads',true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    try {
    xhr.send(JSON.stringify(payload));
    }
    catch(err) {
        console.log(err);
    }

    return true;
}