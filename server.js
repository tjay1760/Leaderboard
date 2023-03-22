const express = require('express');

const app = express();
const open = require('open');

const port = process.env.PORT || 3000;

// your server code here...

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  open(`http://localhost:${port}`); // open the browser
});
