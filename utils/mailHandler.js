const nodemailer = require("nodemailer");
const config = require("../config/config.js");

class Mail {
	static async launch(email, subject, message) {
		const transporter = nodemailer.createTransport({
			host: config.SMTP_HOST,
			port: config.SMTP_PORT,
			auth: {
				user: config.SMTP_USERNAME,
				pass: config.SMTP_PASSWORD,
			},
		});
		const mail = {
			from: `${config.SMTP_NAMEFROM} <${config.SMTP_MAILFROM}>`,
			to: email,
			subject: subject,
			text: message,
		};

		await transporter.sendMail(mail);
	}
}

module.exports = Mail;
