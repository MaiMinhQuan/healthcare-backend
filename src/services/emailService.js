require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  console.log("dataSend: ", dataSend);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"MiQ" <khoidaumoi2004@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
    html: getBodyHTMLEmail(dataSend), // html
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên BookingCare</p>
    <p>Thông tin đặt lịch khám bệnh</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sỹ: ${dataSend.doctorName}</b></div>
    <p>Nếu các thông tin trên là chính xác, hãy click vào đường link sau để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
    <div>Xin chân thành cảm ơn</div>

`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3>Hello ${dataSend.patientName}</h3>
     <p>You received this email because you booked a medical appointment on BookingCare</p>
     <p>Information for scheduling medical examination</p>
     <div><b>Time: ${dataSend.time}</b></div>
     <div><b>Doctor: ${dataSend.doctorName}</b></div>
     <p>If the above information is correct, please click on the following link to confirm and complete the medical appointment procedure</p>
     <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
     <div>Thank you very much</div>

`;

    return result;
  }
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
};
