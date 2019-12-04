# Variable Issues

## For Vasily:

1. What is meant by “Date”? No localStorage variables found with “date” in the name.

## For Jim:

1. What is meant by “Date info”? All 3 variables are missing on both the localStorage and Illustrator sides.
2. What is meant by “Additional Destination info (3 geo elements)”?
3. What is meant by “Additional Origin info (3 geo elements)”?

## For either Jim or Vasily:

1. What is the difference between Commemoration Time Period Start/End (e) and Year?
2. What is the difference between Origins and Region? Using defaults, both read “EuropeAndTheMediterranean” at checkout.

----

## 1:1 Variable matches between localStorage and Illustrator:

### ArrivalPort
- arrivalPort → ArrivalPort

### Departure Port
- departurePort → DeparturePort

### Destination Textbox
- DestinyLine1–2 → DestinationLine1–2

### Plaque Textbox
- PlaqueLine1–8 → PlaqueLine1–8

### Ship Info Textbox
- ShipInfoLine1–2 → ShipInfoLine1–2

### Ship Choice
- shipName → ShipName

### Size
- Size → Size

### Title Textbox
- TitleLine1–3 → TitleLine1–3


## localStorage variables with no obvious equivalent in Illustrator:

### Arrival Port
- ArrivalPortFilter
- ArrivalPortSortMethod
- ArrivalPortStruct

### Departure Port
- DeparturePortFilter
- DeparturePortSortMethod
- DeparturePortStruct

### Destination Textbox
- DestinationCity
- DestinationSection
- DestinationState

### Region
- RegionOfArrival
- RegionOfOrigin
- RegionOfOriginAbbrev

### Routes
- currRteMapFile
- currRteMapYear
- nextRteMapYear
- prevRteMapYear
- SeaLane

### Ship Choice
- shipPic
- userProvidedShipName
- webShipImgHeight
- webShipImgWidth

### Size
- SizeAbbrev

### Time Period
- CommemorationTimePeriodEnd
- CommemorationTimePeriodReprYr
- CommemorationTimePeriodStart

### Year
- currRteMapYear 
- EarliestPossibleYearOfCrossing
- LatestPossibleYearOfCrossing
- nextRteMapYear
- prevRteMapYear
- YearOfCrossing


## Illustrator variables with no obvious equivalent in localStorage

### Region
- Region

### Seascape
- SeaScape

### Routes
- Routes

### Time Period
- TimePeriod

### Year
- Year