var YOUR_EMAIL = "reachfood2024@gmail.com";
var SPREADSHEET_NAME = "ReachFood Orders";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    saveToSpreadsheet(data);
    sendEmailNotification(data);
    sendCustomerConfirmation(data);
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: "OK"})).setMimeType(ContentService.MimeType.JSON);
}

function saveToSpreadsheet(data) {
  var spreadsheet;
  var files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
    var sheet = spreadsheet.getActiveSheet();
    sheet.appendRow(["Order Number", "Date", "Customer Name", "Email", "Phone", "Address", "Items", "Total (SAR)", "Status"]);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#f3f4f6");
  }
  var sheet = spreadsheet.getActiveSheet();
  var itemsList = "";
  for (var i = 0; i < data.items.length; i++) {
    var item = data.items[i];
    if (i > 0) itemsList += ", ";
    itemsList += item.name + " x" + item.quantity + " (" + item.price + " SAR)";
  }
  sheet.appendRow([
    data.orderNumber,
    new Date().toLocaleString(),
    data.customer.fullName,
    data.customer.email,
    data.customer.phone,
    data.customer.address,
    itemsList,
    data.total,
    "New"
  ]);
}

function sendEmailNotification(data) {
  var itemsHtml = "";
  for (var i = 0; i < data.items.length; i++) {
    var item = data.items[i];
    itemsHtml += "<tr><td style='padding:12px;border-bottom:1px solid #eee'>" + item.name + "</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:center'>" + item.quantity + "</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:right'>" + item.price + " SAR</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:right'>" + (item.price * item.quantity) + " SAR</td></tr>";
  }

  var html = "<!DOCTYPE html><html><head><style>";
  html += "body{font-family:Arial,sans-serif;line-height:1.6;color:#333}";
  html += ".container{max-width:600px;margin:0 auto;padding:20px}";
  html += ".header{background:linear-gradient(135deg,#f97316,#ea580c);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}";
  html += ".content{background:#fff;padding:30px;border:1px solid #eee}";
  html += ".info{background:#fef3c7;padding:20px;border-radius:8px;margin:20px 0}";
  html += "table{width:100%;border-collapse:collapse;margin:20px 0}";
  html += "th{background:#f3f4f6;padding:12px;text-align:left}";
  html += ".total{font-size:24px;color:#f97316;font-weight:bold}";
  html += "</style></head><body><div class='container'>";
  html += "<div class='header'><h1>New Order Received!</h1><p style='font-size:24px;margin:0'>Order #" + data.orderNumber + "</p></div>";
  html += "<div class='content'>";
  html += "<div class='info'><h3>Customer Details</h3>";
  html += "<p><strong>Name:</strong> " + data.customer.fullName + "</p>";
  html += "<p><strong>Email:</strong> " + data.customer.email + "</p>";
  html += "<p><strong>Phone:</strong> " + data.customer.phone + "</p>";
  html += "<p><strong>Address:</strong><br>" + data.customer.address + "</p></div>";
  html += "<h3>Order Items</h3><table><thead><tr><th>Product</th><th style='text-align:center'>Qty</th><th style='text-align:right'>Price</th><th style='text-align:right'>Subtotal</th></tr></thead><tbody>";
  html += itemsHtml + "</tbody></table>";
  html += "<div style='text-align:right;background:#f9fafb;padding:20px;border-radius:8px'>";
  html += "<p>Delivery: <strong>FREE</strong></p>";
  html += "<p class='total'>Total: " + data.total + " SAR</p></div>";
  html += "<p><strong>Payment:</strong> Cash on Delivery</p>";
  html += "</div></div></body></html>";

  MailApp.sendEmail({
    to: YOUR_EMAIL,
    subject: "New Order #" + data.orderNumber + " - " + data.customer.fullName + " - " + data.total + " SAR",
    htmlBody: html
  });
}

function sendCustomerConfirmation(data) {
  var itemsHtml = "";
  for (var i = 0; i < data.items.length; i++) {
    var item = data.items[i];
    itemsHtml += "<tr><td style='padding:12px;border-bottom:1px solid #eee'>" + item.name + "</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:center'>" + item.quantity + "</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:right'>" + (item.price * item.quantity) + " SAR</td></tr>";
  }

  var html = "<!DOCTYPE html><html><head><style>";
  html += "body{font-family:Arial,sans-serif;line-height:1.6;color:#333}";
  html += ".container{max-width:600px;margin:0 auto;padding:20px}";
  html += ".header{background:linear-gradient(135deg,#f97316,#ea580c);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}";
  html += ".content{background:#fff;padding:30px;border:1px solid #eee}";
  html += ".info{background:#f9fafb;padding:20px;border-radius:8px;margin:20px 0}";
  html += "table{width:100%;border-collapse:collapse;margin:20px 0}";
  html += "th{background:#f3f4f6;padding:12px;text-align:left}";
  html += ".total{font-size:24px;color:#f97316;font-weight:bold}";
  html += "</style></head><body><div class='container'>";
  html += "<div class='header'><h1>Thank You for Your Order!</h1><p style='font-size:18px;margin:0'>ReachFood</p></div>";
  html += "<div class='content'>";
  html += "<p>Dear " + data.customer.fullName + ",</p>";
  html += "<p>Thank you for your order! We have received it and will begin preparing it shortly.</p>";
  html += "<div class='info'><h3>Order #" + data.orderNumber + "</h3></div>";
  html += "<h3>Your Order</h3><table><thead><tr><th>Product</th><th style='text-align:center'>Qty</th><th style='text-align:right'>Subtotal</th></tr></thead><tbody>";
  html += itemsHtml + "</tbody></table>";
  html += "<div style='text-align:right;background:#f9fafb;padding:20px;border-radius:8px'>";
  html += "<p>Delivery: <strong>FREE</strong></p>";
  html += "<p class='total'>Total: " + data.total + " SAR</p></div>";
  html += "<div class='info'><p><strong>Delivery Address:</strong><br>" + data.customer.address + "</p>";
  html += "<p><strong>Payment:</strong> Cash on Delivery</p>";
  html += "<p><strong>Estimated Delivery:</strong> 3-5 business days</p></div>";
  html += "<p>If you have any questions, please contact us.</p>";
  html += "</div></div></body></html>";

  MailApp.sendEmail({
    to: data.customer.email,
    subject: "Order Confirmation #" + data.orderNumber + " - ReachFood",
    htmlBody: html
  });
}

function testEmail() {
  var testData = {
    orderNumber: "123456",
    customer: {
      fullName: "Test Customer",
      email: YOUR_EMAIL,
      phone: "+966500000000",
      address: "123 Test Street, Riyadh"
    },
    items: [
      {name: "Premium Saffron", quantity: 2, price: 150},
      {name: "Organic Honey", quantity: 1, price: 85}
    ],
    total: 385
  };
  sendEmailNotification(testData);
  saveToSpreadsheet(testData);
  Logger.log("Test complete!");
}
