import express from 'express';
import { YoutubeTranscript } from 'youtube-transcript';
import ytdl from 'ytdl-core';
import ytdlDistube from '@distube/ytdl-core';

const integrationsRouter = express.Router();

function extractVideoId(input) {
    if (!input) return null;
    const urlMatch = input.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&]|$)/);
    if (urlMatch && urlMatch[1]) return urlMatch[1];
    const shortMatch = input.match(/youtu\.be\/([0-9A-Za-z_-]{11})(?:\?|&|$)/);
    if (shortMatch && shortMatch[1]) return shortMatch[1];
    if (/^[0-9A-Za-z_-]{11}$/.test(input)) return input;
    return null;
}

function extractAvailableLangs(errorMessage) {
    if (!errorMessage) return [];
    const marker = 'Available languages:';
    const idx = errorMessage.indexOf(marker);
    if (idx === -1) return [];
    const list = errorMessage.slice(idx + marker.length).split(',').map(s => s.trim()).filter(Boolean);
    return list;
}

async function tryTranscriptWithLang(id, lang) {
    return await YoutubeTranscript.fetchTranscript(id, lang ? { lang } : undefined);
}

function decodeHtmlEntities(text) {
    if (!text) return '';
    const map = {
        '&amp;': '&',
        '&quot;': '"',
        '&#39;': "'",
        '&lt;': '<',
        '&gt;': '>'
    };
    let decoded = text.replace(/(&amp;|&quot;|&#39;|&lt;|&gt;)/g, m => map[m] || m);
    decoded = decoded.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
    return decoded;
}

function extractMetaContent(html, key, attrName = 'property') {
    const regex = new RegExp(`<meta[^>]+${attrName}=["']${key}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
    const match = html.match(regex);
    return match ? decodeHtmlEntities(match[1]).trim() : '';
}

function extractTitle(html) {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match ? decodeHtmlEntities(match[1]).trim() : '';
}

function buildPreview(html, url) {
    const title =
        extractMetaContent(html, 'og:title') ||
        extractMetaContent(html, 'twitter:title', 'name') ||
        extractTitle(html);

    const description =
        extractMetaContent(html, 'og:description') ||
        extractMetaContent(html, 'description', 'name') ||
        extractMetaContent(html, 'twitter:description', 'name');

    const siteName =
        extractMetaContent(html, 'og:site_name') ||
        extractMetaContent(html, 'application-name', 'name');

    const image =
        extractMetaContent(html, 'og:image') ||
        extractMetaContent(html, 'twitter:image', 'name');

    return {
        url,
        title: title || url,
        description: description || '',
        siteName: siteName || '',
        image: image || ''
    };
}

async function fetchHtml(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
        const resp = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'text/html,application/xhtml+xml'
            },
            signal: controller.signal
        });
        return await resp.text();
    } finally {
        clearTimeout(timeout);
    }
}

function parseTimedTextTracks(xmlText) {
    if (!xmlText) return [];
    const tracks = [];
    const matches = xmlText.match(/<track[^>]*>/g) || [];
    for (const tag of matches) {
        const attrs = {};
        const attrMatches = tag.match(/(\w+)="([^"]*)"/g) || [];
        for (const attr of attrMatches) {
            const [key, value] = attr.split('=');
            attrs[key] = value.replace(/^"|"$/g, '');
        }
        if (attrs.lang_code) {
            tracks.push({
                lang: attrs.lang_code,
                name: attrs.name || '',
                kind: attrs.kind || ''
            });
        }
    }
    return tracks;
}

async function fetchTimedTextTranscript(videoId, lang, kind) {
    const base = `https://www.youtube.com/api/timedtext?lang=${encodeURIComponent(lang)}&v=${videoId}`;
    const url = kind ? `${base}&kind=${encodeURIComponent(kind)}` : base;
    const headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html,application/xml;q=0.9,*/*;q=0.8'
    };
    const resp = await fetch(url, { headers });
    const xml = await resp.text();
    const matches = xml.match(/<text[^>]*>[\s\S]*?<\/text>/g) || [];
    if (matches.length === 0) return null;
    const text = matches
        .map(m => m.replace(/<text[^>]*>/, '').replace(/<\/text>/, ''))
        .map(decodeHtmlEntities)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    return text || null;
}

async function fetchTranscriptWithYtdlCore(videoId, preferredLang, client) {
    const info = await client.getInfo(videoId);
    const tracks = info.player_response?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
    if (!tracks.length) return null;

    let track = null;
    if (preferredLang) {
        track = tracks.find(t => t.languageCode === preferredLang) || tracks.find(t => t.languageCode?.startsWith(preferredLang));
    }
    if (!track) {
        track = tracks.find(t => t.languageCode === 'en') || tracks[0];
    }
    if (!track?.baseUrl) return null;

    const resp = await fetch(track.baseUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'text/html,application/xml;q=0.9,*/*;q=0.8'
        }
    });
    const xml = await resp.text();
    const matches = xml.match(/<text[^>]*>[\s\S]*?<\/text>/g) || [];
    if (matches.length === 0) return null;

    const transcript = matches
        .map(m => m.replace(/<text[^>]*>/, '').replace(/<\/text>/, ''))
        .map(decodeHtmlEntities)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!transcript) return null;

    return { transcript, lang: track.languageCode, source: client === ytdlDistube ? 'distube-ytdl' : 'ytdl-core' };
}

async function tryTimedTextFallback(videoId, preferredLang) {
    const headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html,application/xml;q=0.9,*/*;q=0.8'
    };
    const listUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
    let listResp = await fetch(listUrl, { headers });
    let listXml = await listResp.text();
    let tracks = parseTimedTextTracks(listXml);

    if (tracks.length === 0) {
        // alternate domain fallback
        const altListUrl = `https://video.google.com/timedtext?type=list&v=${videoId}`;
        listResp = await fetch(altListUrl, { headers });
        listXml = await listResp.text();
        tracks = parseTimedTextTracks(listXml);
    }

    if (tracks.length === 0) {
        // try direct transcript with preferred lang even without list
        if (preferredLang) {
            const direct = await fetchTimedTextTranscript(videoId, preferredLang, null);
            if (direct) return { transcript: direct, lang: preferredLang, source: 'timedtext-direct' };
        }
        return null;
    }

    let chosen = null;
    if (preferredLang) {
        chosen = tracks.find(t => t.lang === preferredLang) || tracks.find(t => t.lang.startsWith(preferredLang));
    }
    if (!chosen) {
        chosen = tracks.find(t => t.lang === 'en') || tracks[0];
    }

    let transcript = await fetchTimedTextTranscript(videoId, chosen.lang, chosen.kind);
    if (!transcript) {
        const altUrl = `https://video.google.com/timedtext?lang=${encodeURIComponent(chosen.lang)}&v=${videoId}`;
        const altResp = await fetch(altUrl, { headers });
        const altXml = await altResp.text();
        const altMatches = altXml.match(/<text[^>]*>[\s\S]*?<\/text>/g) || [];
        if (altMatches.length > 0) {
            transcript = altMatches
                .map(m => m.replace(/<text[^>]*>/, '').replace(/<\/text>/, ''))
                .map(decodeHtmlEntities)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
        }
    }
    if (!transcript) return null;

    return { transcript, lang: chosen.lang, source: 'timedtext' };
}

integrationsRouter.get('/integrations/youtube/transcript', async (req, res) => {
    try {
        const { url, videoId, lang } = req.query;
        const id = extractVideoId(videoId || url);
        if (!id) {
            return res.status(400).json({ error: 'URL sau videoId invalid' });
        }

        let transcriptItems = null;
        let lastError = null;
        let usedLang = null;

        if (lang) {
            try {
                transcriptItems = await tryTranscriptWithLang(id, lang);
                usedLang = lang;
            } catch (err) {
                lastError = err;
                const available = extractAvailableLangs(err?.message);
                const preferred = available.includes('en') ? 'en' : available[0];
                if (preferred) {
                    try {
                        transcriptItems = await tryTranscriptWithLang(id, preferred);
                        usedLang = preferred;
                    } catch (err2) {
                        lastError = err2;
                    }
                }
            }
        } else {
            // Try auto-detect first
            try {
                transcriptItems = await tryTranscriptWithLang(id, null);
            } catch (err) {
                lastError = err;
                const available = extractAvailableLangs(err?.message);
                const preferred = available.includes('en') ? 'en' : available[0];
                if (preferred) {
                    try {
                        transcriptItems = await tryTranscriptWithLang(id, preferred);
                        usedLang = preferred;
                    } catch (err2) {
                        lastError = err2;
                    }
                }
            }
        }

        if (!transcriptItems || transcriptItems.length === 0) {
            const fallback = await tryTimedTextFallback(id, lang || usedLang);
            if (!fallback) {
                let ytdlFallback = null;
                try {
                    ytdlFallback = await fetchTranscriptWithYtdlCore(id, lang || usedLang, ytdl);
                } catch (err) {
                    if (String(err?.message || '').includes('Could not extract functions')) {
                        try {
                            ytdlFallback = await fetchTranscriptWithYtdlCore(id, lang || usedLang, ytdlDistube);
                        } catch (err2) {
                            ytdlFallback = null;
                        }
                    }
                }

                if (!ytdlFallback) {
                    return res.status(404).json({
                        error: 'Nu am găsit transcript pentru acest video',
                        details: lastError?.message
                    });
                }

                return res.json({ videoId: id, transcript: ytdlFallback.transcript, lang: ytdlFallback.lang, source: ytdlFallback.source });
            }

            return res.json({ videoId: id, transcript: fallback.transcript, lang: fallback.lang, source: fallback.source });
        }

        const transcript = transcriptItems
            .map(t => t.text)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

        return res.json({ videoId: id, transcript, lang: usedLang || lang || 'auto', source: 'youtube-transcript' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

integrationsRouter.get('/integrations/link/preview', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: 'URL este necesar' });
        if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'URL invalid' });

        const html = await fetchHtml(url);
        const preview = buildPreview(html, url);
        return res.json(preview);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default integrationsRouter;
