/*
  Gmail fetch script (TypeScript)

  What it does
  - Authenticates with Google using OAuth2 (Installed App)
  - Lists recent messages in a mailbox
  - Fetches and prints the subject + snippet of each message

  Prerequisites
  1) Create Google Cloud project and enable Gmail API
     - https://console.cloud.google.com/
     - APIs & Services -> Library -> search "Gmail API" -> Enable
  2) Create OAuth 2.0 Client ID (Desktop app)
     - APIs & Services -> Credentials -> Create Credentials -> OAuth client ID -> Application type: Desktop
     - Download client secrets JSON and save to project root as `google_client_secret.json`
  3) First run will open a browser for consent. The script stores tokens in `.credentials/gmail-token.json`.

  Usage
    npm run gmail:auth    # first-time auth (opens browser)
    npm run gmail:fetch   # list and show messages

  Env (optional)
    - GMAIL_QUERY: Gmail search query (e.g. "from:xxx@example.com newer_than:7d")
    - GMAIL_MAX: max messages to list (default 10)
*/

import fs from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google, gmail_v1 } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CLIENT_SECRET_PATH = path.resolve(process.cwd(), 'google_client_secret.json');
const CREDENTIALS_DIR = path.resolve(process.cwd(), '.credentials');
const TOKEN_PATH = path.join(CREDENTIALS_DIR, 'gmail-token.json');

function ensureDirSync(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function authorize() {
    if (!fs.existsSync(CLIENT_SECRET_PATH)) {
        throw new Error('Missing google_client_secret.json at project root. See comments for setup.');
    }
    ensureDirSync(CREDENTIALS_DIR);

    // Try load existing tokens
    if (fs.existsSync(TOKEN_PATH)) {
        const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
        const { client_id, client_secret, redirect_uris } = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, 'utf8')).installed;
        const oAuth2Client = new (google.auth.OAuth2 as any)(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(tokenData);
        return oAuth2Client;
    }

    // Do interactive auth on first run (loopback redirect)
    const oAuth2Client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CLIENT_SECRET_PATH,
    });
    // Ensure we have credentials and persist them for future non-interactive runs
    const tokens = (oAuth2Client as any).credentials;
    if (!tokens || (!tokens.refresh_token && !tokens.access_token)) {
        // Attempt to trigger token fetch to populate credentials
        await oAuth2Client.getAccessToken().catch(() => undefined);
    }
    const finalTokens = (oAuth2Client as any).credentials;
    if (!finalTokens || (!finalTokens.refresh_token && !finalTokens.access_token)) {
        throw new Error('Failed to obtain OAuth tokens after interactive auth');
    }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(finalTokens, null, 2));
    return oAuth2Client;
}

function decodeBase64Url(input: string) {
    return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function getHeader(headers: gmail_v1.Schema$MessagePartHeader[] | undefined, name: string) {
    const h = headers?.find(h => (h.name ?? '').toLowerCase() === name.toLowerCase());
    return h?.value ?? '';
}

async function listMessages(gmail: gmail_v1.Gmail, userId: string, q: string, max: number) {
    const res = await gmail.users.messages.list({ userId, q, maxResults: max });
    return res.data.messages ?? [];
}

async function getMessage(gmail: gmail_v1.Gmail, userId: string, id: string) {
    const res = await gmail.users.messages.get({ userId, id, format: 'full' });
    return res.data;
}

async function run() {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });

    const userEmail = 'me'; // Google uses "me" to mean the authenticated account
    const query = process.env.GMAIL_QUERY || '';
    const max = Number(process.env.GMAIL_MAX || 10);

    console.log('Listing messages...', { query, max });
    const msgs = await listMessages(gmail, userEmail, query, max);
    if (msgs.length === 0) {
        console.log('No messages found.');
        return;
    }

    // Helper: extract verification code from text using regex
    const codeRegex = new RegExp(process.env.CODE_REGEX || '([0-9]{8})', 'i');

    for (const m of msgs) {
        if (!m.id) continue;
        const full = await getMessage(gmail, userEmail, m.id);
        const headers = full.payload?.headers ?? [];
        const subject = getHeader(headers, 'Subject');
        const from = getHeader(headers, 'From');
        const to = getHeader(headers, 'To');
        const date = getHeader(headers, 'Date');

        let snippet = full.snippet || '';

        // Try to decode text/plain if present
        const parts = (full.payload?.parts ?? []) as gmail_v1.Schema$MessagePart[];
        const textPart = parts.find((p: gmail_v1.Schema$MessagePart) => (p.mimeType === 'text/plain') && p.body?.data);
        if (textPart && textPart.body?.data) {
            snippet = decodeBase64Url(textPart.body.data).slice(0, 200);
        }

        console.log('---');
        console.log('id     :', m.id);
        console.log('date   :', date);
        console.log('from   :', from);
        console.log('to     :', to);
        console.log('subject:', subject);
        console.log('snippet:', snippet);

        // Attempt to extract verification code
        const bodyText = textPart?.body?.data ? decodeBase64Url(textPart.body.data) : (full.snippet || '');
        console.log('body   :', bodyText.slice(0, 100)); // show start of body
        console.log('codeRegex:', codeRegex.toString());
        const match = bodyText.match(codeRegex);
        console.log('Match code   :', match ? match[1] : '[not found]');
        if (match && match[1]) {
            const code = match[1];
            console.log('code   :', code);
        }
    }
}

run().catch(err => {
    try {
        console.error('Gmail fetch failed:', err?.message ?? err);
        // Common network error fields
        if (err?.code) console.error('code   :', err.code);
        // gaxios error shape
        if (err?.response) {
            console.error('status :', err.response.status);
            if (err.response.data) {
                try {
                    console.error('data   :', typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data));
                } catch (_) {
                    console.error('data   : [unserializable]');
                }
            }
        }
        if (err?.config?.url) console.error('url    :', err.config.url);
        if (err?.cause) console.error('cause  :', err.cause?.message ?? err.cause);
        if (err?.stack) console.error(err.stack);
    } finally {
        process.exit(1);
    }
});
