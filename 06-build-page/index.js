const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const { readdir, readFile, mkdir, rm } = require("fs/promises");

const destAssets = path.join(__dirname, "project-dist", "assets");
const sourceAssets = path.join(__dirname, "assets");

const destStyles = path.join(__dirname, "project-dist", "style.css");
const sourceStyles = path.join(__dirname, "styles");
const outputStyles = fs.createWriteStream(destStyles);

const projectDist = path.join(__dirname, "project-dist");
async function createFolder(dist) {
  try {
    await mkdir(dist, { recursive: true });
    // console.log(`Copied folder is created`);
  } catch (err) {
    console.log(err);
  }
}
createFolder(projectDist);

const readFolder = async () => {
  try {
    const files = await readdir(sourceStyles, { withFileTypes: true });
    files.forEach((file) => {
      if (file.isFile()) {
        const fileName = file.name.toString();
        const extName = file.name.toString().split(".")[1];
        if (extName == "css") {
          fs.readFile(
            path.join(__dirname, "styles", fileName),
            "utf-8",
            (err, data) => {
              if (err) throw err;
              let resultContent = [];
              const styleData = data.toString();
              resultContent.push(styleData);

              for (let i = 0; i < resultContent.length; i++) {
                outputStyles.write(resultContent[i]);
              }
            }
          );
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};
readFolder();

const template = fs.createReadStream(
  path.join(__dirname, "template.html"),
  "utf-8"
);
const htmlFile = fs.createWriteStream(
  path.join(__dirname, "project-dist", "index.html")
);

template.on("data", async (data) => {
  const htmlRes = await createHtml();
  htmlFile.write(htmlRes);

  async function createHtml() {
    let htmlData = data.toString();
    const tags = htmlData.match(/{{[a-zA-Z]*}}/gi);

    for (let tag of tags) {
      const tagsFile = tag.substr(2, tag.length - 4);
      const filePath = path.join(__dirname, "components", `${tagsFile}.html`);
      const component = await readFile(filePath);
      htmlData = htmlData.replace(tag, component.toString());
    }
    return htmlData;
  }
});

fs.access(destAssets, function (error) {
  if (error) {
    copyAssets();
  } else {
    replaceFolderAssets();
  }
});

function copyAssets() {
  createFolder(destAssets);
  copyFiles(sourceAssets, destAssets);
}

async function replaceFolderAssets() {
  await rm(destAssets, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });
  createFolder(destAssets);
  copyFiles(sourceAssets, destAssets);
}


function copyFiles(source, destination) {
  fs.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        const fileName = file.name.toString();
        const sourcePath = path.join(source, fileName);
        const destPath = path.join(destination, fileName);
        if (file.isDirectory()) {
          createFolder(destPath);
          copyFiles(sourcePath, destPath);
        } else if (file.isFile()) {
          fsPromises.copyFile(sourcePath, destPath).catch(function (error) {
            console.log(error);
          });
        }
      });
    }
  });
}
