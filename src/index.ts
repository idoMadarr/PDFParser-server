import express from "express";
import "express-async-errors";
import multer from "multer";
import * as dotenv from "dotenv";
import pdfParser from "pdf-parse";
import { readFile } from "fs";
dotenv.config();

const app = express();
app.use(express.json());

const imageStorage = multer.diskStorage({
  destination: "image-uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + `${file.originalname}.${file.mimetype.split("/")[1]}`
    );
  },
});

const pdfStorage = multer.diskStorage({
  destination: "pdf-uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// @ts-ignore:
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// @ts-ignore:
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype.includes("/pdf")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
});
const pdfUploads = multer({ storage: pdfStorage, fileFilter: pdfFileFilter });

app.post("/parser_pdf", pdfUploads.single("file"), async (req, res, next) => {
  if (req.file) {
    const fileName = req.file.filename;

    readFile(`pdf-uploads/${fileName}`, async (err, data) => {
      if (err) {
        throw new Error("Buffer error");
      }

      await pdfParser(data).then((data) => {
        res.send(data);
      });
    });
  } else {
    res.send({ message: "No PDF file to save" });
  }
});

app.post("/store_image", imageUpload.single("file"), async (req, res, next) => {
  if (req.file) {
    res.send({ message: "Docuemnt saved" });
  } else {
    res.send({ message: "No Image file to save" });
  }
});

const initServer = () => {
  app.listen(8080, () => {
    console.log(`Server started on port 8080`);
  });
};

initServer();
