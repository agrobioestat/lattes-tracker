import { google } from 'googleapis';

export default async function handler(req, res) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        // Captura os dados do visitante
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'IP Oculto';
        const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        const userAgent = req.headers['user-agent'] || 'Não identificado';

        // Envia para a planilha
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'Acessos!A:C',
            valueInputOption: 'RAW',
            requestBody: {
                values: [[dataHora, ip, userAgent]],
            },
        });

    } catch (error) {
        console.error("Erro ao gravar na planilha:", error);
    }

    // Retorna o formato de script esperado pelo Lattes
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).send("/* Tracker Ativado */");
}
