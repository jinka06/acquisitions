import app from './app.js';
import { createUsersTable } from './models/user.model.js';

const PORT = process.env.PORT || 3000;

await createUsersTable();

app.listen(PORT, () => {
  console.log(`Listening from http://localhost:${PORT}`);
});
