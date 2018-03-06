# Welcome to the Exoplanetorium   
We build visualizations of solar systems beyond our own using data from the Open Exoplanet Project.   
Currently data is housed within js variables but will soon be broadened to a SQL database to represent all systems and refresh itself monthly.   

## Data
The Open Exoplanet Project provides an overview of data released by the scientific community pertaining to exoplanet discoveries aggregated in csv or xml format.   
We take that data and clean it in clean_raw_df.ipynb removing duplicate entries and entries with impossible values. The data is then passed to fill_values.ipynb where in the future we will use sci-kit learn to classify the planets and stars and fill missing values with best estimates where appropriate, for now the data is just passed on to add_columns.ipynb where we make various calculations such as habitability ranges of stars and star classification as well as spinning off the Host Star data into its own database. We use fiddle.ipynb as a general sketchbook for testing features to add to the other notebooks.   
Once the data collection process is perfected, they will be spun off into python files that can then be automated.

## Site
The site is published on github pages for your enjoyment.

## Units
All planet mass and radii are listed in Jupiter (aka Jovian) radii and mass which is a astronomical standard unit, 7.15e7 m (~11x Earth's radius) and 1.90e27 kg (~300x Earth Mass) respectively.   
All planet orbital radii are listed in Astronomical Units which is equivalent to the average distance between the Earth and our Sun, 149 597 870 700 metres or 93 million miles.   
All Star mass and radii are listed in Solar units relative to our Sun, 6.96e8 m (~100x Earth's Radius, ~10x Jupiter's Radius), and 2.00e30 kg.


