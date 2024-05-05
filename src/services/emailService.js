require("dotenv").config();
import { reject } from "lodash";
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
    from: '"BookingCare" <khoidaumoi2004@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    text: "BookingCare", // plain text body
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
  }
  return result;
};

let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
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
        from: '"BookingCare" <khoidaumoi2004@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin đơn thuốc", // Subject line
        text: "BookingCare?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend), // html
        attachments: [
          {
            // encoded string as an attachment
            filename: `remedy}-${
              dataSend.patientName
            }-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName} </h3>
    <p>Cảm ơn bạn đã tin tưởng đặt lịch hẹn trên BookingCare</p>
    <p>Thông tin đơn thuốc được gửi trong file đính kèm</p>
    <div>Xin chân thành cảm ơn</div>

`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3>Hello ${dataSend.patientName} </h3>
     <p>Thank you for trusting to book an appointment on BookingCare</p>
     <p>Prescription information is sent in the attached file</p>
     <div>Thank you very much</div>

`;
  }
  return result;
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
};
