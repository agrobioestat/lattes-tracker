export default async function handler(req, res) {
    // 1. Captura o IP e o Navegador do visitante real do seu Lattes
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'IP Oculto';
    const userAgent = req.headers['user-agent'] || 'Não identificado';

    // 2. Envia os dados diretamente para o seu link do Google Scripts
    try {
        const googleScriptUrl = `https://script.google.com/macros/s/AKfycbwH431-diYqGIjmfAznIlERg6DrnZXy-Orwpl1c58SdvL6i0esZxckp_pIoozeuErZteg/exec?ip=${encodeURIComponent(ip)}&ua=${encodeURIComponent(userAgent)}`;
        await fetch(googleScriptUrl);
    } catch (error) {
        console.error("Erro ao enviar para o Google Script:", error);
    }

    // 3. Devolve a resposta em formato de Script limpo para o Lattes aceitar
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).send("/* Tracker Ativado */");
}
