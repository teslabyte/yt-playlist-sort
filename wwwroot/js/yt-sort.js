const playlistId = "";
const apiKey = "";
const clientId = "";

var items = [];

function authenticate() {
  return gapi.auth2.getAuthInstance()
      .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
      .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}
function loadClient() {
    gapi.client.setApiKey(apiKey);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
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

              for (const item of items) {
                  emp += item.snippet.title + ";";
              }
              console.log(emp);              
          }
            },
            function(err) { console.error("Execute error", err); });
}

gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: clientId });
});

