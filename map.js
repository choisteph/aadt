//globals that update and are updated
var pr = 0 ;
var bpt = "";
var ept = "" ;
var rdname = '' ;
var nfc = 0 ;
var censustract = "" ;
var ru = 0 ;
var housing = 0 ;
var novehicle = "" ;
var ramp = 0 ;
var aadt = 0 ;


// //input is roadid, populates sidebar form // return aadt
function createMap() {

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RjaG9pIiwiYSI6ImNqd2pkNWN0NzAyNnE0YW8xeTl5a3VqMXQifQ.Rq3qT82-ysDHcMsHGTBiQg';


    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/stchoi/cjz8u2gky3dqn1cmxm71d6yus',
        center: [-83.84, 42.25],
        zoom: 14
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('click', ({point, lngLat}) =>{

        var features = map.queryRenderedFeatures(point, { layers: ['reducedallroads'] });
        // console.log(features);
        var {properties: {PR, BPT, EPT, RDNAME, NFC, CENSUS_TRACT, RU, HOUSING, NO_VEHICLE, RAMP, AADT}} = features[0];

        var filter = features.reduce(function(memo, features) {

            memo[1].push(features.properties.PR);
            memo[2].push(features.properties.BPT);
            memo[3].push(features.properties.EPT);
            return memo;
        }, [ "all",
            ["in", 'PR'],
            ["in", 'BPT'],
            ["in", 'EPT']
        ]);



        map.setFilter("roads-highlighted", filter)
        // map.setPaintProperty('roads-highlighted', 'line-color', 'black');

        pr = PR ;
        bpt = BPT ;
        ept = EPT ;
        rdname = RDNAME ;
        nfc = NFC ;
        censustract = CENSUS_TRACT ;
        ru = RU ;
        housing = HOUSING ;
        novehicle = NO_VEHICLE ;
        ramp = RAMP ;
        if (AADT != null){
            aadt = AADT;
        } else {
            aadt = "N/A";
        }

        updateVals();
    })

    map.on('load', () => {
      //https://docs.mapbox.com/mapbox-gl-js/api/#map#setpaintproperty
      // https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
      //https://docs.mapbox.com/help/tutorials/mapbox-gl-js-expressions/
      //https://stackoverflow.com/questions/47951532/mapbox-gl-expressions
         map.setPaintProperty('reducedallroads', 'line-color', ['step',
              ['get', 'NFC'],
              'red', 2,
              'yellow', 4,
              'blue', 6,
             'purple'
         ]);
         map.addSource('reducedallroads-highlight', {
            "type": "vector",
            "url": "mapbox://stchoi.8knoxxji"
        });
         map.addLayer({
            "id": "roads-highlighted",
            "type": "line",
            "source": "reducedallroads-highlight",
            "source-layer": "washtenaw_roads-5dftqu",
            "filter": [ "all",
                ["in", 'PR'],
                ["in", 'BPT'],
                ["in", 'EPT']
            ],
            "layout": {
                "line-cap" : "round"
            },
            "paint" : {
                "line-width" : 12,
                "line-opacity" : 0.4
            }
        }, 'road-label');
    });
    // https://bl.ocks.org/danswick/4906b495e0b206758f71
      map.on('mouseenter', 'reducedallroads', () => {
          map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'reducedallroads', () => {
          map.getCanvas().style.cursor = '';
        });
}

function updateVals(){
    console.log('got to updateVals');
    valRDNAME = document.querySelector("#valRDNAME");
    valSemcogAADT = document.querySelector("#valSemcogAADT");
    valEstimAADT = document.querySelector("#valEstimAADT")
    inp_NFC = document.querySelector("#inputfieldNFC");
    inp_RAMP = document.querySelector("#inputfieldRAMP");
    inp_RU = document.querySelector("#inputfieldRU");
    inp_HOUSING = document.querySelector("#inputfieldHOUSING");
    inp_NOVEHICLE = document.querySelector("#inputfieldNOVEHICLE");
    inp_RDNAME = document.querySelector("#valRDNAME");
    inp_EPT = document.querySelector("#inputfieldEPT");
    inp_BPT = document.querySelector("#inputfieldBPT");
    inp_PR = document.querySelector("#inputfieldPR");

    valRDNAME.innerHTML = rdname;
    valSemcogAADT.innerHTML = aadt;
    inp_NFC.value = nfc;
    inp_RAMP.value = ramp;
    inp_RU.value= ru;
    inp_HOUSING.value = housing;
    inp_NOVEHICLE.value= novehicle * 1000;
    inp_RDNAME.innerHTML = rdname;
    inp_EPT.value = ept;
    inp_BPT.value = bpt;
    inp_PR.value= pr;
  }

function updateFromSearch(object){
    console.log('got to updatefromsearch')
    aadt = object.properties.AADT;
    nfc = object.properties.NFC;
    ramp = object.properties.RAMP;
    ru = object.properties.RU;
    housing = object.properties.HOUSING;
    novehicle = object.properties.NO_VEHICLE;
    pr = object.properties.PR ;
    bpt = object.properties.BPT ;
    ept = object.properties.EPT ;
    rdname = object.properties.RDNAME ;
    censustract = object.properties.CENSUS_TRACT ;

    updateVals();
}

function listenForVals(){
    event.preventDefault();
    console.log("run")
    // valSemcogAADT = document.querySelector("#valSemcogAADT").value;
    inp_EPT = document.querySelector("#inputfieldEPT").value;
    inp_BPT = document.querySelector("#inputfieldBPT").value;
    inp_PR = parseInt(document.querySelector("#inputfieldPR").value);
    
    map.queryRenderedFeatures({layers : ['reducedallroads']}).map(j => j)
                                                             .forEach( obj => {

                                                                  if ( obj.properties.EPT == inp_EPT && obj.properties.BPT == inp_BPT && obj.properties.PR == inp_PR){
                                                                      console.log("we found a match");
                                                                      console.log(obj);
                                                                                selectOnMap(obj);
                                                                                updateFromSearch(obj);
                                                                          }
                                                            });
}

function selectOnMap(road){
    // console.log(road);
      map.setFilter("roads-highlighted", [ "all",
      ["in", 'PR'],
      ["in", 'BPT'],
      ["in", 'EPT']
  ] );
      map.setPaintProperty('roads-highlighted', 'line-color', 'black');

}

function calculateNewAADT(){
    console.log("calculate");
    event.preventDefault();
    valEstimAADT = document.querySelector("#valEstimAADT");
    val_NFC = parseInt(document.querySelector("#inputfieldNFC").value);
    val_RAMP = parseInt(document.querySelector("#inputfieldRAMP").value);
    val_RU = parseInt(document.querySelector("#inputfieldRU").value);
    val_HOUSING = parseInt(document.querySelector("#inputfieldHOUSING").value);
    val_NOVEHICLE = parseInt(document.querySelector("#inputfieldNOVEHICLE").value) / 1000;

  ;
    let vehicHousing = val_NOVEHICLE - val_HOUSING;

    function coefficientNFC(){
        if (val_NFC == 2){
            return 14.118
        } else if (val_NFC == 3){
            return -170.121
        } else if (val_NFC == 4){
            return -169.488
        } else if (val_NFC == 5){
            return -208.668
        } else {
            return 0
        };
    };

    function vehicleMinusHousing(){
        return -14.128 * vehicHousing
    };

    function ruralUrban(){
        if (val_RU == 1){
            return 17.66
        } else {
            return 0
        }
    };
    function rampFlag(){
        return -193.921 * val_RAMP
    };

    function nfcRAMP(){
        if (val_RAMP == 1){
            if (val_NFC == 2){
                return 22.136
            } else if (val_NFC == 3){
                return 67.665
            } else {
                return 0
            }
        } else {
            return 0
        }
    };

    function nfcVEHICLEHOUSING(){
        if (val_NFC == 2){
            return -4.817 * vehicHousing
        } else if (val_NFC == 3){
            return 21.998 * vehicHousing
        } else if (val_NFC == 4){
            return 7.281 * vehicHousing
        } else if (val_NFC == 5){
            return 10.741 * vehicHousing
        } else {
            return 0
        }
    };

    function nfcIFURBAN(){
        if (val_RU == 1){
            if (val_NFC == 2){
                return -29.5
            } else if (val_NFC == 3){
                return 21.006
            } else if (val_NFC == 4){
                return -10.039
            } else if (val_NFC == 5){
                return -3.349
            } else {
                return 0
            }
        } else {
            return 0
        }
    };

    estimaadt = Math.round( Math.pow((264.208 + coefficientNFC() + vehicleMinusHousing() + rampFlag() + ruralUrban() + nfcRAMP() + nfcVEHICLEHOUSING() +  nfcIFURBAN()), 2))

    valEstimAADT.innerHTML = estimaadt.toLocaleString();
    // val_AADT.innerHTML = "we did it"
}