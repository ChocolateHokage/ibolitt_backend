import multer from "multer";
import path from "path";

export default function () {
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.resolve("static"));
		},
		filename: (req, file, cb) => {
			if (file?.mimetype.split("/")[0] == "image") {
				cb(null, file.fieldname + "-" + Date.now() + file.originalname.match(/\.[0-9a-z]+$/i)[0]);
			} else {
				cb(null, file.fieldname + file.originalname.match(/\.[0-9a-z]+$/i)[0]);
			}
		},
	})

	return multer({ storage });
}
