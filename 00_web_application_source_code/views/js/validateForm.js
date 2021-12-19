//========================================================================================================================
// Filename: validateForm.js
// Purpose: To be used in order.html page
// The script here validates user input data and display Error Message and guideline to help user to fill in the form correctly
//   Before user is able to submit their orders, the following checks is conducted:
// - 1) Ensure User selected a collection method
// - 2) Ensure User selected a delivery timing
// - 3) Ensure User selected a delivery Date, and Date Selection range is made available one day after current date
// - 4) Ensure User at least selected a product
// - 5) Ensure User enters the address if delivery option is selected

// The Script here also calculates the following:
// - 1) Calculates the subtotal of Promotional items and individual items
// - 2) Calcualtes the amount to hit free delivery
// - 3) Calculates the number of selected items matches the total promotion items
//=========================================================================================================================

//========================================
// Form Validation Scripts: Error Messages
//=========================================

//=========================================
// To Validate Collection method
// To Ensure the User had selected at least one collection method
//=========================================
function ValidateMethod() {
  var len = $('input[name="method"]:checked').length;
  if (len == 0) {
    // If at no collection method is selected, Show the Error Message
    $("#methodMsg").show();
    $("#methodMsg").text("Remember to select your preferred Collection Method");
    $("#methodMsg").parent().addClass("itemError"); // Add style to the text
    return false;
  } else {
    // If at least one collection method is selected, Hide the Error Message
    $("#methodMsg").hide();
    return true;
  }
} //End ValidateForm() Function

function ValidateAddress() {
    var method = $("input[name='method']:checked"). val();
    if(method=="self"){
        return true;
    }
    else{
        var address =$("#address").val() == ""
        var floor = $("#floor").val() == ""
        var unit = $("#unit").val() == ""
        var postal = $("#postal").val() == ""

        if (address || floor || unit || postal){
            $("#addressMsg").show();
            $("#addressMsg").text("Let us know where to deliver our Ice Cream to you!");
            $("#addressMsg").parent().addClass("itemError");
            return false
        }
        else{
            return true
        }
    }
   
  } //End ValidateAddress() Function

//========================================
// Validate Preferred Time
// To Ensure the User had selected at least one timeslot
//=========================================
function ValidateTime() {
  var time = $("#time option:checked").val(); //Get the Value of selected time

  // The value of default choice ('--Select a Timing--') is attach to "invalid"
  // Then Show the Error Message
  if (time == "invalid") {
    $("#timeMsg").show();
    $("#timeMsg").text("Remember to select your preferred Time");
    $("#timeMsg").parent().addClass("itemError");
    return false;
  } else {
    return true;
  }
} //End ValidateTime() Function

//========================================
// Validate Preferred Date
// To Ensure user had selected one delivery date
//=========================================
function ValidateDate() {
  var date = $("#DeliveryDate").val();
  if (!date) {
    // No date input
    $("#dateMsg").show();
    $("#dateMsg").text("Remember to select your preferred Date");
    $("#dateMsg").parent().addClass("itemError");
    return false;
  } else {
    return true;
  }
} //End ValidateDate() Function

//=========================================
// Validate Order
// To ensure that user had select at least one promotional bundle
// or at least one ice cream tub
//=========================================
function ValidateOrder() {
  var success = true;
  var familyCount = $("#family").val(); // Number of Family Bundle
  var coupleCount = $("#couple").val(); // Number of Couple Bundle

  var promoCount = 0; // Initialize the number of ice cream tub choosen under the bundle promotion

  // Count the number of ice cream tub choosen under the promotion bundle
  $("input.Promo").each(function () {
    var value = parseInt($(this).val(), 10);
    promoCount += value;
  });

  var validCount = familyCount * 4 + coupleCount * 2; // Counts the number of ice cream tub user can order with selected bundle

  var indivCount = 0; // Counts the number of ice cream tub user individually
  $("input.Indiv").each(function () {
    var value = parseInt($(this).val(), 10);
    indivCount += value;
  });
  var count = familyCount + coupleCount + indivCount; // Total number of ice cream tub user selected

  if (count == 0) {
    // If no ice cream is selected, display error message
    $("#orderMsg").show();
    $("#orderMsg").text("Let us send at least One Ice Cream to You!");
    $("#orderMsg").parent().addClass("itemError");
    success = false;
  }

  // if number of ice cream tub does not match with the number of tub user can select under promotion bundle,
  // display error message
  if (promoCount != validCount) {
    success = false;
  }

  return success;
} //End ValidateOrder() Function

function formCheck() {
  // Main Function to conduct form check upon submitting the form
  var method = ValidateMethod();
  var time = ValidateTime();
  var date = ValidateDate();
  var order = ValidateOrder();
  var address= ValidateAddress();
  var checkForm =  method && time && date && order && address
  if(checkForm){
    alert("Your Orders has been submitted Successfully");
    return checkForm;
  }
  else{
    alert("Incomplete Form");
  }
  
}

//========================================
// Form Validation: onchange events
// To observe user input and hides/shows error messages accordingly
//=========================================

$(document).ready(function () {
  // To ensure that the delivery data is always one day after today date
  // Get today data and adds one day to the min date for the date picker.
  var dtToday = new Date();
  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate() + 1;
  var year = dtToday.getFullYear();

  if (month < 10) month = "0" + month.toString();
  if (day < 10) day = "0" + day.toString();
  var minDate = year + "-" + month + "-" + day;
  $("#DeliveryDate").attr("min", minDate);

  // Hide Error Message for Collection Method once User had choosen one option
  $(".address").hide()
  $('input[name="method"]').change(function () {
    $("#methodMsg").hide();
    $("#methodMsg").parent().removeClass("itemError");
    var method = $("input[name='method']:checked"). val();

    if( method =="delivery"){
        $(".address").show()
    }
    else{
        $(".address").hide()
    }
    
  });

  // Hide Error Message for Time once user selected at least one timing
  $('select[name="time"]').change(function () {
    $("#timeMsg").hide();
    $("#timeMsg").parent().removeClass("itemError");
  });

  // Hide Error Message for Data once User selected one date
  $("#DeliveryDate").change(function () {
    
    $("#dateMsg").hide();
    $("#dateMsg").parent().removeClass("itemError");
  });


    // Hide Error Message for Address once User selected one date
    $("#address, #floor, #unit, #postal").change(function () {
        console.log('Change Address')
    
        var address =$("#address").val() != ""
        var floor = $("#floor").val() != ""
        var unit = $("#unit").val() != ""
        var postal = $("#postal").val() != ""
    
        if (address && floor && unit && postal){
            $("#addressMsg").hide();
            $("#addressMsg").parent().removeClass("itemError");
        }
    
      
      });
});



// To calculate minimum number of individual
$(document).ready(function () {
  var family = 0;
  var couple = 0;
  var count = 0;
  var promoPrice = 0;
  var indivPrice = 0;
  var totalPrice = 0;
  var freePrice = 50;
  $("#indivPrice").text(indivPrice);
  $("#totalPrice").text(totalPrice);

  var Price18 = ["Indiv_PY", "Indiv_KM", "Indiv_MR", "Indiv_WB", "Indiv_CB"];
  var Price20 = ["Indiv_TM", "Indiv_Brownie"];

  $(".PromoSelect").hide(); //Hide Promotion selection at start
  $("#promoCount").text(0); //Set promotion ice cream tub to Zero at start
  $("#promoPrice").text(0); //Set sub-total price for promotion bundle to Zero at start

  // If Family Bundle or Couple Bundle is more than 1, show promotion ice cream selection options, else hide them away
  $("#family, #couple").change(function () {
    var family = parseInt($("#family").val());
    var couple = parseInt($("#couple").val());

    if (family != 0 || couple != 0) {
      $(".PromoSelect").show();
    } else {
      $(".PromoSelect").hide();
    }
    count = family * 4 + couple * 2;
    promoPrice = family * 50 + couple * 22;
    $("#promoCount").text(count);
    $("#promoPrice").text(promoPrice);
  });


  // To ensure that the number of ice cream user selected matches with the bundle available
  var totalpoint = 0;
  $(".Promo,#family, #couple").change(function () {
    var totalpoint = 0;
    $(".Promo").each(function () {
      var value = parseInt($(this).val(), 10);
      if (value > 0) {
        $(this).css("background", "rgb(93, 210, 63,0.3)"); // Change input box to light green with count more than 1
      } else {
        $(this).css("background", "white"); // Change input box to white colour (Default) with count == 0
      }

      totalpoint += value;
    });
    $("#selected").text(totalpoint);
    if (totalpoint != count) {  // if users selected the number of ice cream tub that doesnt match
      $("#promoMsg").show();

    // Error Message to user that reminds them the exact number of ice cream tub they should select
      $("#promoMsg").text("Note: You can choose up to " + count + " Flavours "); 
      $("#promoMsg").parent().addClass("itemError");
    } else { 
      $("#promoMsg").hide();
      $("#promoMsg").parent().removeClass("itemError");
    }

    // Calculates the total price: Sum of Promotion Bundle and all individual ice cream tubs
    totalPrice = promoPrice + indivPrice;
    $("#totalPrice").text(totalPrice);
    checkFree(totalPrice);
    console.log("Total price now: ", totalPrice);
  });

  $("input.Indiv").change(function () {
    indivPrice = 0;
    indivCount = 0;
    $("input.Indiv").each(function () {
      var inputID = $(this).attr("id");

      if (Price20.includes(inputID)) {
        // Calculates the price of ice cream price $20
        var value = parseInt($(this).val(), 10);
        indivCount += value;
        indivPrice += value * 20;
        if (value > 0) {
          $(this).css("background", "rgb(93, 210, 63,0.3)");
        } else {
          $(this).css("background", "white");
        }
      } else if (Price18.includes(inputID)) {
          // Calculates the price of ice cream price $18
        var value = parseInt($(this).val(), 10);
        indivCount += value;
        indivPrice += value * 18;
        if (value > 0) {
          $(this).css("background", "rgb(93, 210, 63,0.3)");
        } else {
          $(this).css("background", "white");
        }
      } else {
          // Calculates the price of ice cream price $15
        var value = parseInt($(this).val(), 10);
        indivCount += value;
        indivPrice += value * 15;
        if (value > 0) {
          $(this).css("background", "rgb(93, 210, 63,0.3)");
        } else {
          $(this).css("background", "white");
        }
      }
    });
    // Reports the individual ice cream price to user
    $("#indivPrice").text(indivPrice);
    totalPrice = promoPrice + indivPrice;

    // Reports the total price to user
    $("#totalPrice").text(totalPrice);

    //Check whether free delivery amount is reached
    checkFree(totalPrice);
  });
  
  //========================================
  // Check for free delivery amount
  // This function calculates the total amount that users had selected
  // - Reports the amount left to reach free delivery
  // - Reports to user that he had reached free delivery
  //=========================================
  function checkFree(totalPrice) {
    var amtmore = 50 - totalPrice;
    if (totalPrice >= 50) {
      $("#freePrice").text("Hurray! Free Delivery Amount is achieved!  ");
    } else {
      $("#freePrice").text(
        "Spend $" + amtmore + " more for Free Delivery Islandwide"
      );
    }

    if (totalPrice == 0) {
      $("#orderMsg").show();
      $("#orderMsg").text("Let us send at least One Ice Cream to You!");
      $("#orderMsg").parent().addClass("itemError");
    } else {
      $("#orderMsg").hide();
      $("#orderMsg").parent().removeClass("itemError");
    }
  }
});

//========================================
// Counter Buttons for promotion bundle
//========================================
// For Counters plus and minus button
$(document).ready(function () {
  $(".minus").click(function () {
    var $input = $(this).parent().find("input");
    var count = parseInt($input.val()) - 1;
    count = count < 0 ? 0 : count;
    $input.val(count);
    $input.change();
    return false;
  });
  $(".plus").click(function () {
    var $input = $(this).parent().find("input");
    $input.val(parseInt($input.val()) + 1);
    $input.change();
    return false;
  });
});
