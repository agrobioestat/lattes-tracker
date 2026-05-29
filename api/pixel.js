export default async function handler(req, res) {
    // 1. Captura o IP real do visitante através dos cabeçalhos da Vercel
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const clientIp = ip ? ip.split(',')[0].trim() : '';

    try {
        // 2. Faz a geolocalização no servidor (o Google e o Lattes não conseguem bloquear isto)
        const geoRes = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIp}.json`);
        const data = await geoRes.json();

        // 3. URL do seu Google Script atual
        const googleAppUrl = "https://script.google.com/macros/s/AKfycbwH431-diYqGIjmfAznIlERg6DrnZXy-Orwpl1c58SdvL6i0esZxckp_pIoozeuErZteg/exec";
        
        // Monta os parâmetros para enviar para a sua planilha
        const params = new URLSearchParams({
            ip: data.ip || clientIp,
            cidade: data.city || "Desconhecido",
            estado: data.region || "Desconhecido",
            pais: data.country || "Desconhecido",
            lat: data.latitude || "",
            lon: data.longitude || "",
            ua: req.headers['user-agent'] || "Desconhecido"
        });

        // Envia os dados silenciosamente para o seu Google Sheets em segundo plano
        fetch(`${googleAppUrl}?${params.toString()}`, { method: 'GET' }).catch(() => {});

    } catch (e) {
        console.error("Erro no rastreamento:", e);
    }

    // 4. MÁGICA: Responde com uma imagem GIF real de 1x1 pixel transparente
    const transparentGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).send(transparentGif);
}
