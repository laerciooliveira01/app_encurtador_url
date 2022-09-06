module.exports = (app) =>{

    const nanoid = require('nanoid');
    const opn = require('opn');

    const conn = require('../../config/connection');
    conn.connect();

    //Método de encurtar uma URL persistindo-a no banco de dados.
    app.post('/encurtar-url', async (req, res) =>{
        const UIID = nanoid(10);
        const {deUrlCompleta} = req.body;
        const deUrlEncurtada = encurtarUrl(req) + UIID;
        const urlEncurtada = [UIID, deUrlCompleta, deUrlEncurtada];
        const urlEncurtadaCriada = await inserir(urlEncurtada);
        return convertToJson(res, urlEncurtadaCriada);
    });

    //Método que retorna uma url encurtada conforme um id.
    app.get('/buscar/:id', async (req, res) =>{
        const {id} = req.params;
        const urlEncurtada = await buscarUrlEncurtadaById(id);
        return convertToJson(res, urlEncurtada);
    });

    
    //Método que retorna todas as URLs encurtadas em uma data específica.
    app.get('/urls-encurtadas/:dt_cadastro', async (req, res) =>{
        const {dt_cadastro} = req.params;
        const lista = await buscarUrlsByDtCadastro(dt_cadastro);
        return convertToJson(res, lista);
    });

    // Método que retorna uma url encurtada conforme o encurtamento da URL.
    app.get("/buscar-url/:cdUrlEncurtada", async (req,res) => {
        const {cdUrlEncurtada} = req.params;
        const urlEncurtada = await buscarUrlEncurtadaById(cdUrlEncurtada);
        
        if(!urlEncurtada){
            return res.status(400).json({error : "Não foi encontrada nenhuma URL com esse encurtamento."});
        }
    
        opn(urlEncurtada.de_url_completa);
        return res.status(200).json("Operação realizada com sucesso!");
    });

    async function buscarUrlEncurtadaById(id){
        try {
            const sql = 'SELECT * FROM encurtador.tb_url_encurtada where cd_uiid = $1';
            const result = await conn.query(sql, [id]);
            return result.rows[0];
        } catch (err) {
            console.log("Erro ao consultar URL: ", err.stack);
            return null;
        }
    }

    async function buscarUrlsByDtCadastro(dt_cadastro){
        try {
            const sql = 'SELECT * FROM encurtador.tb_url_encurtada where dt_cadastro = $1 order by dt_cadastro';
            const result = await conn.query(sql, [dt_cadastro]);
            return result.rows;
        } catch (err) {
            console.log(err.stack);
            return null;
        }
    }

    function convertToJson(res, ret){
        if(!ret){
            return res.status(400).json({error : "Nenum registro encotnrado para data informada."});
        }
        return res.json(ret);
    }

    function encurtarUrl(req){
        const protocolo = req.protocol;
        const host = req.hostname;
        const porta = req.socket.localPort ? ":" + req.socket.localPort : "";
        const url = `${protocolo}://${host}${porta}/short/`;
        return url;
    }

    async function inserir(values){
        try {
            const sql = 'INSERT INTO encurtador.tb_url_encurtada(cd_uiid, de_url_completa, de_url_encurtada) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, values);
            return result.rows[0];
        } catch (err) {
            console.log(err.stack);
            return null;
        }
    }    

}