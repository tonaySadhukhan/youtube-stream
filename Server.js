const youtubedl = require('youtube-dl-exec');
const express = require('express');
const fs = require('fs');
const app = express();

const cors = require('cors');
app.use(cors({ origin: '*' }));

// GET route with URL passed as query parameter
app.get('/download', (req, res) => {
  const url = req.query.url;
  console.log('Received URL:', url);

  if (!url) {
    return res.status(400).send('URL is required');
  }

  console.log('Downloading video from URL:', url);
  const outputPath = './presentation/video1.mp4';

  youtubedl(url, {
    output: outputPath,
    format: 'mp4',
    cookies: './cookies.txt'
  }).then(() => {
    console.log('Downloaded successfully');
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    res.setHeader('Content-Type', 'video/mp4');
    const fileStream = fs.createReadStream(outputPath);
    fileStream.pipe(res);
    fileStream.on('close', () => {
      fs.unlink(outputPath, () => {}); // Optional cleanup
    });
  }).catch(err => {
    console.error('Download failed:', err);
    res.status(500).send('Download failed');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
