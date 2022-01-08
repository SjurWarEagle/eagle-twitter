import {Injectable} from '@nestjs/common';
import {promisify} from "promise-callbacks";
import * as moment from 'moment';
import {sortBy, sortedUniq, uniq} from "lodash";
import {UrlList} from "./types/url-list";

require('dotenv').config()

var Twit = require('twit')

var T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
})


@Injectable()
export class AppService {
    async extractImageUrls(screen_name: string): Promise<UrlList> {
        const urls: {url:string,filename:string}[] = [];

        const {get} = promisify.methods(T, ['get']);

        const twitterData = await get('statuses/user_timeline', {
            screen_name: screen_name,
            count: 1000
        });
        // console.log(rc);

        for (let post in twitterData) {
            const url = twitterData[post].entities?.media?.[0].media_url;
            // console.log('rc',rc);
            if (url && url.indexOf('twimg') != -1 && url.indexOf('video') == -1) {
                const filename = this.getCreateDay(twitterData[post]) + '-' + url.substr(url.lastIndexOf('/') + 1);
                // console.log(url + ' -> ' + filename);
                // await request(url).pipe(createWriteStream('images/' + filename));
                urls.push({url:url,filename:filename});
            }
        }

        const rc = new UrlList();
        rc.urls = uniq(urls).sort();
        return rc;
    }

    private getCreateDay(rcElement: any): string {
        const dateOfPost = new Date(rcElement.created_at);
        let formattedDate = (moment(dateOfPost)).format('YYYY-MM-DD')

        return formattedDate;
    }
}
