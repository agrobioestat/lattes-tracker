export default async function handler(req, res) {
    // 1. Captura os dados de localização da Vercel
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'IP Oculto';
    const userAgent = req.headers['user-agent'] || 'Não identificado';
    const city = req.headers['x-vercel-ip-city'] || '-';
    const region = req.headers['x-vercel-ip-country-region'] || '-';
    const country = req.headers['x-vercel-ip-country'] || '-';
    const latitude = req.headers['x-vercel-ip-latitude'] || '-';
    const longitude = req.headers['x-vercel-ip-longitude'] || '-';

    // 2. Envia os dados para a sua Página1 no Google Sheets
    const googleScriptUrl = `https://script.google.com/macros/s/AKfycbwH431-diYqGIjmfAznIlERg6DrnZXy-Orwpl1c58SdvL6i0esZxckp_pIoozeuErZteg/exec` +
        `?ip=${encodeURIComponent(ip)}` +
        `&ua=${encodeURIComponent(userAgent)}` +
        `&city=${encodeURIComponent(city)}` +
        `&region=${encodeURIComponent(region)}` +
        `&country=${encodeURIComponent(country)}` +
        `&lat=${encodeURIComponent(latitude)}` +
        `&lon=${encodeURIComponent(longitude)}`;

    try {
        await fetch(googleScriptUrl);
    } catch (error) {
        console.error("Erro ao enviar para o Google:", error);
    }

    // 3. RETORNA UMA IMAGEM GIF 1X1 TRANSPARENTE REAL
    // Isso engana o filtro do Lattes perfeitamente e não deixa ícones quebrados na tela
    const pixelBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const pixelBuffer = Buffer.from(pixelBase64, 'base64');

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
    return res.status(200).send(pixelBuffer);
}
