const links = [
    "https://www.facebook.com/photo.php?fbid=122174298272795406&set=pb.61573862192594.-2207520000&type=3",
    "https://www.facebook.com/reel/1165898105330696",
    "https://www.facebook.com/photo?fbid=122173087148795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/reel/1195725472013940",
    "https://www.facebook.com/photo?fbid=122171961554795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo?fbid=122171218790795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo?fbid=122171028632795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122170605266795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169880580795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169785528795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169225194795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169028550795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169028310795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169028202795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169028046795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027866795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027770795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027590795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027464795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027308795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122169027122795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956976795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956856795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956676795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956544795406&set=pb.61573862192594.-2207520000",
    "https://www.facebook.com/photo/?fbid=122168956388795406&set=pb.61573862192594.-2207520000"
];

const seen = new Set();
let dups = false;
links.forEach((l, i) => {
    if (seen.has(l)) {
        console.log(`Duplicate found at index ${i}: ${l}`);
        dups = true;
    }
    seen.add(l);
});

if (!dups) console.log("No duplicates found.");
console.log(`Total links: ${links.length}`);
