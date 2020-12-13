const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

//----------------------MULTER CONFIG-------------------------------
const storage = multer.diskStorage({
  //these functions will be executed whenever a file is recieved
  destination: function (req, file, cb) {
    //configure where the file will be stored
    cb(null, './uploads/'); /* process.env.REACT_APP_API */
  },
  filename: function (req, file, cb) {
    //configure the name of the file that is stored
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});
//filter the files you want to store
const multerFilter = (req, file, cb) => {
  const allowedExtentions = /jpg|png|gif/;
  //check if file ext is one of the allowed
  const extention = allowedExtentions.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (file.mimetype.startsWith('image') && extention) {
    cb(null, true);
  } else {
    cb('not an image', false);
  }
};
const upload = multer({ storage: storage, fileFilter: multerFilter });
//-------------------------------------------------------------------

app.get('/', (req, res) => {
  res.send('you are at home');
});

//image is the key name if you try it with postman
//or the first argument if you create FormData() like so:
//fd.append('image', image_file, image_name);
app.post('/', upload.single('image'), (req, res) => {
  try {
    console.log('req.file: ', req.file);
    res.status(400).json({
      message: 'File upload success',
    });
  } catch (err) {
    console.log('Error uploading file ' + err);
    res.status(500).json({
      message: 'File upload failed',
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}...`);
});
