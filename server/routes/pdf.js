const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/convert', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  if(ext === '.ppt' || ext === '.pptx'){
    // LibreOffice CLI로 PPT → PDF 변환
    exec(`libreoffice --headless --convert-to pdf ${filePath} --outdir uploads/`, (err) => {
      if(err) return res.status(500).send('PPT → PDF 변환 실패');
      const convertedFile = filePath.replace(ext, '.pdf');
      res.download(convertedFile, `${req.file.originalname.split('.')[0]}.pdf`, () => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(convertedFile);
      });
    });
  } else if(ext === '.pdf'){
    res.download(filePath, req.file.originalname, () => fs.unlinkSync(filePath));
  } else {
    res.status(400).send('지원되지 않는 파일 형식');
  }
});

module.exports = router;
