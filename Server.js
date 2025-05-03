const youtubedl = require('youtube-dl-exec');
const express= require('express');
const fs = require('fs');
const app=express();

const cors = require('cors');
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.post('/download', (req, res) => {
    const url= req.body.url;
    console.log(url);
    if (!url) {
        return res.status(400).send('URL is required');
      }
      console.log('Downloading video from URL:', url);
    const outputPath = '.\\presentation\\video1.mp4';
    youtubedl(url, {
        output: outputPath,
        format: 'mp4',
        cookie: './cookies.txt'
      }).then(output => {
        console.log('Downloaded successfully');
         res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.setHeader('Content-Type', 'video/mp4');
        const fileStream = fs.createReadStream(outputPath);
        fileStream.pipe(res);
        fileStream.on('close', () => {
            fs.unlink(outputPath, () => {}); // Optional: delete file after sending
        });
      }).catch(err => {
        console.error('Download failed:', err);
        res.status(500).send('Download failed',);    
      }); // Assuming the URL is sent in the request body
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


