const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define a Simple Model
const DataSchema = new mongoose.Schema({ name: String });
const DataModel = mongoose.model("Data", DataSchema);

// API Routes
app.get("/api/data", async (req, res) => {
    const data = await DataModel.find();
    res.json(data);
});

app.post("/api/data", async (req, res) => {
    const newData = new DataModel({ name: req.body.name });
    await newData.save();
    res.json({ message: "✅ Data saved successfully!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
