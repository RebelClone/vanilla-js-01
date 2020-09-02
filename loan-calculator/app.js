// On Form Submit
document.querySelector('#loan-form').addEventListener('submit', e =>{

    // Style only
    if(document.querySelector('#loading').style.display!=='block'){

        document.querySelector('#loading').style.display = 'block';

    }

    document.querySelector('#results').style.display = 'none';

    setTimeout(calculateResults,1000)

    e.preventDefault()
})

// Calculating the loan
function calculateResults(){

    // Selectors
    const amount = document.querySelector('#amount'),
         interest = document.querySelector('#interest'),
         years = document.querySelector('#years'),
         monthlyPayment = document.querySelector('#monthly-payment'),
         totalPayment = document.querySelector('#total-payment'),
         totalInterest = document.querySelector('#total-interest')

    // Calculate principal
    const principal = parseFloat(amount.value),
         calculatedInterest = parseFloat(interest.value)/100/12,
         calculatedPayments = parseFloat(years.value)*12

    // per month amount to be paid
    const x = (1+calculatedInterest) ** calculatedPayments,
         monthly = (principal*x*calculatedInterest)/(x-1)

    // checking for error and manipulating DOM
    if(isFinite(monthly)){
        monthlyPayment.value = monthly.toFixed(2)
        totalPayment.value = (monthly * calculatedPayments).toFixed(2)
        totalInterest.value = ((monthly*calculatedPayments)-principal).toFixed(2)
    
        // Style only
        document.querySelector('#results').style.display = 'block'
        document.querySelector('#loading').style.display = 'none';
    } else {
        // Error handler
        let err = document.querySelector('.alert') || false
        if(!err){
            showError('Please check your numbers')
        }
    }

}

// Showing Error
function showError(error){
    document.querySelector('#loading').style.display = 'none';
    document.querySelector('#results').style.display = 'none';

    // Selectors
    const errorDiv = document.createElement('div'),
         card = document.querySelector('.card'),
         heading  = document.querySelector('.heading');

    // Creating Error DOM
    errorDiv.className = 'alert alert-danger'

    errorDiv.appendChild(document.createTextNode(error))

    card.insertBefore(errorDiv, heading)

    // Auto disappering alert
    setTimeout(()=>{
        document.querySelector('.alert').remove();
    },2000)


}