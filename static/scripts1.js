document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm');

    postForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Gather form data
        const formData = new FormData(postForm);

        // Convert price from milliard/million to a single numeric value (e.g., 1.25 billion = 1250000000)
        const price = parseFloat(formData.get('price'));
        if (formData.get('price').toLowerCase().includes('milliard')) {
            formData.set('price', price * 1000);
        } else if (formData.get('price').toLowerCase().includes('million')) {
            formData.set('price', price * 1000000);
        }

        // Send form data to the backend
        fetch('/post-property', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to post property');
            }
            return response.json();
        })
        .then(data => {
            console.log('Property posted successfully:', data);
            // Optionally, you can redirect the user to a success page or display a success message
        })
        .catch(error => {
            console.error('Error posting property:', error);
            // Optionally, you can display an error message to the user
        });
    });
});
