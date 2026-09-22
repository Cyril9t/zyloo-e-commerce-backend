import nodemailer from "nodemailer"
import "dotenv/config"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  }
})


export const verificationEmail = (verificationCode, userEmail, userName) => {

  transporter.sendMail({
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Verify your Zyloo account",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your Zyloo account</title>
      </head>

       <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f5;
        font-family: Arial, Helvetica, sans-serif;
        color: #18181b;
      ">

        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 40px 16px;">

              <!-- Email Card -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 560px;
                  background-color: #ffffff;
                  border-radius: 18px;
                  overflow: hidden;
                  border: 1px solid #e4e4e7;
                "
              >

                <!-- Dark Zyloo Header -->
                <tr>
                  <td style="
                    background-color: #09090b;
                    padding: 38px 32px;
                    text-align: center;
                  ">

                    <!-- Zyloo Store Logo --> <div style=" width: 72px; height: 72px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center; border: 1px solid #27272a; border-radius: 16px; background-color: #18181b; overflow: hidden; "> <img src="https://res.cloudinary.com/dkh2twop/image/upload/f_auto/q_auto/14dc2e17-3f17-49e7-af2d-0f74e05888e5.png" alt="zyloo" width="70" height="70" /> </div>

                    <div style="
                      font-size: 25px;
                      font-weight: 700;
                      letter-spacing: -0.7px;
                      color: #ffffff;
                    ">
                      Zyloo
                    </div>

                    <div style="
                      margin-top: 5px;
                      font-size: 10px;
                      letter-spacing: 2px;
                      color: #a1a1aa;
                      text-transform: uppercase;
                    ">
                      Premium Store
                    </div>

                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 42px 36px 36px;">

                    <p style="
                      margin: 0 0 8px;
                      font-size: 14px;
                      color: #71717a;
                    ">
                      Hello ${userName},
                    </p>

                    <h1 style="
                      margin: 0 0 16px;
                      font-size: 28px;
                      line-height: 1.25;
                      letter-spacing: -0.8px;
                      color: #18181b;
                    ">
                      Verify your account
                    </h1>

                    <p style="
                      margin: 0;
                      font-size: 15px;
                      line-height: 1.7;
                      color: #52525b;
                    ">
                      Use the verification code below to confirm your
                      Zyloo account. This code is required to continue.
                    </p>

                    <!-- Code Section -->
                    <div style="
                      margin-top: 30px;
                      padding: 30px 20px;
                      background-color: #fafafa;
                      border: 1px solid #e4e4e7;
                      border-radius: 14px;
                      text-align: center;
                    ">

                      <div style="
                        margin-bottom: 12px;
                        font-size: 10px;
                        font-weight: 700;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        color: #71717a;
                      ">
                        Verification Code
                      </div>

                      <div style="
                        font-size: 38px;
                        line-height: 1;
                        font-weight: 700;
                        letter-spacing: 9px;
                        color: #18181b;
                        padding-left: 9px;
                      ">
                        ${verificationCode}
                      </div>

                      <div style="
                        margin-top: 16px;
                        font-size: 12px;
                        color: #71717a;
                      ">
                        Expires in 10 minutes
                      </div>

                    </div>

                    <!-- Security Warning -->
                    <div style="
                      margin-top: 24px;
                      padding: 18px;
                      background-color: #fff7ed;
                      border: 1px solid #fed7aa;
                      border-radius: 12px;
                    ">

                      <div style="
                        margin-bottom: 7px;
                        font-size: 13px;
                        font-weight: 700;
                        color: #9a3412;
                      ">
                        Security notice
                      </div>

                      <p style="
                        margin: 0;
                        font-size: 12px;
                        line-height: 1.65;
                        color: #7c2d12;
                      ">
                        Never share this code with anyone. Zyloo will never
                        ask you for your verification code or password.
                        If you didn't request this code, you can safely
                        ignore this email.
                      </p>

                    </div>

                    <p style="
                      margin: 28px 0 0;
                      font-size: 13px;
                      line-height: 1.6;
                      color: #71717a;
                    ">
                      For your security, this verification code can only be
                      used once and will expire automatically.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="
                    padding: 24px 36px;
                    background-color: #fafafa;
                    border-top: 1px solid #e4e4e7;
                  ">

                    <div style="
                      font-size: 13px;
                      font-weight: 600;
                      color: #27272a;
                      margin-bottom: 6px;
                    ">
                      Zyloo
                    </div>

                    <p style="
                      margin: 0;
                      font-size: 11px;
                      line-height: 1.6;
                      color: #a1a1aa;
                    ">
                      This is an automated security email. Please do not
                      reply to this message.
                    </p>

                    <p style="
                      margin: 12px 0 0;
                      font-size: 11px;
                      color: #a1a1aa;
                    ">
                      © ${new Date().getFullYear()} Zyloo. All rights reserved.
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `,
  })
};