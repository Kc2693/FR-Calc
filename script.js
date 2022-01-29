let commasTotal;

function fillPage() {
  let itemObj = window.marketplaceItems;
  let modePreference = localStorage.getItem('viewModeToggle');

  if (!modePreference) {
    modePreference = localStorage.setItem('viewModeToggle', 'sheet-style')
  }

  if (modePreference == 'sheet-sty3le') {
    let categories = Object.keys(itemObj);

    categories.forEach((category) => {
      let itemArray = []
      itemObj[category].forEach((item) => {
        let template = 
        `<div class="col-12 item">
          <span>${item.name}</span>
          <span class="item-price">${item.price}</span>
          <input class="quantity" type="text" maxlength="3"/>
        </div>`
        
        itemArray.push(template)
      })

      itemArray.forEach((filledTemplate) => {
        $(`#${category}`).append(filledTemplate)
      })
    })
  } else {
    // if (modePrefrence == 'entry-style')

    let template = `
    <div class="autocomplete-container">
      <div class="autocomplete-input-container">
        <span>Enter an item:</span>
        <input id="autocomplete" onclick="this.value=''" onblur=this.value=''></input>
      </div>
      <div class="entry-item-list row">
        <h2>Items:</h2>
      </div>
    </div>`

    $('#columns-container').children().css('display', 'none');

    $('#columns-container').append(template);

    var options = {
      data: Object.values(itemObj).flat(),
      getValue: "name",
      
      list: {
        maxNumberOfElements: 10,
        match: {
          enabled: true
        },
        onChooseEvent: function() {
          let chosen = $("#autocomplete").getSelectedItemData();
          let chosenItem = `<div class="col-12 item">
          <span>${chosen.name}</span>
          <span class="item-price">${chosen.price}</span>
          <input class="quantity" type="text" maxlength="3" value=1 />
        </div>`
          $('.entry-item-list').append(chosenItem);
          $("#autocomplete").select()
        }
      },
      template: {
        type: "description",
        fields: {
          description: "price"
        }
      }
    }

    $("#autocomplete").easyAutocomplete(options);
  }

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

  console.log('what the fuck ' + localPreference)
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


$(".calc-btn").click(function() {
	let itemTotals = gatherItemTotals()
  let orderTotal = reduceOrderTotal(itemTotals)
  let formattedTotal;
  
  if (commasTotal) {
    formattedTotal = numberWithCommas(orderTotal)
  } else {
    formattedTotal = orderTotal
  }


  $('.order-total').text(formattedTotal)
})

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(".clear-totals").click(function() {
  $(".quantity").val('');
  $('.order-total').text('0');

  if ($('.entry-item-list')) {
    $('.entry-item-list').html(`<h2>Items:</h2>`);
    $('#autocomplete').val('');
  }
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

    rawVal.forEach(word => {
      $(`span:contains("${word}")`).parent().toggleClass('show-specific-select-hide-toggle', false)
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

$('.col-md-3 ').on('focusin','.quantity', function() {
  $(this).parent().addClass('highlight')
})
$('.col-md-3 ').on('focusout','.quantity', function() {
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
}


function sortAlphabetically() {
  let parentColumn;
  $('.col-md-3').each(function(index, elem) {
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
}

function sortByPrice(type) {
  let parentColumn;
  $('.col-md-3').each(function(index, elem) {
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
}

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

