export const spreadHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

  <link
    href="https://cdn.grapecity.com/spreadjs/15.2.2/css/gc.spread.sheets.excel2013white.css"
    rel="stylesheet"
  />

  <script src="https://cdn.grapecity.com/spreadjs/15.2.2/gc.spread.sheets.all.min.js"></script>
  <script src="https://cdn.grapecity.com/spreadjs/15.2.2/plugins/gc.spread.sheets.charts.min.js"></script>

  <style>
    html, body {
      margin: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    #spread {
      width: 100%;
      height: 100%;
    }
  </style>
</head>

<body>
  <div id="spread"></div>

  <script>
    let spread;

    document.addEventListener('message', function (e) {
      const base64 = e.data;

      spread = new GC.Spread.Sheets.Workbook(
        document.getElementById('spread'),
        { sheetCount: 1 }
      );

      GC.Spread.Excel.IO.open(base64, spread, function () {
        console.log('Excel loaded');
      });
    });

    function exportExcel() {
      const excelIO = new GC.Spread.Excel.IO();
      excelIO.save(spread, function (blob) {
        const reader = new FileReader();
        reader.onload = function () {
          const base64 = reader.result.split(',')[1];
          window.ReactNativeWebView.postMessage(base64);
        };
        reader.readAsDataURL(blob);
      });
    }
  </script>
</body>
</html>
`;
