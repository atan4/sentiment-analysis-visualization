# sentiment-analysis-visualization
Building on ideas from John Coogan's Using Machine Learning to Visualize Customer Preferences: https://medium.com/@johncoogan/using-machine-learning-to-visualize-customer-preferences-6a007cfb9b97

"dependencies": {
	"@google-cloud/language": "0.11.0",
	"d3": "4.10.0",
	"express": "4.15.4",
	"express-handlebars": "3.0.0",
	"promise": "8.0.1"
}

Test with Game of Thrones Season 7 review: https://www.theatlantic.com/entertainment/archive/2017/08/game-of-thrones-season-7-episode-6-beyond-the-wall-roundtable/537363/

![alt text](https://raw.githubusercontent.com/atan4/sentiment-analysis-visualization/master/imgs/v1.jpg)

This project creates circles that are sized based on their frequency of word entity and colored by the ratio of positive and negative sentiment per sentence. Neutral entities were not included.