import multer from 'multer';
import dotenv from "dotenv";

dotenv.config();

// multer image Upload Functions
const imgConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads");
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
});
//img filter
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true)
    } else {
        callback(null, Error("only image is allowed"))
    }
}
var upload = multer({
    storage: imgConfig,
    fileFilter: isImage
})

export const testRoute = async (req, res, next) => {
    console.log('hit')
};
export const getTest = async (req, res, next) => {
    console.log('hit')
};