// Jimaworks-made
var columns = ["ID", "name", "era", "operator", "class", "careerStart", "careerEnd", "totalPsgrs", "imagery", "background", "sources", "perCountryPsgrs", "shipsRoutes"];
var jimaworksMadeImagery = [
  ["Savannah(1818-1821)", "Savannah", "EraOfTheSteamSailShip(1840-1915)", "Holland-America", "PsgLiner", 1818, 1821, 270.643, "Savannah_1818-1821_jimaworksmade300ppi.png", "transparent", null, {"GB":5, "BL":10, "NL":65, "DE":10, "Other":10}, "*Any*"],
  ["NieuwAmsterdam(1905-1932)", "Nieuw Amsterdam", "EraOfThePassengerLiner(1895-1970)", "Holland-America", "PsgLiner", 1905, 1932, 270.643, "NieuwAmsterdam_1905-1932_jimaworksmade72ppi.png", "transparent", null, {"GB":5, "BL":10, "NL":65, "DE":10, "Other":10}, "*Any*"],
  ["Maasdam(1952-1968)", "Maasdam", "EraOfThePassengerLiner(1895-1970)", "Holland-America", "PsgLiner", 1952, 1968, 270.643, "Maasdam_1952-1968_jimaworksmade72ppi.png", "transparent", null, {"GB":5, "BL":10, "NL":65, "DE":10, "Other":10}, "*Any*"],
  ["Savannah(1962-1972)", "Savannah", "EraOfThePassengerLiner(1895-1970)", "US Maritme Commission", "PsgLiner", 1962, 1972, 270.643, "Savannah_1962-1972_jimaworksmade72ppi.png", "transparent", null, {"GB":5, "BL":10, "NL":65, "DE":10, "Other":10}, "*Any*"],
  ["St.Paul", "St.Paul", "EraOfThePassengerLiner(1895-1970)", "American", "PsgLiner", 1895, 1923, 95, "jimaworksStPaul640.png", "transparent"],
  ["Ryndam", "Ryndam", "EraOfThePassengerLiner(1895-1970)", "Holland-America", "PsgLiner", 1951, 1966, 270.643, "Ryndam_1951-1970_-mdlrend.png", "transparent"]
];
var output = [];

for ( let i = 0; i < jimaworksMadeImagery.length; i++ ) {
  const row = jimaworksMadeImagery[i];
  const obj = {};

  for ( let j = 0; j < row.length; j++ ) {
    const cell = row[j];
    
    obj[columns[j]] = cell;

    console.log( columns[j], '=', cell );
  }

  output.push( obj );
}

JSON.stringify( output, null, 2 );

// Output
var output = [
  {
    "ID": "Savannah(1818-1821)",
    "name": "Savannah",
    "era": "EraOfTheSteamSailShip(1840-1915)",
    "operator": "Holland-America",
    "class": "PsgLiner",
    "careerStart": 1818,
    "careerEnd": 1821,
    "totalPsgrs": 270.643,
    "imagery": "Savannah_1818-1821_jimaworksmade300ppi.png",
    "background": "transparent",
    "sources": null,
    "perCountryPsgrs": {
      "GB": 5,
      "BL": 10,
      "NL": 65,
      "DE": 10,
      "Other": 10
    },
    "shipsRoutes": "*Any*"
  },
  {
    "ID": "NieuwAmsterdam(1905-1932)",
    "name": "Nieuw Amsterdam",
    "era": "EraOfThePassengerLiner(1895-1970)",
    "operator": "Holland-America",
    "class": "PsgLiner",
    "careerStart": 1905,
    "careerEnd": 1932,
    "totalPsgrs": 270.643,
    "imagery": "NieuwAmsterdam_1905-1932_jimaworksmade72ppi.png",
    "background": "transparent",
    "sources": null,
    "perCountryPsgrs": {
      "GB": 5,
      "BL": 10,
      "NL": 65,
      "DE": 10,
      "Other": 10
    },
    "shipsRoutes": "*Any*"
  },
  {
    "ID": "Maasdam(1952-1968)",
    "name": "Maasdam",
    "era": "EraOfThePassengerLiner(1895-1970)",
    "operator": "Holland-America",
    "class": "PsgLiner",
    "careerStart": 1952,
    "careerEnd": 1968,
    "totalPsgrs": 270.643,
    "imagery": "Maasdam_1952-1968_jimaworksmade72ppi.png",
    "background": "transparent",
    "sources": null,
    "perCountryPsgrs": {
      "GB": 5,
      "BL": 10,
      "NL": 65,
      "DE": 10,
      "Other": 10
    },
    "shipsRoutes": "*Any*"
  },
  {
    "ID": "Savannah(1962-1972)",
    "name": "Savannah",
    "era": "EraOfThePassengerLiner(1895-1970)",
    "operator": "US Maritme Commission",
    "class": "PsgLiner",
    "careerStart": 1962,
    "careerEnd": 1972,
    "totalPsgrs": 270.643,
    "imagery": "Savannah_1962-1972_jimaworksmade72ppi.png",
    "background": "transparent",
    "sources": null,
    "perCountryPsgrs": {
      "GB": 5,
      "BL": 10,
      "NL": 65,
      "DE": 10,
      "Other": 10
    },
    "shipsRoutes": "*Any*"
  },
  {
    "ID": "St.Paul",
    "name": "St.Paul",
    "era": "EraOfThePassengerLiner(1895-1970)",
    "operator": "American",
    "class": "PsgLiner",
    "careerStart": 1895,
    "careerEnd": 1923,
    "totalPsgrs": 95,
    "imagery": "jimaworksStPaul640.png",
    "background": "transparent"
  },
  {
    "ID": "Ryndam",
    "name": "Ryndam",
    "era": "EraOfThePassengerLiner(1895-1970)",
    "operator": "Holland-America",
    "class": "PsgLiner",
    "careerStart": 1951,
    "careerEnd": 1966,
    "totalPsgrs": 270.643,
    "imagery": "Ryndam_1951-1970_-mdlrend.png",
    "background": "transparent"
  }
];

// ----
// Known Ship Placeholders

var columns = [
  "ID",
  "name",
  "era",
  "operator",
  "class",
  "careerStart",
  "careerEnd",
  "totalPsgrs",
  "imagery",
  "background",
  "sources",
  "perCountryPsgrs",
  "shipsRoutes"
];
var knownShipPlaceholderArray = [
  [
    "Known Ship placeholder (1565-1790)",
    "Known Ship placeholder (1565-1790)",
    "ColonialAndEarlyIndependenceEra(1607-1840)",
    "Unk",
    "Flute",
    1585,
    1790,
    300,
    "EarlySailKnownShipIconLabeled.png",
    "transparent",
    "",
    {
      "Other": 100
    },
    "*Any*"
  ],
  [
    "Known Ship placeholder (1790-1850)",
    "Known Ship placeholder (1790-1850)",
    "EraOfModernSail(1790-1890)",
    "Unk",
    "3MastedMerchant",
    1790,
    1850,
    800,
    "ModernSailKnownShipIconLabeled.png",
    "transparent",
    "",
    {
      "Other": 100
    },
    "*Any*"
  ],
  [
    "Known Ship placeholder (1850-1890)",
    "Known Ship placeholder (1850-1890)",
    "EraOfTheSteamSailShip(1840-1915)",
    "Unk",
    "SteamSail",
    1850,
    1890,
    1000,
    "SteamSailKnownShipIconLabeled.png",
    "transparent",
    "",
    {
      "Other": 100
    },
    "*Any*"
  ],
  [
    "Known Ship placeholder (1890-1920)",
    "Known Ship placeholder (1890-1920)",
    "EraOfThePassengerLiner(1890-1920)",
    "Unk",
    "SteamShip",
    1890,
    1920,
    2500,
    "ClassicPssgrLinerKnownShipIconLabeled.png",
    "transparent",
    "",
    {
      "Other": 100
    },
    "*Any*"
  ],
  [
    "Known Ship placeholder (1920-1970)",
    "Known Ship placeholder (1920-1970)",
    "EraOfThePassengerLiner(1920-1970)",
    "Unk",
    "MotorShip",
    1920,
    1970,
    800,
    "PssgrLinerKnownShipIconLabeled.png",
    "transparent",
    "",
    {
      "Other": 100
    },
    "*Any*"
  ],
  [
    "Known Ship placeholder (1945-Present)",
    "Known Plane placeholder (1945-Present)",
    "EraOfAirTravel(1945-Present)",
    "Unk",
    "Airplane",
    1945,
    2020,
    1500,
    "AgeOfAirTravelKnownPlaneIconLabeled.png",
    "transparent",
    "",
    {
      "Other": 100
    },
    "*Any*"
  ]
];
var output = [];

for ( let i = 0; i < knownShipPlaceholderArray.length; i++ ) {
  const row = knownShipPlaceholderArray[i];
  const obj = {};

  for ( let j = 0; j < row.length; j++ ) {
    const cell = row[j];
    
    obj[columns[j]] = cell;

    console.log( columns[j], '=', cell );
  }

  output.push( obj );
}

JSON.stringify( output, null, 2 );

// Output
var output = [
  {
    "ID": "Known Ship placeholder (1565-1790)",
    "name": "Known Ship placeholder (1565-1790)",
    "era": "ColonialAndEarlyIndependenceEra(1607-1840)",
    "operator": "Unk",
    "class": "Flute",
    "careerStart": 1585,
    "careerEnd": 1790,
    "totalPsgrs": 300,
    "imagery": "EarlySailKnownShipIconLabeled.png",
    "background": "transparent",
    "sources": "",
    "perCountryPsgrs": {
      "Other": 100
    },
    "shipsRoutes": "*Any*"
  },
  {
    "ID": "Known Ship placeholder (1790-1850)",
    "name": "Known Ship placeholder (1790-1850)",
    "era": "EraOfModernSail(1790-1890)",
    "operator": "Unk",
    "class": "3MastedMerchant",
    "careerStart": 1790,
    "careerEnd": 1850,
    "totalPsgrs": 800,
    "imagery": "ModernSailKnownShipIconLabeled.png",
    "background": "transparent",
    "sources": "",
    "perCountryPsgrs": {
      "Other": 100
    },
    "shipsRoutes": "*Any*"
  },
  {
    "ID": "Known Ship placeholder (1850-1890)",
    "name": "Known Ship placeholder (1850-1890)",
    "era": "EraOfTheSteamSailShip(1840-1915)",
    "operator": "Unk",
    "class": "SteamSail",
    "careerStart": 1850,
    "careerEnd": 1890,
    "totalPsgrs": 1000,
    "imagery": "SteamSailKnownShipIconLabeled.png",
    "background": "transparent",
    "sources": "",
    "perCountryPsgrs": {
      "Other": 100
    },
    "shipsRoutes": "*Any*"
  },
  {
    "ID": "Known Ship placeholder (1890-1920)",
    "name": "Known Ship placeholder (1890-1920)",
    "era": "EraOfThePassengerLiner(1890-1920)",
    "operator": "Unk",
    "class": "SteamShip",
    "careerStart": 1890,
    "careerEnd": 1920,
    "totalPsgrs": 2500,
    "imagery": "ClassicPssgrLinerKnownShipIconLabeled.png",
    "background": "transparent",
    "sources": "",
    "perCountryPsgrs": {
      "Other": 100
    },
    "shipsRoutes": "*Any*"
  },
  {
    "ID": "Known Ship placeholder (1920-1970)",
    "name": "Known Ship placeholder (1920-1970)",
    "era": "EraOfThePassengerLiner(1920-1970)",
    "operator": "Unk",
    "class": "MotorShip",
    "careerStart": 1920,
    "careerEnd": 1970,
    "totalPsgrs": 800,
    "imagery": "PssgrLinerKnownShipIconLabeled.png",
    "background": "transparent",
    "sources": "",
    "perCountryPsgrs": {
      "Other": 100
    },
    "shipsRoutes": "*Any*"
  },
  {
    "ID": "Known Ship placeholder (1945-Present)",
    "name": "Known Plane placeholder (1945-Present)",
    "era": "EraOfAirTravel(1945-Present)",
    "operator": "Unk",
    "class": "Airplane",
    "careerStart": 1945,
    "careerEnd": 2020,
    "totalPsgrs": 1500,
    "imagery": "AgeOfAirTravelKnownPlaneIconLabeled.png",
    "background": "transparent",
    "sources": "",
    "perCountryPsgrs": {
      "Other": 100
    },
    "shipsRoutes": "*Any*"
  }
];