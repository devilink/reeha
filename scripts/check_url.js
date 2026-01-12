const https = require('https');

const url = "https://www.facebook.com/photo.php?fbid=122174298272795406&set=pb.61573862192594.-2207520000&type=3";

console.log(`Checking URL: ${url}`);

https.get(url, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    if (res.statusCode >= 300 && res.statusCode < 400) {
        console.log(`Redirects to: ${res.headers.location}`);
    }
}).on('error', (e) => {
    console.error("Error:", e);
});
