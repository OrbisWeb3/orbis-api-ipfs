import sharp from 'sharp';
import path from 'path';

export default class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(1024, 1024, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);

    return filename;
  }
  static filename() {
    return `test.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}
