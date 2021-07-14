const fs = require("fs")
const theForbidden = ["<" , ">", "*", ":", '"', "/", "\\", "|", "?", "*", "//"];


const title = (title)=>{
    let splitWords = title.split("");
    const TitleFilter = (l)=>{
        splitWords.filter((word, i )=>{
            if(splitWords[i] == l){
                splitWords.splice(i, 1)
            }
        });
    }
    theForbidden.forEach(l => {
        if(splitWords.includes(l))
         {
            TitleFilter(l);
            TitleFilter(l);
            TitleFilter(l);
            TitleFilter(l);
         }
    })
    return splitWords.join("");
}


const genScript = (path, data) => {
    if(!fs.existsSync(`${path}/.mynxData/${data.title}.json`))
      {
          fs.writeFileSync(`${path}/.mynxData/${data.title}.json`, JSON.stringify(data));
      }
 }
 
 

module.exports = {title};