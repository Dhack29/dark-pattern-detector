document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var inputUrl = document.getElementById('search-bar').value;

    try {
        var url = new URL(inputUrl);
    } catch (error) {
        console.error('Invalid URL:', error.message);
        var resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '<p>Invalid URL. Please enter a valid URL and try again.</p>';
        return;
    }

    // Fetch content of the dataset file
    fetch('data.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error loading dataset: ' + response.statusText);
            }
            return response.text();
        })
        .then(datasetContent => {
            // Split the dataset content into an array of words and categories
            const arr = datasetContent.split('\n').filter(Boolean);
            var words = arr.map(element => element.replace('\r', ''));

            // Fetch content of the entered URL
            fetch(inputUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.text();
                })
                .then(bodyText => {
                    var matchCounter = 0;
                    var categoryCounts = {
                        "Forced Action": 0,
                        "False Reassurance": 0,
                        "Misdirection": 0,
                        "False Scarcity": 0,
                        "Social Proof": 0,
                        "Hidden Subscription": 0,
                        "False Affiliation": 0,
                        "Negative Option": 0,
                        "Upselling": 0,
                        "Positive Reinforcement": 0,
                        "Urgency": 0
                    }; // Object to store category-wise match counts

                    for (var i = 0; i < words.length; i++) {
                        var wordData = words[i].split('@');
                        var word = wordData[0];
                        var category = wordData[1];

                        var regex = new RegExp(word, 'gi');
                        bodyText = bodyText.replace(regex, function (match) {
                            matchCounter++;

                            // Update category count
                            if (category) {
                                if (!categoryCounts[category]) {
                                    categoryCounts[category] = 1;
                                } else {
                                    categoryCounts[category]++;
                                }
                            }

                            return '<mark style="border: 2px solid red;">' + match + '</mark>';
                        });
                    }

                    // Display match data and categories in the result div
                    var resultDiv = document.getElementById('result');
                    resultDiv.innerHTML = '<p>Total Dark Patterns Detected: ' + matchCounter + '</p>';

                    // Display category-wise counts
                    resultDiv.innerHTML += '<p>Dark Pattern Categories:</p>';
                    for (var category in categoryCounts) {
                        resultDiv.innerHTML += '<p>' + category + ': ' + categoryCounts[category] + '</p>';
                    }

                    // Output match data and categories to the console (you can modify this part)
                    console.log({ Total: matchCounter, Categories: categoryCounts });
                })
                .catch(error => {
                    console.error('Error analyzing the entered website:', error);
                    var resultDiv = document.getElementById('result');
                    resultDiv.innerHTML = '<p>Error analyzing the entered website. Please check the URL and try again.</p>';
                });
        })
        .catch(error => {
            console.error('Error:', error);
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<p>Error loading dataset. Please check the dataset file and try again.</p>';
        });
});
