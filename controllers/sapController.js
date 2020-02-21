const fs = require("fs");

const PDFReactor = require('../PDFreactor');
const pdfReactor = new PDFReactor("http://ec2-34-216-255-36.us-west-2.compute.amazonaws.com/service/rest");

// ------------------------------------------------------------
// FUNCTIONS
// ------------------------------------------------------------

exports.createHTMLversion = (req, res) => {
    res.render( 'cx-content' );
}
exports.renderTool = (req, res) => {
    res.render('index');
}
exports.generatePDF = (req, res) => {
    let result;
    const config = {
        document: `http://assessment-tools.com/sap/htmlversion`,
        addLinks: true,
        pixelsPerInch:71,
        javaScriptSettings:{ enabled:true }
    }
    async function printPDF() {
        try{
            result = await pdfReactor.convert(config);
            fs.writeFile(`./bin_dev/sap.pdf`, result.document, 'base64', function(err) {
                if (err) {
                    console.log(err)
                } else {
                    fs.readFile(`./bin_dev/sap.pdf`, (err, data) => {
                        res
                        .contentType('application/pdf')
                        .send(data);
                    })
                }
            });
        } catch (err) {
            console.log(err)
        }
    }
    printPDF()
}

