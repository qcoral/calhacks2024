import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all origins. You can specify specific origins if needed.
    methods: ["GET", "POST"], // Specify allowed methods
    allowedHeaders: ["Content-Type"], // Specify allowed headers
  })
);

const public_key = process.env.SUPABASE_PUBLIC_KEY;

console.log("SUPABASE_PUBLIC_KEY: ", public_key);

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://yrgxsvhoxugxexmnwdvc.supabase.co",
  public_key
);

// Define a simple route
app.get("/calhacks", async (req, res) => {
  const { data, error } = await supabase.from("calhacks").select();
  res.json(data);
});

app.get('/graph', async (req, res) => {
    const { data, error } = await supabase
        .from('calhacks')
        .select('name, friends');
    
    if (error) return res.status(400).json({ error: error.message });

    const nodes = [];
    const links = [];
    const nodeSet = new Set();
    const linkSet = new Set();

    data.forEach((entry) => {
        const { name, friends } = entry;

        // Add the node if it doesn't already exist
        if (!nodeSet.has(name)) {
            nodes.push({ id: name });
            nodeSet.add(name);
        }

        // Add friends as nodes and create links
        friends.forEach((friend) => {
            const friendName = friend.name;
            if (!nodeSet.has(friendName)) {
                nodes.push({ id: friendName });
                nodeSet.add(friendName);
            }
            // Prevent self-linking and deduplicate links
            const linkKey = `${name}-${friendName}`;
            if (name !== friendName && !linkSet.has(linkKey)) {
                links.push({ source: name, target: friendName });
                linkSet.add(linkKey);
            }
        });
    });

    console.log({ nodes, links });
    res.json({ nodes, links });
});

app.post("/calhacks", async (req, res) => {
  const { data, error } = await supabase
    .from("calhacks")
    .insert(req.body)
    .select();
  if (error) return res.status(400).json({ error: error.message });
  console.log("data:", data);
  res.json(data);
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
