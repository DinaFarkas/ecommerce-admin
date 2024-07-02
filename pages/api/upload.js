import multiparty from 'multiparty';

export default async function handle(req,res){
    const form = new multiparty.Form();
    form.parse(req, (err,fields,files) =>{
        console.log(files.length);
        res.json('ok');
    });
}

//next.js don't parse  
export const config={
    api: {bodyParser: false}
};