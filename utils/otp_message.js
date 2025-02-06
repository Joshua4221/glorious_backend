export const OtpMessageDisplay = ({ otpCode, name }) => {
  const otpMessage = `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="images/favicon.png" type="image/x-icon" />
          <title>AbaNAba | OTP Email</title>

          <!-- Google Font css -->
          <link rel="preconnect" href="https://fonts.googleapis.com/" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@100;200;300;400;500;600;700;800;900&amp;display=swap"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;600;700;800;900&amp;display=swap"
            rel="stylesheet"
          />

          <style type="text/css">
            body {
              text-align: center;
              margin: 0 auto;
              width: 650px;
              font-family: 'Public Sans', sans-serif;
              background-color: #e2e2e2;
              display: block;
            }

            .mb-3 {
              margin-bottom: 30px;
            }

            ul {
              margin: 0;
              padding: 0;
            }

            li {
              display: inline-block;
              text-decoration: unset;
            }

            a {
              text-decoration: none;
            }

            h5 {
              margin: 10px;
              color: #777;
            }

            .text-center {
              text-align: center;
            }

            .header-menu ul li + li {
              margin-left: 20px;
            }

            .header-menu ul li a {
              font-size: 14px;
              color: #252525;
              font-weight: 500;
            }

            .otp-button {
              background-color: #0da487;
              border: none;
              color: #fff;
              padding: 14px 26px;
              font-size: 18px;
              border-radius: 6px;
              font-weight: 700;
              font-family: 'Nunito Sans', sans-serif;
            }

            .footer-table {
              position: relative;
            }

            .footer-table::before {
              position: absolute;
              content: '';
              background-image: url(images/footer-left.svg);
              background-position: top right;
              top: 0;
              left: -71%;
              width: 100%;
              height: 100%;
              background-repeat: no-repeat;
              z-index: -1;
              background-size: contain;
              opacity: 0.3;
            }

            .footer-table::after {
              position: absolute;
              content: '';
              background-image: url(images/footer-right.svg);
              background-position: top right;
              top: 0;
              right: 0;
              width: 100%;
              height: 100%;
              background-repeat: no-repeat;
              z-index: -1;
              background-size: contain;
              opacity: 0.3;
            }

            .theme-color {
              color: #0da487;
            }
          </style>
        </head>

        <body style="margin: 20px auto">
          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            style="
              background-color: white;
              width: 100%;
              box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);
              -webkit-box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);
            "
          >
            <tbody>
              <tr>
                <td>
                  <table
                    class="header-table"
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                  >
                    <tr
                      class="header"
                      style="
                        background-color: #f7f7f7;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                      "
                    >
                      <td class="header-logo" style="padding: 10px 32px">
                        <a
                          href="../front-end/index.html"
                          style="display: block; text-align: left"
                        >
                          <img src="images/logo.png" class="main-logo" alt="logo" />
                        </a>
                      </td>
                      <td
                        class="header-menu"
                        style="display: block; padding: 10px 32px; text-align: right"
                      >
                        <ul>
                          <li>
                            <a href="../front-end/index.html">Home</a>
                          </li>
                          <li>
                            <a href="../front-end/wishlist.html">Wishlist</a>
                          </li>
                          <li>
                            <a href="../front-end/cart.html">My Cart</a>
                          </li>
                          <li>
                            <a href="../front-end/contact-us.html">Contact</a>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </table>

                  <table
                    class="content-table"
                    style="margin-bottom: -6px"
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                  >
                    <thead>
                      <tr>
                        <td>
                          <img src="images/otp-banner.jpg" alt="OTP Verification" />
                        </td>
                      </tr>
                    </thead>
                  </table>

                  <table
                    class="content-table"
                    style="margin-top: 40px"
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                  >
                    <thead>
                      <tr style="display: block">
                        <td style="display: block">
                          <h3
                            style="
                              font-weight: 700;
                              font-size: 20px;
                              margin: 0;
                              text-transform: uppercase;
                            "
                          >
                            Hi ${name?.toUpperCase()}, Your OTP Code is Here!
                          </h3>
                        </td>

                        <td>
                          <p
                            style="
                              font-size: 14px;
                              font-weight: 600;
                              width: 82%;
                              margin: 8px auto 0;
                              line-height: 1.5;
                              color: #939393;
                              font-family: 'Nunito Sans', sans-serif;
                            "
                          >
                            To complete your sign-up process, please use the following OTP code to verify your email address.
                          </p>
                          <h2
                            style="
                              font-size: 36px;
                              font-weight: 700;
                              margin: 20px 0;
                              color: #0da487;
                              font-family: 'Nunito Sans', sans-serif;
                            "
                          >
                            ${otpCode?.toUpperCase()}
                          </h2>
                        </td>
                      </tr>
                    </thead>
                  </table>

                  <table
                    class="button-table"
                    style="margin: 34px 0"
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                  >
                    <thead>
                      <tr style="display: block">
                        <td style="display: block">
                          <button class="otp-button">Verify OTP</button>
                        </td>
                      </tr>
                    </thead>
                  </table>

                  <table
                    class="content-table"
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                  >
                    <thead>
                      <tr style="display: block">
                        <td style="display: block">
                          <p
                            style="
                              font-size: 14px;
                              font-weight: 600;
                              width: 82%;
                              margin: 0 auto;
                              line-height: 1.5;
                              color: #939393;
                              font-family: 'Nunito Sans', sans-serif;
                            "
                          >
                            If you have any questions, please email us at
                            <span class="theme-color">AbaNAba@example.com</span> or
                            visit our <span class="theme-color">FAQs.</span> You can
                            also chat with a real live human during our operating
                            hours. They can answer questions about your account or help you
                            with any other issues.
                          </p>
                        </td>
                      </tr>
                    </thead>
                  </table>

                  <table
                    class="text-center footer-table"
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="
                      background-color: #282834;
                      color: white;
                      padding: 24px;
                      overflow: hidden;
                      z-index: 0;
                      margin-top: 30px;
                    "
                  >
                    <tr>
                      <td>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="footer-social-icon text-center"
                          align="center"
                          style="margin: 8px auto 11px"
                        >
                        
                                        <tr>
                            <td>
                              <h4
                                style="font-size: 19px; font-weight: 700; margin: 0"
                              >
                                Shop For <span class="theme-color">AbaNAba</span>
                              </h4>
                            </td>
                          </tr>
                        </table>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="footer-social-icon text-center"
                          align="center"
                          style="margin: 8px auto 20px"
                        >
                          <tr>
                            <td>
                              <a
                                href="javascript:void(0)"
                                style="
                                  font-size: 14px;
                                  font-weight: 600;
                                  color: #fff;
                                  text-decoration: underline;
                                  text-transform: capitalize;
                                "
                                >Contact Us</a
                              >
                            </td>
                            <td>
                              <a
                                href="javascript:void(0)"
                                style="
                                  font-size: 14px;
                                  font-weight: 600;
                                  color: #fff;
                                  text-decoration: underline;
                                  text-transform: capitalize;
                                  margin-left: 20px;
                                "
                                >Unsubscribe</a
                              >
                            </td>
                            <td>
                              <a
                                href="javascript:void(0)"
                                style="
                                  font-size: 14px;
                                  font-weight: 600;
                                  color: #fff;
                                  text-decoration: underline;
                                  text-transform: capitalize;
                                  margin-left: 20px;
                                "
                                >Privacy Policy</a
                              >
                            </td>
                          </tr>
                        </table>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="footer-social-icon text-center"
                          align="center"
                          style="margin: 23px auto"
                        >
                          <tr>
                            <td>
                              <a href="www.facebook.html">
                                <img
                                  src="images/fb.png"
                                  style="
                                    font-size: 25px;
                                    margin: 0 18px 0 0;
                                    width: 22px;
                                    filter: invert(1);
                                  "
                                  alt="Facebook"
                                />
                              </a>
                            </td>
                            <td>
                              <a href="www.twitter.html">
                                <img
                                  src="images/twitter.png"
                                  style="
                                    font-size: 25px;
                                    margin: 0 18px 0 0;
                                    width: 22px;
                                    filter: invert(1);
                                  "
                                  alt="Twitter"
                                />
                              </a>
                            </td>
                            <td>
                              <a href="www.instagram.html">
                                <img
                                  src="images/insta.png"
                                  style="
                                    font-size: 25px;
                                    margin: 0 18px 0 0;
                                    width: 22px;
                                    filter: invert(1);
                                  "
                                  alt="Instagram"
                                />
                              </a>
                            </td>
                            <td>
                              <a href="www.pinterest.html">
                                <img
                                  src="images/pinterest.png"
                                  style="
                                    font-size: 25px;
                                    margin: 0 18px 0 0;
                                    width: 22px;
                                    filter: invert(1);
                                  "
                                  alt="Pinterest"
                                />
                              </a>
                            </td>
                          </tr>
                        </table>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                        >
                          <tr>
                            <td>
                              <h5
                                style="
                                  font-size: 13px;
                                  text-transform: uppercase;
                                  margin: 0;
                                  color: #ddd;
                                  letter-spacing: 1px;
                                  font-weight: 500;
                                "
                              >
                                Want to change how you receive these emails?
                              </h5>
                              <h5
                                style="
                                  font-size: 13px;
                                  text-transform: uppercase;
                                  margin: 10px 0 0;
                                  color: #ddd;
                                  letter-spacing: 1px;
                                  font-weight: 500;
                                "
                              >
                                2021-22 Copyright by ThemeForest powered by Pixelstrap
                              </h5>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>

  `;
  return otpMessage;
};
