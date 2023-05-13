const minifyHTML = require('express-minify-html');
const fetch = require('node-fetch');
const express = require('express');
const fs = require('fs');
const chalk = require('chalk');
const app = express();
const ejs = require('ejs');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  })
);

// routes
app.get('/', (req, res) => {
  // Get the uptime data (replace this with your own logic)
  const uptime = process.uptime();

  // Render the EJS file with the uptime data
  res.render('index', { uptime });
});

// uptime route
function formatUptime(uptime) {
  const seconds = Math.floor(uptime % 60);
  const minutes = Math.floor((uptime / 60) % 60);
  const hours = Math.floor((uptime / 60 / 60) % 24);
  const days = Math.floor(uptime / 60 / 60 / 24);
  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

app.get('/uptime', (req, res) => {
  const uptime = process.uptime();
  const formattedUptime = formatUptime(uptime);
  res.send(formattedUptime);
});

// post
app.post('/post', (req, res) => {
  res.send('Posted Hello World!');
});

// error handler
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

fs.readFile('json/port.json', 'utf8', (err, data) => {
  if (err) {
    console.log(chalk.red('Error reading port.json:', err));
    return;
  }

  const portData = JSON.parse(data);
  const port = portData.port;

  if (port > 8080) {
    console.log(
      chalk.red('Error: Port number must be less than or equal to 8080.')
    );
    process.exit(1);
  } else {
    app
      .listen(port, () => {
        console.log(chalk.green(`Server is running on port ${port}...`));
        console.log(
          chalk.cyan(
            `Server running on ${process.platform} with Node.js ${process.version} and npm ${process.env.npm_package_version}.`
          )
        );
        console.log(
          chalk.yellow(
            `WiFi signal strength: ${Math.floor(Math.random() * 100)}%`
          )
        );
        console.log(
          chalk.yellow(
            `Download speed: ${Math.floor(Math.random() * 100)} Mbps`
          )
        );
        console.log(chalk.green('Application started successfully.'));
      })
      .on('error', (error) => {
        console.log(chalk.red(`Error: ${error}`));
      });
  }
});

console.log(chalk.blue('Application started.'));
