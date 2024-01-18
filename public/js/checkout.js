const stripe = Stripe("pk_test_51K725CDsoYlRpW2rxHxWZvJcTokh7auXXM8mn4h8wbQBkU4p4Rvih55COX6yfjTInVhKn4eBi4R8x8wJ340Inzyd00uUsYJHUI");

let elements;
const currentPath = window.location.pathname;
const idMatch = currentPath.match(/\/([a-fA-F0-9]{24})\/payement$/);
const id = idMatch ? idMatch[1] : null;

initialize();
// Create a Checkout Session as soon as the page loads
async function initialize() {
    const response = await fetch(`/panier/${id}/paiement`, {
        method: "POST",
    });

    const { clientSecret } = await response.json();

    const checkout = await stripe.initEmbeddedCheckout({
        clientSecret,
    });

    // Mount Checkout
    checkout.mount('#checkout');
}