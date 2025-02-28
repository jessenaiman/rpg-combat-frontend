# RPG Combat Simulator Frontend

This is the frontend for the RPG Combat Simulator, built with Phaser and Webpack.

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Ensure the backend API is running at `http://localhost:8000`.
4. Run `npm start` to start the development server.
5. Open `http://localhost:9000` in your browser.

## Building for Production

Run `npm run build` to create a production build in the `dist/` directory.

## Running Tests

Run `npm test` to execute unit tests with Jest.

## Project Structure

- `src/`: Source files
  - `index.js`: Entry point
  - `scenes/`: Phaser scenes
- `public/`: Public files
  - `index.html`: HTML template
- `webpack.config.js`: Webpack configuration


MIT License

Copyright (c) 2023 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.