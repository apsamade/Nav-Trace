const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);
const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY;

const Panier = require('../../../models/panier')
const Product = require('../../../models/product')

const PDFDocument = require('pdfkit');
const fs = require('fs')
const nodemailer = require('nodemailer');
const path = require('path')

const monMdp = process.env.MON_MDP;
const monMail = process.env.MON_EMAIL;

const fulfillOrder = async (lineItems) => {
    try {
        console.log('meta donné test drive webhook : ', lineItems.metadata)
        if (lineItems.metadata.panier_id) {
            await Panier.findByIdAndUpdate(lineItems.metadata.panier_id, {
                $set: {
                    payer: true,
                    politique_accepter: true,
                    paiement_stripe_id: lineItems.id,
                    ville: lineItems.shipping_details.address.city,
                    adresse_postale: lineItems.shipping_details.address.line1,
                    code_postal: lineItems.shipping_details.address.postal_code,
                    email: lineItems.customer_details.email,
                    nom: lineItems.shipping_details.name,
                    tel: lineItems.customer_details.phone
                }
            })

            console.log(await Panier.findById(lineItems.metadata.panier_id))
//    Génération d'une facture
            const paniers = await Panier.find({payer: true})
            const produits = await Product.find()
            const thisPanier = await Panier.findById(lineItems.metadata.panier_id)
            const factureDir = path.join(__dirname, '..', '..', '..', 'factures');
            const numeroFacture = paniers.length;

            const factureFilename = `facture_${numeroFacture}.pdf`;
            const filePath = path.resolve(factureDir, factureFilename);

            const doc = new PDFDocument();
            const writeStream = fs.createWriteStream(filePath);

            doc.pipe(writeStream);
            doc.image('public/img/logo/Nav-Trace_logo_noname.png', 40, 15, { width: 45 })
                .moveDown(-1.7); // Ajuster l'espacement vertical

            // Titre de la facture
            doc.font('Helvetica-Bold')
                .fontSize(21)
                .text('FACTURE PANIER NAV TRACE', 15, 15, { align: 'right' });

            doc.moveDown();
            doc.font('Helvetica-Bold').fontSize(10).text('Nav Trace', 40, 70, { align: 'left' });
            doc.moveDown(0.2);
            doc.font('Helvetica').fontSize(10)
                .text('9 RUE DENIS PAPIN', 40, 85, { align: 'left' })
                .text('ml.prestige77680@gmail.com', { align: 'left' })
                .text('N°TVA Intracommunautaire : FR06789818036', { align: 'left' })
                .text('N°SIRET : 78981803600038', { align: 'left' })
                .text('Capital : 20 000€', { align: 'left' });

            doc.font('Helvetica').fontSize(10)
                .text(`${thisPanier.nom.toUpperCase()}`, 375, 85)
                .text(`${thisPanier.tel}`) // Ajout de la position
                .text(`${thisPanier.email}`, {width: 420}) // Ajout de la position
                .text(`${thisPanier.code_postal} ${thisPanier.ville}`)
                .text(`${thisPanier.adresse_postale}`)

            doc.moveDown();
            doc.font('Helvetica-Bold').fontSize(14).text(`FACTURE N°${numeroFacture}`, 40, 180, { align: 'left' });
            doc.moveDown(0.3);

            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const dateDuJour = new Date().toLocaleDateString('fr-FR', options);

            doc.font('Helvetica').fontSize(10).text(`Le ${dateDuJour}`)

            // Tableau des articles
            const tableTop = 270;
            const col1 = 40;
            const col2 = 115;
            const col3 = 205;
            const col4 = 275;
            const col5 = 350;
            const col6 = 415;
            const col7 = 455;

            let ref = 1;
            const items = [];
            thisPanier.products.forEach(article =>{
                const produitCorrespondant = produits.find(prod => prod._id.toString() === article.product_id.toString());
                console.log('items webhook map : ', produits.map(prod => prod._id))
                console.log('items webhook prod correspondant : ', produitCorrespondant)
                items.push({
                    id: '00'+ (ref),
                    nom: produitCorrespondant.name,
                    quantite: article.quantite,
                    prix: article.prix * article.quantite,
                    tva: '20',
                })
                ref += 1;
            })
            items.push({
                id: '00'+ (ref),
                nom: 'Abonnement Nav Trace',
                quantite: thisPanier.quantite_total,
                prix: thisPanier.quantite_total * 999,
                tva: '20',
            })
            console.log('items webhook : ', items)
            let yPos = tableTop;
            // Dessiner des lignes horizontales entre les lignes du tableau
            doc.moveTo(col1 - 15, yPos + -29)
                .lineTo(col7 + 80, yPos + -29)
                .stroke();
            // Table headers
            doc.font('Helvetica-Bold')
                .fontSize(12)
                .text('Référence', col1, tableTop - 20)
                .text('Description', col2, tableTop - 20)
                .text('Quantité', col5, tableTop - 20)
                .text('TVA', col6, tableTop - 20)
                .text('Montant HT', col7, tableTop - 20);

            // Table data
            // Dessiner des lignes horizontales entre les lignes du tableau
            doc.moveTo(col1 - 15, yPos + -5)
                .lineTo(col7 + 80, yPos + -5)
                .stroke();

            for (const item of items) {
                doc.font('Helvetica')
                    .fontSize(10)
                    .text(item.id, col1, yPos, { width: 0, continued: true })
                    .text(`${item.nom}`, col2, yPos, { width: 0, continued: true })
                    .text(item.quantite.toString(), col5, yPos, { width: 0, continued: true })
                    .text(`${item.tva.toString()}%`, col6, yPos, { width: 0, continued: true })
                    .text(`${((item.prix / 100) - (((item.prix / 100) * items[0].tva) / 100)).toFixed(2)} €`, col7, yPos, { width: 0, continued: true });

                // Dessiner des lignes horizontales entre les lignes du tableau
                doc.moveTo(col1 - 15, yPos + 15)
                    .lineTo(col7 + 80, yPos + 15)
                    .stroke();

                // Dessiner des lignes verticales entre les colonnes du tableau
                doc.moveTo(col1 - 15, yPos - 30)
                    .lineTo(col1 - 15, yPos + 15)
                    .stroke();

                doc.moveTo(col2 - 12, yPos - 30)
                    .lineTo(col2 - 12, yPos + 15)
                    .stroke();

                doc.moveTo(col5 - 5, yPos - 30)
                    .lineTo(col5 - 5, yPos + 15)
                    .stroke();

                doc.moveTo(col6 - 6, yPos - 30)
                    .lineTo(col6 - 6, yPos + 15)
                    .stroke();

                doc.moveTo(col7 - 8, yPos - 30)
                    .lineTo(col7 - 8, yPos + 15)
                    .stroke();

                doc.moveTo(col7 + 80, yPos - 30)
                    .lineTo(col7 + 80, yPos + 15)
                    .stroke();

                yPos += 20;

            }

            const options2 = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const dateDuJour2 = new Date().toLocaleDateString('fr-FR', options2);

            // derniers détails
            doc.font('Helvetica').fontSize(10)
                .text(`Conditions de paiements :`, 25, 670, { width: 0, continued: true })
                .text(`• 100% soit ${((thisPanier.prix_total / 100) + (thisPanier.quantite_total * 999/100)).toFixed(2)} € payé (carte bancaire)`, 24, 684, { width: 0, continued: true })
                .text(`le ${dateDuJour2} (paiement comptant)`, 33, 698, { width: 0, continued: true })

            // payement ttc ht tva
            // Dessiner un rectangle avec une couleur de remplissage
            doc.save()
                .rect(385, 645, 210, 80)
                .fill('#BFC4C1')
                .restore();

            doc.font('Helvetica').fontSize(11)
                .text(`Total HT`, 400, 660, { width: 0, continued: true })
                .text(`${(((thisPanier.prix_total / 100) + (thisPanier.quantite_total * 999/100)) - ((((thisPanier.prix_total / 100) + (thisPanier.quantite_total * 999/100)) * items[0].tva) / 100)).toFixed(2)} €`, 520, 660, { width: 0, continued: true })
                .text(`TVA (${items[0].tva}%)`, 400, 680, { width: 0, continued: true })
                .text(`${((((thisPanier.prix_total / 100) + (thisPanier.quantite_total * 999/100)) * items[0].tva) / 100).toFixed(2)} €`, 520, 680, { width: 0, continued: true });

            doc.font('Helvetica-Bold').fontSize(14)
                .text(`Total TTC`, 400, 700, { width: 0, continued: true })
                .text(`${((thisPanier.prix_total / 100) + (thisPanier.quantite_total * 999/100)).toFixed(2)} €`, 520, 700, { width: 0, continued: true })

            doc.end();

            writeStream.on('finish', async () => {
                // Le fichier PDF a été sauvegardé avec succès
                console.log('Facture créée et sauvegardée avec succès');
                const factureData = fs.readFileSync(filePath);
                thisPanier.facture.data = factureData;
                thisPanier.facture.contentType = 'application/pdf';
                await thisPanier.save();
                // Envoi de la facture par e-mail, etc.
            });

            writeStream.on('error', (error) => {
                // Une erreur s'est produite lors de la sauvegarde du fichier PDF
                console.log('Erreur lors de la sauvegarde de la facture :', error);
            });


            // envoie de la facture par mail 
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: monMail,
                    pass: monMdp
                },
                tls: true
            });

            const mailOptions = {
                from: monMail,
                to: thisPanier.email,
                subject: `Facture de ${thisPanier.nom}`,
                html: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Panier acheté</title>
                            <link rel="preconnect" href="https://fonts.googleapis.com">
                            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                            <link href="https://fonts.googleapis.com/css2?family=Lobster&family=Oswald:wght@400;500;600;700&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">
                        </head>
                        <body>
                            <div style="font-family: 'Roboto', sans-serif; background-color: #323232; color: white; padding: 50px 0">
                                <h1 style="padding: 25px 0; text-align: center;">Confirmaion du panier acheter chez Nav Trace</h1>
                                <img style="margin: 30px auto; display: block; width: 220px;" src="https://nav-trace.onrender.com/public/img/logo/Nav-Trace_logo_noname.png" alt="logo de Nav Trace">
                                <p style="display: block; line-height: 150%; font-size: 18px; margin: 25px auto; text-align: center;">
                                Vous trouverez la facture de votre achat ci dessous
                                </p>
                                <p style="display: block; line-height: 150%; margin: 25px auto; text-align: center; font-size: 18px;">Merci pour votre confiance !</p>    
                            </div> 
                        </body>
                        </html>`,
                attachments: [
                    {
                        filename: factureFilename,
                        path: filePath,
                        contentType: 'application/pdf'
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Facture envoyé par email');
                }
            });
        } else {
            console.log('paiement non panier paiement')
        }
    } catch (error) {
        console.log(error)
    }
}
const createOrder = (session) => {
    // TODO: fill me in
    console.log("Creating order", session.id);
}

const emailCustomerAboutFailedPayment = (session) => {
    // TODO: fill me in
    console.log("Emailing customer", session.id);
}
exports.handleWebhook = async (req, res, next) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            createOrder(session);
            if (session.payment_status === 'paid' && session.consent.terms_of_service == 'accepted') {
                await fulfillOrder(session);
            }
            break;
        }

        case 'checkout.session.async_payment_succeeded': {
            const session = event.data.object;

            // Fulfill the purchase...
            await fulfillOrder(session);

            break;
        }

        case 'checkout.session.async_payment_failed': {
            const session = event.data.object;
            emailCustomerAboutFailedPayment(session);

            break;
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send();

}