const nodemailer = require('nodemailer');

const monMdp = process.env.MONMDP;
const monMail = process.env.MONMAIL;

exports.getContact = async (req, res, next) => {
    const user = req.session.user
    res.render('contact', { user })

}

exports.postContact = (req, res, next) => {
    const user = req.session.user
    const transporter = nodemailer.createTransport({
        host: "smtp.ionos.fr",
        port: 465,
        secure: false,
        auth: {
            user: monMail,
            pass: monMdp
        },
        tls: true
    });
    let mailOptions = {
        from: req.body.email,
        to: monMail,
        subject: `${req.body.object} : ${req.body.email}`,
        text: `${req.body.message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Message envoyé: ' + info.response + ' contenue du message : ' + req.body.message + ' email : ' + req.body.email);
            res.render('contact', { user, message: 'Votre message a bien été envoyé !' })
        }
    });
} 