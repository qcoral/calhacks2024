import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json()); 
app.use(cors({
    origin: '*', // Allow all origins. You can specify specific origins if needed.
    methods: ['GET', 'POST'], // Specify allowed methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers
  }));
  

const public_key = process.env.SUPABASE_PUBLIC_KEY

console.log('SUPABASE_PUBLIC_KEY: ', public_key)

// Create a single supabase client for interacting with your database
const supabase = createClient('https://yrgxsvhoxugxexmnwdvc.supabase.co', public_key)

// Define a simple route
app.get('/calhacks', async (req, res) => {
    const { data, error } = await supabase
        .from('calhacks')
        .select()
    res.json(data);
});

app.post('/calhacks', async (req, res) => {
    const { data, error } = await supabase
        .from('calhacks')
        .insert(req.body)
        .select()
    if (error) return res.status(400).json({ error: error.message })
    console.log('data:', data)
    res.json(data)
})
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
