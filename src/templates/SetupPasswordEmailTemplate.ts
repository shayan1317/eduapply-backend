
export function SetupPasswordEmailTemplate(
    {email, link, name}: {email: string, link: string, name: string}): string {
    return `
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup for EduApply</title>
    <style type="text/css">
        body {
            margin: 0;
            font-family: 'helvetica neue', helvetica, sans-serif;
            -webkit-font-smoothing: antialiased;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #121212;
            padding-bottom: 60px;
            padding-left: 8px;
        }

        .main {
            width: 100%;
            max-width: 700px;
            padding-left: 20px;
        }

        table {
            border-spacing: 0;
        }

        td {
            padding: 0;
        }

        img {
            border: 0;
        }

        .logo {
            margin-top: 20px;
            margin-bottom: 40px;
        }

        h1 {
            font-size: 32px;
            font-weight: 400;
            color: #f9f9f9;
            line-height: 38px;
            margin: 0px;
        }

        h4 {
            font-size: 16px;
            font-weight: 700;
            line-height: 19px;
            color: #f9f9f9;
            margin: 0px;
        }

        p {
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
            margin: 0px;
            color: #f9f9f9;
        }

        .descriptionText {
            width: 430px;
            margin-top: 40px;
            margin-bottom: 40px;
            color: #f9f9f9;
        }

        .paragraphText {
            width: 430px;
            color: #f9f9f9;
        }

        .linkText {
            width: 430px;
            color: #4692FE;
            text-decoration: none;
        }

        .mv-40 {
            margin-top: 40px;
            margin-bottom: 40px;
        }

        .mt-40 {
            margin-top: 40px;
        }

        .mb-40 {
            margin-bottom: 40px;
        }

        .mt-20 {
            margin-top: 20px;
        }

        .mb-20 {
            margin-bottom: 20px;
        }

        .hr {
            border: 0.5px solid #858585;
            width: 375px;
        }

        .button {
            background-color: #4692FE;
            color: #ffffff;
            display: inline-block;
            font-size: 16px;
            font-weight: 600;
            line-height: 48px;
            text-align: center;
            text-decoration: none;
            width: 200px;
            border-radius: 6px;
            margin-bottom: 40px;
            -webkit-text-size-adjust: none;
        }
    </style>
</head>

<body>

    <center class="wrapper">

        <table class="main" width="100%">
            <tr>
                <td>
                    <img class="mv-40" width="40" src="https://todo//logolink" />
                </td>
            </tr>
            <tr>
                <td>
                    <h1>Setup your Eduapply account</h1>
                    <table class="mb-40" role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <p class="descriptionText">${name} setup your EduApply account with email ${email}, click on the link below
                                    to set your password.</p>
                                .</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <a href="${link}" class="button">
                                    Set up Password
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="paragraphText">If you are unable to click on the link, copy and paste the
                                    following link into your browser.</p>
                                <p class="linkText">${link}</p>
                            </td>
                        <tr>
                        <tr>
                            <td>
                                <p class="paragraphText mt-40">This is one time setup password link and will expire after use, Contact Eduapply if expired or not working</p>
                            </td>
                        <tr>
                    </table>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="hr"></td>
                        </tr>
                    </table>
                    <h4 class="mt-40" style="color: #858585;">How do I know an email is from EduApply?</h4>
                    <p style="color: #858585; margin-top: 24px; width: 430px;">Links in this email will start
                        with “https:ll”
                        and
                        contain “eduApply.com.” Your browser will also display a
                        padlock icon to let you know a site is secure.</p>
                </td>
            </tr>

        </table> <!-- End Main Class -->

    </center> <!-- End Wrapper -->

</body>

</html>
`
}
