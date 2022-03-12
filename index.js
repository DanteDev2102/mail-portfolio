const express = require('express');
const { createTransport } = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post('/mail', (req, res) => {
	const { name, lastname, email, subject, message } = req.body;
	if (!name || !lastname || !email || !subject || !message) {
		res.status(400).send({
			error: 'one or more data is missing'
		});
		return false;
	}
	const transporter = createTransport({
		service: 'gmail',
		host: process.env.HOST_EMAIL,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD
		}
	});
	const msg = `contact: ${email}\n ${message}`;
	const mailOptions = {
		from: process.env.EMAIL,
		to: process.env.EMAIL_DESTINY,
		subject: `${subject} - ${name} ${lastname}`,
		text: msg
	};
	transporter.sendMail(mailOptions, (error, info) => {
		error
			? res
					.status(500)
					.send({ error: 'the mail could not be send' })
			: console.log(`mail enviado: ${info.response}`);
	});
	res.json({ msg: 'mail sent successfully' });
});

app.listen(process.env.PORT, () => {
	console.log(
		`server listen in ${process.env.HOSTING}:${process.env.PORT}`
	);
});
