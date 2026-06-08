import express from "express";
import Url from "../models/Url.js";
import { nanoid } from "nanoid";

const router = express.Router();

router.post('/shorten', async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ error: 'Original URL is required' });
        }

        try {
            new URL(originalUrl);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }
        let shortId;
        let exists = true;

        // FIXED
        while (exists) {
            shortId = nanoid(7);
            const existingUrl = await Url.findOne({ shortId });
            exists = !!existingUrl;
        }

        const url = await Url.create({ shortId, originalUrl });

        res.json({
            shortId: url.shortId,
            shortUrl: `${process.env.BASE_URL}/${url.shortId}`,
        });

    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;

        const url = await Url.findOne({ shortId });
        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        url.click += 1;
        await url.save();
        res.redirect(url.originalUrl);

    } catch (error) {
        console.error('Error redirecting URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
