export const MailOTPVerification = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset OTP</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0; width: 100%; background-color: #f8f9fa;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px;">
          <!-- Header Section -->
          <tr>
            <td style="background-color: green; padding: 20px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px;">Find Employee Job Portal</h1>
            </td>
          </tr>
          <!-- Body Section -->
          <tr>
            <td style="padding: 20px;">
              <h2 style="color: #333;">Password Reset OTP</h2>
              <p style="font-size: 16px; line-height: 1.6;">
                Hello {name},<br>
                You have requested to reset your password for your <strong>Find Employee Job Portal</strong> account. Use the One-Time Password (OTP) below to proceed:
              </p>
              <p style="text-align: center; margin: 20px 0;">
                <span style="background-color: #f8f9fa; border: 1px solid green; color: green; padding: 8px 15px; border-radius: 5px; display: inline-block; font-size: 18px; font-weight: bold;">{OTP}</span>
              </p>
              <p style="font-size: 14px; color: #555; line-height: 1.6;">
                This OTP is valid for the next 10 minutes. Please enter it on the password reset page to continue. If you did not request a password reset, you can safely ignore this email.
              </p>
              <p style="font-size: 14px; color: #555; line-height: 1.6;">
                If you need further assistance, please contact our support team.
              </p>
            </td>
          </tr>
          <!-- Footer Section -->
          <tr>
            <td style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #555;">
              <p style="margin: 0;">&copy; 2025 Find Employee Job Portal. All rights reserved.</p>
              <p style="margin: 0;">123 Job Street, Employment City, Dehradun</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`