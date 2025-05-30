const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const yaml = require('js-yaml');
const fs = require('fs');
const app = express();
const cors = require('cors');
const path=require('path');
const config = yaml.load(fs.readFileSync('serviceConfig.yaml', 'utf8'));
const logger = require('./logging'); // Your custom logger

app.use(cors({
  origin: ['http://localhost:3000','https://frontend.localhost'], // Replace with your frontend URL
  credentials: true,
}));

app.set('trust proxy', 1); // Or 'loopback', or true

const cookieParser = require('cookie-parser');
app.use(cookieParser());
require('./utils/secretsLoader');

app.use(express.static(path.join(__dirname, 'public')));

// Setup proxy with error logging
for (const [serviceName, serviceConfig] of Object.entries(config.routes)) {
  const subServices = serviceConfig.subServices;
  const ip = serviceConfig.IP || 'localhost';
  const port = serviceConfig.port;

  console.log(`Setting up proxy for service: ${serviceName} at ${ip}:${port}`);

  for (const [routeName, { route, method }] of Object.entries(subServices)) {
    console.log(`Setting up route for ${serviceName}: ${route} [${method}]`);

    app[method.toLowerCase()](
      route,
      createProxyMiddleware({
        target: `http://${ip}:${port}`,
        changeOrigin: true,
        onError: (err, req, res) => {
          logger.error(`Proxy error for ${route} [${method}] -> ${ip}:${port}: ${err.message}`);
          res.status(500).json({ error: 'Internal proxy error' });
        },
      })
    );
  }
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
