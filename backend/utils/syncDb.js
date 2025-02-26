const { sequelize } = require('../config/database');

async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();