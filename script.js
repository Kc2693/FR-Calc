let commasTotal;

function fillPage() {
  let itemObj = window.marketplaceItems;
  let categories = Object.keys(itemObj);

  categories.forEach((category) => {
    let itemArray = []
    itemObj[category].forEach((item) => {
      let template = 
      `<div class="col-12 item">
        <span>${item.name}</span>
        <span class="item-price">${item.price}</span>
        <input class="quantity" type="number" maxlength="3"/>
      </div>`
      
      itemArray.push(template)
    })

    itemArray.forEach((filledTemplate) => {
      $(`#${category}`).append(filledTemplate)
    })
  })
}

(function() {
  let toggled = false;
  let localPreference = localStorage.getItem('lightModeToggle') 
  var htmlElement = document.querySelector("html");

  if (localPreference === "true") {
    toggled = true;
    $(htmlElement).attr("data-light-mode", true);
    $('#lightmode-switch').prop('checked', true);
  }

  $("#lightmode-switch").click(function() {
    toggled = !toggled;
    $(htmlElement).attr("data-light-mode", toggled ? "true" : "false");
    localStorage.setItem('lightModeToggle', toggled)
  });

})();

(function() {
  let toggled = false;
  let localPreference = localStorage.getItem('commaToggle') 

  if (localPreference === "true") {
    toggled = true;
    $('#comma-switch').prop('checked', true);
    commasTotal = true;
  }

  $("#comma-switch").click(function() {
    toggled = !toggled;
    commasTotal = toggled;

    localStorage.setItem('commaToggle', toggled)
  });

})();

(function() {
  let toggled = false;
  let localPreference = localStorage.getItem('festivalToggle') 

  if (localPreference === "true") {
    toggled = true;
    $('#festival-switch').prop('checked', true);
  }

  toggleFestivalBox(toggled, 0)

  $("#festival-switch").click(function() {
    toggled = !toggled;

    localStorage.setItem('festivalToggle', toggled)
    toggleFestivalBox(toggled, 1000)
  });

})();

function toggleFestivalBox(bool, timer) {
  if (bool) {
    $('.festival-skin-box').show(timer);
  } else {
    $('.festival-skin-box').hide(timer);
  }
};

$(".calc-btn").click(function() {
	let itemTotals = gatherItemTotals()
  let orderTotal = reduceOrderTotal(itemTotals) + addFestivalSkins();

  let formattedTotal;
  
  if (commasTotal) {
    formattedTotal = numberWithCommas(orderTotal)
  } else {
    formattedTotal = orderTotal
  }


  $('.order-total').text(formattedTotal)
});

function gatherItemTotals() {
  let calculated = $('.quantity').map((i, item) => {
	  let quantity = $(item).val();
    let itemPrice = parseInt($(item).siblings(".item-price").text()); 

    return quantity * itemPrice;
  })
   
	return calculated.get();
};

function reduceOrderTotal(itemTotals) {  
	let orderTotal = itemTotals.reduce((currentTotal, item) => {
  	let newTotal = currentTotal + item;

    return newTotal;
  });
  return orderTotal;
};

function addFestivalSkins() {
  if ($('.festival-skin-box').is(":hidden")) {
    return 0;
  } else {
    let quantity = $('.festival-quantity').val();

    return quantity * 29750;
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(".clear-totals").click(function() {
  $(".quantity").val('')
  $('.order-total').text('0')
})

$('.show-specific-select').change(function() {
  if ($('.show-specific-select').val() == 'All') {
    $(".quantity").val('')
    $('.order-total').text('0')
    $('.item').toggleClass('show-specific-select-hide-toggle', false)

  } else {
    let rawVal = $('.show-specific-select').val().split(" ")
    $(".quantity").val('')
    $('.order-total').text('0')
    $('.item').toggleClass('show-specific-select-hide-toggle', true)

    // vial exception for show-only lives here for now. think of a better method later.
    rawVal.forEach(word => {
      console.log(word)
      $(`span:contains("${word}"), span:contains("Vial")`).parent().toggleClass('show-specific-select-hide-toggle', false)
    });
  }
});

$('.sort-select').change(function() {
  switch($('.sort-select').val()) {
    case 'alphabet':
      sortAlphabetically();
      break;
    case 'price-low':
      sortByPrice("low");
      break;
    case 'price-high':
      sortByPrice("high");
      break;
  }
});

$('.item-boxes').on('focusin','.quantity', function() {
  $(this).parent().addClass('highlight')
})
$('.item-boxes').on('focusout','.quantity', function() {
  $(this).parent().removeClass('highlight')
})

$('.order-total').click(function() {
  if (parseInt($(this).text()) > 0) {
    var text = $(this).get(0); 
    var selection = window.getSelection(); 
    var range = document.createRange(); 
    range.selectNodeContents(text); 
    selection.removeAllRanges(); 
    selection.addRange(range); 
    document.execCommand('copy'); 
    selection.removeAllRanges();
  
    $('.tooltiptext').show();
    hideAlert();
  }
})

function hideAlert() {
  setTimeout(function(){ 
    $('.tooltiptext').fadeOut(500);
   }, 800);
};

function sortAlphabetically() {
  let parentColumn;
  $('.item-boxes').each(function(index, elem) {
    parentColumn = "#" + elem.getAttribute('id')
    itemSelector = parentColumn + " > .item"

    $(itemSelector).sort(function(a,b) {
      let textA = alphabetHelper(a.textContent)
      let textB = alphabetHelper(b.textContent)

      if (textA < textB) {
        return -1;
      } else {
        return 1;
      }
    }).appendTo(parentColumn)
  });
};

function alphabetHelper(text) {
  const regex = /[^:]*$/
  const found = text.match(regex).join().trim();

  return found
};

function sortByPrice(type) {
  let parentColumn;
  $('.item-boxes').each(function(index, elem) {
    parentColumn = "#" + elem.getAttribute('id')
    itemSelector = parentColumn + " > .item"

    $(itemSelector).sort(function(a,b) {
      let = firstVal = parseInt(a.querySelector('.item-price').innerText);
      let secondVal = parseInt(b.querySelector('.item-price').innerText);

      if (type == 'low') {
        if (firstVal < secondVal) {
          return -1;
        } else {
          return 1;
        }
      } else if (type == 'high') {
        if (firstVal < secondVal) {
          return 1;
        } else {
          return -1;
        }
      }

    }).appendTo(parentColumn)
  });
};


