let commasTotal;
let trackedOrderDefault = {specialty: [], breed: [], primary: [], secondary: [], tertiary: []};
let trackedOrder = {};

function fillPage() {
  let itemObj = window.marketplaceItems;
  let modePreference = localStorage.getItem('viewModeToggle');
  let categories = Object.keys(itemObj);

  if (!modePreference) {
    modePreference = localStorage.setItem('viewModeToggle', 'sheet-style')
  }

  if (modePreference == 'sheet-sty3le') {

    categories.forEach((category) => {
      let itemArray = []
      itemObj[category].forEach((item) => {
        let data = 0;
        typeof item.keyword !== "undefined" ? data = `<span data-keyword="${item.keyword}">` : data = `<span>`
  
        let template = 
        `<div class="col-12 item">
          ${data}${item.name}</span>
          <span class="item-price">${item.price}</span>
          <input class="quantity" type="number" inputMode="numeric" maxlength="3"/>
        </div>`
        
        itemArray.push(template)
      })
  
      itemArray.forEach((filledTemplate) => {
        $(`#${category}`).append(filledTemplate)
      })
    })
  } else {
    // if (modePrefrence == 'entry-style')

    $('#columns-container').children().css('display', 'none');
    $('.sorting-options').css('display', 'none');
    $('.show-options').css('display', 'none');
    // $('#columns-container').append(template);

    var options = {
      placeholder: "Start typing here",
      // data: Object.values(itemObj).flat(),
      data: itemObj,
      getValue: "name",

      categories: [
        {
          listLocation: "breed",
          header: "-- Breed Change --"
        },
        {
          listLocation: "primary",
          header: "-- Primary Genes --"
        },
        {
          listLocation: "secondary",
          header: "-- Secondary Genes --"
        },
        {
          listLocation: "tertiary",
          header: "-- Tertiary Genes --"
        },
        {
          listLocation: "specialty",
          header: "-- Specialty Items --"
        },
      ],
      
      list: {
        maxNumberOfElements: 10,
        match: {
          enabled: true
        },
        onChooseEvent: function() {
          let chosen = $("#autocomplete").getSelectedItemData();

          let chosenItem = 
          `<div class="col-12 item">
            <button type="button" class="btn btn-sm btn-danger entry-item-cancel" onclick="deleteEntry(this)">X</button>
            <span class="item-name" id="${chosen.itemType}" data-keyword="${chosen.keyword}">${chosen.name}</span>
            <span class="item-price">${chosen.price}</span>
            <input class="quantity" type="number" inputmode="numeric" maxlength="3" value=1 onfocusin="highlight(this)" onfocusout="unlight(this)"/>
          </div>`

          let existing = $(".item span.item-name:contains(" + `${chosen.name}` + ")")

          if (existing.length !== 0) {
            let existingEntry = existing.parent()
            let entryQuantityVal = parseInt(existingEntry.find("input").val()) + 1
            
            existingEntry.addClass('flash');
            setTimeout(function() {
              existingEntry.removeClass('flash');
            }, 500);
            existingEntry.find("input").val(entryQuantityVal)
          } else {
            $('.entry-item-list').append(chosenItem);
          }

          $("#autocomplete").select()
          orderFormHelper()
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

  trackedOrder = Object.assign({}, JSON.parse(JSON.stringify(trackedOrderDefault)))
};

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
  })

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
  })

})();

(function() {
  let toggled = false;
  let localPreference = localStorage.getItem('festivalToggle') 

  if (localPreference === "true") {
    toggled = true;
    $('#festival-switch').prop('checked', true);
  }

  toggleDisplayOptionBox(toggled, '.festival-skin-box')

  $("#festival-switch").click(function() {
    toggled = !toggled;

    localStorage.setItem('festivalToggle', toggled);
    $('.festival-quantity').val(0);
    toggleDisplayOptionBox(toggled, '.festival-skin-box');
  })

})();

(function() {
  let toggled = false;
  let localPreference = localStorage.getItem('gotopToggle') 

  if (localPreference === "true") {
    toggled = true;
    $('#gotop-switch').prop('checked', true);
  }

  toggleDisplayOptionBox(toggled, '#go-top-btn')

  $("#gotop-switch").click(function() {
    toggled = !toggled;

    localStorage.setItem('gotopToggle', toggled)
    toggleDisplayOptionBox(toggled, '#go-top-btn')
  })
})();

$('#go-top-btn').click(function() {
  $("html, body").animate({ scrollTop: "0" }, 700);
});

function toggleDisplayOptionBox(bool, boxName) {
  if (bool) {
    $(`${boxName}`).show();
  } else {
    $(`${boxName}`).hide();
  }
};

function inputMaxLengthHelper(input) {
  if (input.val().length > 3) {
    input.val(function(_, value){
      return value.slice(0,3)
    })
  }
};

// listeners for all maxlength inputs
$('body').on('input', 'input[maxlength]', function() {
  inputMaxLengthHelper($(this))
});

$('body').on("click", 'input[maxlength]', function () {
  $(this).select();
});

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

  if (orderTotal > 0) {
    formatTrackedOrder()
    toggleDisableOnCopyBtn(false)
  } else {
    $('.trackedOrderBox').html(resetOrderFormInstructions())
    toggleDisableOnCopyBtn(true)
  }
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

$('.btn-order-form-toggle').click(function(){
  $(this).toggleClass('order-form-close');
  $('.form-toggle-box').slideToggle('slow');
});

$(".clear-totals").click(function() {
  $(".quantity").val('');
  $(".festival-quantity").val('');
  $('.order-total').text('0');

  //double-check entry with this
  resetTrackedOrder();
  $('.trackedOrderBox').html(resetOrderFormInstructions());
  toggleDisableOnCopyBtn(true);

  if ($('.entry-item-list')) {
    $('.entry-item-list').html(`<h2>Items:</h2>`);
    $('#autocomplete').val('');
  }
});

$('.show-specific-select').change(function() {
  resetTrackedOrder();
  toggleDisableOnCopyBtn(true);
  $('.trackedOrderBox').html(resetOrderFormInstructions());

  if ($('.show-specific-select').val() == 'All') {
    $(".quantity").val('')
    $('.order-total').text('0')
    $('.item').toggleClass('show-specific-select-hide-toggle', false)

  } else {
    let rawVal = $('.show-specific-select').val().split(" ")
    $(".quantity").val('')
    $('.order-total').text('0')
    $('.item').toggleClass('show-specific-select-hide-toggle', true)

    // specialty exception for show-only lives here for now. think of a better method later.
    rawVal.forEach(word => {
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

// DELETING THIS?
// $('.item-boxes').on('focusin','.quantity', function() {
//   $(this).parent().addClass('highlight')

//   orderFormHelper()
// })

// $('.item-boxes').on('focusout','.quantity', function() {
//   $(this).parent().removeClass('highlight')
// })

// CONSOLIDATE THIS LATER ENTRY MODE
function highlight(e) {
  $(e).parent().addClass('highlight');
}
function unlight(e) {
  $(e).parent().removeClass('highlight');
}

$('.item-boxes').on('input','.quantity', function() {
  let trackItemCategory = $(this).siblings('.item-name').attr('id')
  let trackItemTitle = $(this).siblings('span:first').text()
  let trackItemPrice = $(this).siblings('.item-price').text()
  let currentItemVal = $(this).val()
  let currentItemKeyword = $(this).siblings('span:first').data('keyword')

  let indexExists = trackedOrder[trackItemCategory].findIndex(item => item.title === trackItemTitle)

  if (indexExists != -1) {
    if (currentItemVal > 0) {
      trackedOrder[trackItemCategory][indexExists].orderQuant = currentItemVal
    } else {
      trackedOrder[trackItemCategory].splice(indexExists, 1)
    }
  } else {
    trackedOrder[trackItemCategory].push({
      categ: trackItemCategory, 
      keyword: currentItemKeyword,
      title: trackItemTitle, 
      itemPrice: trackItemPrice, 
      orderQuant: currentItemVal
    })
  }

  orderFormHelper()
})

// function trackHandler(currentItem) {
//   let trackItemCategory = $(currentItem).parent().parent().attr('id') || "random_entry"
//   let trackItemTitle = $(currentItem).siblings('span:first').text()
//   let trackItemPrice = $(currentItem).siblings('.item-price').text()
//   let currentItemVal = $(currentItem).val()
//   let currentItemKeyword = $(currentItem).siblings('span:first').data('keyword')


//   let indexExists = 1
//   // trackedOrder[trackItemCategory].findIndex(item => item.title === trackItemTitle)

//   // if (indexExists != -1) {
//   //   if (currentItemVal > 0) {
//       // console.log(trackItemCategory)
//   //     console.log(indexExists)
      
//   //     trackedOrder[trackItemCategory][indexExists].orderQuant = currentItemVal
//   //   } else {
//   //     trackedOrder[trackItemCategory].splice(indexExists, 1)
//   //   }
//   // } else {
//   //   trackedOrder[trackItemCategory].push({
//   //     categ: trackItemCategory, 
//   //     keyword: currentItemKeyword,
//   //     title: trackItemTitle, 
//   //     itemPrice: trackItemPrice, 
//   //     orderQuant: currentItemVal
//   //   })
//   // }
// }

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
  
    showTooltip($(this), 2)
  }
})

$('.btn-copy-order-to-clipboard').click(function() {
  let toCopy = $(this).siblings('.trackedOrderBox')

  if (parseInt(toCopy.text()) > 0) {
    var text = $(this).siblings('.trackedOrderBox').get(0); 
    var selection = window.getSelection(); 
    var range = document.createRange(); 
    range.selectNodeContents(text); 
    
    selection.removeAllRanges(); 
    selection.addRange(range); 
    document.execCommand('copy'); 
    selection.removeAllRanges();
  
    showTooltip($(this), -8)
  }
})

function showTooltip(element, marginPrct) {
  let elementClass = element.attr('class').split(' ')[0] || 'fallback'
  let width = element.width() / 2
  const tooltipTemplate = $('.tooltiptext');
  const tooltipClone = tooltipTemplate.clone().addClass(`${elementClass}-tooltip`);

  tooltipClone.css({ 
    top: element.position().top - 28 + 'px', 
    left: width + 'px', 
    position: 'absolute', 
    'margin-left': marginPrct + '%'
  })

  $(element).append(tooltipClone);
  $(tooltipClone).show();
  hideAlert(tooltipClone);
}

function hideAlert(currentTooltip) {
  setTimeout(function(){ 
    $(currentTooltip).fadeOut(500, function() {
      $(this).remove()
    });
   }, 800);
};

function selectEntry() {
  
}

function deleteEntry(button) {
  orderFormHelper();
  $(button).parent().remove();
}

function hideAlert() {
  setTimeout(function(){ 
    $('.tooltiptext').fadeOut(500);
   }, 800);
}

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

$('#go-top-btn').click(function() {
  $("html, body").animate({ scrollTop: "0" }, 700);
})

function formatTrackedOrder() {
  let itemArray = [];
  let formattedTotal = numberWithCommas($('.order-total').text());
  const textAfterColon = /:(.*)/;
  let orderKeys = Object.keys(trackedOrder)
  let festivalSkinsAddon = addFestivalSkins()

  orderKeys.forEach((key) => {
    trackedOrder[key].forEach((order) => {

      let matchedGeneName = order.title.match(textAfterColon) || order.title;
      
      if (typeof matchedGeneName === 'object') {
        matchedGeneName = matchedGeneName[1].trim()
      }
  
      let geneType = order.keyword
      let formattedCategoryName = order.categ.charAt(0).toUpperCase() + order.categ.slice(1);
  
      let template =
      `<div class="col-12 item-special-tracked">
        <span class="order-form-quant">${order.orderQuant}x</span>
        <span>${formattedCategoryName}: ${matchedGeneName} (${geneType})</span>
      </div>`
  
      itemArray.push(template)
  
    })
  })

  if (festivalSkinsAddon > 0) {
    let skinsAddonTemplate = 
    `<div class="col-12 item-special-tracked">
      <span class="stuff2">${$('.festival-quantity').val()}x</span>
      <span>Festival Skins</span>
    </div>`

    itemArray.push(skinsAddonTemplate)
  }

  $('.trackedOrderBox').html(itemArray).append( `<span><b>Total:</b> ${formattedTotal}</span>`);
  toggleDisplayOptionBox(true, '.shop-order-container');
};

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

function resetOrderFormInstructions() {
  const instructions = 
  `<span class="instructions">The calculator is empty. Add items then press calculate to receive an order form.</span>`
}

function addFestivalSkins() {
  if ($('.festival-skin-box').is(":hidden")) {
    return 0;
  } else {
    let quantity = $('.festival-quantity').val();

    return quantity * 29750;
  }
}


function orderFormHelper() {
  if (!$('.trackedOrderBox').is(':has(span.instructions)')){
    let warningTemplate = `<span>Recalculate total to get updated form`
    $('.trackedOrderBox').html(warningTemplate)
  }
  $('.order-total').text('0');
}

function formatTrackedOrder() {
  let itemArray = [];
  let formattedTotal = numberWithCommas($('.order-total').text());
  const textAfterColon = /:(.*)/;
  let orderKeys = Object.keys(trackedOrder)
  let festivalSkinsAddon = addFestivalSkins()

  orderKeys.forEach((key) => {
    trackedOrder[key].forEach((order) => {

      let matchedGeneName = order.title.match(textAfterColon) || order.title;
      
      if (typeof matchedGeneName === 'object') {
        matchedGeneName = matchedGeneName[1].trim()
      }
  
      let geneType = order.keyword
      let formattedCategoryName = order.categ.charAt(0).toUpperCase() + order.categ.slice(1);
  
      let template =
      `<div class="col-12 item-special-tracked">
        <span class="order-form-quant">${order.orderQuant}x</span>
        <span>${formattedCategoryName}: ${matchedGeneName} (${geneType})</span>
      </div>`
  
      itemArray.push(template)
  
    })
  })

  if (festivalSkinsAddon > 0) {
    let skinsAddonTemplate = 
    `<div class="col-12 item-special-tracked">
      <span class="stuff2">${$('.festival-quantity').val()}x</span>
      <span>Festival Skins</span>
    </div>`

    itemArray.push(skinsAddonTemplate)
  }

  $('.trackedOrderBox').html(itemArray).append( `<span><b>Total:</b> ${formattedTotal}</span>`);
  toggleDisplayOptionBox(true, '.shop-order-container');
};

function resetTrackedOrder() {
  for (const key in trackedOrder) {
    if (Array.isArray(trackedOrder[key])) {
      if (trackedOrder[key].length > 0) {
        trackedOrder = Object.assign({}, JSON.parse(JSON.stringify(trackedOrderDefault)))
      }
    }
  }
}

function resetOrderFormInstructions() {
  const instructions = 
  `<span class="instructions">The calculator is empty. Add items then press calculate to receive an order form.</span>`

  return instructions
}

function toggleDisableOnCopyBtn(toggle) {
  copyBtn = $('.btn-copy-order-to-clipboard')
  if (toggle) {
    copyBtn.prop('disabled', true);
    copyBtn.attr('aria-disabled', true)
  } else {
    copyBtn.prop('disabled', false);
    copyBtn.attr('aria-disabled', false);
  }
}