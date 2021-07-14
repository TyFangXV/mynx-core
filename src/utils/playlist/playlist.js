const iq = require("inquirer");
const yt = require("yt-playlist-scraper")
const ytdl = require("ytdl-core")
const fs = require("fs");
const path = require("path");
const NodeID3 = require('node-id3');
const imageDataURI = require("image-data-uri");
const {title} = require("../extra/script");

let currentIndex = 0;
let alreadyran = false;
let trackIndex;
let latestname;
let latestPath;


const imageDownload = async(vidname,playListData, path)=>{
   let uri = await imageDataURI.encodeFromURL(playListData.videos[currentIndex].thumbnails.best.url);
   let data = imageDataURI.outputFile(uri, `${path}/.mynxData/${playListData.videos[currentIndex].title}.png`);
   return data;
}

const genScript = (path, data) => {
   if(!fs.existsSync(`${path}/.mynxData/${data.title}.json`))
     {
         fs.writeFileSync(`${path}/.mynxData/${data.title}.json`, JSON.stringify(data));
     }
}




const abort = (path, name)=>{
    fs.rmdirSync(`${path}/.mynxData`);
}
    



    
    var main = async(yt,path,currentIndex) => {
    await downloader(yt,path,currentIndex)
    };
    
    var session = async(yt,path) => {
      main(yt,path,currentIndex);
      currentIndex += 1;
      console.log(currentIndex)
      setTimeout(async()=>{
          if (currentIndex < trackIndex) {
              session();
              if(currentIndex == trackIndex) await fs.rmSync(`${latestPath}/.mynxData`,  { recursive: true });
            }
      }, 5000);
    }

//downloder
const downloader = async(yt,path,currentIndex)=>{
    try {
        //if it ran already it will change the source of data for the variable then download the video
        if(alreadyran)
        {
            let data =  JSON.parse(await fs.readFileSync(`${latestPath}/.mynxData/${latestname}.json`, "utf-8"));
            let vidtitle = title(data.videos[currentIndex].title);  
            ytdl(`https://www.youtube.com/watch?v=${data.videos[currentIndex].id}`).pipe(fs.createWriteStream(`${latestPath}/${data.title}/${vidtitle}.mp3`));
            console.log(`👍${vidtitle}.mp3 `)
        }

        //if it didnt ran then it would take the default source of data then download the video
        if(!alreadyran)
        {
            let data =  JSON.parse(await fs.readFileSync(`${path}/.mynxData/${yt.title}.json`, "utf-8")); 
            let vidtitle = title(data.videos[currentIndex].title);
            ytdl(`https://www.youtube.com/watch?v=${data.videos[currentIndex].id}`).pipe(fs.createWriteStream(`${path}/${data.title}/${vidtitle}.mp3`));
            console.log(`👍${vidtitle}.mp3 `);        
        }
  
    } catch (error) {
        console.log(`👎 ${error.stack}`)
        abort(latestPath, latestname);
    }
}



const playlist = async()=>{
    try {
        let {id} = await iq.prompt({type : "input", message : "Enter playlist id", name : "id"})
        let {path} = await iq.prompt({type : "input", message : "Enter the path to the folder you wanna save the files", name : "path"});
        
        if(!fs.existsSync(`${path}/.mynxData`)) fs.mkdirSync(`${path}/.mynxData`);
        if(fs.existsSync(`${path}/.mynxData`) && fs.statSync(`${path}/.mynxData`).isDirectory())
        {
                let yt_data =  await yt(id);
                genScript(path,yt_data);
                trackIndex = yt_data.videos.length;

                let data =  JSON.parse(await fs.readFileSync(`${path}/.mynxData/${yt_data.title}.json`, "utf-8"));
                fs.mkdirSync(`${path}/${yt_data.title}`);
                session(yt_data,path, currentIndex);
                latestname = yt_data.title;
                alreadyran = true;
                latestPath = path;
            } 

        console.log("song downloading")
    } catch (error) {
        console.log(error)
    }
} 

module.exports = {playlist}

