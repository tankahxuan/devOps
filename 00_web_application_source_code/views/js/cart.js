$(function(){
// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
    // =============================
    // Private methods and propeties
    // =============================
    cart = [];
    
    // Constructor
    function Item(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }
    
    // Save cart
    function saveCart() {
      sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
    
      // Load cart
    function loadCart() {
      cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
      loadCart();
    }
    
  
    // =============================
    // Public methods and propeties
    // =============================
    var obj = {};
    
    // Add to cart
    obj.addItemToCart = function(name, price, count) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count ++;
          saveCart();
          return;
        }
      }
      var item = new Item(name, price, count);
      cart.push(item);
      saveCart();
    }
    // Set count from item
    obj.setCountForItem = function(name, count) {
      for(var i in cart) {
        if (cart[i].name === name) {
            
          cart[i].count = count;
          break;
        }
      }
    };
    // Remove item from cart
    obj.removeItemFromCart = function(name) {
        for(var item in cart) {
          if(cart[item].name === name) {
            cart[item].count --;
            if(cart[item].count === 0) {
         
              cart.splice(item, 1);
            }
            break;
          }
      }
      saveCart();
    }
  
    // Remove all items from cart
    obj.removeItemFromCartAll = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart.splice(item, 1);
          break;
        }
      }
      saveCart();
    }
  
    // Clear cart
    obj.clearCart = function() {
      cart = [];
      saveCart();
    }
  
    // Count cart 
    obj.totalCount = function() {
      var totalCount = 0;
      for(var item in cart) {
        totalCount += cart[item].count;
      }
      return totalCount;
    }
  
    // Total cart
    obj.totalCart = function() {
      var totalCart = 0;
      for(var item in cart) {
        totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
    }
  
    // List cart
    obj.listCart = function() {
      var cartCopy = [];
      for(i in cart) {
        item = cart[i];
        itemCopy = {};
        for(p in item) {
          itemCopy[p] = item[p];
  
        }
        itemCopy.total = Number(item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy)
      }
      return cartCopy;
    }
  
    // cart : Array
    // Item : Object/Class
    // addItemToCart : Function
    // removeItemFromCart : Function
    // removeItemFromCartAll : Function
    // clearCart : Function
    // countCart : Function
    // totalCart : Function
    // listCart : Function
    // saveCart : Function
    // loadCart : Function
    return obj;
  })();
  
  
  // *****************************************
  // Triggers / Events
  // ***************************************** 
  // Add item
  $('.add-to-cart').click(function(event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));

    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
    var cartArray = shoppingCart.listCart();
    let obj = cartArray.find(x => x.name === name)
    console.log(obj.count)
    console.log(name+"_count")
    $("."+name+"_count").html(obj.count)
  });
  
  // Clear items
  $('.clear-cart').click(function() {
    shoppingCart.clearCart();
    displayCart();
  });
  
  
  function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    var checkout_output = "";
    for(var i in cartArray) {
      output += "<tr>"
        + "<td>" + (cartArray[i].name.replace(/_/g, ' ')) + "</td>" 
        + "<td>(" + cartArray[i].price + ")</td>"
        + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
        + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
        + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
        + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
        + " = " 
        + "<td>" + cartArray[i].total + "</td>" 
        +  "</tr>";

        checkout_output += '<tr>'
        + '<th scope="row"> <div class="p-2"> <div class="ml-3 d-inline-block align-middle">'
        + '<h5 class="mb-0">' +(cartArray[i].name.replace(/_/g, ' ')) + '</h5>'
        + '</div>  </th>'
        + '<td strong>'+cartArray[i].price  +'</strong></td>'
        +'<td ><strong>' +cartArray[i].count + '</strong></td>'
        + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + "><i class='fa fa-trash'></i></button></td>"
        +  "</tr>";
     
        
    }
    $('.show-cart').html(output);
    $('.show_checkout tbody').html(checkout_output);
    $('.total-cart').html('$'+shoppingCart.totalCart()+'.00');
    var subTotal = shoppingCart.totalCart()
    var grandTotal = subTotal*1.07
    grandTotal = Number(grandTotal.toFixed(2));
    $('.grand_total').html('$'+(grandTotal+5));
    var tax = grandTotal-subTotal
    tax = Number(tax.toFixed(2));
    $('.tax').html(tax)
    $('.total-count').html(shoppingCart.totalCount());

  }


  // Delete item button
  
  $('.show-cart').on("click", ".delete-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
    var cartArray = shoppingCart.listCart();
    $("."+name+"_count").html("")
    displayCart();
  })

  $('.show_checkout').on("click", ".delete-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
    var cartArray = shoppingCart.listCart();
    $("."+name+"_count").html("")
    displayCart();
  })
  
  
  
  // -1
  $('.show-cart').on("click", ".minus-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCart(name);
    var cartArray = shoppingCart.listCart();
     let obj = cartArray.find(x => x.name === name)
    if (obj!=undefined){
    console.log(obj.count)
    console.log(name+"_count")
    $("."+name+"_count").html(obj.count)
    }
    else{
        $("."+name+"_count").html('')
    }

    
    displayCart();
  })
  // +1
  $('.show-cart').on("click", ".plus-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.addItemToCart(name);
    var cartArray = shoppingCart.listCart();
    let obj = cartArray.find(x => x.name === name)
    console.log(obj.count)
    console.log(name+"_count")
    $("."+name+"_count").html(obj.count)
    displayCart();
  })
  
  // Item count input
  $('.show-cart').on("change", ".item-count", function(event) {
     var name = $(this).data('name');
     var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
  });
  
  displayCart();

  
  
})
