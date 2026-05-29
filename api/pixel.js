export default async function handler(req, res) {
    const { debug } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const clientIp = ip ? ip.split(',')[0].trim() : '';
    
    // Objeto para guardar o relatório do que está acontecendo
    let relatorio = { passo: "Início", ipDetectado: clientIp };

    try {
        relatorio.passo = "Buscando Geolocalização";
        const geoRes = await fetch(`https://get.geojs.io/v1/ip/geo/${clientIp}.json`);
        const data = await geoRes.json();
        relatorio.dadosGeograficos = data;

        const googleAppUrl = "https://script.google.com/macros/s/AKfycbwH431-diYqGIjmfAznIlERg6DrnZXy-Orwpl1c58SdvL6i0esZxckp_pIoozeuErZteg/exec";
        
        const params = new URLSearchParams({
            ip: data.ip || clientIp,
            cidade: data.city || "Desconhecido",
            estado: data.region || "Desconhecido",
            pais: data.country || "Desconhecido",
            lat: data.latitude || "",
            lon: data.longitude || "",
            ua: req.headers['user-agent'] || "Desconhecido"
        });

        relatorio.passo = "Enviando para o Google Sheets";
        relatorio.urlEnviada = `${googleAppUrl}?${params.toString()}`;
        
        const googleRes = await fetch(relatorio.urlEnviada, { method: 'GET', redirect: 'follow' });
        relatorio.statusRespostaGoogle = googleRes.status;
        relatorio.passo = "Sucesso Total";

    } catch (e) {
        relatorio.passo = "Erro detectado";
        relatorio.detalheDoErro = e.message;
    }

    // Se você digitar ?debug=true no navegador, ele mostra o relatório em texto
    if (debug === "true") {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(relatorio);
    }

    // Caso contrário, manda um script invisível imitando o Clustrmaps
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).send("/* Tracker Lattes Ativado */");
}
