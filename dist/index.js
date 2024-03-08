"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const multer_1 = __importDefault(require("multer"));
const dotenv = __importStar(require("dotenv"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const fs_1 = require("fs");
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const imageStorage = multer_1.default.diskStorage({
    destination: "image-uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + `${file.originalname}.${file.mimetype.split("/")[1]}`);
    },
});
const pdfStorage = multer_1.default.diskStorage({
    destination: "pdf-uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
// @ts-ignore:
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.includes("image/")) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
// @ts-ignore:
const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype.includes("/pdf")) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const imageUpload = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter: imageFileFilter,
});
const pdfUploads = (0, multer_1.default)({ storage: pdfStorage, fileFilter: pdfFileFilter });
app.post("/parser_pdf", pdfUploads.single("file"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const fileName = req.file.filename;
        (0, fs_1.readFile)(`pdf-uploads/${fileName}`, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error("Buffer error");
            }
            yield (0, pdf_parse_1.default)(data).then((data) => {
                res.send(data);
            });
        }));
    }
    else {
        res.send({ message: "No PDF file to save" });
    }
}));
app.post("/store_image", imageUpload.single("file"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        res.send({ message: "Docuemnt saved" });
    }
    else {
        res.send({ message: "No Image file to save" });
    }
}));
const initServer = () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port 8080`);
    });
};
initServer();
