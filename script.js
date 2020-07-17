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

$('.sort-select').change(function(){
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
  })
});
  
function gatherItemTotals() {
  let calculated = $('.quantity').map((i, item) => {
	  let quantity = $(item).val();
    let itemPrice = parseInt($(item).siblings(".item-price").text()); 

    return quantity * itemPrice;
  })
   
	return calculated.get();
}

function reduceOrderTotal(itemTotals) {  
	let orderTotal = itemTotals.reduce((currentTotal, item) => {
  	let newTotal = currentTotal + item;

    return newTotal;
  });
  return orderTotal;
}
