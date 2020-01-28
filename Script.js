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
    $('.item').css('display', 'inline-block');
  } else {
    let rawVal = $('.show-specific-select').val().split(" ")
    $(".quantity").val('')
    $('.order-total').text('0')
    $('.item').css('display', 'none');
  
    rawVal.forEach(word => {
      $(`span:contains("${word}")`).parent().css('display', 'inline');
    });
  }
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
  	let whatthefuck = currentTotal + item;

    return whatthefuck
  });
  console.log(orderTotal)
  return orderTotal;
}
