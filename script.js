$(".calc-btn").click(function() {
	let itemTotals = gatherItemTotals()
  let orderTotal = reduceOrderTotal(itemTotals)
  
  $('.order-total').text(orderTotal)
  })

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

$('#compact-switch').change(function () {
  $('.inner-container').toggleClass('compact-container');
  $('#breed').toggleClass('col-md-3').toggleClass('col-sm-7').toggleClass('compact');
  $('#primary').toggleClass('col-md-3').toggleClass('col-sm-7').toggleClass('compact');
  $('#secondary').toggleClass('col-md-3').toggleClass('col-sm-7').toggleClass('compact');
  $('#tertiary').toggleClass('col-md-3').toggleClass('col-sm-7').toggleClass('compact');
  replaceText();
})

function sortAlphabetically() {
  let parentColumn;
  $('.col-md-3').each(function(index, elem) {
    parentColumn = "#" + elem.getAttribute('id')
    itemSelector = parentColumn + " > .item"

    $(itemSelector).sort(function(a,b) {

      if (a.textContent < b.textContent) {
        return -1;
      } else {
        return 1;
      }
    }).appendTo(parentColumn)
  });
};

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
        return
      } else if (type == 'high') {
        if (firstVal < secondVal) {
          return 1;
        } else {
          return -1;
        }
        return
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

function replaceText() {
  var test = $('div#breed > div.item > span:first-of-type').html();
  var str = test.split(" ");
  var img = '<img src="https://www1.flightrising.com/static/icons/primary-gene.png">'
  console.log(str)


  $('div#breed > div.item > span:first-of-type').each(function(index, elem) {
    let toChange = elem.innerText;
    let strArr = toChange.split(" ");
    let newString = toChange.replace(strArr[0], img)

    elem.innerHTML = newString
  })

}