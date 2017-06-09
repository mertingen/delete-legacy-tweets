//gerekli kütüphaneler ve konfigürasyonlar set ediliyor.
const twitter = require('twit');
const dateTime = require('node-datetime');
const config = require('./config.js')

//config'den gelen keyler ile twitter connection objesi oluşturuluyor.
var T = new twitter({
  consumer_key: config.keys.consumer_key,
  consumer_secret: config.keys.consumer_secret,
  access_token: config.keys.access_token_key,
  access_token_secret: config.keys.access_token_secret
});


//bugünün tarhihi set ediliyor.
const dt = dateTime.create()
//dt.offsetInDays(+1);
var date = dt.format('Y-m-d');
//hangi kelime hakkında, kimin tarafından atılan tweetlerin silineceği set ediliyor.
//keyword boş ise bugünden önce atılan tüm tweetleri siler.
var username = config.twitter.username;
var keyword = config.twitter.keyword;
var tweetCount = config.twitter.count;

//twitter searcy query set ediliyor.
var query = keyword + " from:" + username + " until:" + date;

//tweetler çekiliyor.
T.get('search/tweets', { q: query, count: tweetCount }, function(err, tweets, response) {
  	if (err) console.log(err);
  	//eğer içinde tweet varsa, verilerin içinde dönerek tek tek tweet id'si ile siliniyor.
  	var dataLength = tweets['statuses'].length;
  	if (dataLength > 0){
  		for(var key in tweets['statuses']){
  			T.post('statuses/destroy/:id', { id:  tweets['statuses'][key].id_str}, function (err, data, response) {
		  		if (err) console.log("\n" + tweets['statuses'][key].id_str + " tweet did'nt deleted. ERROR => " + err + "\n");
		  		console.log(tweets['statuses'][key].id_str + " tweet deleted!\n");
			});
  		}
  	} else{
  		console.log("Tweets not found!\n");
  	}
});