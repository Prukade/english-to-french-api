const express = require('express');
const bodyParser = require('body-parser');
const { Translate } = require('@google-cloud/translate');

const credentials = require('./key.json');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const translator = new Translate({
  projectId: credentials.project_id,
  keyFilename: credentials.path,
});

app.post('/translate', async (req, res) => {
  const englishText = req.body.text;

  if (!englishText) {
    return res.status(400).json({ error: 'Missing "text" in request body' });
  }

  try {
    const [translation] = await translator.translate(englishText, 'fr');
    res.json({ translatedText: translation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(port, () => {
  console.log(`Translation API listening on port ${port}`);
});
