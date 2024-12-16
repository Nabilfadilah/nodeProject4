const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer') 
const EmployeeModel = require('./Employee')
 
const app = express()
const port = 3001
 
const path = require('path') 
app.use('/static', express.static(path.join(__dirname, 'public')))
 
app.use(cors())
app.use(express.json())
  
main().catch(err => console.log(err));
 
// konek database mongoo
async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/nodeexpressdb', {});
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
}
 
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./public/images")
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  }
})
  
const upload = multer({storage})
 
app.get('/hello', (req, res) => {
  res.send('Hello World!')
})
 
// post image
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.body)
  console.log(req.file)
  return res.json({Status: "Success"});
})
 
// post
app.post('/create', upload.single('file'), (req, res) => {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!req.file) {
        return res.status(400).json({ error: "File upload failed. Please provide a file." });
    }

    EmployeeModel.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.file.filename  // filename dari multer
    })
    .then(user => {
        console.log("Successfully saved to MongoDB:", user);
        res.json(user);
    })
    .catch(err => {
        console.error("Failed to save to MongoDB:", err.message);
        res.status(500).json({ error: err.message });
    });
});

 
// get all 
app.get('/', (req, res) => {
    EmployeeModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
})
 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})