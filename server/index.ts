import express, { Request, Response } from 'express';
import { FandomScraper } from 'fandomscraper';

const app = express();
const port = 3000;

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

app.get('/bleh', async (_req: Request, res: Response) => {
  console.log('getting characters');

  const allChars = await getAllChars();
  console.log(allChars);
});
app.get('/charactersFile', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(
      'http://localhost:5173/rickAndMortyCharacters.json',
      {
        headers: {
          'allow-origin': '*',
          'Access-Control-Allow-Origin': '*',
        },
        method: 'GET',
      }
    );
    const { data } = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);

  // const allChars = await getAllChars();
  // console.log(allChars);
});
