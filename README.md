# yt-playlist-sort  
yt-playlist-sort is a simple JavaScript program that sorts a YouTube playlist in alphabetical order with the least possible credits/quota. The program uses the Longest Increasing Subsequence (LIS) algorithm to find the videos in the playlist that don't need to be moved, reducing the number of API requests required to sort the playlist.  
# **How it works**

The program first retrieves the video IDs of all the videos in the playlist using the YouTube Data API. It then uses the LIS algorithm to find the longest increasing subsequence of video IDs, which represents the videos that are already in alphabetical order and don't need to be moved.

The program then retrieves the video details for the remaining videos in the playlist and sorts them alphabetically. It then inserts the sorted videos into the playlist, preserving the order of the LIS.  
# **How to use**  
 - Update playlistId, apiKey and clientId values in `yt-sort.js`  
 - Run the program (i used Visual Studio)
 - Click `Initialize Gapi` button
 - Click `Initialize GIS` button
 - Click `Run` button  
# Note  
You will run out of quota after around 200 requests. That is normal because the update request costs 50 credits and Youtube allows 10000 credits a day.
