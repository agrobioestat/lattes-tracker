export default async function handler(req, res) {
    // 1. Captura os dados da Vercel
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'IP Oculto';
    const userAgent = req.headers['user-agent'] || 'Não identificado';
    const city = req.headers['x-vercel-ip-city'] || '-';
    const region = req.headers['x-vercel-ip-country-region'] || '-';
    const country = req.headers['x-vercel-ip-country'] || '-';
    const latitude = req.headers['x-vercel-ip-latitude'] || '-';
    const longitude = req.headers['x-vercel-ip-longitude'] || '-';

    // 2. Monta o link da sua Planilha
    const googleScriptUrl = `https://script.google.com/macros/s/AKfycbwH431-diYqGIjmfAznIlERg6DrnZXy-Orwpl1c58SdvL6i0esZxckp_pIoozeuErZteg/exec` +
        `?ip=${encodeURIComponent(ip)}` +
        `&ua=${encodeURIComponent(userAgent)}` +
        `&city=${encodeURIComponent(city)}` +
        `&region=${encodeURIComponent(region)}` +
        `&country=${encodeURIComponent(country)}` +
        `&lat=${encodeURIComponent(latitude)}` +
        `&lon=${encodeURIComponent(longitude)}`;

    // Envia os dados para a planilha silenciosamente (sem travar a imagem)
    fetch(googleScriptUrl).catch(console.error);

    // 3. Retorna uma imagem SVG em formato de texto (Não quebra nunca)
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).send(svg);
}
