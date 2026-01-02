const formatHtmlForWebView = (rawHtml: string) => {
  if (!rawHtml) return '';

  // Remove dangerous scripts
  let safeHtml = rawHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove all script tags
    .replace(/on\w+="[^"]*"/g, '') // Remove inline JS events
    .replace(/window\.[^;]*;/g, '') // Remove window.* calls
    .replace(/alert\(.*?\);?/g, '') // Remove alert()
    .replace(/history\.(forward|back)\(\);?/g, '') // Remove back button blocking
    .replace(/document\.onkeydown[\s\S]*?=/g, '') // Remove key blocking
    .replace(/contextmenu/gi, ''); // Remove right click disable

  // Wrap inside full safe HTML structure
  const finalHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <style>
        * {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
        }
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
      </style>
    </head>
    <body>
      ${safeHtml}
    </body>
    </html>
  `;

  return finalHtml;
};

export default formatHtmlForWebView;
