const fs = require("fs");
// const { stat, readdir } = require("fs/promises");
const path = require("path");


const folderWay = path.join(__dirname, "secret-folder");

fs.readdir(folderWay, { withFileTypes: true }, (err, files) => {
  if (err) console.log("ERROR", err);
  
  else
    files.forEach((el) => {
      if (el.isFile()) {
        const fileName = el.name.split(".")[0];
        const fileExtension = path.extname(el.name).split(".")[1];
        // console.log("full file name", el.name);

        const fileWay = path.join(__dirname, "secret-folder", el.name);
        fs.stat(fileWay, (err, stats) => {
          if (err) {
            console.log("ERROR", err);
          }
          console.log(`${fileName} - ${fileExtension} - ${stats.size}b`);
        });
      }
    });
});
