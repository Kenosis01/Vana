const http = require('http');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

async function testServer() {
  console.log(`${colors.blue}Starting Vana web server test...${colors.reset}`);
  
  // Start the server in the background
  console.log(`${colors.yellow}Starting the server...${colors.reset}`);
  const serverProcess = exec('node server.js', { cwd: __dirname });
  
  // Give the server some time to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Test the health endpoint
    console.log(`${colors.yellow}Testing health endpoint...${colors.reset}`);
    const healthResponse = await makeRequest('http://localhost:5000/api/health');
    
    if (healthResponse.status === 'ok') {
      console.log(`${colors.green}Health endpoint test passed!${colors.reset}`);
    } else {
      console.log(`${colors.red}Health endpoint test failed!${colors.reset}`);
      console.log(healthResponse);
    }
    
    // Test the generate endpoint
    console.log(`${colors.yellow}Testing generate endpoint...${colors.reset}`);
    const generateResponse = await makeRequest('http://localhost:5000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: 'Create a simple landing page' })
    });
    
    if (generateResponse.success) {
      console.log(`${colors.green}Generate endpoint test passed!${colors.reset}`);
      console.log(`${colors.blue}Generated ${generateResponse.files.length} files${colors.reset}`);
    } else {
      console.log(`${colors.red}Generate endpoint test failed!${colors.reset}`);
      console.log(generateResponse);
    }
    
    console.log(`${colors.green}All tests passed! The Vana web server is functional.${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}Error during tests:${colors.reset}`, error.message);
  } finally {
    // Kill the server process
    serverProcess.kill();
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

testServer().catch(error => {
  console.error(`${colors.red}Test failed:${colors.reset}`, error);
  process.exit(1);
});