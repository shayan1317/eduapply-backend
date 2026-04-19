
export function ResetPassword(code: string, userName: string): string {
    return `
<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset EduApply Password</title>
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
    </style>
</head>

<body>

    <center class="wrapper">

        <table class="main" width="100%">
            <tr>
                <td>
                    <img class="mv-40" width="40" src="https://todo/logo.png" />
                </td>
            </tr>
            <tr>
                <td>
                    <h1>Reset your password?</h1>
                    <p>(happens to the best of us)</p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <p class="descriptionText">If you request a password reset for @${userName}, use
                                    the confirmation code
                                    below to
                                    complete the
                                    process.
                                    If you didn't make this request, forget we had this conversation...</p>
                            </td>
                        </tr>
                    </table>
                    <h4 class="mb-40">${code}</h4>
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
