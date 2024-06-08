document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    const suggestionsDiv = document.getElementById('suggestions');

    searchBox.addEventListener('input', function() {
        const query = searchBox.value.trim();
        if (query === '') {
            suggestionsDiv.innerHTML = '';
            return;
        }

        fetch(`/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                suggestionsDiv.innerHTML = '';
                data.forEach(address => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = address;
                    suggestionsDiv.appendChild(suggestion);
                });
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    });
});
