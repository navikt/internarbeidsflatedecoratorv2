const fs = require('fs');
const async = require('async');
const Mustache = require('mustache');
const Promise = require('promise');

const htmlMappe = 'html';
const destinasjon = '../main/webapp/index.html';
const tittel = 'Dekoratør for interne arbeidsflater';

const skrivTilFil = (html) => {
    fs.writeFile(destinasjon, html, 'utf-8', (err) => {
        if (err) throw err;
    });
}

const rendre = (fragmenter) => {
    return new Promise((resolve, reject) => {
        fs.readFile('./index.html', function (err, data) {
            if (err) {
                reject();
                throw err;
            }
            const html = Mustache.render(data.toString(), {
                fragmenter,
                tittel,
                timestamp: Date.now().toString(),
            });
            resolve(html);
        });
    });
}

fs.readdir(`./${htmlMappe}`, function(error, filer) {
    const filerMedFullSti = filer.map((file) => {
        return `${htmlMappe}/${file}`;
    });

    async.map(filerMedFullSti, (filePath, callback) => {
        fs.readFile(filePath, 'utf8', callback)
    }, (error, resultat) => {
        const fragmenter = resultat.join('\n\n');
        rendre(fragmenter).then(skrivTilFil);
    });
});
