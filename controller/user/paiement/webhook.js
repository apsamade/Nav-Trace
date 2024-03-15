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
            console.log('voici la facture : ', lineItems.invoice)
            console.log(await Panier.findById(lineItems.metadata.panier_id))
            const thisPanier = await Panier.findById(lineItems.metadata.panier_id)

            // Télécharger la facture depuis Stripe
            const invoicePDF = await stripe.invoices.retrievePdf(lineItems.invoice);

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
                        filename: `facture_${lineItems.metadata.panier_id}.pdf`,
                        content: invoicePDF,
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