const fs = require('fs');
const path = require('path');

/**
 * Load MongoDB configuration from environment variables or mndb.txt file
 */
function loadMongoConfig() {
  // Check environment variables first
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  // Fall back to mndb.txt file
  const configPath = path.join(__dirname, '..', 'mndb.txt');

  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());

    let username = '';
    let password = '';

    lines.forEach(line => {
      if (line.includes('Username:')) {
        username = line.split('Username:')[1].trim();
      }
      if (line.includes('Password:')) {
        password = line.split('Password:')[1].trim();
      }
    });

    if (!username || !password) {
      throw new Error('Missing username or password in mndb.txt');
    }

    // Build connection string
    return `mongodb+srv://${username}:${password}@cluster0.yqwqot.mongodb.net/?appName=Cluster0`;
  } catch (error) {
    console.error('Error loading MongoDB config:', error.message);
    throw error;
  }
}

// Admin key for protected routes
const ADMIN_KEY = process.env.ADMIN_KEY || 'demo-admin-key-12345';

module.exports = {
  mongoUri: loadMongoConfig(),
  adminKey: ADMIN_KEY,
  port: process.env.PORT || 5001
};
