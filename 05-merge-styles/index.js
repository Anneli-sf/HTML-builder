const fs = require("fs");
const path = require("path");
const { writeFile, readdir, readFile } = require("fs/promises");

const source = path.join(__dirname, "styles");
const destination = path.join(__dirname, "project-dist");
const pathToNewFile = path.join(__dirname, "project-dist", "bundle.css");
const output = fs.createWriteStream(pathToNewFile);

//reade folder STYLES
const readFolder = async () => {
  try {
    const files = await readdir(source, { withFileTypes: true });
    ifCss(files);
  } catch (err) {
    console.log(err);
  }
};

readFolder();

//проход по папке STYLES и проверка файл на CSS
const ifCss = (array) => {
  array.forEach((el) => {
    if (el.isFile()) {
      const fileExtension = path.extname(el.name).split(".")[1];
      fileExtension.match("css") ? readenFile(el.name) : console.log("not css");
    }
  });
};

//read file and push content
const readenFile = async (file) => {
  try {
    const filePath = path.join(__dirname, "styles", file);
    const content = await readFile(filePath, { encoding: "utf8" });
    let resultContent = [];
    resultContent.push(content);

    for (let i = 0; i < resultContent.length; i++) {
        output.write(resultContent[i]);
      }
    
    // console.log(resultContent);
  } catch (err) {
    console.error(err.message);
  }
};
