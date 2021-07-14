const iq = require("inquirer");
const yt = require("yt-playlist-scraper")
const {playlist} = require("./utils/playlist/playlist")

  iq.prompt({type : "list", message : "choose the type:", name : "action", choices : ["playlist", "video"]})
          .then(async(ans) => {
             if(ans.action == "playlist")
               {
                 await playlist();
               }

             if(ans.action == "video") 
               {
                 console.log("coming soon.....")
               } 

          })
          .catch(err =>{
            if (err.isTtyError) {
                console.log("Prompt couldn't be rendered in the current environment")
              } else {
                console.log(err.message)
              }
          })
       




