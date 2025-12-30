// ============================================
// REACHFOOD - GOOGLE APPS SCRIPT
// Handles: Orders, Contact Forms, Bookings
// Email: reachfood2024@gmail.com
// ============================================

var YOUR_EMAIL = "reachfood2024@gmail.com";
var ORDERS_SHEET = "ReachFood Orders";
var CONTACTS_SHEET = "ReachFood Contacts";
var BOOKINGS_SHEET = "ReachFood Bookings";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Route based on type
    if (data.type === 'contact') {
      handleContact(data);
    } else if (data.type === 'booking') {
      handleBooking(data);
    } else {
      // Default: Order
      handleOrder(data);
    }

    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: "OK", message: "ReachFood API is running"})).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// ORDER HANDLING
// ============================================

function handleOrder(data) {
  saveOrderToSpreadsheet(data);
  sendOrderNotification(data);
  sendCustomerConfirmation(data);
}

function saveOrderToSpreadsheet(data) {
  var spreadsheet = getOrCreateSpreadsheet(ORDERS_SHEET, ["Order Number", "Date", "Customer Name", "Email", "Phone", "Address", "Items", "Total ($)", "Status", "Source"]);
  var sheet = spreadsheet.getActiveSheet();

  var itemsList = "";
  for (var i = 0; i < data.items.length; i++) {
    var item = data.items[i];
    if (i > 0) itemsList += ", ";
    itemsList += item.name + " x" + item.quantity + " ($" + item.price + ")";
  }

  var source = data.source || "shop.reachfood.co";

  sheet.appendRow([
    data.orderNumber,
    new Date().toLocaleString(),
    data.customer.fullName,
    data.customer.email,
    data.customer.phone,
    data.customer.address,
    itemsList,
    data.total,
    "New",
    source
  ]);
}

function sendOrderNotification(data) {
  var itemsHtml = "";
  for (var i = 0; i < data.items.length; i++) {
    var item = data.items[i];
    itemsHtml += "<tr><td style='padding:12px;border-bottom:1px solid #eee'>" + item.name + "</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:center'>" + item.quantity + "</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:right'>$" + item.price + "</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:right'>$" + (item.price * item.quantity) + "</td></tr>";
  }

  var source = data.source || "shop.reachfood.co";

  var html = "<!DOCTYPE html><html><head><style>";
  html += "body{font-family:Arial,sans-serif;line-height:1.6;color:#333}";
  html += ".container{max-width:600px;margin:0 auto;padding:20px}";
  html += ".header{background:linear-gradient(135deg,#0D4A52,#1A5F6A);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}";
  html += ".content{background:#fff;padding:30px;border:1px solid #eee}";
  html += ".info{background:#fef3c7;padding:20px;border-radius:8px;margin:20px 0}";
  html += "table{width:100%;border-collapse:collapse;margin:20px 0}";
  html += "th{background:#f3f4f6;padding:12px;text-align:left}";
  html += ".total{font-size:24px;color:#E8862A;font-weight:bold}";
  html += ".source{background:#e0f2fe;padding:8px 12px;border-radius:4px;display:inline-block;margin-top:10px;font-size:12px}";
  html += "</style></head><body><div class='container'>";
  html += "<div class='header'><h1>New Order Received!</h1><p style='font-size:24px;margin:0'>Order #" + data.orderNumber + "</p>";
  html += "<span class='source'>Source: " + source + "</span></div>";
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
  html += "<p class='total'>Total: $" + data.total + "</p></div>";
  html += "<p><strong>Payment:</strong> Cash on Delivery</p>";
  html += "</div></div></body></html>";

  MailApp.sendEmail({
    to: YOUR_EMAIL,
    subject: "🛒 New Order #" + data.orderNumber + " - " + data.customer.fullName + " - $" + data.total,
    htmlBody: html
  });
}

function sendCustomerConfirmation(data) {
  var itemsHtml = "";
  for (var i = 0; i < data.items.length; i++) {
    var item = data.items[i];
    itemsHtml += "<tr><td style='padding:12px;border-bottom:1px solid #eee'>" + item.name + "</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:center'>" + item.quantity + "</td>";
    itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:right'>$" + (item.price * item.quantity) + "</td></tr>";
  }

  var html = "<!DOCTYPE html><html><head><style>";
  html += "body{font-family:Arial,sans-serif;line-height:1.6;color:#333}";
  html += ".container{max-width:600px;margin:0 auto;padding:20px}";
  html += ".header{background:linear-gradient(135deg,#0D4A52,#1A5F6A);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}";
  html += ".content{background:#fff;padding:30px;border:1px solid #eee}";
  html += ".info{background:#f9fafb;padding:20px;border-radius:8px;margin:20px 0}";
  html += "table{width:100%;border-collapse:collapse;margin:20px 0}";
  html += "th{background:#f3f4f6;padding:12px;text-align:left}";
  html += ".total{font-size:24px;color:#E8862A;font-weight:bold}";
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
  html += "<p class='total'>Total: $" + data.total + "</p></div>";
  html += "<div class='info'><p><strong>Delivery Address:</strong><br>" + data.customer.address + "</p>";
  html += "<p><strong>Payment:</strong> Cash on Delivery</p>";
  html += "<p><strong>Estimated Delivery:</strong> 3-5 business days</p></div>";
  html += "<p>If you have any questions, please contact us at " + YOUR_EMAIL + "</p>";
  html += "</div></div></body></html>";

  MailApp.sendEmail({
    to: data.customer.email,
    subject: "✅ Order Confirmation #" + data.orderNumber + " - ReachFood",
    htmlBody: html
  });
}

// ============================================
// CONTACT FORM HANDLING
// ============================================

function handleContact(data) {
  saveContactToSpreadsheet(data);
  sendContactNotification(data);
}

function saveContactToSpreadsheet(data) {
  var spreadsheet = getOrCreateSpreadsheet(CONTACTS_SHEET, ["Date", "First Name", "Last Name", "Email", "Organization", "Inquiry Type", "Message", "Status", "Source"]);
  var sheet = spreadsheet.getActiveSheet();

  var source = data.source || "shop.reachfood.co";

  sheet.appendRow([
    new Date().toLocaleString(),
    data.firstName,
    data.lastName,
    data.email,
    data.organization || "",
    data.inquiryType,
    data.message,
    "New",
    source
  ]);
}

function sendContactNotification(data) {
  var source = data.source || "shop.reachfood.co";

  var html = "<!DOCTYPE html><html><head><style>";
  html += "body{font-family:Arial,sans-serif;line-height:1.6;color:#333}";
  html += ".container{max-width:600px;margin:0 auto;padding:20px}";
  html += ".header{background:linear-gradient(135deg,#0D4A52,#1A5F6A);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}";
  html += ".content{background:#fff;padding:30px;border:1px solid #eee;border-radius:0 0 10px 10px}";
  html += ".info{background:#e0f2fe;padding:20px;border-radius:8px;margin:20px 0}";
  html += ".message{background:#f9fafb;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #E8862A}";
  html += ".source{background:#fef3c7;padding:8px 12px;border-radius:4px;display:inline-block;margin-top:10px;font-size:12px}";
  html += "</style></head><body><div class='container'>";
  html += "<div class='header'><h1>New Contact Message</h1>";
  html += "<span class='source'>From: " + source + "</span></div>";
  html += "<div class='content'>";
  html += "<div class='info'>";
  html += "<p><strong>Name:</strong> " + data.firstName + " " + data.lastName + "</p>";
  html += "<p><strong>Email:</strong> <a href='mailto:" + data.email + "'>" + data.email + "</a></p>";
  if (data.organization) {
    html += "<p><strong>Organization:</strong> " + data.organization + "</p>";
  }
  html += "<p><strong>Inquiry Type:</strong> " + data.inquiryType + "</p>";
  html += "</div>";
  html += "<div class='message'><h3>Message:</h3><p>" + data.message.replace(/\n/g, "<br>") + "</p></div>";
  html += "<p style='text-align:center;margin-top:30px'><a href='mailto:" + data.email + "' style='background:#E8862A;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold'>Reply to " + data.firstName + "</a></p>";
  html += "</div></div></body></html>";

  MailApp.sendEmail({
    to: YOUR_EMAIL,
    subject: "📧 Contact: " + data.inquiryType + " - " + data.firstName + " " + data.lastName,
    htmlBody: html,
    replyTo: data.email
  });
}

// ============================================
// BOOKING HANDLING (for main site)
// ============================================

function handleBooking(data) {
  saveBookingToSpreadsheet(data);
  sendBookingNotification(data);
}

function saveBookingToSpreadsheet(data) {
  var spreadsheet = getOrCreateSpreadsheet(BOOKINGS_SHEET, ["Date", "Customer Name", "Email", "Phone", "Country", "Items", "Total ($)", "Status", "Source"]);
  var sheet = spreadsheet.getActiveSheet();

  var itemsList = "";
  if (data.items) {
    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      if (i > 0) itemsList += ", ";
      itemsList += item.name + " x" + item.quantity;
    }
  }

  var source = data.source || "reachfood.co";

  sheet.appendRow([
    new Date().toLocaleString(),
    data.customer.fullName,
    data.customer.email,
    data.customer.phone || "",
    data.customer.country || "",
    itemsList,
    data.total || 0,
    "New",
    source
  ]);
}

function sendBookingNotification(data) {
  var source = data.source || "reachfood.co";

  var itemsHtml = "";
  if (data.items) {
    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      itemsHtml += "<tr><td style='padding:12px;border-bottom:1px solid #eee'>" + item.name + "</td>";
      itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:center'>" + item.quantity + "</td>";
      itemsHtml += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:right'>$" + (item.price * item.quantity) + "</td></tr>";
    }
  }

  var html = "<!DOCTYPE html><html><head><style>";
  html += "body{font-family:Arial,sans-serif;line-height:1.6;color:#333}";
  html += ".container{max-width:600px;margin:0 auto;padding:20px}";
  html += ".header{background:linear-gradient(135deg,#0D4A52,#1A5F6A);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}";
  html += ".content{background:#fff;padding:30px;border:1px solid #eee}";
  html += ".info{background:#fef3c7;padding:20px;border-radius:8px;margin:20px 0}";
  html += "table{width:100%;border-collapse:collapse;margin:20px 0}";
  html += "th{background:#f3f4f6;padding:12px;text-align:left}";
  html += ".total{font-size:24px;color:#E8862A;font-weight:bold}";
  html += ".source{background:#e0f2fe;padding:8px 12px;border-radius:4px;display:inline-block;margin-top:10px;font-size:12px}";
  html += "</style></head><body><div class='container'>";
  html += "<div class='header'><h1>New Booking Request</h1>";
  html += "<span class='source'>From: " + source + "</span></div>";
  html += "<div class='content'>";
  html += "<div class='info'><h3>Customer Details</h3>";
  html += "<p><strong>Name:</strong> " + data.customer.fullName + "</p>";
  html += "<p><strong>Email:</strong> " + data.customer.email + "</p>";
  if (data.customer.phone) html += "<p><strong>Phone:</strong> " + data.customer.phone + "</p>";
  if (data.customer.country) html += "<p><strong>Country:</strong> " + data.customer.country + "</p>";
  html += "</div>";
  if (itemsHtml) {
    html += "<h3>Requested Items</h3><table><thead><tr><th>Product</th><th style='text-align:center'>Qty</th><th style='text-align:right'>Subtotal</th></tr></thead><tbody>";
    html += itemsHtml + "</tbody></table>";
    html += "<div style='text-align:right'><p class='total'>Total: $" + data.total + "</p></div>";
  }
  html += "<p><strong>Payment:</strong> Cash on Delivery</p>";
  html += "</div></div></body></html>";

  MailApp.sendEmail({
    to: YOUR_EMAIL,
    subject: "📋 New Booking - " + data.customer.fullName + " - $" + (data.total || 0),
    htmlBody: html
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getOrCreateSpreadsheet(name, headers) {
  var files = DriveApp.getFilesByName(name);
  var spreadsheet;

  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(name);
    var sheet = spreadsheet.getActiveSheet();
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");
  }

  return spreadsheet;
}

// ============================================
// TEST FUNCTIONS
// ============================================

function testOrder() {
  var testData = {
    orderNumber: "TEST-001",
    customer: {
      fullName: "Test Customer",
      email: YOUR_EMAIL,
      phone: "+966500000000",
      address: "123 Test Street, Riyadh"
    },
    items: [
      {name: "Re-Collagen Meal", quantity: 2, price: 12},
      {name: "Re-Protein Meal", quantity: 1, price: 8}
    ],
    total: 32,
    source: "shop.reachfood.co"
  };
  handleOrder(testData);
  Logger.log("Order test complete!");
}

function testContact() {
  var testData = {
    type: "contact",
    firstName: "Test",
    lastName: "User",
    email: YOUR_EMAIL,
    organization: "Test Company",
    inquiryType: "General Inquiry",
    message: "This is a test contact message.",
    source: "reachfood.co"
  };
  handleContact(testData);
  Logger.log("Contact test complete!");
}

function testBooking() {
  var testData = {
    type: "booking",
    customer: {
      fullName: "Test Booker",
      email: YOUR_EMAIL,
      phone: "+962790000000",
      country: "Jordan"
    },
    items: [
      {name: "Collagen Boost Meal Kit", quantity: 1, price: 24.99}
    ],
    total: 24.99,
    source: "reachfood.co"
  };
  handleBooking(testData);
  Logger.log("Booking test complete!");
}
