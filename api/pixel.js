export default async function handler(req, res) {
    // 1. Captura o IP e Navegador do visitante
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'IP Oculto';
    const userAgent = req.headers['user-agent'] || 'Não identificado';

    // 2. Captura a geolocalização nativa, gratuita e infalível da Vercel
    const city = req.headers['x-vercel-ip-city'] || '-';
    const region = req.headers['x-vercel-ip-country-region'] || '-';
    const country = req.headers['x-vercel-ip-country'] || '-';
    const latitude = req.headers['x-vercel-ip-latitude'] || '-';
    const longitude = req.headers['x-vercel-ip-longitude'] || '-';

    // 3. Envia os dados já processados para o seu Google Scripts
    try {
        const googleScriptUrl = `https://script.google.com/macros/s/AKfycbwH431-diYqGIjmfAznIlERg6DrnZXy-Orwpl1c58SdvL6i0esZxckp_pIoozeuErZteg/exec` +
            `?ip=${encodeURIComponent(ip)}` +
            `&ua=${encodeURIComponent(userAgent)}` +
            `&city=${encodeURIComponent(city)}` +
            `&region=${encodeURIComponent(region)}` +
            `&country=${encodeURIComponent(country)}` +
            `&lat=${encodeURIComponent(latitude)}` +
            `&lon=${encodeURIComponent(longitude)}`;

        await fetch(googleScriptUrl);
    } catch (error) {
        console.error("Erro ao enviar para o Google Script:", error);
    }

    // 4. Devolve resposta em formato válido para o Lattes (Evita o erro 500)
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res.status(200).send("/* Tracker Ativado */");
}
