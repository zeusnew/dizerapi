const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow CORS
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Hiru News API! Use /news to fetch the latest news.');
});

// Scrape news from Hiru News
app.get('/news', async (req, res) => {
  const url = 'https://www.hirunews.lk/local-news.php?pageID=1';

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const results = [];

    // Scrape each news article
    $('div.rp-ltsbx').each((i, elem) => {
      const title = $(elem).find('a').attr('title')?.trim();
      const newsUrl = 'https://www.hirunews.lk' + $(elem).find('a').attr('href');
      const imageUrl = $(elem).find('img').attr('src');
      const description = $(elem).find('p').text()?.trim();

      results.push({
        title,
        description,
        image: imageUrl,
        url: newsUrl,
        powered_by: "DIZER",
      });
    });

    res.json(results);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: 'error', message: 'Unable to fetch news.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
