import express from "express";
import "express-async-errors";
import multer from "multer";
import * as dotenv from "dotenv";
import pdfParser from "pdf-parse";
import { readFile } from "fs";
dotenv.config();

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadDest = multer({ storage });

app.post("/parser", uploadDest.single("file"), async (req, res, next) => {
  if (req.file?.mimetype.includes("/pdf")) {
    const fileName = req.file.filename;

    readFile(`uploads/${fileName}`, async (err, data) => {
      if (err) {
        throw new Error("Buffer error");
      }

      await pdfParser(data).then((data) => {
        res.send(data);
      });
    });
  } else {
    res.send({ message: "Docuemnt saved" });
  }
});

const initServer = () => {
  app.listen(8080, () => {
    console.log(`Server started on port 8080`);
  });
};

initServer();
