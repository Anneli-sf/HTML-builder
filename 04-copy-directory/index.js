const fs = require("fs");
const path = require("path");
const { mkdir, rm, readdir, copyFile, access } = require("fs/promises");

const source = path.join(__dirname, "files");
const destination = path.join(__dirname, "files-copy");

fs.access(destination, (err) => {
    if (err) {
        createCopyFolder();
    } else {
        replaceCopyFolder();
    }
  });

//удаление папки
async function replaceCopyFolder() {
    await rm(destination, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
    });

    createCopyFolder();
  }

//создание копии папки
async function createCopyFolder() {
  try {
    await mkdir(destination, { recursive: true });
    // console.log(`Copied folder is created`);
  } catch (err) {
    console.log(err);
  }

  copyFiles(source);
}

//чтение содержимого files
async function copyFiles(source) {
  try {
    const files = await readdir(source);
    // console.log(files);
    files.forEach((file) => {
      copyOneFile(file);
    });
  } catch (err) {
    console.error(err);
  }
}

//копирование файла
async function copyOneFile(file) {
  try {
    await copyFile(
      path.join(__dirname, "files", file),
      path.join(__dirname, "files-copy", file)
    );
  } catch (err) {
    console.log("file couldn't be copied");
  }
}


