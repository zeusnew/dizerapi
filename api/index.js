const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const url = 'https://www.hirunews.lk/local-news.php?pageID=1';
  
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const newsItems = [];

    // Scraping each news item
    $('.lts-cntp').each((i, el) => {
      const title = $(el).find('.rp-hdln').text().trim();
      const description = $(el).find('p').text().trim();
      const newsUrl = $(el).find('a').attr('href');
      const imageUrl = $(el).find('img').attr('src');

      if (title && newsUrl) {
        newsItems.push({
          title: title,
          description: description,
          image: imageUrl ? `https://www.hirunews.lk${imageUrl}` : null,
          news_url: `https://www.hirunews.lk${newsUrl}`,
          source: "Hiru News",
          powered_by: "DIZER",
        });
      }
    });

    // Returning scraped news
    if (newsItems.length > 0) {
      res.status(200).json({ status: 'success', data: newsItems });
    } else {
      res.status(404).json({ status: 'error', message: 'No news articles found.' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
