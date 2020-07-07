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
        setTimeout(() => {addAdDetails(); scrape_images();}, 3000);
    }
};

//https://stackoverflow.com/questions/17527713/force-browser-to-download-image-files-on-click/49836565
function download(url, filename) {
    console.log('FETCH: ' + url );
    
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    // get file name - you might need to modify this if your image url doesn't contain a file extension otherwise you can set the file name manually
    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
        canvas.getContext('2d').drawImage(this, 0, 0);
        var blob;
        // ... get as Data URI
        if (image.src.indexOf(".jpg") > -1) {
        blob = canvas.toDataURL("image/jpeg");
        } else if (image.src.indexOf(".png") > -1) {
        blob = canvas.toDataURL("image/png");
        } else if (image.src.indexOf(".gif") > -1) {
        blob = canvas.toDataURL("image/gif");
        } else {
        blob = canvas.toDataURL("image/png");
        }

        const a = document.createElement("a");
        a.href = blob;
        a.download = filename;
        a.style = "width: 50px; height: 30px; display:contents";
        a.textContent = filename + ' ' + url;
        document.body.appendChild(a);
        a.click();

    };
}

function addAdDetails() {
    let desc = document.getElementById("textContent");
    let timestamp = document.querySelector('#offerbottombar .offer-bottombar__item:first-child strong')
    let adId = document.querySelector('#offerbottombar .offer-bottombar__item:last-child strong')

    // add ad desc
    payload = {
        "descr": desc.textContent,
        "postedTimestamp": timestamp.textContent,
        "scraped_images": true
            };

    xhr = new XMLHttpRequest;
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response);
        }
    }
    xhr.onerror = function() {
        console.log(xhr.response);
    }
    xhr.open('PUT','http://localhost:3000/ads/olx' + adId.textContent,true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    try {
        xhr.send(JSON.stringify(payload));
    }
    catch(err){
        console.log(err);
    }
    
}

function scrape_images() {
    let images = document.querySelectorAll("#descGallery a");
    let adId = document.querySelector('#offerbottombar .offer-bottombar__item:last-child strong')

    if (images.length == 0) {
        images = document.querySelectorAll('#descImage img');
    }

    let timeout =  3000 + Math.random() * 1000;
    images.forEach((image, xi) => {
        
        // wait
        timeout = timeout + 500 + Math.random() * 2000;
        setTimeout(function() {
        
            // add image to db
            payload = {
                "fk_olx_ad_id": 'olx' + adId.textContent,
                "image_url": image.hasAttribute('href')?image.href:image.src,
                "image_path": adId.textContent + ' [' + (xi+1) + '].jpg'
                    };

            let xhr = new XMLHttpRequest;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    console.log(xhr.response);

                    if (xi == images.length - 1) {
                        setTimeout(() => {
                        window.close();
                    },3000);
                }
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

            // download images to hdd (maybe download from node.js server?)
            download(image.hasAttribute('href')?image.href:image.src, adId.textContent + ' [' + (xi+1) + '].jpg');

        }, timeout)
    })

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