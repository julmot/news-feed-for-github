/******************************************************
 * GitHub news feed
 * Copyright (c) 2016, Julian Motz
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed
 * with this source code.
 *****************************************************/
"use strict";
class NewsFeedChecker extends NewsFeed {

    constructor(cbnp, cbe) {
        super();

        this.interval = 15000;
        this.cbNewPost = cbnp;
        this.cbErr = cbe;

        this.initialize();
    }

    initialize() {
        setInterval(() => {
            this.fetch();
        }, this.interval);
        this.fetch();
    }

    fetch() {
        this.load((data) => {
            this.checkNewPosts(data);
        }, (error) => {
            this.cbErr(error);
        });
    }

    checkNewPosts(j) {
        let nf = j["feed"][0]["entry"];
        let nfStr = JSON.stringify(nf);
        let savedNfStr = sessionStorage.getItem("newsFeed");
        let savedNf = JSON.parse(savedNfStr);

        if(savedNfStr && savedNfStr !== nfStr) {
            let showStack = [];
            for(let nfPost of nf) {
                // Check if the post is already in the sessionStorage
                let found = false;
                for(let savedNfPost of savedNf) {
                    if(JSON.stringify(savedNfPost) === JSON.stringify(nfPost)) {
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    showStack.push(nfPost);
                }
            }
            if(showStack.length > 0) {
                for(let post of showStack) {
                    this.cbNewPost(post);
                }
            }
        }
        sessionStorage.setItem("newsFeed", nfStr);
    }

}