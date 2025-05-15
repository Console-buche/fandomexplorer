import express, { Request, Response } from 'express';
import { FandomScraper } from 'fandomscraper';

const app = express();
const port = 3000;

// TODO: use scaper, more universes!
async function getAllChars() {
  const scraper = new FandomScraper({ name: 'dragon-ball', language: 'en' });
  const allChars = await scraper.getAll();

  return allChars;
}

app.get(
  '/characters',
  async (_req: Request<{ page: number }>, res: Response) => {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${_req.query.page}`,
        {
          headers: {
            'allow-origin': '*',
            'Access-Control-Allow-Origin': '*',
          },
          method: 'GET',
        }
      );
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);
});
