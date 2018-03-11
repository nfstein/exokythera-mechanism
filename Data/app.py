# import necessary libraries
import pandas as pd

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import (
    Flask,
    render_template,
    jsonify)

from ast import literal_eval #allows for literal evaluation of string-list

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///sql/exoplanetorium.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to the table
Planet = Base.classes.planet
Star = Base.classes.hostStar

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
starProperties = ['StarIdentifier',
    'Class',
    'RadiusSlrRad',
    'TempK',
    'DistFromSunParsec',
    'InnerHabitabilityAU',
    'OuterHabitabilityAU',
    'Color',
    'Metallicity',
    'Luminosity',
    'MassSlrMass',
    'RightAscension',
    'Declination',
    'PlanetList',
    'DistFromSunLY',
    'HabitablePlanets',
    'HabitablePlanetsList',
    'Planets',
    'Coordinates']

planetProperties = [
    'PlanetIdentifier',
    'RadiusJpt',
    'PlanetaryMassJpt',
    'SemiMajorAxisAU',
    'PeriodDays',
    'Eccentricity',
    'SurfaceTempK',
    'DiscoveryMethod',
    'DiscoveryYear',
    'ListsPlanetIsOn',
    'HostStar']

density = .15

# Query the database and send the jsonified results
'''@app.route("/system/<starName>")
def system(starName):

    star = session.query(Star).filter(Star.StarIdentifier == starName).first()
    planets = session.query(Planet).filter(Planet.HostStar == starName).all()

    starData = {}
    for key in starProperties:
        starData[key] = star[key]

    return (jsonify(star))#, jsonify(planets))'''

#All data to draw a star, plus the planetlist to draw the planets after
@app.route("/draw/<starName>")
def drawStar(starName):
    '''all system data needed for animation, returns (star,[planets])'''
    star = session.query(Star).filter(Star.StarIdentifier == starName).first()

    star_data = {
        'StarIdentifier': star.StarIdentifier,
        'Color': star.Color,
        'RadiusSlrRad': star.RadiusSlrRad,
        'InnerHabitabilityAU': star.InnerHabitabilityAU,
        'OuterHabitabilityAU': star.OuterHabitabilityAU,
        'PlanetList': star.PlanetList
        }

    planets = []
    for planetName in literal_eval(star.PlanetList):
        print("/\/\/\/\/\/\/\/\/"+ planetName)
        planet = session.query(Planet).filter(Planet.PlanetIdentifier == planetName).first()
        planets.append({
        'PlanetIdentifier': planetName,
        'PeriodDays': planet.PeriodDays,
        'RadiusJpt': planet.RadiusJpt,
        'SemiMajorAxisAU': planet.SemiMajorAxisAU,
        'PlanetaryMassJpt': planet.PlanetaryMassJpt,
        })

    return jsonify({'star': star_data,'planets': planets})

@app.route("/plot/coordinates")
def coordinates():
    '''star coordinates and names for scatterplot'''
    X1 = [] #w/o habitables
    Y1 = []
    Z1 = []
    X2 = []
    Y2 = []
    Z2 = []

    habitableList = []
    starNames1 = []
    starNames2 = []
    for coordinates, starName, habitables in  session.query(Star.Coordinates, Star.StarIdentifier, Star.HabitablePlanets).filter(Star.Coordinates != None): #filter for habitables could be applied here, would be faster
        #TODO: should be in try: excepts: or something
        split_coordinates = coordinates.split(' ')

        X = float(split_coordinates[0])
        Y = float(split_coordinates[1])
        Z = float(split_coordinates[2])
        if (X**2 + Y**2 + Z**2)**.5 < 2500: #semi arbitrary location requirement within 2500 LYs
            if int(habitables) > 0:
                X2.append(X)
                Y2.append(Y)
                Z2.append(Z)
                habitableList.append(int(habitables))
                starNames2.append(starName)
            else:
                X1.append(X)
                Y1.append(Y)
                Z1.append(Z)
                starNames1.append(starName)
            
    trace01 = {
        'x': X1, 'y': Y1, 'z': Z1,
        'mode': 'markers',
        'name': 'No Known Habitable Planets',
        'text': starNames1,
        'marker': {
            'size': 3,
            'color': 'red',
            'line': {
            'width': 0
            },
            'opacity': .1,
        },
        'type': 'scatter3d'
    }

    trace02 = {
        'x': X2, 'y': Y2, 'z': Z2,
        'mode': 'markers',
        'name': 'Habitable Planets',
        'text': starNames2,
        'marker': {
            'size': [3*(1+2*ii) for ii in habitableList],
            'color': 'green',
            'line': {
            'width': 0,
            },
            'opacity': .75,
        },
        'type': 'scatter3d'
    }


    return jsonify([trace01, trace02])

@app.route("/plot/planetmassvsradius")
def planetmassvsradius():

    results = session.query(Planet.PlanetaryMassJpt, Planet.RadiusJpt, Planet.PlanetIdentifier).filter(Planet.PlanetaryMassJpt != None).filter(Planet.RadiusJpt != None).filter(Planet.PlanetaryMassJpt < 10).filter(Planet.RadiusJpt < 5)
    masses, radii, names = zip(*results)

    '''
    if mass is not None and radius is not None:
        masses.append(mass)
        radii.append(radius)
        names.append(name)
    else:
        if mass is None:
            if radius is not None:
                masses.append(density*4*radius**3)
                radii.append(radius)
                names.append(name)
        elif radius is None:
            if mass is not None:
                masses.append(mass)
                radii.append((mass/(density*4))**.3)
                names.append(name)
    '''
        
    bubbleTrace01 = {
        'name': 'Exoplanets',
        'marker': {'color': 'blue', 'opacity': 0.5, 'size': [(r**.5)*10 for r in radii]},
        'mode': 'markers',
        'text': names,
        'x': masses,
        'y': radii
    }

    return jsonify(bubbleTrace01)




@app.route("/plot/logarithmicbarplot")
def logarithmicbarplot():
    return 'the little traces for the log plot'

@app.route("/draw/table")
def table():
    return "all the data that needs to go into the table, probably won't be needed if we populate from the general data pool"

if __name__ == "__main__":
    app.run(debug=True)
