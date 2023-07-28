import mime from "mime-types";
import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";

const storage = multer.diskStorage({
  destination: path.resolve(process.cwd() + "/" + "uploads"),
  filename: function (_req, file, cb) {
    const fileName = nanoid(8);
    cb(null, fileName + "." + mime.extension(file.mimetype));
  },
});

export const upload = multer({ storage });
