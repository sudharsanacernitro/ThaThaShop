const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const yaml = require('js-yaml');
const fs = require('fs');
const app = express();

const config = yaml.load(fs.readFileSync('serviceConfig.yaml', 'utf8'));

const cors = require('cors');

app.use(cors({ origin: 'http://localhost:3000' ,
              credentials: true, 
                }));

require('./utils/secretsLoader');

for (const [serviceName, serviceConfig] of Object.entries(config.routes)) {
  const subServices = serviceConfig.subServices;
  
  console.log(`Setting up proxy for service: ${serviceName} on port ${serviceConfig.port}`);

  for (const [routeName, { route, method }] of Object.entries(subServices)) {
    console.log(`Setting up route for ${serviceName}: ${route} with method ${method}`);

    app[method.toLowerCase()](
      route,
      createProxyMiddleware({
        target: `http://localhost:${serviceConfig.port}`, 
        changeOrigin: true,
      })
    );
  }
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
