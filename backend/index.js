import express from 'express';
import bcrypt from 'bcrypt';

(async () => {
    try {

        let text = (password)

        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(text, salt)
        console.log(hash)

        let compare = await bcrypt.compare(text, hash)
        console.log(compare)

    } catch (error ) {
        console.log(error.message)
    }
})()

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
