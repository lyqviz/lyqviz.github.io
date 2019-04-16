var BUBBLE_PARAMETERS = {
    "data_file": "fulllist.csv",
    "report_title": "A Visual Exploration of Film Festivals",
    //"footer_text": "Net Value of Assets owned by Donald J. Trump.  Source: Jennifer Wang/Forbes.",
    "width": 940,
    "height": 1350,
    "force_strength": 0.03,
    "force_type": "charge",
    "radius_field": "rating_users",
    "numeric_fields": ["imdb_score", "rating_users"],
    "fill_color": {
        "data_field": "movie_region",
        "color_groups": {
            "Asia": '#cb181d',
            'Europe': '#ff9999',
            'North America': '#8BCBC8',
            'Oceania': '#d9d9d9',
            'Africa': '#33cc33',
            'South America': '#8c96c6'
        }
    },
    "tooltip": [
        {"title": "Film Festival", "data_field": "festival"},
        {"title": "Movie", "data_field": "movie"},
        {"title": "Director", "data_field": "director"},
        {"title": "Country", "data_field": "country"},
        {"title": "IMDb Score", "data_field": "imdb_score"},
        {"title": "User Ratings", "data_field": "rating_users"}
    ],
    "modes": [
        {
            "button_text": "All Films",
            "button_id": "all",
            "type": "grid",
            "labels": null,
            "grid_dimensions": {"rows": 1, "columns": 1},
            "data_field": null
        },
        {
            "button_text": "Films by Region",
            "button_id": "region",
            "type": "grid",
            "labels": ["Asia", "Europe", "Africa", "South America", "North America", "Oceania"],
            "grid_dimensions": {"rows": 2, "columns": 3},
            "data_field": "movie_region"
        },
        {
            "button_text": "Films by Festival",
            "button_id": "Change",
            "type": "grid",
            "labels": ["Venice Film Festival", "Cannes Film Festival", "Locarno International Film Festival", "Karlovy Vary International Film Festival", "Berlin International Film Festival", "San Sebastián International Film Festival", "Moscow International Film Festival", "Warsaw International Film Festival", "Tallinn Black Nights Film Festival", "Mar del Plata Film Festival", "Montreal World Film Festival", "Cairo International Film Festival", "International Film Festival of India (Goa)", "Tokyo International Film Festival", "Shanghai International Film Festival"],
            "grid_dimensions": {"rows": 5, "columns": 3},
            "data_field": "festival"
        },
        {
            "button_text": "Films by Scores",
            "button_id": "change_vs_net_value",
            "type": "scatterplot",
            "x_data_field": "imdb_score",
            "y_data_field": "festival"
        }
    ]
};
