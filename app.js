require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
    const files = await fs.readdirSync("files");
    res.render("index", { files });
});

app.post("/create", async (req, res) => {
    const { title, textarea } = req.body;
    const filename = title.split(" ").join("");
    const createdFile = await fs.writeFileSync(`./files/${filename}.txt`, textarea);
    res.redirect("/");
});

app.get("/file/:filename", async (req, res) => {
    const fileData = await fs.readFileSync(`files/${req.params.filename}`, "utf-8");
    const filename = req.params.filename;
    res.render("read", { fileData, filename });
});

app.get("/edit/:filename", async (req, res) => {
    const filename = req.params.filename;
    const fileData = await fs.readFileSync(`files/${filename}`, "utf-8");
    res.render("edit", { filename, fileData });
});

app.post("/edit", async (req, res) => {
    const { title, oldTitle, textarea } = req.body;

    const rename = await fs.renameSync(`./files/${oldTitle}`, `./files/${title}`);
    const createdFile = await fs.writeFileSync(`./files/${title}`, textarea);
    res.redirect("/");
});

app.get("/delete/:filename", async (req, res) => {
    const deletedFile = await fs.rmSync(`./files/${req.params.filename}`);
    res.redirect("/");
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));