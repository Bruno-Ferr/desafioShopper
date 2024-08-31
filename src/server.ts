import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { confirmValues, list, upload } from "./controller/billing";
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public');
  },
  filename: function (req, file, cb) {
    const fileName = file.fieldname + "-" + Date.now() + ".jpeg"
    cb(null,  fileName);
    req.body.image = fileName
  }
})
const multe = multer({ storage: storage })

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post('/upload', multe.single('image'), upload)
app.patch('/confirm', confirmValues)
app.get('/:customer_id/list', list)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});