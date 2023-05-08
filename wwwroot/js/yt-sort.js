
const playlistId = "";
const apiKey = "";
const clientId = "";

const scope = 'https://www.googleapis.com/auth/youtube.force-ssl'; 
const discoveryDocs = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

var items = [];
var steps = [];

var client;
var access_token;
var tokenClient;

function initClient() {
    gapi.client.init({
        'apiKey': apiKey,
        'clientId': clientId,
        'scope': scope,
        'discoveryDocs': [discoveryDocs]
    });
}

function initGis() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        'client_id': clientId,
        'scope': scope,
        'callback': ''
    });

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessTokken({ prompt: '' });
    }
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute(nextPageToken) {
    var params = {
        "maxResults": 50,
        "part": [
            "snippet,contentDetails"
        ],
        "playlistId": playlistId
    };

    if (nextPageToken) {
        params.pageToken = nextPageToken;
    }

    return gapi.client.youtube.playlistItems.list(params)
      .then(function(response) {
          
          for (const item of response.result.items) {
              items.push(item);
          }

          if (response.result.nextPageToken) {
              var nextPageToken = response.result.nextPageToken;
              execute(nextPageToken);
          }
          else {
              console.log("There are " + items.length + " videos in your playlist");
              let emp = "";

              let lis = longestIncreasingSub(items);
              let sortedItems = [...items];

              console.log(items.length + "  " + lis.length + "   " + sortedItems.length);

              let apiCallCounter = 0;

              for (let i = 0; i < items.length; i++) {
                  for (let j = 0; j < lis.length; j++) {
                      if (lis[j].snippet.resourceId.videoId === items[i].snippet.resourceId.videoId) {
                          break;
                      }
                      else {
                          let temp = items[i];

                          oldPos = findElementPosition(sortedItems, items[i]);
                          newPos = findElementPosition(sortedItems, lis[j]);

                          if (lis[j].snippet.title > items[i].snippet.title) {
                              newPos = oldPos < newPos ? newPos - 2 : newPos;

                              ChangeElementPosition(sortedItems, oldPos, newPos);
                              setTimeout(updatePlayListItemPosition, 1000, items[i], newPos);

                              lis.splice(j, 0, temp);

                              apiCallCounter++;
                              break;
                          }
                          else if (j === lis.length - 1) {
                              newPos = oldPos < newPos ? newPos : newPos + 2;

                              ChangeElementPosition(sortedItems, oldPos, newPos);
                              setTimeout(updatePlayListItemPosition, 1000, items[i], newPos);

                              lis.push(temp);

                              apiCallCounter++;
                              break;
                          }
                      }
                  }
              }

              console.log("API calls " + apiCallCounter);              
          }
            },
            function(err) { console.error("Execute error", err); });
}

function updatePlayListItemPosition(item, newPosition) {
    var request = gapi.client.youtube.playlistItems.update({
        "part": "snippet",
        "id": item.id,
        "snippet": {
            "playlistId": item.snippet.playlistId,
            "resourceId": item.snippet.resourceId,
            "position": newPosition
        }
    });

    request.execute(function (response) {
        console.log(response);
    });

} 

function findElementPosition(items, item) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].snippet.resourceId.videoId == item.snippet.resourceId.videoId) return i;
    }
    return -1;
}

function ChangeElementPosition(items, oldPos, newPos) {
    if (oldPos < 0 || oldPos >= items.length || newPos < 0 || newPos >= items.length) {
        return;
    }

    const item = items[oldPos];
    items.splice(oldPos, 1);
    items.splice(newPos, 0, item);
}

function longestIncreasingSub(items) {
    const n = items.length;
    const dp = new Array(n).fill(1);

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (items[i].snippet.title > items[j].snippet.title) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }

    let maxIndex = 0;
    for (let i = 0; i < n; i++) {
        if (dp[i] > dp[maxIndex]) {
            maxIndex = i;
        }
    }

    const subsequence = [];
    let currentLength = dp[maxIndex];
    for (let i = maxIndex; i >= 0; i--) {
        if (dp[i] === currentLength) {
            subsequence.unshift(items[i]);
            currentLength--;
        }
    }

    return subsequence;
}

gapi.load('client', initClient);

