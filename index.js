import { ImagePool } from "@squoosh/lib";
import { cpus } from "os";
import fs from "fs/promises";

let imagePool = new ImagePool(cpus().length);

const dir = "./pathToYourImages";
const filenames = await fs.readdir(dir);
const encodeOptions = {
  mozjpeg: {
    quality: 75,
  },
};

const filePromises = filenames.map(async (filename) => {
  const file = await fs.readFile(`${dir}/${filename}`);
  return file;
});

const files = await Promise.all(filePromises);

for (let [index, file] of files) {
  const image = imagePool.ingestImage(file);
  await image.encode(encodeOptions);
  const rawEncodedImage = await image.encodedWith.mozjpeg;
  fs.writeFile(`./decoded-img/image-${index}.jpg`, rawEncodedImage.binary);
  console.log(`${index}/${filenames.length}`);
}

await imagePool.close();
